'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface CosmicBackgroundProps {
  className?: string;
}

export function CosmicBackground({ className = '' }: CosmicBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Clock for animation
    const clock = new THREE.Clock();
    
    // Particles Layer 1 - White stars
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Particles Layer 2 - Blue stars
    const bgStarsGeometry = new THREE.BufferGeometry();
    const bgStarsCount = 5000;
    const bgPosArray = new Float32Array(bgStarsCount * 3);
    
    for (let i = 0; i < bgStarsCount * 3; i++) {
      bgPosArray[i] = (Math.random() - 0.5) * 80;
    }
    
    bgStarsGeometry.setAttribute('position', new THREE.BufferAttribute(bgPosArray, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x88ccff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    
    const bgStarsMesh = new THREE.Points(bgStarsGeometry, starsMaterial);
    scene.add(bgStarsMesh);
    
    // Mouse interaction state
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Rotation
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.02;
      bgStarsMesh.rotation.y = elapsedTime * 0.01;
      
      // Parallax effect
      const targetX = mouseX * 0.001;
      const targetY = mouseY * 0.001;
      particlesMesh.rotation.y += 0.5 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
      
      // Camera follow
      camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      bgStarsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted]);
  
  if (!mounted) {
    return <div className={className} />;
  }
  
  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ background: '#050505' }}
    />
  );
}

export default CosmicBackground;
