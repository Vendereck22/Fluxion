"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function HeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Optimisation du ratio de pixels pour la netteté sur iPhone/Android
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    // ADAPTATION MOBILE : On réduit le nombre de particules sur petit écran
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 1500 : 4000;

    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 12;
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.025 : 0.015, // Particules un peu plus grosses sur mobile pour compenser le nombre
      color: 0xff007f,
      transparent: true,
      opacity: 0.6,
    });
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    camera.position.z = 5;

    // INTERACTION : Mouse pour Desktop, Auto-rotation pour Mobile
    const handleMove = (x: number, y: number) => {
      gsap.to(mesh.rotation, {
        y: x * 0.3,
        x: -y * 0.3,
        duration: 2,
        ease: "power2.out",
      });
    };

    const onMouseMove = (e: MouseEvent) =>
      handleMove(
        e.clientX / window.innerWidth - 0.5,
        e.clientY / window.innerHeight - 0.5,
      );

    // Ajout du support Touch pour mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(
          e.touches[0].clientX / window.innerWidth - 0.5,
          e.touches[0].clientY / window.innerHeight - 0.5,
        );
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    const animate = () => {
      requestAnimationFrame(animate);
      // Rotation automatique constante (très lente) pour le côté "vivant"
      mesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    // Gestion du redimensionnement (Resize)
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />
  );
}
