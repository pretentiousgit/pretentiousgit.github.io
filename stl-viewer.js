// STL Viewer Main Module with Modular Components
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { createIcosahedronNavigator } from './icosahedron-navigator.js';
import { createModelEditor } from './model-editor.js';
import { centerAndScaleModel } from './model-utils.js';


// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
pointLight.position.set(2, 3, 2);
pointLight.castShadow = true;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight2.position.set(-2, 2, -2);
scene.add(pointLight2);

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(6, 6);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Camera animation system
let cameraTarget = { x: 0, y: 2, z: 5 };
let autoRotateEnabled = false;
let autoRotateSpeed = 0.005;
let currentViewIndex = 0;

const cameraViews = {
    front: { x: 0, y: 0, z: 5 },
    back: { x: 0, y: 0, z: -5 },
    right: { x: 5, y: 0, z: 0 },
    left: { x: -5, y: 0, z: 0 },
    top: { x: 0, y: 5, z: 0 },
    bottom: { x: 0, y: -5, z: 0 },
    'top-front': { x: -2, y: 4, z: 3 },
    'top-right': { x: 3, y: 4, z: 2 },
    'top-back': { x: 2, y: 4, z: -3 },
    'top-left': { x: -3, y: 4, z: -2 },
    'front-right': { x: 3, y: 1, z: 3 },
    'right-back': { x: 3, y: 1, z: -3 },
    'back-left': { x: -3, y: 1, z: -3 },
    'left-front': { x: -3, y: 1, z: 3 },
    'bottom-right': { x: 3, y: -2, z: 2 },
    'bottom-back': { x: 2, y: -2, z: -3 },
    'bottom-left': { x: -3, y: -2, z: -2 },
    'bottom-front': { x: -2, y: -2, z: 3 },
    'front-bottom': { x: -1, y: -3, z: 4 },
    'iso1': { x: -3, y: 3, z: 3 },
    home: { x: 2, y: 2, z: 5 }
};

// View sequence for arrow navigation (main 6 faces)
const viewSequence = ['front', 'right', 'back', 'left', 'top', 'bottom'];

// Initialize modular components
let icosahedronNav = null;
let modelEditor = null;
let editorContainer = null;
let editorVisible = false;

function animateCameraTo(targetPos, duration = 1000, updateNav = true) {
    const startPos = { 
        x: camera.position.x, 
        y: camera.position.y, 
        z: camera.position.z 
    };
    
    const startTime = Date.now();
    
    function updateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        camera.position.x = startPos.x + (targetPos.x - startPos.x) * easeProgress;
        camera.position.y = startPos.y + (targetPos.y - startPos.y) * easeProgress;
        camera.position.z = startPos.z + (targetPos.z - startPos.z) * easeProgress;
        
        camera.lookAt(0, 0, 0);
        
        if (updateNav && icosahedronNav) {
            icosahedronNav.updateFromCamera(camera.position);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        } else {
            cameraTarget = { ...targetPos };
        }
    }
    
    autoRotateEnabled = false;
    document.getElementById('autoRotate').classList.remove('active');
    updateCamera();
}

function goToView(viewName) {
    if (cameraViews[viewName]) {
        animateCameraTo(cameraViews[viewName]);
        
        // Update current view index if it's in the sequence
        const index = viewSequence.indexOf(viewName);
        if (index !== -1) {
            currentViewIndex = index;
        }
    }
}

function goToNextView() {
    currentViewIndex = (currentViewIndex + 1) % viewSequence.length;
    const viewName = viewSequence[currentViewIndex];
    goToView(viewName);
}

function goToPrevView() {
    currentViewIndex = (currentViewIndex - 1 + viewSequence.length) % viewSequence.length;
    const viewName = viewSequence[currentViewIndex];
    goToView(viewName);
}

// Model loading system
let currentModel = null;
let currentModelName = 'model';
const loader = new STLLoader();
const exporter = new STLExporter();

// Getter functions for model editor
const getCurrentModel = () => currentModel;
const getCurrentModelName = () => currentModelName;

// Editor toggle functionality
const showEditor = () => {
    if (!editorContainer || editorVisible) return;
    
    // Re-insert the editor container into the DOM
    const infoPanel = document.getElementById('info');
    infoPanel.appendChild(editorContainer);
    
    // Re-initialize the editor if needed
    if (!modelEditor) {
        modelEditor = createModelEditor(
            editorContainer, 
            getCurrentModel, 
            onModelChange,
            { 
                getModelName: getCurrentModelName, 
                exporter: exporter 
            }
        );
    }
    
    editorVisible = true;
    updateToggleButton();
};

