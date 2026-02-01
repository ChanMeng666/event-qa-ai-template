'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface Reaction {
  msg: string;
  eyeScale: { x: number; y: number };
  color: { r: number; g: number; b: number };
  shape: 'sphere' | 'arc';
  rotation?: number;
}

interface SpriteChatProps {
  className?: string;
  onSpriteClick?: () => void;
}

export function SpriteChat({ className = '', onSpriteClick }: SpriteChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState('');
  const greetingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Three.js refs for animation control
  const sceneRef = useRef<{
    leftEye: THREE.Mesh;
    rightEye: THREE.Mesh;
    leftEar: THREE.Mesh;
    rightEar: THREE.Mesh;
    particleSphere: THREE.Points;
    eyeGeo: THREE.SphereGeometry;
    archedEyeGeo: THREE.TorusGeometry;
  } | null>(null);
  
  useEffect(() => {
    setMounted(true);
    return () => {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!mounted || !canvasContainerRef.current) return;
    
    const container = canvasContainerRef.current;
    const width = 180;
    const height = 180;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Particle Sphere
    const sphereGeometry = new THREE.SphereGeometry(7, 128, 128);
    const count = sphereGeometry.attributes.position.count;
    
    // Add vertex colors
    const colors: number[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(1, 1, 1);
    }
    sphereGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const sphereMaterial = new THREE.PointsMaterial({
      size: 0.12,
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
    
    const eyeGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const archedEyeGeo = new THREE.TorusGeometry(0.6, 0.15, 16, 32, Math.PI);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-1.8, 1, 6.5);
    eyeGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(1.8, 1, 6.5);
    eyeGroup.add(rightEye);
    
    // Ears with colored material
    const earGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const leftEarMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.4,
      blending: THREE.AdditiveBlending 
    });
    const rightEarMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.4,
      blending: THREE.AdditiveBlending 
    });
    
    const leftEar = new THREE.Mesh(earGeo, leftEarMat);
    leftEar.scale.set(0.8, 1.5, 0.8);
    leftEar.position.set(-8, 5, 0);
    scene.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeo, rightEarMat);
    rightEar.scale.set(0.8, 1.5, 0.8);
    rightEar.position.set(8, 5, 0);
    scene.add(rightEar);
    
    // Store refs for external animation control
    sceneRef.current = {
      leftEye,
      rightEye,
      leftEar,
      rightEar,
      particleSphere,
      eyeGeo,
      archedEyeGeo,
    };
    
    // Store original positions for wave animation
    const originalPositions = sphereGeometry.attributes.position.array.slice() as Float32Array;
    
    // Animation variables
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    // Mouse tracking - track from anywhere on the page
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX = ((e.clientX - centerX) / window.innerWidth) * 4;
      mouseY = ((e.clientY - centerY) / window.innerHeight) * 4;
      mouseX = Math.max(-1.5, Math.min(1.5, mouseX));
      mouseY = Math.max(-1.5, Math.min(1.5, mouseY));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.015;
      
      // Wave animation on particles
      const positions = sphereGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const px = originalPositions[i * 3];
        const py = originalPositions[i * 3 + 1];
        const pz = originalPositions[i * 3 + 2];
        const noise = Math.sin(px * 0.4 + time) * Math.cos(py * 0.4 + time) * Math.sin(pz * 0.4 + time);
        const displacement = 1 + noise * 0.15;
        positions[i * 3] = px * displacement;
        positions[i * 3 + 1] = py * displacement;
        positions[i * 3 + 2] = pz * displacement;
      }
      sphereGeometry.attributes.position.needsUpdate = true;
      
      // Floating animation - apply to particle sphere position, NOT the container
      const floatY = Math.sin(time * 0.8) * 1.5;
      particleSphere.position.y = floatY;
      
      // Ear animation
      leftEar.position.y = 5 + Math.sin(time * 1.5) * 1.5;
      rightEar.position.y = 5 + Math.cos(time * 1.5) * 1.5;
      leftEar.rotation.z = Math.sin(time) * 0.2;
      rightEar.rotation.z = -Math.sin(time) * 0.2;
      
      // Rotation with mouse influence
      particleSphere.rotation.y += 0.005;
      const targetRotX = mouseY * 0.4;
      const targetRotY = mouseX * 0.4;
      particleSphere.rotation.x += (targetRotX - particleSphere.rotation.x) * 0.05;
      particleSphere.rotation.y += (targetRotY - particleSphere.rotation.y) * 0.05;
      
      // Eye tracking
      eyeGroup.position.copy(particleSphere.position);
      const lookFactorX = 1.2;
      const lookFactorY = 0.8;
      leftEye.position.x = -1.8 + mouseX * lookFactorX;
      leftEye.position.y = 1 - mouseY * lookFactorY;
      rightEye.position.x = 1.8 + mouseX * lookFactorX;
      rightEye.position.y = 1 - mouseY * lookFactorY;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      eyeGeo.dispose();
      archedEyeGeo.dispose();
      eyeMat.dispose();
      earGeo.dispose();
      leftEarMat.dispose();
      rightEarMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted]);
  
  // Enhanced reactions with eye shape changes and color variations
  const reactions: Reaction[] = [
    { msg: '(>////<)', eyeScale: { x: 1, y: 0.15 }, color: { r: 1, g: 0.5, b: 0.6 }, shape: 'sphere' },
    { msg: '😳', eyeScale: { x: 1.8, y: 1.8 }, color: { r: 1, g: 0.4, b: 0.4 }, shape: 'sphere' },
    { msg: '(〃∀〃)', eyeScale: { x: 1.2, y: 1.2 }, color: { r: 1, g: 0.6, b: 0.8 }, shape: 'arc', rotation: Math.PI },
    { msg: '✨', eyeScale: { x: 1.5, y: 1.5 }, color: { r: 1, g: 1, b: 0.4 }, shape: 'sphere' },
    { msg: '(/▽＼)', eyeScale: { x: 1, y: 0.1 }, color: { r: 1, g: 0.5, b: 0.7 }, shape: 'arc', rotation: 0 },
    { msg: '(◕‿◕)', eyeScale: { x: 1.3, y: 1.3 }, color: { r: 0.6, g: 1, b: 0.8 }, shape: 'sphere' },
    { msg: '(ﾉ´ヮ`)ﾉ', eyeScale: { x: 0.8, y: 1.4 }, color: { r: 1, g: 0.8, b: 0.4 }, shape: 'arc', rotation: Math.PI },
    { msg: '(｡♥‿♥｡)', eyeScale: { x: 1.6, y: 1.6 }, color: { r: 1, g: 0.4, b: 0.6 }, shape: 'sphere' },
    { msg: '(◠‿◠)', eyeScale: { x: 1.1, y: 0.6 }, color: { r: 0.8, g: 0.9, b: 1 }, shape: 'arc', rotation: Math.PI },
    { msg: '👀', eyeScale: { x: 2, y: 2 }, color: { r: 1, g: 1, b: 1 }, shape: 'sphere' },
  ];
  
  // Apply reaction animation
  const applyReaction = useCallback((reaction: Reaction) => {
    if (!sceneRef.current) return;
    
    const { leftEye, rightEye, leftEar, rightEar, particleSphere, eyeGeo, archedEyeGeo } = sceneRef.current;
    
    // Change eye shape
    if (reaction.shape === 'arc') {
      leftEye.geometry = archedEyeGeo;
      rightEye.geometry = archedEyeGeo;
      leftEye.rotation.x = reaction.rotation || 0;
      rightEye.rotation.x = reaction.rotation || 0;
    } else {
      leftEye.geometry = eyeGeo;
      rightEye.geometry = eyeGeo;
      leftEye.rotation.x = 0;
      rightEye.rotation.x = 0;
    }
    
    // Animate eye scale
    const animateScale = (target: { x: number; y: number }) => {
      let progress = 0;
      const duration = 300;
      const startScale = { x: leftEye.scale.x, y: leftEye.scale.y };
      const startTime = performance.now();
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        leftEye.scale.x = startScale.x + (target.x - startScale.x) * eased;
        leftEye.scale.y = startScale.y + (target.y - startScale.y) * eased;
        rightEye.scale.x = startScale.x + (target.x - startScale.x) * eased;
        rightEye.scale.y = startScale.y + (target.y - startScale.y) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    animateScale(reaction.eyeScale);
    
    // Animate ear color
    const animateColor = (target: { r: number; g: number; b: number }) => {
      let progress = 0;
      const duration = 300;
      const leftMat = leftEar.material as THREE.MeshBasicMaterial;
      const rightMat = rightEar.material as THREE.MeshBasicMaterial;
      const startColor = { r: leftMat.color.r, g: leftMat.color.g, b: leftMat.color.b };
      const startTime = performance.now();
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        leftMat.color.r = startColor.r + (target.r - startColor.r) * eased;
        leftMat.color.g = startColor.g + (target.g - startColor.g) * eased;
        leftMat.color.b = startColor.b + (target.b - startColor.b) * eased;
        rightMat.color.r = startColor.r + (target.r - startColor.r) * eased;
        rightMat.color.g = startColor.g + (target.g - startColor.g) * eased;
        rightMat.color.b = startColor.b + (target.b - startColor.b) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    animateColor(reaction.color);
    
    // Bounce animation on the sphere
    const animateBounce = () => {
      let bounceProgress = 0;
      const bounceDuration = 200;
      const startTime = performance.now();
      const startY = particleSphere.position.y;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        bounceProgress = Math.min(elapsed / bounceDuration, 1);
        const bounceHeight = 2;
        const bounce = Math.sin(bounceProgress * Math.PI) * bounceHeight;
        particleSphere.position.y = startY + bounce;
        
        if (bounceProgress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    animateBounce();
  }, []);
  
  // Reset to default state
  const resetState = useCallback(() => {
    if (!sceneRef.current) return;
    
    const { leftEye, rightEye, leftEar, rightEar, eyeGeo } = sceneRef.current;
    
    leftEye.geometry = eyeGeo;
    rightEye.geometry = eyeGeo;
    leftEye.rotation.x = 0;
    rightEye.rotation.x = 0;
    
    const animateReset = () => {
      let progress = 0;
      const duration = 500;
      const startTime = performance.now();
      const startScale = { x: leftEye.scale.x, y: leftEye.scale.y };
      const leftMat = leftEar.material as THREE.MeshBasicMaterial;
      const rightMat = rightEar.material as THREE.MeshBasicMaterial;
      const startColor = { r: leftMat.color.r, g: leftMat.color.g, b: leftMat.color.b };
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        leftEye.scale.x = startScale.x + (1 - startScale.x) * eased;
        leftEye.scale.y = startScale.y + (1 - startScale.y) * eased;
        rightEye.scale.x = startScale.x + (1 - startScale.x) * eased;
        rightEye.scale.y = startScale.y + (1 - startScale.y) * eased;
        
        leftMat.color.r = startColor.r + (1 - startColor.r) * eased;
        leftMat.color.g = startColor.g + (1 - startColor.g) * eased;
        leftMat.color.b = startColor.b + (1 - startColor.b) * eased;
        rightMat.color.r = startColor.r + (1 - startColor.r) * eased;
        rightMat.color.g = startColor.g + (1 - startColor.g) * eased;
        rightMat.color.b = startColor.b + (1 - startColor.b) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    animateReset();
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    if (showGreeting) return;
    
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    setGreetingText(reaction.msg);
    setShowGreeting(true);
    applyReaction(reaction);
    
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
    }
  }, [showGreeting, applyReaction]);
  
  const handleMouseLeave = useCallback(() => {
    greetingTimeoutRef.current = setTimeout(() => {
      setShowGreeting(false);
      resetState();
    }, 500);
  }, [resetState]);
  
  const handleClick = useCallback(() => {
    onSpriteClick?.();
  }, [onSpriteClick]);
  
  // Sprite content
  const spriteContent = (
    <div 
      ref={containerRef}
      id="sprite-container"
      className={cn("cursor-pointer", className)}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: 180,
        height: 180,
        zIndex: 10000,
        pointerEvents: 'auto',
        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Greeting bubble */}
      <div
        className="sprite-greeting"
        style={{
          position: 'absolute',
          top: '50%',
          right: '110%',
          transform: showGreeting 
            ? 'translateY(-50%) scale(1) translateX(0)' 
            : 'translateY(-50%) scale(0.8) translateX(20px)',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '10px 20px',
          borderRadius: '40px',
          color: '#ffffff',
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '1px',
          pointerEvents: 'none',
          opacity: showGreeting ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          zIndex: 10001,
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        {greetingText}
      </div>
      
      {/* Three.js canvas container */}
      <div 
        ref={canvasContainerRef} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
  
  // Don't render anything on server
  if (!mounted) {
    return null;
  }
  
  // Use portal to render directly to body, avoiding any transform ancestors
  return createPortal(spriteContent, document.body);
}

export default SpriteChat;
