// STL Viewer Main Module with Mobile Support and Model Management
import * as THREE from 'three';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { createIcosahedronNavigator } from './icosahedron-navigator.js';
import { createModelEditor } from './model-editor.js';
import { createMobileCameraControls, isMobileDevice } from './mobile-camera-controls.js';
import { createModelManager } from './model-manager.js';

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
let mobileControls = null;
let modelManager = null;
let editorContainer = null;
let editorVisible = false;
let isMobile = isMobileDevice();

// STL Exporter for editor
const exporter = new STLExporter();

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
        
        if (updateNav && mobileControls) {
            mobileControls.updateFromCamera(camera.position);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        } else {
            cameraTarget = { ...targetPos };
        }
    }
    
    autoRotateEnabled = false;
    updateAutoRotateButtons();
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

// Auto rotate button state sync
function updateAutoRotateButtons() {
    const desktopBtn = document.getElementById('autoRotate');
    const mobileBtn = document.getElementById('mobileAutoRotate');
    
    if (desktopBtn) {
        desktopBtn.classList.toggle('active', autoRotateEnabled);
    }
    if (mobileBtn) {
        mobileBtn.classList.toggle('active', autoRotateEnabled);
    }
}

// Model management callbacks
function onModelChange(model, modelInfo) {
    console.log(`Switched to model: ${modelInfo.name}`);
    
    // Update editor if it exists and is showing
    if (modelEditor && editorVisible) {
        modelEditor.updateFromModel();
    }
}

function onLoadingChange(isLoading, message = '') {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorDiv = document.getElementById('error');
    
    if (isLoading) {
        loadingIndicator.textContent = message || 'Loading model...';
        loadingIndicator.classList.remove('hidden');
        errorDiv.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
        if (message && message.includes('Failed')) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }
}

// Editor management (desktop only)
const showEditor = () => {
    if (isMobile || !editorContainer || editorVisible) return;
    
    const infoPanel = document.getElementById('info');
    infoPanel.appendChild(editorContainer);
    
    if (!modelEditor) {
        modelEditor = createModelEditor(
            editorContainer, 
            () => modelManager?.getCurrentModel() || null,
            onModelChange,
            { 
                getModelName: () => modelManager?.getCurrentModelInfo()?.name || 'model',
                exporter: exporter 
            }
        );
    }
    
    editorVisible = true;
    updateToggleButton();
};

const hideEditor = () => {
    if (isMobile || !editorContainer || !editorVisible) return;
    
    editorContainer.remove();
    
    if (modelEditor) {
        modelEditor.destroy();
        modelEditor = null;
    }
    
    editorVisible = false;
    updateToggleButton();
};

const toggleEditor = () => {
    if (isMobile) return;
    
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

// Handle responsive changes
function handleResize() {
    const wasDesktop = !isMobile;
    isMobile = isMobileDevice();
    
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // If switching from desktop to mobile, clean up desktop components
    if (wasDesktop && isMobile) {
        if (editorVisible) {
            hideEditor();
        }
        if (icosahedronNav) {
            // Icosahedron nav will be hidden by CSS
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Desktop-only file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && !isMobile && modelManager) {
                // Load file through model manager
                modelManager.loadFromFile(file);
            }
        });
    }

    // Load sample button (desktop only)
    const loadSampleBtn = document.getElementById('loadSample');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', function() {
            if (modelManager && !isMobile) {
                modelManager.goToModel('canti');
            }
        });
    }

    // Editor toggle (desktop only)
    const editorToggleBtn = document.getElementById('editorToggle');
    if (editorToggleBtn) {
        editorToggleBtn.addEventListener('click', toggleEditor);
    }

    // Desktop animation controls
    const autoRotateBtn = document.getElementById('autoRotate');
    if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
            autoRotateEnabled = !autoRotateEnabled;
            updateAutoRotateButtons();
        });
    }

    const homeViewBtn = document.getElementById('homeView');
    if (homeViewBtn) {
        homeViewBtn.addEventListener('click', () => goToView('home'));
    }

    const nextViewBtn = document.getElementById('nextView');
    if (nextViewBtn) {
        nextViewBtn.addEventListener('click', goToNextView);
    }

    const prevViewBtn = document.getElementById('prevView');
    if (prevViewBtn) {
        prevViewBtn.addEventListener('click', goToPrevView);
    }

    // Mobile controls
    const mobileAutoRotateBtn = document.getElementById('mobileAutoRotate');
    if (mobileAutoRotateBtn) {
        mobileAutoRotateBtn.addEventListener('click', () => {
            autoRotateEnabled = !autoRotateEnabled;
            updateAutoRotateButtons();
        });
    }

    const mobileHomeViewBtn = document.getElementById('mobileHomeView');
    if (mobileHomeViewBtn) {
        mobileHomeViewBtn.addEventListener('click', () => goToView('home'));
    }

    const prevModelBtn = document.getElementById('prevModel');
    if (prevModelBtn) {
        prevModelBtn.addEventListener('click', () => {
            if (modelManager) {
                modelManager.prevModel();
            }
        });
    }

    const nextModelBtn = document.getElementById('nextModel');
    if (nextModelBtn) {
        nextModelBtn.addEventListener('click', () => {
            if (modelManager) {
                modelManager.nextModel();
            }
        });
    }

    // Window resize
    window.addEventListener('resize', handleResize);
}

// Set initial camera position
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);
cameraTarget = { x: 2, y: 2, z: 5 };

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Initializing STL Viewer - Mobile: ${isMobile}`);
    
    // Initialize model manager
    modelManager = createModelManager(scene, onModelChange, onLoadingChange);
    
    if (!isMobile) {
        // Desktop initialization
        const navContainer = document.getElementById('icosahedronContainer');
        if (navContainer) {
            icosahedronNav = createIcosahedronNavigator(navContainer, camera, goToView);
            console.log('Icosahedron navigator initialized');
        }
        
        editorContainer = document.getElementById('modelEditor');
        if (editorContainer) {
            editorContainer.remove();
            console.log('Model editor container prepared');
        }
    } else {
        // Mobile initialization
        const canvas = renderer.domElement;
        mobileControls = createMobileCameraControls(camera, canvas, (cameraPosition) => {
            // Sync with camera target for auto-rotation
            cameraTarget.x = cameraPosition.x;
            cameraTarget.y = cameraPosition.y;
            cameraTarget.z = cameraPosition.z;
        });
        console.log('Mobile camera controls initialized');
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Load default model
    if (modelManager) {
        modelManager.loadDefault(0); // Load first model (canti)
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
        
        // Update navigation components
        if (icosahedronNav && !isMobile) {
            icosahedronNav.updateFromCamera(camera.position);
        }
        
        if (mobileControls && isMobile) {
            mobileControls.updateFromCamera(camera.position);
        }
    }
    
    renderer.render(scene, camera);
}

// Start animation
animate();