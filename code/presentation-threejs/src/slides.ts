import * as THREE from 'three';
import type { Section } from './types';

export const sections: Section[] = [
  {
    title: 'The Loop',
    content: [
      "We welcome you!"
    ],
    sceneSetup: (scene, camera) => {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      const group = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshStandardMaterial({
          color: 0x029FE4,
          emissive: 0x029FE4,
        });
        const cube = new THREE.Mesh(geometry, material);
        const angle = (i / 8) * Math.PI * 2;
        cube.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
        group.add(cube);
      }
      scene.add(group);
    },
    sceneUpdate: (scene) => {
      const group = scene.children.find(c => c.type === 'Group') as THREE.Group;
      if (group) {
        group.rotation.z += 0.005;
        group.children.forEach(cube => {
          (cube as THREE.Mesh).rotation.x += 0.01;
          (cube as THREE.Mesh).rotation.y += 0.01;
        });
      }
    }
  },
  {
    title: '',
    content: [''],
    sceneSetup: (scene, camera) => {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      const group = new THREE.Group();
      const cubeMeshes: THREE.Mesh[] = [];
      const cubePositions: THREE.Vector3[] = [];
      
      // Optimized lightning bolt geometry - fewer segments for performance
      const createLightningBolt = (start: THREE.Vector3, end: THREE.Vector3, segments: number = 10, chaos: number = 0.5): THREE.BufferGeometry => {
        const points: THREE.Vector3[] = [start.clone()];
        const direction = new THREE.Vector3().subVectors(end, start);
        const distance = direction.length();
        direction.normalize();
        
        for (let i = 1; i < segments; i++) {
          const t = i / segments;
          const basePoint = new THREE.Vector3().lerpVectors(start, end, t);
          
          // Add randomness perpendicular to the direction
          const perpendicular1 = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
          const perpendicular2 = new THREE.Vector3().crossVectors(direction, perpendicular1).normalize();
          
          // Optimized chaos calculation
          const chaosFactor = 1 + Math.sin(t * Math.PI * 3) * 0.3;
          const offset1 = (Math.random() - 0.5) * chaos * distance * chaosFactor * (1 - Math.abs(t - 0.5) * 2);
          const offset2 = (Math.random() - 0.5) * chaos * distance * chaosFactor * (1 - Math.abs(t - 0.5) * 2);
          basePoint.add(perpendicular1.multiplyScalar(offset1));
          basePoint.add(perpendicular2.multiplyScalar(offset2));
          
          points.push(basePoint);
        }
        points.push(end.clone());
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
      };
      
      // Create cubes and store their references
      for (let i = 0; i < 8; i++) {
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshStandardMaterial({
          color: 0x029FE4,
          emissive: 0x029FE4,
        });
        const cube = new THREE.Mesh(geometry, material);
        const angle = (i / 8) * Math.PI * 2;
        const position = new THREE.Vector3(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
        cube.position.copy(position);
        cubePositions.push(position);
        cubeMeshes.push(cube);
        group.add(cube);
      }
      
      // Store cube meshes for dynamic updates
      group.userData.cubeMeshes = cubeMeshes;
      group.userData.cubePositions = cubePositions;
      
      // Create VISIBLE conflict lightning bolts - optimized for performance
      const conflictLightningBolts: THREE.Line[] = [];
      
      // Bright, highly visible materials
      const conflictLightningMaterial = new THREE.LineBasicMaterial({
        color: 0xff3333,
        transparent: true,
        opacity: 1,
      });
      
      // Create multiple layers for each lightning for better visibility (glow effect)
      const createVisibleLightning = (start: THREE.Vector3, end: THREE.Vector3, startIdx: number, endIdx: number, intensity: number, isOpposite: boolean) => {
        // Main bright lightning
        const boltGeometry = createLightningBolt(start, end, 12, isOpposite ? 0.7 : 0.6);
        const bolt = new THREE.Line(boltGeometry, conflictLightningMaterial);
        bolt.userData.visible = false;
        bolt.userData.time = Math.random() * (isOpposite ? 0.8 : 1);
        bolt.userData.startIdx = startIdx;
        bolt.userData.endIdx = endIdx;
        bolt.userData.intensity = intensity;
        bolt.userData.lastUpdateTime = 0;
        conflictLightningBolts.push(bolt);
        group.add(bolt);
        
        // Glow layer for extra visibility (lighter)
        const glowMaterial = new THREE.LineBasicMaterial({
          color: 0xffaaaa,
          transparent: true,
          opacity: 0.6,
        });
        const glowBolt = new THREE.Line(boltGeometry.clone(), glowMaterial);
        glowBolt.userData.visible = false;
        glowBolt.userData.time = bolt.userData.time;
        glowBolt.userData.startIdx = startIdx;
        glowBolt.userData.endIdx = endIdx;
        glowBolt.userData.intensity = intensity;
        glowBolt.userData.isGlow = true;
        glowBolt.userData.parentBolt = bolt;
        bolt.userData.glowBolt = glowBolt; // Link parent to glow
        conflictLightningBolts.push(glowBolt);
        group.add(glowBolt);
      };
      
      // Focus on most visible conflicts: adjacent and opposite cubes only
      for (let i = 0; i < 8; i++) {
        // Adjacent cubes - most visible conflicts
        const next = (i + 1) % 8;
        const start = cubePositions[i].clone();
        const end = cubePositions[next].clone();
        createVisibleLightning(start, end, i, next, 1, false);
        
        // Opposite cubes - strongest conflicts
        const opposite = (i + 4) % 8;
        const startOpp = cubePositions[i].clone();
        const endOpp = cubePositions[opposite].clone();
        createVisibleLightning(startOpp, endOpp, i, opposite, 1.2, true);
      }
      
      // Store all conflict lightning bolts
      group.userData.conflictLightningBolts = conflictLightningBolts;
      scene.add(group);
    },
    sceneUpdate: (scene, deltaTime = 0.016) => {
      const group = scene.children.find(c => c.type === 'Group') as THREE.Group;
      if (group) {
        group.rotation.z += 0.005;
        
        // Get cube meshes and positions
        const cubeMeshes = group.userData.cubeMeshes as THREE.Mesh[];
        const cubePositions = group.userData.cubePositions as THREE.Vector3[];
        
        // Update cube positions based on rotation
        if (cubeMeshes?.length === 8) {
          for (let i = 0; i < cubeMeshes.length; i++) {
            const cube = cubeMeshes[i];
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            // Update position based on group rotation
            const angle = (i / 8) * Math.PI * 2 + group.rotation.z;
            const newPosition = new THREE.Vector3(
              Math.cos(angle) * 2,
              Math.sin(angle) * 2,
              0
            );
            cube.position.copy(newPosition);
            if (cubePositions?.[i]) {
              cubePositions[i].copy(newPosition);
            }
            
            // Intense flickering effect on cubes during conflicts
            const material = cube.material as THREE.MeshStandardMaterial;
            const flicker = 0.9 + Math.random() * 0.5;
            material.emissiveIntensity = flicker;
            
            // Add color variation to show conflict state
            const conflictPulse = 0.5 + Math.sin(Date.now() * 0.01 + i) * 0.3;
            material.emissive.setHex(0x029FE4).multiplyScalar(conflictPulse);
          }
        }
        
        // Optimized helper to recreate lightning (only when needed)
        const recreateLightningBolt = (start: THREE.Vector3, end: THREE.Vector3, segments: number = 10, chaos: number = 0.5): THREE.BufferGeometry => {
          const points: THREE.Vector3[] = [start.clone()];
          const direction = new THREE.Vector3().subVectors(end, start);
          const distance = direction.length();
          direction.normalize();
          
          for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const basePoint = new THREE.Vector3().lerpVectors(start, end, t);
            
            const perpendicular1 = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
            const perpendicular2 = new THREE.Vector3().crossVectors(direction, perpendicular1).normalize();
            
            const chaosFactor = 1 + Math.sin(t * Math.PI * 3) * 0.3;
            const offset1 = (Math.random() - 0.5) * chaos * distance * chaosFactor * (1 - Math.abs(t - 0.5) * 2);
            const offset2 = (Math.random() - 0.5) * chaos * distance * chaosFactor * (1 - Math.abs(t - 0.5) * 2);
            basePoint.add(perpendicular1.multiplyScalar(offset1));
            basePoint.add(perpendicular2.multiplyScalar(offset2));
            
            points.push(basePoint);
          }
          points.push(end.clone());
          
          return new THREE.BufferGeometry().setFromPoints(points);
        };
        
        // Optimized lightning update - only regenerate when needed, not every frame
        const conflictLightningBolts = group.userData.conflictLightningBolts as THREE.Line[];
        if (conflictLightningBolts && cubePositions) {
          // Track position changes to avoid unnecessary updates
          const positionUpdateThreshold = 0.1; // Only update if position changed significantly
          
          for (const bolt of conflictLightningBolts) {
            // Skip glow bolts - they'll be updated with parent
            if (bolt.userData.isGlow) continue;
            
            bolt.userData.time = (bolt.userData.time || 0) + deltaTime;
            
            const startIdx = bolt.userData.startIdx;
            const endIdx = bolt.userData.endIdx;
            const intensity = bolt.userData.intensity || 1;
            
            if (startIdx !== undefined && endIdx !== undefined && cubePositions[startIdx] && cubePositions[endIdx]) {
              const currentStart = cubePositions[startIdx].clone();
              const currentEnd = cubePositions[endIdx].clone();
              
              // More frequent and longer flashes for better visibility
              const flashDuration = intensity >= 1.2 ? 0.35 : 0.3; // Longer visible duration
              const flashInterval = intensity >= 1.2 ? 0.6 : 0.7; // More frequent flashes
              const cycleTime = bolt.userData.time % flashInterval;
              const shouldBeVisible = cycleTime < flashDuration;
              
              if (shouldBeVisible) {
                // Only regenerate geometry every 3 frames or when position changed significantly
                const needsGeometryUpdate = !bolt.userData.lastStartPos || 
                  currentStart.distanceTo(bolt.userData.lastStartPos) > positionUpdateThreshold ||
                  currentEnd.distanceTo(bolt.userData.lastEndPos || new THREE.Vector3()) > positionUpdateThreshold ||
                  (bolt.userData.frameCount || 0) % 3 === 0;
                
                if (needsGeometryUpdate && !bolt.userData.visible) {
                  // Regenerate on first appearance
                  if (bolt.geometry) bolt.geometry.dispose();
                  bolt.geometry = recreateLightningBolt(
                    currentStart,
                    currentEnd,
                    10 + Math.floor(Math.random() * 3),
                    intensity >= 1.2 ? 0.7 : 0.6
                  );
                  bolt.userData.lastStartPos = currentStart.clone();
                  bolt.userData.lastEndPos = currentEnd.clone();
                } else if (needsGeometryUpdate && bolt.userData.frameCount % 3 === 0) {
                  // Periodic update for animation variation
                  bolt.geometry.dispose();
                  bolt.geometry = recreateLightningBolt(
                    currentStart,
                    currentEnd,
                    10 + Math.floor(Math.random() * 3),
                    intensity >= 1.2 ? 0.7 : 0.6
                  );
                  bolt.userData.lastStartPos = currentStart.clone();
                  bolt.userData.lastEndPos = currentEnd.clone();
                }
                
                // Update glow bolt if it exists
                if (bolt.userData.glowBolt) {
                  const glowBolt = bolt.userData.glowBolt;
                  glowBolt.visible = true;
                  if (needsGeometryUpdate) {
                    glowBolt.geometry.dispose();
                    glowBolt.geometry = bolt.geometry.clone();
                  }
                }
                
                if (!bolt.visible) {
                  bolt.visible = true;
                  bolt.userData.visible = true;
                }
                
                // Bright, visible flickering
                const material = bolt.material as THREE.LineBasicMaterial;
                material.opacity = 0.9 + Math.random() * 0.1; // Keep it bright
                
                bolt.userData.frameCount = (bolt.userData.frameCount || 0) + 1;
              } else if (bolt.visible) {
                bolt.visible = false;
                bolt.userData.visible = false;
                if (bolt.userData.glowBolt) {
                  bolt.userData.glowBolt.visible = false;
                }
              }
            }
          }
          
          // Update glow bolts
          for (const bolt of conflictLightningBolts) {
            if (bolt.userData.isGlow && bolt.userData.parentBolt) {
              bolt.visible = bolt.userData.parentBolt.visible;
            }
          }
        }
      }
    }
  },
  {
    title: '',
    content: [''],
    imageUrl: '/stop.png',
    imageSize: 'large',
  },
  {
    title: 'From every opinion, a shared decision.',
    content: [''],
    imageUrl: '/logo.jpeg',
    imageSize: 'small', 
  },
  {
    title: '',
    content: [

    ],
    imageUrl: '/demo.jpeg',
    imageSize: 'large',
  },
  {
    title: 'Team',
    content: [
      'Tobias Schäuble | Software Engineer',
      'Muhammad Saad | Data Scientist',
      'Philipp Nüßlein | Software Engineer',
      'Zehra Rajnagarwala | Product Designer (UX/UI)',
      'Waasiq Masood | Software Developer',
      'Yvette Rivero Suarez | Project Manager',
      'Felix Lüdin | Senior Data Scientist'
    ],
    sceneSetup: (scene, camera) => {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      const group = new THREE.Group();
      const teamColors = [0xff6b6b, 0x4ecdc4, 0x95e1d3, 0xffd93d];
      
      for (let i = 0; i < 4; i++) {
        const personGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
        const personMaterial = new THREE.MeshStandardMaterial({
          color: teamColors[i],
          emissive: teamColors[i] * 0.1,
        });
        const person = new THREE.Mesh(personGeometry, personMaterial);
        const angle = (i / 4) * Math.PI * 2;
        person.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0);
        person.rotation.z = angle + Math.PI / 2;
        group.add(person);
      }
      
      const centerGeometry = new THREE.SphereGeometry(0.8, 16, 16);
      const centerMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x333333,
      });
      const center = new THREE.Mesh(centerGeometry, centerMaterial);
      group.add(center);
      scene.add(group);
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const light = new THREE.PointLight(0xffffff, 1.2);
      light.position.set(0, 0, 8);
      scene.add(light);
    }
  },
  {
    title: 'Tech Stack',
    content: [],
    imageUrl: '/TechStack.png',
    imageSize: 'large',
  },
  {
    title: 'Architectural Details',
    content: [],
    imageUrl: '/architecture.png',
    imageSize: 'large',
  },
  {
    title: 'From every opinion, a shared decision.',
    content: ['Consenza available now!'],
    imageUrl: '/qr-code.png',
    imageSize: 'small',
    sceneSetup: (scene, camera) => {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      
      const group = new THREE.Group();
      group.userData.fireworkParticles = [];
      
      // Create firework particles that will explode outward
      const particleCount = 150;
      const colors = [
        new THREE.Color(0xff0000), // Red
        new THREE.Color(0x00ff00), // Green
        new THREE.Color(0x0000ff), // Blue
        new THREE.Color(0xffff00), // Yellow
        new THREE.Color(0xff00ff), // Magenta
        new THREE.Color(0x00ffff), // Cyan
        new THREE.Color(0xff8800), // Orange
        new THREE.Color(0xffffff), // White
      ];
      
      for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particleMaterial = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color.clone().multiplyScalar(0.8),
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Start all particles at the center (explosion origin)
        particle.position.set(0, 0, 0);
        
        // Random velocity in all directions (explosion force)
        const speed = 15 + Math.random() * 8; // Increased from 8-12 to 15-23
        const theta = Math.random() * Math.PI * 2; // Azimuth angle
        const phi = Math.acos(2 * Math.random() - 1); // Polar angle (uniform sphere distribution)
        
        const velocity = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        );
        
        // Store particle data for physics updates
        (particle.userData as any).velocity = velocity;
        (particle.userData as any).lifetime = 0;
        (particle.userData as any).maxLifetime = 3 + Math.random() * 1.5; // Increased from 2-3 to 3-4.5 seconds
        (particle.userData as any).initialColor = color.clone();
        (particle.userData as any).gravity = -2; // Downward acceleration
        
        group.userData.fireworkParticles.push(particle);
        group.add(particle);
      }
      
      scene.add(group);
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const light = new THREE.PointLight(0xffffff, 3);
      light.position.set(0, 0, 5);
      scene.add(light);
    },
    sceneUpdate: (scene, deltaTime) => {
      const group = scene.children.find(c => c.type === 'Group') as THREE.Group;
      if (!group || !group.userData.fireworkParticles) return;
      
      const particles = group.userData.fireworkParticles as THREE.Mesh[];
      
      particles.forEach((particle) => {
        const userData = particle.userData as any;
        const material = particle.material as THREE.MeshStandardMaterial;
        
        // Update lifetime
        userData.lifetime += deltaTime;
        
        if (userData.lifetime < userData.maxLifetime) {
          // Apply velocity
          particle.position.add(
            userData.velocity.clone().multiplyScalar(deltaTime)
          );
          
          // Apply gravity (only affects Y axis)
          userData.velocity.y += userData.gravity * deltaTime;
          
          // Apply air resistance (drag) - reduced drag to allow particles to travel further
          const drag = 0.97; // Increased from 0.95 to 0.97 (less resistance)
          userData.velocity.multiplyScalar(drag);
          
          // Fade out over time
          const lifeProgress = userData.lifetime / userData.maxLifetime;
          const fadeStart = 0.6; // Start fading at 60% of lifetime
          let alpha = 1;
          
          if (lifeProgress > fadeStart) {
            alpha = 1 - (lifeProgress - fadeStart) / (1 - fadeStart);
          }
          
          // Update material opacity and emissive intensity
          material.opacity = alpha;
          material.transparent = true;
          
          // Make particles dim as they fade
          const colorIntensity = 0.3 + alpha * 0.7;
          material.color.copy(userData.initialColor).multiplyScalar(colorIntensity);
          material.emissive.copy(userData.initialColor).multiplyScalar(alpha * 0.8);
          
          // Add slight rotation for visual interest
          particle.rotation.x += deltaTime * 2;
          particle.rotation.y += deltaTime * 2;
        } else {
          // Reset particle for continuous explosion effect
          particle.position.set(0, 0, 0);
          userData.lifetime = 0;
          userData.maxLifetime = 3 + Math.random() * 1.5;
          
          // New random velocity
          const speed = 15 + Math.random() * 8;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          userData.velocity.set(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed
          );
          
          // Random color
          const colors = [
            new THREE.Color(0xff0000),
            new THREE.Color(0x00ff00),
            new THREE.Color(0x0000ff),
            new THREE.Color(0xffff00),
            new THREE.Color(0xff00ff),
            new THREE.Color(0x00ffff),
            new THREE.Color(0xff8800),
            new THREE.Color(0xffffff),
          ];
          const newColor = colors[Math.floor(Math.random() * colors.length)];
          userData.initialColor = newColor.clone();
          material.color.copy(newColor);
          material.emissive.copy(newColor).multiplyScalar(0.8);
        }
      });
    }
  }
];