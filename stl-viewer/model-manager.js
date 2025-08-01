// Model Manager ES6 Module
// Handles model loading, preloading, and switching with smart memory management

import { getAllModels, getModelByIndex, getModelCount } from './models-manifest.js';
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { centerAndScaleModel } from './model-utils.js';

// Create model manager state
const createModelManagerState = (scene, onModelChange, onLoadingChange) => ({
  scene,
  onModelChange,
  onLoadingChange,
  loader: new STLLoader(),
  models: getAllModels(),
  currentIndex: 0,
  loadedGeometries: new Map(), // Cache geometries, not full meshes
  currentModel: null,
  currentUploadedModelInfo: null, // Track uploaded file info
  isLoading: false
});

// Create mesh from cached geometry
const createMeshFromGeometry = (geometry) => {
  const material = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    shininess: 100,
    side: THREE.DoubleSide
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  return mesh;
};

// Load geometry and cache it
const loadGeometry = async (state, modelInfo) => {
  if (state.loadedGeometries.has(modelInfo.index)) {
    return state.loadedGeometries.get(modelInfo.index);
  }
  
  return new Promise((resolve, reject) => {
    state.loader.load(
      modelInfo.path,
      (geometry) => {
        // Process geometry
        geometry.deleteAttribute('normal');
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
        
        // Cache the geometry
        state.loadedGeometries.set(modelInfo.index, geometry);
        resolve(geometry);
      },
      (progress) => {
        console.log(`Loading ${modelInfo.name}:`, progress);
      },
      (error) => {
        console.error(`Failed to load ${modelInfo.name}:`, error);
        reject(error);
      }
    );
  });
};

// Clear current model from scene
const clearCurrentModel = (state) => {
  if (state.currentModel) {
    state.scene.remove(state.currentModel);
    // Don't dispose geometry - it's cached
    state.currentModel.material.dispose();
    state.currentModel = null;
  }
};

// Switch to model by index
const switchToModel = async (state, index) => {
  const modelInfo = getModelByIndex(index);
  if (!modelInfo) {
    console.error(`Model at index ${index} not found`);
    return false;
  }
  
  state.isLoading = true;
  if (state.onLoadingChange) {
    state.onLoadingChange(true, `Loading ${modelInfo.name}...`);
  }
  
  try {
    // Load geometry (from cache or network)
    const geometry = await loadGeometry(state, modelInfo);
    
    // Clear current model
    clearCurrentModel(state);
    
    // Create new mesh from cached geometry
    state.currentModel = createMeshFromGeometry(geometry);
    
    // Add to scene and position
    state.scene.add(state.currentModel);
    centerAndScaleModel(state.currentModel);
    
    // Update current index
    state.currentIndex = index;
    
    // Clear uploaded model info since we're back to manifest
    state.currentUploadedModelInfo = null;
    
    // Notify change
    if (state.onModelChange) {
      state.onModelChange(state.currentModel, modelInfo);
    }
    
    state.isLoading = false;
    if (state.onLoadingChange) {
      state.onLoadingChange(false);
    }
    
    return true;
  } catch (error) {
    state.isLoading = false;
    if (state.onLoadingChange) {
      state.onLoadingChange(false, `Failed to load ${modelInfo.name}`);
    }
    return false;
  }
};

// Smart preloading: load current + next model
const smartPreload = async (state) => {
  const currentModel = getModelByIndex(state.currentIndex);
  const nextIndex = (state.currentIndex + 1) % getModelCount();
  const nextModel = getModelByIndex(nextIndex);
  
  // Load current model if not cached
  if (currentModel && !state.loadedGeometries.has(currentModel.index)) {
    try {
      await loadGeometry(state, currentModel);
    } catch (error) {
      console.error(`Failed to preload current model: ${currentModel.name}`, error);
    }
  }
  
  // Load next model if not cached
  if (nextModel && !state.loadedGeometries.has(nextModel.index)) {
    try {
      await loadGeometry(state, nextModel);
    } catch (error) {
      console.error(`Failed to preload next model: ${nextModel.name}`, error);
    }
  }
};

// Memory management: keep only current, next, and previous models
const manageMemory = (state) => {
  const keepIndices = new Set();
  const currentIndex = state.currentIndex;
  const modelCount = getModelCount();
  
  // Keep current
  keepIndices.add(currentIndex);
  
  // Keep next
  keepIndices.add((currentIndex + 1) % modelCount);
  
  // Keep previous
  keepIndices.add((currentIndex - 1 + modelCount) % modelCount);
  
  // Dispose geometries not in keep list
  for (const [index, geometry] of state.loadedGeometries.entries()) {
    if (!keepIndices.has(index)) {
      geometry.dispose();
      state.loadedGeometries.delete(index);
    }
  }
};

