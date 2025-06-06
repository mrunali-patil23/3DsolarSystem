
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Planet {
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: number;
  mesh?: THREE.Mesh;
  angle: number;
}

interface SolarSystemProps {
  planetSpeeds: { [key: string]: number };
  isPaused: boolean;
  onPlanetHover: (planetName: string | null) => void;
}

export const SolarSystem = ({ planetSpeeds, isPaused, onPlanetHover }: SolarSystemProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const planetsRef = useRef<Planet[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const raycasterRef = useRef<THREE.Raycaster>();
  const mouseVectorRef = useRef<THREE.Vector2>();

  const planets: Planet[] = [
    { name: 'Mercury', radius: 0.5, distance: 8, speed: 0.02, color: 0x8c7853, angle: 0 },
    { name: 'Venus', radius: 0.7, distance: 11, speed: 0.015, color: 0xffa500, angle: 0 },
    { name: 'Earth', radius: 0.8, distance: 15, speed: 0.01, color: 0x6b93d6, angle: 0 },
    { name: 'Mars', radius: 0.6, distance: 20, speed: 0.008, color: 0xcd5c5c, angle: 0 },
    { name: 'Jupiter', radius: 2.5, distance: 30, speed: 0.005, color: 0xd2691e, angle: 0 },
    { name: 'Saturn', radius: 2.2, distance: 40, speed: 0.003, color: 0xfad5a5, angle: 0 },
    { name: 'Uranus', radius: 1.5, distance: 50, speed: 0.002, color: 0x4fd0e3, angle: 0 },
    { name: 'Neptune', radius: 1.4, distance: 60, speed: 0.001, color: 0x4169e1, angle: 0 },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Create raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    raycasterRef.current = raycaster;
    mouseVectorRef.current = mouse;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffa500, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffa500,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create planets
    const planetMeshes: Planet[] = planets.map(planet => {
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ color: planet.color });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.x = planet.distance;
      mesh.userData = { name: planet.name };
      scene.add(mesh);

      return {
        ...planet,
        mesh
      };
    });

    planetsRef.current = planetMeshes;

    // Camera position
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 0, 0);

    // Mouse controls
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = event.clientX - mouseRef.current.x;
        const deltaY = event.clientY - mouseRef.current.y;

        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.01;
        spherical.phi += deltaY * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);

        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;
      } else {
        // Handle hover detection
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children.filter(child => child.userData.name));

        if (intersects.length > 0) {
          onPlanetHover(intersects[0].object.userData.name);
          document.body.style.cursor = 'pointer';
        } else {
          onPlanetHover(null);
          document.body.style.cursor = 'default';
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (event: WheelEvent) => {
      const distance = camera.position.length();
      const newDistance = Math.max(20, Math.min(200, distance + event.deltaY * 0.1));
      camera.position.normalize().multiplyScalar(newDistance);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isPaused) {
        // Rotate sun
        sun.rotation.y += 0.005;

        // Update planet positions
        planetsRef.current.forEach(planet => {
          if (planet.mesh) {
            const speed = planetSpeeds[planet.name] || planet.speed;
            planet.angle += speed;
            
            planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
            planet.mesh.rotation.y += 0.01;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [planetSpeeds, isPaused, onPlanetHover]);

  return <div ref={mountRef} className="w-full h-full" />;
};
