import * as THREE from 'three';

export interface Section {
  title: string;
  content: string[];
  imageUrl?: string;
  imageSize?: 'small' | 'large';
  sceneSetup?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void;
  sceneUpdate?: (scene: THREE.Scene, deltaTime: number) => void;
  sceneCleanup?: (scene: THREE.Scene) => void;
}

