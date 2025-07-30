// STL Viewer Main Module with Icosahedron Navigator Integration
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { createIcosahedronNavigator } from './icosahedron-navigator.js';


// Model handling
let currentModelName = 'model';


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

// Initialize icosahedron navigator
let icosahedronNav = null;

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
const loader = new STLLoader();
const exporter = new STLExporter();

function updateModelStats() {
    const statsDiv = document.getElementById('modelStats');
    if (currentModel) {
        const pos = currentModel.position;
        const rot = currentModel.rotation;
        const scale = currentModel.scale.x;
        statsDiv.innerHTML = `Pos: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})<br>
                             Rot: (${(rot.x * 180/Math.PI).toFixed(0)}°, ${(rot.y * 180/Math.PI).toFixed(0)}°, ${(rot.z * 180/Math.PI).toFixed(0)}°)<br>
                             Scale: ${scale.toFixed(2)}`;
    } else {
        statsDiv.textContent = 'No model loaded';
    }
}

function updateModelTransform() {
    if (!currentModel) return;
    
    const posX = parseFloat(document.getElementById('posX').value) || 0;
    const posY = parseFloat(document.getElementById('posY').value) || 0;
    const posZ = parseFloat(document.getElementById('posZ').value) || 0;
    
    const rotX = (parseFloat(document.getElementById('rotX').value) || 0) * Math.PI / 180;
    const rotY = (parseFloat(document.getElementById('rotY').value) || 0) * Math.PI / 180;
    const rotZ = (parseFloat(document.getElementById('rotZ').value) || 0) * Math.PI / 180;
    
    const scale = parseFloat(document.getElementById('scale').value) || 1;
    
    currentModel.position.set(posX, posY, posZ);
    currentModel.rotation.set(rotX, rotY, rotZ);
    currentModel.scale.setScalar(scale);
    
    updateModelStats();
}

function updateDebugControls() {
    if (!currentModel) return;
    
    document.getElementById('posX').value = currentModel.position.x.toFixed(2);
    document.getElementById('posY').value = currentModel.position.y.toFixed(2);
    document.getElementById('posZ').value = currentModel.position.z.toFixed(2);
    
    document.getElementById('rotX').value = (currentModel.rotation.x * 180 / Math.PI).toFixed(0);
    document.getElementById('rotY').value = (currentModel.rotation.y * 180 / Math.PI).toFixed(0);
    document.getElementById('rotZ').value = (currentModel.rotation.z * 180 / Math.PI).toFixed(0);
    
    document.getElementById('scale').value = currentModel.scale.x.toFixed(2);
    
    updateModelStats();
}

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

function autoOrientModel(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    
    const dimensions = [
        { axis: 'x', size: size.x },
        { axis: 'y', size: size.y },
        { axis: 'z', size: size.z }
    ];
    
    dimensions.sort((a, b) => a.size - b.size);
    const shortestAxis = dimensions[0].axis;
    
    if (shortestAxis === 'x') {
        object.rotation.z = Math.PI / 2;
    } else if (shortestAxis === 'z') {
        object.rotation.x = -Math.PI / 2;
    }
    
    const aspectRatioXZ = Math.max(size.x, size.z) / Math.min(size.x, size.z);
    const heightRatio = size.y / Math.max(size.x, size.z);
    
    if (heightRatio < 0.3 && aspectRatioXZ > 2) {
        if (size.x > size.z) {
            object.rotation.z = Math.PI / 2;
        } else {
            object.rotation.x = -Math.PI / 2;
        }
    }
}

function centerAndScaleModel(object) {
    autoOrientModel(object);
    
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    object.position.set(-center.x, -center.y, -center.z);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
        const scale = 2 / maxDim;
        const finalScale = Math.min(scale, 10);
        object.scale.setScalar(finalScale);
    }
}

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

            centerAndScaleModel(currentModel);
            scene.add(currentModel);
            updateDebugControls();
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

// Event listeners
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        currentModelName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const url = URL.createObjectURL(file);
        loadModel(url);
    }
});

document.getElementById('posX').addEventListener('input', updateModelTransform);
document.getElementById('posY').addEventListener('input', updateModelTransform);
document.getElementById('posZ').addEventListener('input', updateModelTransform);
document.getElementById('rotX').addEventListener('input', updateModelTransform);
document.getElementById('rotY').addEventListener('input', updateModelTransform);
document.getElementById('rotZ').addEventListener('input', updateModelTransform);
document.getElementById('scale').addEventListener('input', updateModelTransform);

document.getElementById('resetModel').addEventListener('click', function() {
    if (currentModel) {
        centerAndScaleModel(currentModel);
        updateDebugControls();
    }
});

document.getElementById('autoOrient').addEventListener('click', function() {
    if (currentModel) {
        currentModel.rotation.set(0, 0, 0);
        autoOrientModel(currentModel);
        updateDebugControls();
    }
});

document.getElementById('loadSample').addEventListener('click', function() {
    currentModelName = 'canti';
    const sampleUrl = './models/canti.stl';
    loadModel(sampleUrl);
});

document.getElementById('exportSTL').addEventListener('click', function() {
    if (!currentModel) return;
    
    const clonedModel = currentModel.clone();
    clonedModel.updateMatrixWorld();
    
    const geometry = clonedModel.geometry.clone();
    geometry.applyMatrix4(clonedModel.matrixWorld);
    
    const stlData = exporter.parse(clonedModel, { binary: true });
    
    const blob = new Blob([stlData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentModelName}_reoriented.stl`;
    link.click();
    URL.revokeObjectURL(url);
});

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

// Initialize icosahedron navigator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.getElementById('icosahedronContainer');
    if (navContainer) {
        icosahedronNav = createIcosahedronNavigator(navContainer, camera, goToView);
        console.log('Icosahedron navigator initialized');
    } else {
        console.error('Icosahedron container not found');
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

// Load initial model
loadModel('./models/canti.stl');