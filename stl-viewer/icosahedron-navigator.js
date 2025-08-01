// Icosahedron Navigator ES6 Module
// Golden ratio for icosahedron construction
const phi = (1 + Math.sqrt(5)) / 2;

// Icosahedron vertices using golden ratio coordinates
const vertices = [
  // Rectangle in XY plane
  [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
  // Rectangle in YZ plane  
  [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
  // Rectangle in ZX plane
  [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
];

// 20 triangular faces of the icosahedron (vertex indices in counter-clockwise order)
const faces = [
  // Top cap (5 faces around vertex 1)
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  // Upper belt (5 faces)
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  // Lower belt (5 faces)  
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  // Bottom cap (5 faces around vertex 3)
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];

// Edges for wireframe (30 edges total)
const edges = [
  // Edges from vertex 0
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  // Edges from vertex 1 (excluding already listed)
  [1, 5], [1, 7], [1, 8], [1, 9],
  // Edges from vertex 2
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  // Edges from vertex 3 (excluding already listed)
  [3, 4], [3, 6], [3, 8], [3, 9],
  // Remaining edges
  [4, 5], [4, 9], [4, 11], [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10], [7, 8], [7, 10],
  [8, 9], [10, 11]
];

// Face-to-view mapping for navigation
const faceViews = {
  0: 'top-front', 1: 'top-right', 2: 'top-back', 3: 'top-left', 4: 'top',
  5: 'front-right', 6: 'right-back', 7: 'back-left', 8: 'left-front', 9: 'front',
  10: 'bottom-right', 11: 'bottom-back', 12: 'bottom-left', 13: 'bottom-front', 14: 'bottom',
  15: 'right', 16: 'back', 17: 'left', 18: 'front-bottom', 19: 'iso1'
};

// Color palette configurations
const colorPalettes = {
  rainbow: {
    name: 'Rainbow Gradient',
    gradients: [
      { start: 'hsl(200, 70%, 70%)', end: 'hsl(200, 70%, 40%)' },
      { start: 'hsl(218, 70%, 70%)', end: 'hsl(218, 70%, 40%)' },
      { start: 'hsl(236, 70%, 70%)', end: 'hsl(236, 70%, 40%)' },
      { start: 'hsl(254, 70%, 70%)', end: 'hsl(254, 70%, 40%)' },
      { start: 'hsl(272, 70%, 70%)', end: 'hsl(272, 70%, 40%)' },
      { start: 'hsl(290, 70%, 70%)', end: 'hsl(290, 70%, 40%)' },
      { start: 'hsl(308, 70%, 70%)', end: 'hsl(308, 70%, 40%)' },
      { start: 'hsl(326, 70%, 70%)', end: 'hsl(326, 70%, 40%)' },
      { start: 'hsl(344, 70%, 70%)', end: 'hsl(344, 70%, 40%)' },
      { start: 'hsl(2, 70%, 70%)', end: 'hsl(2, 70%, 40%)' },
      { start: 'hsl(20, 70%, 70%)', end: 'hsl(20, 70%, 40%)' },
      { start: 'hsl(38, 70%, 70%)', end: 'hsl(38, 70%, 40%)' },
      { start: 'hsl(56, 70%, 70%)', end: 'hsl(56, 70%, 40%)' },
      { start: 'hsl(74, 70%, 70%)', end: 'hsl(74, 70%, 40%)' },
      { start: 'hsl(92, 70%, 70%)', end: 'hsl(92, 70%, 40%)' },
      { start: 'hsl(110, 70%, 70%)', end: 'hsl(110, 70%, 40%)' },
      { start: 'hsl(128, 70%, 70%)', end: 'hsl(128, 70%, 40%)' },
      { start: 'hsl(146, 70%, 70%)', end: 'hsl(146, 70%, 40%)' },
      { start: 'hsl(164, 70%, 70%)', end: 'hsl(164, 70%, 40%)' },
      { start: 'hsl(182, 70%, 70%)', end: 'hsl(182, 70%, 40%)' }
    ],
    faces: Array(20).fill({ fill: 'gradient', stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1.5, opacity: 0.85 }),
    edges: { stroke: 'rgba(255, 255, 255, 0.4)', strokeWidth: 0.8 }
  },
  
  wireframeYellow: {
    name: 'Imperial Yellow Wireframe',
    gradients: [],
    faces: Array(20).fill({ fill: 'rgba(255, 255, 255, 0.05)', stroke: '#FFD700', strokeWidth: 5, opacity: 0.1 }),
    edges: { stroke: '#FFD700', strokeWidth: 5 }
  },
  
  minimal: {
    name: 'Minimal Glass',
    gradients: [],
    faces: Array(20).fill({ fill: 'rgba(74, 158, 255, 0.1)', stroke: 'rgba(74, 158, 255, 0.6)', strokeWidth: 2, opacity: 0.3 }),
    edges: { stroke: 'rgba(74, 158, 255, 0.8)', strokeWidth: 1.5 }
  },
  
  neon: {
    name: 'Neon Outline',
    gradients: [],
    faces: Array(20).fill({ fill: 'rgba(0, 0, 0, 0.1)', stroke: '#00FFFF', strokeWidth: 3, opacity: 0.2 }),
    edges: { stroke: '#00FFFF', strokeWidth: 3 }
  }
};

// Current active palette
let currentPalette = 'rainbow';

// Palette management functions
const getCurrentPalette = () => colorPalettes[currentPalette];

const setPalette = (paletteName) => {
  if (colorPalettes[paletteName]) {
    currentPalette = paletteName;
    return true;
  }
  return false;
};

const listPalettes = () => Object.keys(colorPalettes).map(key => ({ key, name: colorPalettes[key].name }));

// State factory function
const createState = (rotationX, rotationY, camera, onViewChange) => ({
  rotationX,
  rotationY,
  camera,
  onViewChange,
  showWireframe: true,
  isMouseDown: false,
  lastMouseX: 0,
  lastMouseY: 0,
  svg: null,
  icosahedronGroup: null
});

// Pure math functions
const rotateX = (angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [[1, 0, 0], [0, cos, -sin], [0, sin, cos]];
};

const rotateY = (angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [[cos, 0, sin], [0, 1, 0], [-sin, 0, cos]];
};

const multiplyMatrix = (a, b) => [
  [a[0][0]*b[0][0] + a[0][1]*b[1][0] + a[0][2]*b[2][0],
   a[0][0]*b[0][1] + a[0][1]*b[1][1] + a[0][2]*b[2][1],
   a[0][0]*b[0][2] + a[0][1]*b[1][2] + a[0][2]*b[2][2]],
  [a[1][0]*b[0][0] + a[1][1]*b[1][0] + a[1][2]*b[2][0],
   a[1][0]*b[0][1] + a[1][1]*b[1][1] + a[1][2]*b[2][1],
   a[1][0]*b[0][2] + a[1][1]*b[1][2] + a[1][2]*b[2][2]],
  [a[2][0]*b[0][0] + a[2][1]*b[1][0] + a[2][2]*b[2][0],
   a[2][0]*b[0][1] + a[2][1]*b[1][1] + a[2][2]*b[2][1],
   a[2][0]*b[0][2] + a[2][1]*b[1][2] + a[2][2]*b[2][2]]
];

const transformVertex = (vertex, matrix) => [
  vertex[0]*matrix[0][0] + vertex[1]*matrix[0][1] + vertex[2]*matrix[0][2],
  vertex[0]*matrix[1][0] + vertex[1]*matrix[1][1] + vertex[2]*matrix[1][2],
  vertex[0]*matrix[2][0] + vertex[1]*matrix[2][1] + vertex[2]*matrix[2][2]
];

const project = (vertex, scale = 80) => [vertex[0] * scale, vertex[1] * scale];

const calculateNormal = (v1, v2, v3) => {
  const u = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
  const v = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
};

// Pure rendering functions
const createGradients = (defsElement) => {
  defsElement.innerHTML = '';
  const palette = getCurrentPalette();
  
  if (palette.gradients && palette.gradients.length > 0) {
    palette.gradients.forEach((grad, i) => {
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.id = `grad${i}`;
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '100%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('style', `stop-color:${grad.start};stop-opacity:0.9`);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('style', `stop-color:${grad.end};stop-opacity:0.9`);
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defsElement.appendChild(gradient);
    });
  }
};

const renderFaces = (icosahedronGroup, faceDepths, transformedVertices) => {
  const palette = getCurrentPalette();
  
  faceDepths.forEach(({ index, visible }) => {
    if (!visible) return;
    
    const face = faces[index];
    const v1 = project(transformedVertices[face[0]]);
    const v2 = project(transformedVertices[face[1]]);
    const v3 = project(transformedVertices[face[2]]);
    
    const faceStyle = palette.faces[index] || palette.faces[0];
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', `${v1[0]},${v1[1]} ${v2[0]},${v2[1]} ${v3[0]},${v3[1]}`);
    
    // Handle gradient vs solid fill
    const fill = faceStyle.fill === 'gradient' ? `url(#grad${index})` : faceStyle.fill;
    polygon.setAttribute('fill', fill);
    polygon.setAttribute('stroke', faceStyle.stroke);
    polygon.setAttribute('stroke-width', faceStyle.strokeWidth);
    polygon.setAttribute('opacity', faceStyle.opacity);
    polygon.setAttribute('stroke-linejoin', 'round');
    polygon.setAttribute('class', 'face');
    polygon.setAttribute('data-face', index);
    
    icosahedronGroup.appendChild(polygon);
  });
};

const renderEdges = (icosahedronGroup, transformedVertices) => {
  const palette = getCurrentPalette();
  const edgeStyle = palette.edges;
  
  edges.forEach(edge => {
    const v1 = project(transformedVertices[edge[0]]);
    const v2 = project(transformedVertices[edge[1]]);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', v1[0]);
    line.setAttribute('y1', v1[1]);
    line.setAttribute('x2', v2[0]);
    line.setAttribute('y2', v2[1]);
    line.setAttribute('stroke', edgeStyle.stroke);
    line.setAttribute('stroke-width', edgeStyle.strokeWidth);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('class', 'edges');
    icosahedronGroup.appendChild(line);
  });
};

// Main render function
const render = (state) => {
  const rotMatrix = multiplyMatrix(rotateY(state.rotationY), rotateX(state.rotationX));
  const transformedVertices = vertices.map(v => transformVertex(v, rotMatrix));
  
  // Clear previous render
  state.icosahedronGroup.innerHTML = '';
  
  // Calculate face depths for z-sorting
  const faceDepths = faces.map((face, index) => {
    const v1 = transformedVertices[face[0]];
    const v2 = transformedVertices[face[1]];
    const v3 = transformedVertices[face[2]];
    const avgZ = (v1[2] + v2[2] + v3[2]) / 3;
    
    const normal = calculateNormal(v1, v2, v3);
    const isVisible = normal[2] > 0;
    
    return { index, depth: avgZ, visible: isVisible };
  });
  
  faceDepths.sort((a, b) => a.depth - b.depth);
  
  // Render wireframe edges first (behind faces)
  if (state.showWireframe) {
    renderEdges(state.icosahedronGroup, transformedVertices);
  }
  
  // Render faces
  renderFaces(state.icosahedronGroup, faceDepths, transformedVertices);
};

// Camera sync function
const syncWithCamera = (state) => {
  const radius = 5;
  const x = radius * Math.sin(state.rotationX) * Math.cos(state.rotationY);
  const y = radius * Math.cos(state.rotationX);
  const z = radius * Math.sin(state.rotationX) * Math.sin(state.rotationY);
  
  if (state.camera) {
    state.camera.position.set(x, y, z);
    state.camera.lookAt(0, 0, 0);
  }
};

// Event handlers
const handleStart = (state, x, y) => {
  state.isMouseDown = true;
  state.lastMouseX = x;
  state.lastMouseY = y;
};

const handleMove = (state, x, y) => {
  if (!state.isMouseDown) return;
  
  const deltaX = x - state.lastMouseX;
  const deltaY = y - state.lastMouseY;
  
  state.rotationY += deltaX * 0.008;
  state.rotationX -= deltaY * 0.008;
  
  state.lastMouseX = x;
  state.lastMouseY = y;
  
  render(state);
  syncWithCamera(state);
};

const handleEnd = (state) => {
  state.isMouseDown = false;
};

const handleFaceClick = (state, faceIndex) => {
  const viewName = faceViews[faceIndex];
  if (viewName && state.onViewChange) {
    state.onViewChange(viewName);
  }
};

// Setup event listeners
const setupEventListeners = (state) => {
  // Mouse/touch controls
  state.svg.addEventListener('mousedown', (e) => handleStart(state, e.clientX, e.clientY));
  document.addEventListener('mousemove', (e) => handleMove(state, e.clientX, e.clientY));
  document.addEventListener('mouseup', () => handleEnd(state));
  
  // Touch events
  state.svg.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(state, touch.clientX, touch.clientY);
  });
  
  state.svg.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(state, touch.clientX, touch.clientY);
  });
  
  state.svg.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleEnd(state);
  });
  
  // Face click handling
  state.svg.addEventListener('click', (e) => {
    if (e.target.classList.contains('face')) {
      const faceIndex = parseInt(e.target.dataset.face);
      handleFaceClick(state, faceIndex);
    }
  });
  
  // Wireframe toggle
  // const toggleButton = state.svg.parentElement.querySelector('#toggleWireframe');
  // if (toggleButton) {
  //   toggleButton.addEventListener('click', () => {
  //     state.showWireframe = !state.showWireframe;
  //     render(state);
  //   });
  // }
};

