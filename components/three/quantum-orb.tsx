'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface QuantumOrbProps {
  className?: string
  size?: number
}

/**
 * Quantum Singularity Orb Component
 * A CSS-based black hole visualization with accretion disks, 
 * photon ring, and energy jets
 */
export function QuantumOrb({ className = '', size = 380 }: QuantumOrbProps) {
  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve3d',
        perspective: '1000px',
        transform: 'rotateX(60deg) rotateZ(-20deg)',
        background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 70%)',
        borderRadius: '50%',
      }}
    >
      {/* Accretion Disk */}
      <div 
        className="absolute w-full h-full animate-disk-spin"
        style={{ transformStyle: 'preserve3d' }}
      >
        {/* Ring 1 - Outer */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: size * 0.95,
            height: size * 0.95,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid rgba(255, 255, 255, 0.9)',
            borderBottom: '2px solid rgba(255, 255, 255, 0.9)',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
          }}
        />
        
        {/* Ring 2 - Middle */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse-ring"
          style={{
            width: size * 0.74,
            height: size * 0.74,
            border: '8px solid rgba(255, 255, 255, 0.05)',
            borderLeft: '8px solid rgba(255, 255, 255, 0.3)',
            borderRight: '8px solid rgba(255, 255, 255, 0.3)',
            filter: 'blur(4px)',
          }}
        />
        
        {/* Ring 3 - Inner Dashed */}
        <div 
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: size * 0.53,
            height: size * 0.53,
            border: '1px dashed rgba(255, 255, 255, 0.3)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
            transform: 'translate(-50%, -50%)',
            animation: 'spinReverse 20s linear infinite',
          }}
        />
      </div>
      
      {/* Event Horizon */}
      <div 
        className="absolute"
        style={{
          width: size * 0.21,
          height: size * 0.21,
          transformStyle: 'preserve3d',
          transform: 'rotateX(-60deg)',
        }}
      >
        {/* Singularity Core */}
        <div 
          className="absolute w-full h-full bg-black rounded-full"
          style={{
            boxShadow: '0 0 20px #000, 0 0 40px rgba(255, 255, 255, 0.1), 0 0 80px rgba(255, 255, 255, 0.1)',
          }}
        />
        
        {/* Photon Ring */}
        <div 
          className="absolute rounded-full animate-photon-pulse"
          style={{
            top: '-5%',
            left: '-5%',
            width: '110%',
            height: '110%',
            border: '2px solid #fff',
            boxShadow: '0 0 15px #fff, 0 0 30px rgba(255, 255, 255, 0.3)',
            opacity: 0.9,
          }}
        />
      </div>
      
      {/* Energy Jets */}
      <div 
        className="absolute w-full h-full pointer-events-none"
        style={{ transformStyle: 'preserve3d' }}
      >
        {/* Top Jet */}
        <div 
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '50%',
            width: 4,
            height: size * 0.4,
            background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent)',
            filter: 'blur(2px)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            transformOrigin: 'bottom center',
            transform: 'rotateX(-90deg)',
          }}
        />
        
        {/* Bottom Jet */}
        <div 
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '50%',
            width: 4,
            height: size * 0.4,
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), transparent)',
            filter: 'blur(2px)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            transformOrigin: 'top center',
            transform: 'rotateX(90deg)',
          }}
        />
      </div>
      
      {/* 3D Particles */}
      <div 
        className="absolute w-full h-full"
        style={{
          transformStyle: 'preserve3d',
          animation: 'particleCloudSpin 30s linear infinite',
        }}
      >
        {[
          { top: '20%', left: '20%', z: 50 },
          { top: '80%', left: '80%', z: -50 },
          { top: '20%', left: '80%', z: 20 },
          { top: '80%', left: '20%', z: -20 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: pos.top,
              left: pos.left,
              transform: `translateZ(${pos.z}px)`,
              boxShadow: '0 0 5px #fff',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default QuantumOrb
