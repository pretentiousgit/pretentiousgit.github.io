// Models Manifest - ES6 Module
// Add new model filenames here as you expand your collection

const MODELS_MANIFEST = [
  'canti.stl',
  'clip-and-post.stl'
];

// Utility to get model info from filename
const getModelInfo = (filename) => {
  const name = filename.replace(/\.[^/.]+$/, ''); // Remove extension
  const path = `./models/${filename}`;
  return { name, filename, path };
};

// Get all models with metadata
const getAllModels = () => {
  return MODELS_MANIFEST.map((filename, index) => ({
    index,
    ...getModelInfo(filename)
  }));
};

// Get model by index
const getModelByIndex = (index) => {
  if (index < 0 || index >= MODELS_MANIFEST.length) {
    return null;
  }
  return {
    index,
    ...getModelInfo(MODELS_MANIFEST[index])
  };
};

// Get total model count
const getModelCount = () => MODELS_MANIFEST.length;

// Export the manifest and utilities
export { 
  MODELS_MANIFEST, 
  getAllModels, 
  getModelByIndex, 
  getModelCount 
};