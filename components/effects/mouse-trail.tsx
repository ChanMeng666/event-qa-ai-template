'use client';

import { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    // Trail points
    const trail: TrailPoint[] = [];
    const maxTrailLength = 20;
    const trailLifespan = 0.5; // seconds
    
    let mouseX = 0;
    let mouseY = 0;
    let lastTime = performance.now();
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Add new point
      trail.push({
        x: mouseX,
        y: mouseY,
        age: 0
      });
      
      // Remove old points
      if (trail.length > maxTrailLength) {
        trail.shift();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw trail
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += deltaTime;
        
        // Remove old points
        if (trail[i].age > trailLifespan) {
          trail.splice(i, 1);
          continue;
        }
        
        const progress = trail[i].age / trailLifespan;
        const alpha = 1 - progress;
        const size = (1 - progress) * 8 + 2;
        
        // Draw glow
        const gradient = ctx.createRadialGradient(
          trail[i].x, trail[i].y, 0,
          trail[i].x, trail[i].y, size * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw core
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
      
      // Draw connections between points
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        
        for (let i = 1; i < trail.length; i++) {
          const progress = trail[i].age / trailLifespan;
          const alpha = (1 - progress) * 0.3;
          
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = (1 - progress) * 2;
        }
        ctx.stroke();
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mounted]);
  
  if (!mounted) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export default MouseTrail;