// Factory function that creates icosahedron navigator
const createIcosahedronNavigator = (containerElement, camera, onViewChange) => {
  if (!containerElement) {
    console.error('Container element is required');
    return null;
  }

  // Create the SVG structure in the container
  containerElement.innerHTML = `
    <svg class="icosahedron-svg" viewBox="-250 -250 500 500">
      <defs id="icosahedronGradients">
        <!-- Gradients will be populated by JavaScript -->
      </defs>
      <g id="icosahedron">
        <!-- Faces will be drawn by JavaScript -->
      </g>
    </svg>
  `;

  const state = createState(0.3, 0.5, camera, onViewChange);
  
  // Initialize DOM elements
  state.svg = containerElement.querySelector('.icosahedron-svg');
  state.icosahedronGroup = containerElement.querySelector('#icosahedron');
  
  if (!state.svg || !state.icosahedronGroup) {
    console.error('Failed to create icosahedron elements');
    return null;
  }
  
  // Initialize gradients
  const defsElement = containerElement.querySelector('#icosahedronGradients');
  if (defsElement) {
    createGradients(defsElement);
  }
  
  setupEventListeners(state);
  render(state);
  
  // Return object with same interface as class
  return {
    updateFromCamera: (cameraPosition) => {
      const normalized = cameraPosition.clone().normalize();
      state.rotationX = Math.acos(normalized.y);
      state.rotationY = Math.atan2(normalized.z, normalized.x);
      render(state);
    },
    
    reset: () => {
      state.rotationX = 0.3;
      state.rotationY = 0.5;
      render(state);
      syncWithCamera(state);
    },
    
    setPalette: (paletteName) => {
      if (setPalette(paletteName)) {
        const defsElement = containerElement.querySelector('#icosahedronGradients');
        if (defsElement) {
          createGradients(defsElement);
        }
        render(state);
        return true;
      }
      return false;
    },
    
    getCurrentPalette,
    listPalettes
  };
};

// Export the factory function and utilities
export { createIcosahedronNavigator, setPalette, getCurrentPalette, listPalettes };