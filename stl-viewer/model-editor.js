// Model Editor ES6 Module
import * as THREE from 'three';
import { autoOrientModel } from './model-utils.js';
import { centerAndScaleModel } from './model-utils.js';

// Create the editor state
const createEditorState = (getModel, onModelChange, exportConfig) => ({
  getModel,
  onModelChange,
  getModelName: exportConfig.getModelName,
  exporter: exportConfig.exporter,
  container: null,
  controls: {},
  statsElement: null,
  updateInterval: null
});

// Update model statistics display
const updateModelStats = (state) => {
  if (!state.statsElement) return;
  
  const model = state.getModel();
  if (model) {
    const pos = model.position;
    const rot = model.rotation;
    const scale = model.scale.x;
    state.statsElement.innerHTML = `Pos: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})<br>
                                   Rot: (${(rot.x * 180/Math.PI).toFixed(0)}°, ${(rot.y * 180/Math.PI).toFixed(0)}°, ${(rot.z * 180/Math.PI).toFixed(0)}°)<br>
                                   Scale: ${scale.toFixed(2)}`;
  } else {
    state.statsElement.textContent = 'No model loaded';
  }
};

// Update model transform from controls
const updateModelTransform = (state) => {
  const model = state.getModel();
  if (!model) return;
  
  const posX = parseFloat(state.controls.posX.value) || 0;
  const posY = parseFloat(state.controls.posY.value) || 0;
  const posZ = parseFloat(state.controls.posZ.value) || 0;
  
  const rotX = (parseFloat(state.controls.rotX.value) || 0) * Math.PI / 180;
  const rotY = (parseFloat(state.controls.rotY.value) || 0) * Math.PI / 180;
  const rotZ = (parseFloat(state.controls.rotZ.value) || 0) * Math.PI / 180;
  
  const scale = parseFloat(state.controls.scale.value) || 1;
  
  model.position.set(posX, posY, posZ);
  model.rotation.set(rotX, rotY, rotZ);
  model.scale.setScalar(scale);
  
  updateModelStats(state);
  
  if (state.onModelChange) {
    state.onModelChange(model);
  }
};

// Update controls from model
const updateControlsFromModel = (state) => {
  const model = state.getModel();
  if (!model) return;
  
  state.controls.posX.value = model.position.x.toFixed(2);
  state.controls.posY.value = model.position.y.toFixed(2);
  state.controls.posZ.value = model.position.z.toFixed(2);
  
  state.controls.rotX.value = (model.rotation.x * 180 / Math.PI).toFixed(0);
  state.controls.rotY.value = (model.rotation.y * 180 / Math.PI).toFixed(0);
  state.controls.rotZ.value = (model.rotation.z * 180 / Math.PI).toFixed(0);
  
  state.controls.scale.value = model.scale.x.toFixed(2);
  
  updateModelStats(state);
};

