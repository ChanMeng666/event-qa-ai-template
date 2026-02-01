'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

interface SolarSystemProps {
  className?: string
  size?: number
}

/**
 * Solar System Component
 * A Three.js based solar system visualization with orbiting planets,
 * sun with shader animation, and bloom effects
 */
export function SolarSystem({ className = '', size = 400 }: SolarSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const width = size
    const height = size
    
    // Configuration
    const CONFIG = {
      ambientLight: 0.05,
      starCount: 2000,
      autoRotateSpeed: 0.3
    }
    
    // Scene Setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.003)
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000)
    camera.position.set(0, 60, 180)
    camera.lookAt(0, 0, 0)
    
    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ReinhardToneMapping
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, CONFIG.ambientLight)
    scene.add(ambientLight)
    
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 400)
    scene.add(sunLight)
    
    // Planet Data
    const planetData = [
      {
        name: 'Planet 1',
        color: 0x4169E1,
        atmosphereColor: 0x00ffff,
        orbitRadius: 45,
        size: 4,
        speed: 0.004,
        angle: Math.random() * Math.PI * 2
      },
      {
        name: 'Planet 2',
        color: 0xD3D3D3,
        atmosphereColor: 0xffffff,
        orbitRadius: 65,
        size: 2.5,
        speed: 0.006,
        angle: Math.random() * Math.PI * 2
      },
      {
        name: 'Planet 3',
        color: 0xFF4500,
        atmosphereColor: 0xff3300,
        orbitRadius: 85,
        size: 3.5,
        speed: 0.003,
        angle: Math.random() * Math.PI * 2
      },
      {
        name: 'Planet 4',
        color: 0xDAA520,
        atmosphereColor: 0xffcc00,
        orbitRadius: 115,
        size: 7,
        speed: 0.0015,
        angle: Math.random() * Math.PI * 2
      }
    ]
    
    // Create Starfield
    const createStarfield = () => {
      const geometry = new THREE.BufferGeometry()
      const positions: number[] = []
      const colors: number[] = []
      
      for (let i = 0; i < CONFIG.starCount; i++) {
        const x = (Math.random() - 0.5) * 1500
        const y = (Math.random() - 0.5) * 1500
        const z = (Math.random() - 0.5) * 1500
        positions.push(x, y, z)
        
        const colorType = Math.random()
        let color: THREE.Color
        if (colorType > 0.9) color = new THREE.Color(0xadd8e6)
        else if (colorType > 0.7) color = new THREE.Color(0xffd700)
        else color = new THREE.Color(0xffffff)
        
        colors.push(color.r, color.g, color.b)
      }
      
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      
      const material = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      })
      
      const starField = new THREE.Points(geometry, material)
      scene.add(starField)
    }
    
    // Create Sun with Shader
    let sunMesh: THREE.Mesh
    const createSun = () => {
      const geometry = new THREE.SphereGeometry(10, 64, 64)
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xffaa00) },
          color2: { value: new THREE.Color(0xffddaa) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          void main() {
            vec2 p = vUv * 8.0;
            float n = noise(p + time * 0.2);
            vec3 finalColor = mix(color1, color2, n + 0.2);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        side: THREE.DoubleSide
      })
      
      sunMesh = new THREE.Mesh(geometry, material)
      
      // Sun glow
      const glowGeo = new THREE.SphereGeometry(12, 32, 32)
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff4500,
        transparent: true,
        opacity: 0.15
      })
      const sunGlow = new THREE.Mesh(glowGeo, glowMat)
      sunMesh.add(sunGlow)
      
      // Outer glow
      const outerGlowGeo = new THREE.SphereGeometry(14, 32, 32)
      const outerGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.08
      })
      const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat)
      sunMesh.add(outerGlow)
      
      scene.add(sunMesh)
    }
    
    // Create Atmosphere Material (Fresnel shader)
    const getAtmosphereMaterial = (color: number) => {
      return new THREE.ShaderMaterial({
        uniforms: {
          c: { value: 0.7 },
          p: { value: 3.0 },
          glowColor: { value: new THREE.Color(color) },
          viewVector: { value: camera.position }
        },
        vertexShader: `
          uniform vec3 viewVector;
          uniform float c;
          uniform float p;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(c - dot(vNormal, vNormel), p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 1.0);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      })
    }
    
    // Create Planets
    interface PlanetGroup extends THREE.Group {
      atmosphere?: THREE.Mesh
      userData: typeof planetData[0]
    }
    
    const planets: PlanetGroup[] = []
    
    const createPlanets = () => {
      planetData.forEach(data => {
        const planetGroup = new THREE.Group() as PlanetGroup
        
        // Planet body
        const geometry = new THREE.SphereGeometry(data.size, 64, 64)
        const material = new THREE.MeshPhysicalMaterial({
          color: data.color,
          roughness: 0.6,
          metalness: 0.1,
          reflectivity: 0.2
        })
        
        const planet = new THREE.Mesh(geometry, material)
        planetGroup.add(planet)
        
        // Atmosphere glow
        const atmoGeo = new THREE.SphereGeometry(data.size * 1.2, 64, 64)
        const atmoMat = getAtmosphereMaterial(data.atmosphereColor)
        const atmosphere = new THREE.Mesh(atmoGeo, atmoMat)
        planet.add(atmosphere)
        planetGroup.atmosphere = atmosphere
        
        // Orbit line
        const orbitCurve = new THREE.EllipseCurve(
          0, 0,
          data.orbitRadius, data.orbitRadius,
          0, 2 * Math.PI,
          false, 0
        )
        const points = orbitCurve.getPoints(128)
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map(p => new THREE.Vector3(p.x, 0, p.y))
        )
        const orbitMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.08
        })
        const orbit = new THREE.Line(orbitGeo, orbitMat)
        scene.add(orbit)
        
        planetGroup.userData = data
        scene.add(planetGroup)
        planets.push(planetGroup)
      })
    }
    
    // Initialize scene objects
    createStarfield()
    createSun()
    createPlanets()
    
    // Animation
    let time = 0
    let rotationY = 0
    let animationId: number
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      time += 0.005
      rotationY += 0.001
      
      // Rotate camera around scene
      camera.position.x = Math.sin(rotationY) * 180
      camera.position.z = Math.cos(rotationY) * 180
      camera.lookAt(0, 0, 0)
      
      // Sun animation
      if (sunMesh && sunMesh.material instanceof THREE.ShaderMaterial) {
        sunMesh.material.uniforms.time.value = time
        sunMesh.rotation.y += 0.002
      }
      
      // Planet animation
      planets.forEach(p => {
        const data = p.userData
        
        // Orbit
        data.angle += data.speed
        p.position.x = Math.cos(data.angle) * data.orbitRadius
        p.position.z = Math.sin(data.angle) * data.orbitRadius
        
        // Self rotation
        if (p.children[0]) {
          p.children[0].rotation.y += 0.01
        }
        
        // Update atmosphere shader view vector
        if (p.atmosphere && p.atmosphere.material instanceof THREE.ShaderMaterial) {
          p.atmosphere.material.uniforms.viewVector.value = 
            new THREE.Vector3().subVectors(camera.position, p.position)
        }
      })
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      
      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose())
          }
        }
      })
      
      renderer.dispose()
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [size])
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative", className)}
      style={{ 
        width: size, 
        height: size,
        filter: 'drop-shadow(0 0 30px rgba(255, 150, 50, 0.2))'
      }}
    />
  )
}

export default SolarSystem