// Load model from file (bypasses manifest and cache)
const loadModelFromFile = async (state, file, customName = null) => {
  const modelName = customName || file.name.replace(/\.[^/.]+$/, '');
  
  state.isLoading = true;
  if (state.onLoadingChange) {
    state.onLoadingChange(true, `Loading ${modelName}...`);
  }
  
  try {
    const url = URL.createObjectURL(file);
    
    const geometry = await new Promise((resolve, reject) => {
      state.loader.load(
        url,
        (geometry) => {
          // Process geometry
          geometry.deleteAttribute('normal');
          geometry.computeVertexNormals();
          geometry.computeBoundingSphere();
          resolve(geometry);
        },
        (progress) => {
          console.log(`Loading ${modelName}:`, progress);
        },
        (error) => {
          console.error(`Failed to load ${modelName}:`, error);
          reject(error);
        }
      );
    });
    
    // Clean up object URL
    URL.revokeObjectURL(url);
    
    // Clear current model
    clearCurrentModel(state);
    
    // Create new mesh from geometry
    state.currentModel = createMeshFromGeometry(geometry);
    
    // Add to scene and position
    state.scene.add(state.currentModel);
    centerAndScaleModel(state.currentModel);
    
    // Create temporary model info for callback
    const tempModelInfo = {
      name: modelName,
      filename: file.name,
      path: 'file://uploaded',
      index: -1 // Special index for uploaded files
    };
    
    // Reset current index since we're outside manifest
    state.currentIndex = -1;
    
    // Store uploaded model info
    state.currentUploadedModelInfo = tempModelInfo;
    
    // Notify change
    if (state.onModelChange) {
      state.onModelChange(state.currentModel, tempModelInfo);
    }
    
    state.isLoading = false;
    if (state.onLoadingChange) {
      state.onLoadingChange(false);
    }
    
    return true;
  } catch (error) {
    state.isLoading = false;
    if (state.onLoadingChange) {
      state.onLoadingChange(false, `Failed to load ${modelName}`);
    }
    return false;
  }
};

// Clear specific model from cache
const clearCache = (state, modelName = null) => {
  if (modelName) {
    // Clear specific model by name
    const modelInfo = state.models.find(m => m.name === modelName);
    if (modelInfo && state.loadedGeometries.has(modelInfo.index)) {
      const geometry = state.loadedGeometries.get(modelInfo.index);
      geometry.dispose();
      state.loadedGeometries.delete(modelInfo.index);
    }
  } else {
    // Clear all cache
    for (const geometry of state.loadedGeometries.values()) {
      geometry.dispose();
    }
    state.loadedGeometries.clear();
  }
};

// Factory function that creates model manager
const createModelManager = (scene, onModelChange, onLoadingChange) => {
  if (!scene) {
    console.error('Scene is required for model manager');
    return null;
  }
  
  const state = createModelManagerState(scene, onModelChange, onLoadingChange);
  
  // Return public interface
  return {
    // Get current model info
    getCurrentModel: () => state.currentModel,
    getCurrentModelInfo: () => {
      // Return uploaded file info if current model is uploaded
      if (state.currentIndex === -1 && state.currentUploadedModelInfo) {
        return state.currentUploadedModelInfo;
      }
      // Otherwise return manifest model info
      return getModelByIndex(state.currentIndex);
    },
    getCurrentIndex: () => state.currentIndex,
    getModelCount: () => getModelCount(),
    getAllModels: () => state.models,
    
    // Navigation
    switchToModel: (index) => switchToModel(state, index),
    
    goToModel: (name) => {
      const modelInfo = state.models.find(m => m.name === name);
      if (modelInfo) {
        return switchToModel(state, modelInfo.index);
      }
      return Promise.resolve(false);
    },
    
    nextModel: async () => {
      const nextIndex = (state.currentIndex + 1) % getModelCount();
      const success = await switchToModel(state, nextIndex);
      if (success) {
        manageMemory(state);
        smartPreload(state);
      }
      return success;
    },
    
    prevModel: async () => {
      const prevIndex = (state.currentIndex - 1 + getModelCount()) % getModelCount();
      const success = await switchToModel(state, prevIndex);
      if (success) {
        manageMemory(state);
        smartPreload(state);
      }
      return success;
    },
    
    // Initial load
    loadDefault: async (index = 0) => {
      const success = await switchToModel(state, index);
      if (success) {
        smartPreload(state);
      }
      return success;
    },
    
    // Preloading
    preloadAll: async () => {
      for (const modelInfo of state.models) {
        if (!state.loadedGeometries.has(modelInfo.index)) {
          try {
            await loadGeometry(state, modelInfo);
          } catch (error) {
            console.error(`Failed to preload ${modelInfo.name}:`, error);
          }
        }
      }
    },
    
    // File loading (bypasses manifest)
    loadFromFile: (file, customName = null) => loadModelFromFile(state, file, customName),
    
    // Cache management
    clearCache: (modelName = null) => clearCache(state, modelName),
    
    // Force reload a manifest model (clears cache first)
    forceReload: async (name) => {
      clearCache(state, name);
      const modelInfo = state.models.find(m => m.name === name);
      if (modelInfo) {
        return switchToModel(state, modelInfo.index);
      }
      return false;
    },
    
    // State queries
    isLoading: () => state.isLoading,
    
    // Cleanup
    dispose: () => {
      clearCurrentModel(state);
      for (const geometry of state.loadedGeometries.values()) {
        geometry.dispose();
      }
      state.loadedGeometries.clear();
    }
  };
};

// Export the factory function
export { createModelManager };