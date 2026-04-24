"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    // 2. Particules (même logique)
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 10;
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const material = new THREE.PointsMaterial({ size: 0.015, color: 0x555555 });
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    camera.position.z = 3;

    // 3. Animation
    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // 4. GSAP Text Animation
    const tl = gsap.timeline();
    tl.to("#main-title", { opacity: 1, duration: 2, ease: "expo.out" }).to(
      "#sub-text",
      { opacity: 1, duration: 1.5, y: -10 },
      "-=1",
    );

    // Nettoyage (Crucial pour Next.js)
    return () => {
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="absolute inset-0" />

      {/* Contenu Texte */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <h1
          id="main-title"
          className="text-white text-5xl md:text-7xl font-black opacity-0"
        >
          FLUXION<span className="text-fluxion-rose">_</span>
        </h1>
        <p
          id="sub-text"
          className="text-zinc-500 mt-4 tracking-[0.5em] text-xs uppercase opacity-0"
        >
          Precision / Intelligence / Vision
        </p>
      </div>
    </div>
  );
}