const hideEditor = () => {
    if (!editorContainer || !editorVisible) return;
    
    // Remove from DOM but keep reference
    editorContainer.remove();
    
    // Destroy the editor instance to clean up listeners and intervals
    if (modelEditor) {
        modelEditor.destroy();
        modelEditor = null;
    }
    
    editorVisible = false;
    updateToggleButton();
};

const toggleEditor = () => {
    if (editorVisible) {
        hideEditor();
    } else {
        showEditor();
    }
};

const updateToggleButton = () => {
    const toggleBtn = document.getElementById('editorToggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('.toggle-icon');
        const text = toggleBtn.querySelector('.toggle-text');
        
        if (editorVisible) {
            icon.textContent = '▲';
            text.textContent = 'Hide Editor';
            toggleBtn.classList.add('active');
        } else {
            icon.textContent = '▼';
            text.textContent = 'Show Editor';
            toggleBtn.classList.remove('active');
        }
    }
};

// Callback for model changes from editor
const onModelChange = (model) => {
    // Currently just exists for extensibility
    // Could add validation, scene updates, etc.
};

function showLoading() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loadingIndicator').classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    hideLoading();
}

function clearScene() {
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
}

// Auto-orient and centering are now handled by the model editor module
function loadModel(url) {
    showLoading();
    clearScene();

    loader.load(
        url,
        function (geometry) {
            hideLoading();
            
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                shininess: 100,
                side: THREE.DoubleSide
            });
            
            currentModel = new THREE.Mesh(geometry, material);
            currentModel.castShadow = true;
            currentModel.receiveShadow = true;
            
            geometry.deleteAttribute('normal');
            geometry.computeVertexNormals();
            geometry.computeBoundingSphere();

            // Use model editor's reset function for initial positioning
            scene.add(currentModel);
            centerAndScaleModel(currentModel);
            
            if (modelEditor) {
                modelEditor.reset();
            }
        },
        function (progress) {
            console.log('Loading progress:', progress);
        },
        function (error) {
            console.error('Loading error:', error);
            showError('Failed to load STL model: ' + error.message);
        }
    );
}

// Event listeners for file operations
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        currentModelName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const url = URL.createObjectURL(file);
        loadModel(url);
    }
});

document.getElementById('loadSample').addEventListener('click', function() {
    currentModelName = 'canti';
    const sampleUrl = './models/canti.stl';
    loadModel(sampleUrl);
});

// Editor toggle button
document.getElementById('editorToggle').addEventListener('click', toggleEditor);

// Animation controls
document.getElementById('autoRotate').addEventListener('click', () => {
    autoRotateEnabled = !autoRotateEnabled;
    document.getElementById('autoRotate').classList.toggle('active', autoRotateEnabled);
});

document.getElementById('homeView').addEventListener('click', () => {
    goToView('home');
});

// Arrow navigation
document.getElementById('nextView').addEventListener('click', goToNextView);
document.getElementById('prevView').addEventListener('click', goToPrevView);

// Set initial camera position
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);
cameraTarget = { x: 2, y: 2, z: 5 };

// Initialize modular components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize icosahedron navigator
    const navContainer = document.getElementById('icosahedronContainer');
    if (navContainer) {
        icosahedronNav = createIcosahedronNavigator(navContainer, camera, goToView);
        console.log('Icosahedron navigator initialized');
    } else {
        console.error('Icosahedron container not found');
    }
    
    // Initialize model editor container (but don't show it initially)
    editorContainer = document.getElementById('modelEditor');
    if (editorContainer) {
        // Remove from DOM initially - will be re-added when shown
        editorContainer.remove();
        console.log('Model editor container prepared');
    } else {
        console.error('Model editor container not found');
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Auto rotation around the model
    if (autoRotateEnabled) {
        const radius = Math.sqrt(cameraTarget.x * cameraTarget.x + cameraTarget.z * cameraTarget.z);
        const angle = Math.atan2(cameraTarget.z, cameraTarget.x) + autoRotateSpeed;
        
        cameraTarget.x = Math.cos(angle) * radius;
        cameraTarget.z = Math.sin(angle) * radius;
        
        camera.position.x = cameraTarget.x;
        camera.position.z = cameraTarget.z;
        camera.lookAt(0, 0, 0);
        
        if (icosahedronNav) {
            icosahedronNav.updateFromCamera(camera.position);
        }
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Load default model
loadModel('./models/canti.stl');