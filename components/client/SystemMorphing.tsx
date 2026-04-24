"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function SystemMorphing() {
  const mountRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Setup de base
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    // 2. Particules
    const count = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff, // On peut utiliser 0xFF007F pour le Rose Fluxion
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 3. Logique des Formes
    const getSpherePositions = () => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const r = 2;
        arr[i3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i3 + 2] = r * Math.cos(phi);
      }
      return arr;
    };

    const getLinePositions = () => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3] = (i / count - 0.5) * 6;
        arr[i3 + 1] = 0;
        arr[i3 + 2] = 0;
      }
      return arr;
    };

    const getWavePositions = () => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = (i / count - 0.5) * 6;
        arr[i3] = x;
        arr[i3 + 1] = Math.sin(x * 2) * 1.5;
        arr[i3 + 2] = 0;
      }
      return arr;
    };

    const getChaosPositions = () => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 10;
      return arr;
    };

    // 4. Fonction de Morphing
    const morphTo = (newPositions: Float32Array) => {
      const currentPositions = geometry.attributes.position
        .array as Float32Array;
      const target = { t: 0 };

      gsap.to(target, {
        t: 1,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          for (let i = 0; i < currentPositions.length; i++) {
            currentPositions[i] =
              currentPositions[i] +
              (newPositions[i] - currentPositions[i]) * target.t;
          }
          geometry.attributes.position.needsUpdate = true;
        },
      });
    };

    // 5. Sequence Loop
    const shapes = [
      getSpherePositions,
      getChaosPositions,
      getLinePositions,
      getWavePositions,
    ];
    let index = 0;
    let interval: NodeJS.Timeout;

    const nextShape = () => {
      // Apparition du texte au moment du Chaos
      if (index === 1 && textRef.current) {
        gsap.to(textRef.current, {
          opacity: 1,
          duration: 2,
          ease: "power2.out",
        });
      }

      morphTo(shapes[index]());
      index = (index + 1) % shapes.length;
      interval = setTimeout(nextShape, 4000);
    };

    nextShape();

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(interval);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      <div
        ref={textRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-heading font-black text-6xl md:text-8xl tracking-[0.4em] opacity-0 pointer-events-none z-10"
      >
        FLUXION
      </div>
    </div>
  );
}
