import {
  TriangleFanDrawMode,
  TriangleStripDrawMode
} from '../vendor/three.module.min.js';

// Conversione delle geometrie GLTF a triangoli, richiesta da GLTFLoader.
export function toTrianglesDrawMode(geometry, drawMode) {
  if (drawMode !== TriangleFanDrawMode && drawMode !== TriangleStripDrawMode) {
    return geometry;
  }

  if (geometry.index === null) {
    geometry = geometry.toNonIndexed();
    const count = geometry.getAttribute('position').count;
    geometry.setIndex(Array.from({ length: count }, (_, i) => i));
  }

  const index = geometry.getIndex();
  if (!index || index.count < 3) return geometry;

  const triangleCount = index.count - 2;
  const newIndices = [];

  if (drawMode === TriangleFanDrawMode) {
    for (let i = 1; i <= triangleCount; i++) {
      newIndices.push(index.getX(0), index.getX(i), index.getX(i + 1));
    }
  } else {
    for (let i = 0; i < triangleCount; i++) {
      if (i % 2 === 0) {
        newIndices.push(index.getX(i), index.getX(i + 1), index.getX(i + 2));
      } else {
        newIndices.push(index.getX(i + 2), index.getX(i + 1), index.getX(i));
      }
    }
  }

  geometry.setIndex(newIndices);
  return geometry;
}
