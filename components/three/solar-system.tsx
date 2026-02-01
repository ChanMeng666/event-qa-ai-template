'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { cn } from '@/lib/utils'

interface SolarSystemProps {
  className?: string
  size?: number
}

// Configuration - matching space.html exactly
const CONFIG = {
  bloomStrength: 1.8,
  bloomRadius: 0.5,
  bloomThreshold: 0.2,
  ambientLight: 0.05,
  starCount: 6000,
  autoRotateSpeed: 0.3
}

// Planet Data - matching space.html exactly
const planetData = [
  {
    name: 'MUSE AURORA',
    cnName: '缪斯极光',
    color: 0x4169E1,
    atmosphereColor: 0x00ffff,
    type: 'Terrestrial',
    orbitRadius: 55,
    size: 4.5,
    speed: 0.003,
    description: '汇聚宇宙间的灵感碎片，这里是艺术家与梦想家的终极归宿。'
  },
  {
    name: 'LUMINARIA',
    cnName: '流光书海',
    color: 0xD3D3D3,
    atmosphereColor: 0xffffff,
    type: 'Satellite',
    orbitRadius: 75,
    size: 2.2,
    speed: 0.005,
    description: '漂浮在静谧虚空中的智慧结晶，表面刻满了宇宙真理的符文。'
  },
  {
    name: 'NEON FORGE',
    cnName: '霓虹锻界',
    color: 0xFF4500,
    atmosphereColor: 0xff3300,
    type: 'Industrial',
    orbitRadius: 100,
    size: 4,
    speed: 0.002,
    description: '闪耀着赛博朋克光芒的未来世界。'
  },
  {
    name: 'WHISPER RING',
    cnName: '风语环廊',
    color: 0xDAA520,
    atmosphereColor: 0xffcc00,
    type: 'Gas Giant',
    orbitRadius: 140,
    size: 9,
    speed: 0.001,
    description: '巨大的气态行星，表面风暴涌动着全宇宙的信息流。'
  }
]

/**
 * Solar System Component
 * Exact replication of space.html Three.js solar system
 * with bloom post-processing, OrbitControls, and interactive planets
 */
export function SolarSystem({ className = '', size = 400 }: SolarSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const composerRef = useRef<EffectComposer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const width = size
    const height = size
    
    // ========== Scene Setup ==========
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.0015)
    
    // ========== Camera Setup ==========
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000)
    camera.position.set(0, 40, 180)
    
    // ========== Renderer Setup ==========
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ReinhardToneMapping
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer
    
    // ========== Post-Processing (Bloom Effect) ==========
    const renderScene = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5, 0.4, 0.85
    )
    bloomPass.threshold = CONFIG.bloomThreshold
    bloomPass.strength = CONFIG.bloomStrength
    bloomPass.radius = CONFIG.bloomRadius
    
    const composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)
    composerRef.current = composer
    
    // ========== OrbitControls ==========
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 50
    controls.maxDistance = 400
    controls.autoRotate = true
    controls.autoRotateSpeed = CONFIG.autoRotateSpeed
    controlsRef.current = controls
    
    // ========== Lighting ==========
    const ambientLight = new THREE.AmbientLight(0x404040, CONFIG.ambientLight)
    scene.add(ambientLight)
    
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 400)
    scene.add(sunLight)
    
    // ========== Create Starfield ==========
    const createStarfield = () => {
      const geometry = new THREE.BufferGeometry()
      const positions: number[] = []
      const colors: number[] = []
      
      for (let i = 0; i < CONFIG.starCount; i++) {
        const x = (Math.random() - 0.5) * 2000
        const y = (Math.random() - 0.5) * 2000
        const z = (Math.random() - 0.5) * 2000
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
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      })
      
      const starField = new THREE.Points(geometry, material)
      scene.add(starField)
    }
    
    // ========== Create Sun with Shader ==========
    let sunMesh: THREE.Mesh
    
    const createSun = () => {
      const geometry = new THREE.SphereGeometry(12, 64, 64)
      
      // Custom shader for sun surface turbulence
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
      
      // Sun outer glow (Bloom will amplify this)
      const glowGeo = new THREE.SphereGeometry(13.5, 32, 32)
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff4500,
        transparent: true,
        opacity: 0.15
      })
      const sunGlow = new THREE.Mesh(glowGeo, glowMat)
      sunMesh.add(sunGlow)
      
      scene.add(sunMesh)
    }
    
    // ========== Fresnel Atmosphere Shader ==========
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
    
    // ========== Create Planets ==========
    interface PlanetUserData {
      name: string
      cnName: string
      color: number
      atmosphereColor: number
      type: string
      orbitRadius: number
      size: number
      speed: number
      description: string
      angle: number
    }
    
    interface PlanetGroup extends THREE.Group {
      atmosphere?: THREE.Mesh
      userData: PlanetUserData
    }
    
    const planets: PlanetGroup[] = []
    
    const createPlanets = () => {
      planetData.forEach(data => {
        const planetGroup = new THREE.Group() as PlanetGroup
        const angle = Math.random() * Math.PI * 2
        
        // Planet body
        const geometry = new THREE.SphereGeometry(data.size, 64, 64)
        const material = new THREE.MeshPhysicalMaterial({
          color: data.color,
          roughness: 0.6,
          metalness: 0.1,
          reflectivity: 0.2,
          flatShading: false
        })
        
        const planet = new THREE.Mesh(geometry, material)
        planetGroup.add(planet)
        
        // Atmosphere glow (Fresnel)
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
        
        // Store data
        planetGroup.userData = { ...data, angle }
        
        scene.add(planetGroup)
        planets.push(planetGroup)
      })
    }
    
    // ========== Initialize Scene Objects ==========
    createStarfield()
    createSun()
    createPlanets()
    
    // ========== Animation Loop ==========
    let time = 0
    let animationId: number
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      time += 0.005
      
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
      
      // Update controls
      controls.update()
      
      // Render with post-processing (using composer instead of renderer)
      composer.render()
    }
    
    animate()
    
    // ========== Handle Resize ==========
    const handleResize = () => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      composer.setSize(width, height)
    }
    
    // ========== Cleanup ==========
    return () => {
      cancelAnimationFrame(animationId)
      
      // Dispose controls
      controls.dispose()
      
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
        if (object instanceof THREE.Line) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          }
        }
        if (object instanceof THREE.Points) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          }
        }
      })
      
      // Dispose composer
      composer.dispose()
      
      // Dispose renderer
      renderer.dispose()
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [size])
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative cursor-grab active:cursor-grabbing", className)}
      style={{ 
        width: size, 
        height: size
      }}
    />
  )
}

export default SolarSystem
