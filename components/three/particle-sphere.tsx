'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface ParticleSphereProps {
  className?: string;
  greeting?: string;
  onGreet?: () => void;
}

export function ParticleSphere({ 
  className = '', 
  greeting = 'WELCOME!',
  onGreet 
}: ParticleSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const greetingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    setMounted(true);
    return () => {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth || 280;
    const containerHeight = container.offsetHeight || 280;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerWidth / containerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 25;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Particle Sphere
    const sphereGeometry = new THREE.SphereGeometry(8, 128, 128);
    const count = sphereGeometry.attributes.position.count;
    
    // Add vertex colors
    const colors: number[] = [];
    const color1 = new THREE.Color(0xffffff);
    const color2 = new THREE.Color(0xaaaaaa);
    
    for (let i = 0; i < count; i++) {
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }
    sphereGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const sphereMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    
    const particleSphere = new THREE.Points(sphereGeometry, sphereMaterial);
    scene.add(particleSphere);
    
    // Eyes
    const eyeGroup = new THREE.Group();
    scene.add(eyeGroup);
    
    const eyeGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-1.5, 1.2, 8.2);
    leftEye.scale.set(0, 0, 0);
    eyeGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(1.5, 1.2, 8.2);
    rightEye.scale.set(0, 0, 0);
    eyeGroup.add(rightEye);
    
    // Store original positions for wave animation
    const originalPositions = sphereGeometry.attributes.position.array.slice() as Float32Array;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let time = 0;
    const amplitude = 0.9;
    const speed = 1.0;
    let isHovered = false;
    
    // Event handlers
    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => {
      isHovered = false;
      mouseX = 0;
      mouseY = 0;
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01 * speed;
      
      // Wave simulation
      const positions = sphereGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const px = originalPositions[i * 3];
        const py = originalPositions[i * 3 + 1];
        const pz = originalPositions[i * 3 + 2];
        
        const noise = Math.sin(px * 0.5 + time) * 
                      Math.cos(py * 0.3 + time) * 
                      Math.sin(pz * 0.5 + time);
        const displacement = 1 + (noise * 0.18 * amplitude);
        
        positions[i * 3] = px * displacement;
        positions[i * 3 + 1] = py * displacement;
        positions[i * 3 + 2] = pz * displacement;
      }
      sphereGeometry.attributes.position.needsUpdate = true;
      
      // Position magnetism
      const targetPosX = mouseX * 1.2;
      const targetPosY = -mouseY * 1.2;
      particleSphere.position.x += 0.08 * (targetPosX - particleSphere.position.x);
      particleSphere.position.y += 0.08 * (targetPosY - particleSphere.position.y);
      
      // Elastic scale
      const distToCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const targetScale = 1 + distToCenter * 0.15;
      particleSphere.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Rotation
      particleSphere.rotation.y += 0.003;
      particleSphere.rotation.x += 0.05 * (mouseY * 0.4 - particleSphere.rotation.x);
      particleSphere.rotation.z += 0.05 * (mouseX * 0.2 - particleSphere.rotation.z);
      
      // Eyes interaction
      eyeGroup.position.copy(particleSphere.position);
      
      const eyeScaleTarget = (isHovered && distToCenter < 0.5) ? 1 : 0;
      const eyeScaleVec = new THREE.Vector3(eyeScaleTarget, eyeScaleTarget, eyeScaleTarget);
      
      leftEye.scale.lerp(eyeScaleVec, 0.1);
      rightEye.scale.lerp(eyeScaleVec, 0.1);
      
      // Eye tracking
      const lookFactor = 0.4;
      leftEye.position.x = -1.5 + mouseX * lookFactor;
      leftEye.position.y = 1.2 - mouseY * lookFactor;
      rightEye.position.x = 1.5 + mouseX * lookFactor;
      rightEye.position.y = 1.2 - mouseY * lookFactor;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', handleMouseMove);
      
      // Dispose resources
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      eyeGeo.dispose();
      eyeMat.dispose();
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted]);
  
  const handleClick = useCallback(() => {
    if (showGreeting) return;
    
    setShowGreeting(true);
    onGreet?.();
    
    greetingTimeoutRef.current = setTimeout(() => {
      setShowGreeting(false);
    }, 2000);
  }, [showGreeting, onGreet]);
  
  if (!mounted) {
    return <div className={className} />;
  }
  
  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      onClick={handleClick}
      style={{ background: 'transparent' }}
    >
      {/* Greeting bubble */}
      <div
        className={`
          absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white/5 backdrop-blur-[15px] border border-white/20
          px-6 py-3 text-white font-semibold text-sm tracking-widest uppercase
          pointer-events-none z-10
          transition-all duration-500
          shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.1)]
          whitespace-nowrap
          ${showGreeting 
            ? 'opacity-100 -translate-y-[120%] scale-100' 
            : 'opacity-0 -translate-y-1/2 scale-[0.8]'
          }
        `}
      >
        {greeting}
      </div>
    </div>
  );
}

export default ParticleSphere;
