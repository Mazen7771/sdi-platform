import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const GeneticsBackground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfafaf9, 0.012);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 48);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- DNA Double Helix Construction ---
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Colors matching Bright Avenue & Irish Medical Theme
    const strandColorA = new THREE.Color(0x3ead87); // Emerald
    const strandColorB = new THREE.Color(0x0f766e); // Deep Teal
    const baseColorA = new THREE.Color(0x22d3ee);   // Cyan
    const baseColorT = new THREE.Color(0x34d399);   // Mint
    const baseColorG = new THREE.Color(0x10b981);   // Jade
    const baseColorC = new THREE.Color(0xf59e0b);   // Amber Accent

    const stepCount = 90;
    const helixRadius = 4.2;
    const helixLength = 70;
    const twists = 4.5;

    // Strand 1 & Strand 2 Points
    const pointsA: THREE.Vector3[] = [];
    const pointsB: THREE.Vector3[] = [];

    // Sphere geometry for nodes
    const nodeGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const connectorGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 8);

    const rungsGroup = new THREE.Group();
    dnaGroup.add(rungsGroup);

    for (let i = 0; i <= stepCount; i++) {
      const t = i / stepCount;
      const angle = t * Math.PI * 2 * twists;
      const y = (t - 0.5) * helixLength;

      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;

      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      const p1 = new THREE.Vector3(x1, y, z1);
      const p2 = new THREE.Vector3(x2, y, z2);

      pointsA.push(p1);
      pointsB.push(p2);

      // Add nucleotide node spheres at intervals
      if (i % 2 === 0) {
        const mat1 = new THREE.MeshBasicMaterial({
          color: i % 4 === 0 ? strandColorA : baseColorT,
          transparent: true,
          opacity: 0.85,
        });
        const mesh1 = new THREE.Mesh(nodeGeo, mat1);
        mesh1.position.copy(p1);
        rungsGroup.add(mesh1);

        const mat2 = new THREE.MeshBasicMaterial({
          color: i % 4 === 0 ? strandColorB : baseColorA,
          transparent: true,
          opacity: 0.85,
        });
        const mesh2 = new THREE.Mesh(nodeGeo, mat2);
        mesh2.position.copy(p2);
        rungsGroup.add(mesh2);

        // Connector rungs between base pairs
        const dist = p1.distanceTo(p2);
        const rungMat = new THREE.MeshBasicMaterial({
          color: i % 6 === 0 ? baseColorC : i % 3 === 0 ? baseColorG : 0x94a3b8,
          transparent: true,
          opacity: 0.45,
        });
        const rungMesh = new THREE.Mesh(connectorGeo, rungMat);
        rungMesh.scale.set(1, dist, 1);

        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        rungMesh.position.copy(midPoint);
        rungMesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3().subVectors(p2, p1).normalize()
        );
        rungsGroup.add(rungMesh);
      }
    }

    // Continuous Tube Strands
    const curveA = new THREE.CatmullRomCurve3(pointsA);
    const tubeGeoA = new THREE.TubeGeometry(curveA, 160, 0.16, 8, false);
    const tubeMatA = new THREE.MeshBasicMaterial({
      color: strandColorA,
      transparent: true,
      opacity: 0.75,
    });
    const tubeMeshA = new THREE.Mesh(tubeGeoA, tubeMatA);
    dnaGroup.add(tubeMeshA);

    const curveB = new THREE.CatmullRomCurve3(pointsB);
    const tubeGeoB = new THREE.TubeGeometry(curveB, 160, 0.16, 8, false);
    const tubeMatB = new THREE.MeshBasicMaterial({
      color: strandColorB,
      transparent: true,
      opacity: 0.75,
    });
    const tubeMeshB = new THREE.Mesh(tubeGeoB, tubeMatB);
    dnaGroup.add(tubeMeshB);

    // Initial Tilt & Position: angled diagonally across viewport
    dnaGroup.rotation.z = Math.PI * 0.15;
    dnaGroup.rotation.x = Math.PI * 0.1;
    dnaGroup.position.set(4, 0, -6);

    // --- Floating Cellular Depth Particles ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 80;
      particlePositions[p * 3 + 1] = (Math.random() - 0.5) * 80;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
      particleScales[p] = Math.random() * 2 + 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3ead87,
      size: 0.45,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Interaction States ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let currentScroll = 0;
    let targetScroll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp mouse coordinates
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Smooth lerp scroll offset
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // Continuous autonomous rotation + scroll driven rotation
      dnaGroup.rotation.y = elapsedTime * 0.35 + currentScroll * 0.0035;
      dnaGroup.rotation.x = Math.PI * 0.1 + mouseY * 0.35;
      dnaGroup.rotation.z = Math.PI * 0.15 + mouseX * 0.25;

      // Vertical translation along scroll: camera glides down the strand
      const scrollYOffset = (currentScroll * 0.015) % 40;
      dnaGroup.position.y = scrollYOffset - 8;

      // Subtle horizontal pan following mouse
      camera.position.x = mouseX * 4;
      camera.position.y = mouseY * 3;
      camera.lookAt(0, 0, 0);

      // Drift floating cellular particles
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = currentScroll * 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      // Clean disposal of Three.js objects
      renderer.dispose();
      tubeGeoA.dispose();
      tubeGeoB.dispose();
      tubeMatA.dispose();
      tubeMatB.dispose();
      nodeGeo.dispose();
      connectorGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90 transition-opacity duration-1000"
      style={{
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 60%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 60%, transparent 100%)',
      }}
    />
  );
};
