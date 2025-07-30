// model-utils.js
import * as THREE from 'three';

export const autoOrientModel = (object) => {
  // Move the auto-orient logic here
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
};

export const centerAndScaleModel = (object) => {
  // Move the center-and-scale logic here
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
};