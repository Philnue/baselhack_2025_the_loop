import * as THREE from 'three';
import type { Section } from './types';

export class PresentationController {
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private currentSectionIndex: number = -1;
  private readonly sections: Section[] = [];
  private lastTime: number = 0;
  private targetCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 5);
  private readonly targetCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor(container: HTMLElement, sections: Section[]) {
    this.sections = sections;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
    this.handleScroll();
    this.animate();
  }

  public scrollToSection(index: number): void {
    if (index < 0 || index >= this.sections.length) return;
    
    const windowHeight = window.innerHeight;
    // Scroll to exact section position (full viewport height per section)
    const targetScrollY = index * windowHeight;
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  public getCurrentSection(): number {
    return this.currentSectionIndex;
  }

  public getTotalSections(): number {
    return this.sections.length;
  }

  public goToNext(): void {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.scrollToSection(this.currentSectionIndex + 1);
    }
  }

  public goToPrevious(): void {
    if (this.currentSectionIndex > 0) {
      this.scrollToSection(this.currentSectionIndex - 1);
    }
  }

  private getCurrentSectionIndex(): number {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    // Switch sections when scrolling past 50% of each section (smooth transition point)
    // This ensures sections align with button clicks but still allow smooth transitions
    const sectionIndex = Math.floor((scrollY + windowHeight * 0.5) / windowHeight);
    return Math.max(0, Math.min(sectionIndex, this.sections.length - 1));
  }

  private handleScroll() {
    const newSectionIndex = this.getCurrentSectionIndex();
    
    if (newSectionIndex !== this.currentSectionIndex) {
      this.switchSection(newSectionIndex);
      this.currentSectionIndex = newSectionIndex;
    }
  }

  private switchSection(index: number) {
    const section = this.sections[index];
    if (!section) return;

    this.cleanupScene();
    
    const isTeamSection = section.title === 'Team';
    
    // Hide canvas for Team section
    if (isTeamSection) {
      this.renderer.domElement.style.display = 'none';
    } else {
      this.renderer.domElement.style.display = 'block';
    }
    
    // Setup the scene (this may change camera position)
    if (section.sceneSetup) {
      section.sceneSetup(this.scene, this.camera);
      
      // Capture target state after setup
      this.targetCameraPosition = this.camera.position.clone();
      this.targetCameraLookAt.set(0, 0, 0);
      
      // For Team section, snap camera immediately (no interpolation)
      if (isTeamSection) {
        this.camera.position.copy(this.targetCameraPosition);
        this.camera.lookAt(this.targetCameraLookAt);
      }
    } else {
      this.targetCameraPosition.set(0, 0, 5);
      this.targetCameraLookAt.set(0, 0, 0);
      
      if (isTeamSection) {
        this.camera.position.copy(this.targetCameraPosition);
        this.camera.lookAt(this.targetCameraLookAt);
      }
    }
  }

  private cleanupScene() {
    while (this.scene.children.length > 0) {
      const child = this.scene.children[0];
      if (child.type === 'AmbientLight' || child.type === 'PointLight' || child.type === 'DirectionalLight') {
        this.scene.remove(child);
      } else {
        if (child.type === 'Group' || child.type === 'Mesh' || child.type === 'Line' || child.type === 'ArrowHelper') {
          this.scene.remove(child);
          if ('geometry' in child) {
            (child as THREE.Mesh).geometry.dispose();
          }
          if ('material' in child) {
            const material = (child as THREE.Mesh).material;
            if (Array.isArray(material)) {
              material.forEach(m => m.dispose());
            } else {
              material.dispose();
            }
          }
        } else {
          this.scene.remove(child);
        }
      }
    }
  }

  private handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private readonly animate = (currentTime: number = 0) => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    const deltaTime = (currentTime - this.lastTime) * 0.001;
    this.lastTime = currentTime;

    const section = this.sections[this.currentSectionIndex];
    const isTeamSection = section?.title === 'Team';

    // Skip camera interpolation for Team section (no animation)
    if (!isTeamSection) {
      // Smooth camera transition with exponential interpolation
      const lerpFactor = 1 - Math.exp(-deltaTime * 10); // Smooth transition (higher = faster)
      this.camera.position.lerp(this.targetCameraPosition, lerpFactor);
      
      // Smooth look-at interpolation for seamless transitions
      this.camera.lookAt(this.targetCameraLookAt);
    } else {
      // For Team section, keep camera fixed at target position
      this.camera.position.copy(this.targetCameraPosition);
      this.camera.lookAt(this.targetCameraLookAt);
    }

    if (section?.sceneUpdate) {
      section.sceneUpdate(this.scene, deltaTime);
    }

    // Only render if canvas is visible (not Team section)
    if (this.renderer.domElement.style.display !== 'none') {
      this.renderer.render(this.scene, this.camera);
    }
  };

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.cleanupScene();
    this.renderer.dispose();
  }
}