// Set up event listeners
const setupEventListeners = (state) => {
  // Transform controls
  Object.values(state.controls).forEach(control => {
    if (control.type === 'number') {
      control.addEventListener('input', () => updateModelTransform(state));
    }
  });
  
  // Reset button
  const resetBtn = state.container.querySelector('#resetModel');
  resetBtn.addEventListener('click', () => {
    const model = state.getModel();
    if (model) {
      centerAndScaleModel(model);
      updateControlsFromModel(state);
      if (state.onModelChange) {
        state.onModelChange(model);
      }
    }
  });
  
  // Auto-orient button
  const orientBtn = state.container.querySelector('#autoOrient');
  orientBtn.addEventListener('click', () => {
    const model = state.getModel();
    if (model) {
      model.rotation.set(0, 0, 0);
      autoOrientModel(model);
      updateControlsFromModel(state);
      if (state.onModelChange) {
        state.onModelChange(model);
      }
    }
  });
  
  // Export button
  const exportBtn = state.container.querySelector('#exportSTL');
  exportBtn.addEventListener('click', () => {
    const model = state.getModel();
    if (!model || !state.exporter) return;
    
    const clonedModel = model.clone();
    clonedModel.updateMatrixWorld();
    
    const geometry = clonedModel.geometry.clone();
    geometry.applyMatrix4(clonedModel.matrixWorld);
    
    const stlData = state.exporter.parse(clonedModel, { binary: true });
    
    const blob = new Blob([stlData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.getModelName()}_reoriented.stl`;
    link.click();
    URL.revokeObjectURL(url);
  });
};

// Start continuous stats updates
const startStatsUpdates = (state) => {
  if (state.updateInterval) {
    clearInterval(state.updateInterval);
  }
  
  state.updateInterval = setInterval(() => {
    updateModelStats(state);
  }, 100); // Update every 100ms for smooth live updates
};

// Stop stats updates
const stopStatsUpdates = (state) => {
  if (state.updateInterval) {
    clearInterval(state.updateInterval);
    state.updateInterval = null;
  }
};

// Factory function that creates model editor
const createModelEditor = (containerElement, getModel, onModelChange, exportConfig = {}) => {
  if (!containerElement) {
    console.error('Container element is required');
    return null;
  }

  // Extract export configuration
  const { getModelName = () => 'model', exporter = null } = exportConfig;

  // Create the editor HTML structure
  containerElement.innerHTML = `
    <h4 style="margin: 0.5rem 0;">Model Transform</h4>
    
    <div style="margin: 0.5rem 0;">
      <label>Position X: </label>
      <input type="number" id="posX" value="0" step="0.1" style="width: 3.75rem;">
      <label style="margin-left: 0.625rem;">Y: </label>
      <input type="number" id="posY" value="0" step="0.1" style="width: 3.75rem;">
      <label style="margin-left: 0.625rem;">Z: </label>
      <input type="number" id="posZ" value="0" step="0.1" style="width: 3.75rem;">
    </div>
    
    <div style="margin: 0.5rem 0;">
      <label>Rotation X: </label>
      <input type="number" id="rotX" value="0" step="15" style="width: 3.75rem;">
      <label style="margin-left: 0.625rem;">Y: </label>
      <input type="number" id="rotY" value="0" step="15" style="width: 3.75rem;">
      <label style="margin-left: 0.625rem;">Z: </label>
      <input type="number" id="rotZ" value="0" step="15" style="width: 3.75rem;">°
    </div>
    
    <div style="margin: 0.5rem 0;">
      <label>Scale: </label>
      <input type="number" id="scale" value="1" step="0.1" min="0.1" style="width: 3.75rem;">
      <button id="resetModel" style="margin-left: 0.625rem;">Reset</button>
      <button id="autoOrient" style="margin-left: 0.25rem;">Auto Orient</button>
    </div>
    
    <div style="margin: 0.5rem 0; font-size: 0.75rem; color: #ccc;">
      <div id="modelStats">No model loaded</div>
    </div>

    <button id="exportSTL" style="margin-left: 0.25rem;">Export STL</button>
  `;

  const state = createEditorState(getModel, onModelChange, exportConfig);
  state.container = containerElement;
  
  // Get references to controls
  state.controls = {
    posX: containerElement.querySelector('#posX'),
    posY: containerElement.querySelector('#posY'),
    posZ: containerElement.querySelector('#posZ'),
    rotX: containerElement.querySelector('#rotX'),
    rotY: containerElement.querySelector('#rotY'),
    rotZ: containerElement.querySelector('#rotZ'),
    scale: containerElement.querySelector('#scale')
  };
  
  state.statsElement = containerElement.querySelector('#modelStats');
  
  setupEventListeners(state);
  startStatsUpdates(state);
  
  // Return public interface
  return {
    updateFromModel: () => {
      updateControlsFromModel(state);
    },
    
    reset: () => {
      const model = getModel();
      if (model) {
        centerAndScaleModel(model);
        updateControlsFromModel(state);
        if (onModelChange) {
          onModelChange(model);
        }
      }
    },
    
    show: () => {
      containerElement.style.display = '';
      startStatsUpdates(state);
    },
    
    hide: () => {
      containerElement.style.display = 'none';
      stopStatsUpdates(state);
    },
    
    destroy: () => {
      stopStatsUpdates(state);
    }
  };
};

// Export the factory function
export { createModelEditor };