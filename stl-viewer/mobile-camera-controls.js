// Mobile Camera Controls ES6 Module
// Extracted touch handling from icosahedron navigator, applied to 3D camera

// Create mobile camera control state
const createMobileControlState = (camera, onCameraChange, initialDistance = 5) => ({
  camera,
  onCameraChange,
  isActive: false,
  lastTouchX: 0,
  lastTouchY: 0,
  sphericalCoords: {
    radius: initialDistance,
    phi: Math.PI / 3,    // Vertical angle (0 = top, PI = bottom)
    theta: Math.PI / 4   // Horizontal angle
  },
  element: null
});

// Convert spherical coordinates to cartesian for camera position
const sphericalToCartesian = (spherical) => {
  const { radius, phi, theta } = spherical;
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};

// Update camera position from spherical coordinates
const updateCameraFromSpherical = (state) => {
  const cartesian = sphericalToCartesian(state.sphericalCoords);
  
  state.camera.position.set(cartesian.x, cartesian.y, cartesian.z);
  state.camera.lookAt(0, 0, 0);
  
  if (state.onCameraChange) {
    state.onCameraChange(state.camera.position);
  }
};

// Initialize camera position from current position
const initializeFromCamera = (state) => {
  const pos = state.camera.position;
  const radius = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
  const phi = Math.acos(pos.y / radius);
  const theta = Math.atan2(pos.z, pos.x);
  
  state.sphericalCoords = { radius, phi, theta };
};

// Touch event handlers
const handleTouchStart = (state, x, y) => {
  state.isActive = true;
  state.lastTouchX = x;
  state.lastTouchY = y;
  
  // Prevent default to avoid scrolling
  return false;
};

const handleTouchMove = (state, x, y) => {
  if (!state.isActive) return;
  
  const deltaX = x - state.lastTouchX;
  const deltaY = y - state.lastTouchY;
  
  // Sensitivity for touch rotation
  const sensitivity = 0.008;
  
  // Update spherical coordinates
  state.sphericalCoords.theta += deltaX * sensitivity;
  state.sphericalCoords.phi -= deltaY * sensitivity;
  
  // Clamp phi to prevent camera flipping
  state.sphericalCoords.phi = Math.max(0.1, Math.min(Math.PI - 0.1, state.sphericalCoords.phi));
  
  // Update camera position
  updateCameraFromSpherical(state);
  
  // Update last position
  state.lastTouchX = x;
  state.lastTouchY = y;
};

const handleTouchEnd = (state) => {
  state.isActive = false;
};

// Set up event listeners for mobile touch
const setupTouchListeners = (state) => {
  if (!state.element) return;
  
  // Touch events
  state.element.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleTouchStart(state, touch.clientX, touch.clientY);
  }, { passive: false });
  
  state.element.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleTouchMove(state, touch.clientX, touch.clientY);
  }, { passive: false });
  
  state.element.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleTouchEnd(state);
  }, { passive: false });
  
  // Also support mouse for testing on desktop
  state.element.addEventListener('mousedown', (e) => {
    handleTouchStart(state, e.clientX, e.clientY);
  });
  
  document.addEventListener('mousemove', (e) => {
    handleTouchMove(state, e.clientX, e.clientY);
  });
  
  document.addEventListener('mouseup', () => {
    handleTouchEnd(state);
  });
};

// Utility to detect mobile device
const isMobileDevice = () => {
  return window.innerWidth <= 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Factory function that creates mobile camera controls
const createMobileCameraControls = (camera, targetElement, onCameraChange) => {
  if (!camera || !targetElement) {
    console.error('Camera and target element are required for mobile controls');
    return null;
  }
  
  const state = createMobileControlState(camera, onCameraChange);
  state.element = targetElement;
  
  // Initialize spherical coordinates from current camera position
  initializeFromCamera(state);
  
  // Set up touch event listeners
  setupTouchListeners(state);
  
  // Return public interface
  return {
    updateFromCamera: (cameraPosition) => {
      // Update internal state when camera position changes externally
      const radius = cameraPosition.length();
      const normalized = cameraPosition.clone().normalize();
      
      state.sphericalCoords.radius = radius;
      state.sphericalCoords.phi = Math.acos(normalized.y);
      state.sphericalCoords.theta = Math.atan2(normalized.z, normalized.x);
    },
    
    setDistance: (distance) => {
      state.sphericalCoords.radius = distance;
      updateCameraFromSpherical(state);
    },
    
    reset: (distance = 5) => {
      state.sphericalCoords = {
        radius: distance,
        phi: Math.PI / 3,
        theta: Math.PI / 4
      };
      updateCameraFromSpherical(state);
    },
    
    getSphericalCoords: () => ({ ...state.sphericalCoords }),
    
    destroy: () => {
      // Clean up event listeners if needed
      state.isActive = false;
    }
  };
};

// Export factory function and utilities
export { createMobileCameraControls, isMobileDevice };