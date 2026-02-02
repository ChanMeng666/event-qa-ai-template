'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import {
  gestureConfigs,
  negativeBehaviorConfigs,
  affectionLevels,
  levelUpPhrases,
  moodConfigs,
  emotionConfigs,
  timePeriodConfigs,
  streakBonuses,
  getAffectionLevel,
  getLevelProgress,
  getMoodState,
  getTimePeriod,
  getStreakBonus,
  calculateDaysSinceLastInteraction,
  AFFECTION_STORAGE_KEY,
  defaultAffectionState,
  type AffectionState,
  type AffectionTier,
  type GestureType,
  type NegativeBehaviorType,
  type EmotionCategory,
  type MoodState,
} from '@/config/sprite-affection.config';

// Gesture detection state
interface GestureState {
  // Circle detection
  circleAngleAccumulator: number;
  lastAngle: number | null;
  circleDirection: 'cw' | 'ccw' | null;
  
  // Vertical swipe detection
  verticalCrossCount: number;
  lastVerticalSide: 'top' | 'bottom' | null;
  
  // Horizontal swipe detection
  horizontalCrossCount: number;
  lastHorizontalSide: 'left' | 'right' | null;
  
  // Pat detection (slow movement on top area)
  patCount: number;
  lastPatTime: number;
  isInPatZone: boolean;
}

// Negative behavior detection state
interface NegativeBehaviorState {
  lastClickTime: number;
  clickCount: number;
  lastRoughMovementTime: number;
  hoverStartTime: number | null;
  lastIgnoreWarningTime: number;
  consecutiveCircles: number;
}

const initialGestureState: GestureState = {
  circleAngleAccumulator: 0,
  lastAngle: null,
  circleDirection: null,
  verticalCrossCount: 0,
  lastVerticalSide: null,
  horizontalCrossCount: 0,
  lastHorizontalSide: null,
  patCount: 0,
  lastPatTime: 0,
  isInPatZone: false,
};

const initialNegativeBehaviorState: NegativeBehaviorState = {
  lastClickTime: 0,
  clickCount: 0,
  lastRoughMovementTime: 0,
  hoverStartTime: null,
  lastIgnoreWarningTime: 0,
  consecutiveCircles: 0,
};

// Animation types (extended)
type AnimationType = 'bounce' | 'shake' | 'pulse' | 'spin' | 'wobble' | 'tremble' | 'droop';

interface Reaction {
  msg: string;
  emotion: EmotionCategory;
  eyeScale: { x: number; y: number };
  shape: 'sphere' | 'arc' | 'star' | 'heart' | 'crescent' | 'spiral' | 'teardrop';
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
  const [glowColor, setGlowColor] = useState('rgba(255, 255, 255, 0.15)');
  const [currentEmotion, setCurrentEmotion] = useState<EmotionCategory | null>(null);
  const [moodState, setMoodState] = useState<MoodState>('neutral');
  const greetingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverStartTimeRef = useRef<number | null>(null);
  const longHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ignoreCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMouseMoveRef = useRef<number>(Date.now());
  
  // Affection & Mood system state
  const [affection, setAffection] = useState<AffectionState>({ ...defaultAffectionState });
  const [showFloatingText, setShowFloatingText] = useState(false);
  const [floatingText, setFloatingText] = useState('');
  const [floatingTextType, setFloatingTextType] = useState<'points' | 'levelup' | 'mood' | 'streak'>('points');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showMoodIndicator, setShowMoodIndicator] = useState(false);
  const gestureStateRef = useRef<GestureState>({ ...initialGestureState });
  const negativeBehaviorStateRef = useRef<NegativeBehaviorState>({ ...initialNegativeBehaviorState });
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const lastMouseSpeedRef = useRef<number>(0);
  
  // Load affection from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(AFFECTION_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const level = getAffectionLevel(parsed.points || 0);
          
          // Calculate decay based on days since last interaction
          const daysSince = calculateDaysSinceLastInteraction(parsed.lastInteraction || Date.now());
          let decayedPoints = parsed.points || 0;
          
          if (daysSince > 0 && level.decayRate > 0) {
            const decay = Math.min(daysSince * level.decayRate, decayedPoints - level.minPoints);
            decayedPoints = Math.max(level.minPoints, decayedPoints - decay);
          }
          
          // Check streak
          const lastBonusDate = new Date(parsed.lastDailyBonus || 0).toDateString();
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          
          let streakDays = parsed.streakDays || 0;
          if (lastBonusDate !== today && lastBonusDate !== yesterday) {
            streakDays = 0; // Streak broken
          }
          
          const newLevel = getAffectionLevel(decayedPoints);
          setAffection({
            points: decayedPoints,
            tier: newLevel.tier,
            mood: parsed.mood || 0,
            streakDays,
            lastInteraction: parsed.lastInteraction || Date.now(),
            lastDailyBonus: parsed.lastDailyBonus || 0,
            totalInteractions: parsed.totalInteractions || 0,
            circleCount: 0,
          });
          setMoodState(getMoodState(parsed.mood || 0));
          
          // Show return message if was away
          if (daysSince > 0) {
            const returnPhrase = newLevel.returnPhrases[Math.floor(Math.random() * newLevel.returnPhrases.length)];
            setGreetingText(returnPhrase);
            setShowGreeting(true);
            setTimeout(() => setShowGreeting(false), 3000);
          }
        } catch {
          // Invalid data, use default
        }
      }
    }
  }, []);
  
  // Save affection to localStorage when it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem(AFFECTION_STORAGE_KEY, JSON.stringify(affection));
      setMoodState(getMoodState(affection.mood));
    }
  }, [affection, mounted]);
  
  // Three.js refs for animation control
  const sceneRef = useRef<{
    leftEye: THREE.Mesh;
    rightEye: THREE.Mesh;
    leftEar: THREE.Mesh;
    rightEar: THREE.Mesh;
    particleSphere: THREE.Points;
    sphereGeometry: THREE.SphereGeometry;
    eyeGeo: THREE.SphereGeometry;
    archedEyeGeo: THREE.TorusGeometry;
    starEyeGeo: THREE.BufferGeometry;
    heartEyeGeo: THREE.BufferGeometry;
    crescentEyeGeo: THREE.TorusGeometry;
    spiralEyeGeo: THREE.TorusKnotGeometry;
    teardropEyeGeo: THREE.BufferGeometry;
  } | null>(null);
  
  useEffect(() => {
    setMounted(true);
    return () => {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
      }
      if (longHoverTimeoutRef.current) {
        clearTimeout(longHoverTimeoutRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
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
    
    // Star eye geometry - 5 pointed star
    const starShape = new THREE.Shape();
    const outerRadius = 0.5;
    const innerRadius = 0.2;
    const spikes = 5;
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starEyeGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.15, bevelEnabled: false });
    starEyeGeo.center();
    
    // Heart eye geometry
    const heartShape = new THREE.Shape();
    const hx = 0, hy = 0, hs = 0.35;
    heartShape.moveTo(hx, hy + hs * 0.5);
    heartShape.bezierCurveTo(hx, hy + hs, hx - hs, hy + hs, hx - hs, hy + hs * 0.5);
    heartShape.bezierCurveTo(hx - hs, hy, hx, hy - hs * 0.5, hx, hy - hs);
    heartShape.bezierCurveTo(hx, hy - hs * 0.5, hx + hs, hy, hx + hs, hy + hs * 0.5);
    heartShape.bezierCurveTo(hx + hs, hy + hs, hx, hy + hs, hx, hy + hs * 0.5);
    const heartEyeGeo = new THREE.ExtrudeGeometry(heartShape, { depth: 0.15, bevelEnabled: false });
    heartEyeGeo.center();
    heartEyeGeo.rotateZ(Math.PI); // Flip so heart points down correctly
    
    // Crescent eye geometry (for sleepy)
    const crescentEyeGeo = new THREE.TorusGeometry(0.4, 0.12, 16, 32, Math.PI * 0.6);
    
    // Spiral eye geometry (for dizzy) - using torus knot
    const spiralEyeGeo = new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8, 2, 3);
    
    // Teardrop eye geometry (for sad)
    const teardropShape = new THREE.Shape();
    teardropShape.moveTo(0, 0.4);
    teardropShape.bezierCurveTo(0.3, 0.2, 0.3, -0.2, 0, -0.4);
    teardropShape.bezierCurveTo(-0.3, -0.2, -0.3, 0.2, 0, 0.4);
    const teardropEyeGeo = new THREE.ExtrudeGeometry(teardropShape, { depth: 0.1, bevelEnabled: false });
    teardropEyeGeo.center();
    
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
      sphereGeometry,
      eyeGeo,
      archedEyeGeo,
      starEyeGeo,
      heartEyeGeo,
      crescentEyeGeo,
      spiralEyeGeo,
      teardropEyeGeo,
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
      starEyeGeo.dispose();
      heartEyeGeo.dispose();
      crescentEyeGeo.dispose();
      spiralEyeGeo.dispose();
      teardropEyeGeo.dispose();
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
  
  // Enhanced reactions with emotion categories - 35+ expressions
  const reactions: Reaction[] = [
    // Happy expressions (5)
    { msg: '(◕‿◕)', emotion: 'happy', eyeScale: { x: 1.3, y: 1.3 }, shape: 'sphere' },
    { msg: 'Yay~!', emotion: 'happy', eyeScale: { x: 1.5, y: 1.2 }, shape: 'arc', rotation: Math.PI },
    { msg: '(｡◕‿◕｡)', emotion: 'happy', eyeScale: { x: 1.4, y: 1.4 }, shape: 'sphere' },
    { msg: '(◠‿◠)', emotion: 'happy', eyeScale: { x: 1.1, y: 0.6 }, shape: 'arc', rotation: Math.PI },
    { msg: 'Nice!', emotion: 'happy', eyeScale: { x: 1.3, y: 1.1 }, shape: 'sphere' },
    
    // Excited expressions (5)
    { msg: '✨ WOW! ✨', emotion: 'excited', eyeScale: { x: 2, y: 2 }, shape: 'star' },
    { msg: '(ﾉ´ヮ`)ﾉ*:・゚✧', emotion: 'excited', eyeScale: { x: 1.8, y: 1.8 }, shape: 'star' },
    { msg: 'AMAZING!', emotion: 'excited', eyeScale: { x: 1.9, y: 1.9 }, shape: 'star' },
    { msg: '(☆▽☆)', emotion: 'excited', eyeScale: { x: 1.7, y: 1.7 }, shape: 'star' },
    { msg: 'Let\'s GO!', emotion: 'excited', eyeScale: { x: 1.6, y: 1.8 }, shape: 'sphere' },
    
    // Shy expressions (4)
    { msg: '(>////<)', emotion: 'shy', eyeScale: { x: 1, y: 0.15 }, shape: 'sphere' },
    { msg: 'H-hi...', emotion: 'shy', eyeScale: { x: 0.8, y: 0.3 }, shape: 'arc', rotation: 0 },
    { msg: '(/▽＼)', emotion: 'shy', eyeScale: { x: 1, y: 0.1 }, shape: 'arc', rotation: 0 },
    { msg: '(〃▽〃)', emotion: 'shy', eyeScale: { x: 0.9, y: 0.2 }, shape: 'sphere' },
    
    // Love expressions (4)
    { msg: '(♥‿♥)', emotion: 'love', eyeScale: { x: 1.6, y: 1.6 }, shape: 'heart' },
    { msg: '(｡♥‿♥｡)', emotion: 'love', eyeScale: { x: 1.5, y: 1.5 }, shape: 'heart' },
    { msg: 'So cute~', emotion: 'love', eyeScale: { x: 1.4, y: 1.4 }, shape: 'heart' },
    { msg: '♡(◡‿◡)', emotion: 'love', eyeScale: { x: 1.3, y: 1.2 }, shape: 'arc', rotation: Math.PI },
    
    // Surprised expressions (4)
    { msg: '😳', emotion: 'surprised', eyeScale: { x: 1.8, y: 1.8 }, shape: 'sphere' },
    { msg: 'Whoa!', emotion: 'surprised', eyeScale: { x: 2, y: 2 }, shape: 'sphere' },
    { msg: '(°o°)', emotion: 'surprised', eyeScale: { x: 1.9, y: 1.9 }, shape: 'sphere' },
    { msg: 'EH?!', emotion: 'surprised', eyeScale: { x: 2.1, y: 2.1 }, shape: 'sphere' },
    
    // Curious expressions (4)
    { msg: 'Hmm...?', emotion: 'curious', eyeScale: { x: 1.4, y: 1.2 }, shape: 'sphere' },
    { msg: '(・・?)', emotion: 'curious', eyeScale: { x: 1.3, y: 1.5 }, shape: 'sphere' },
    { msg: 'Tell me more', emotion: 'curious', eyeScale: { x: 1.2, y: 1.3 }, shape: 'sphere' },
    { msg: '👀', emotion: 'curious', eyeScale: { x: 1.6, y: 1.6 }, shape: 'sphere' },
    
    // Playful expressions (4)
    { msg: '(〃∀〃)', emotion: 'playful', eyeScale: { x: 1.2, y: 1.2 }, shape: 'arc', rotation: Math.PI },
    { msg: 'Hehe~', emotion: 'playful', eyeScale: { x: 1.1, y: 0.8 }, shape: 'arc', rotation: Math.PI },
    { msg: '( ͡° ͜ʖ ͡°)', emotion: 'playful', eyeScale: { x: 1.0, y: 0.6 }, shape: 'sphere' },
    { msg: 'Gotcha!', emotion: 'playful', eyeScale: { x: 1.3, y: 1.0 }, shape: 'arc', rotation: Math.PI },
    
    // Sleepy expressions (3)
    { msg: 'zzZ...', emotion: 'sleepy', eyeScale: { x: 1.2, y: 0.2 }, shape: 'crescent' },
    { msg: '(－ω－)', emotion: 'sleepy', eyeScale: { x: 1.0, y: 0.15 }, shape: 'crescent' },
    { msg: '*yawn*', emotion: 'sleepy', eyeScale: { x: 0.9, y: 0.1 }, shape: 'arc', rotation: 0 },
    
    // Cool expressions (3)
    { msg: '( •̀ᴗ•́ )و', emotion: 'cool', eyeScale: { x: 1.1, y: 1.1 }, shape: 'sphere' },
    { msg: 'Nice one', emotion: 'cool', eyeScale: { x: 1.0, y: 0.9 }, shape: 'sphere' },
    { msg: '(‾◡◝)', emotion: 'cool', eyeScale: { x: 1.2, y: 0.8 }, shape: 'arc', rotation: Math.PI },
    
    // Confused expressions (3)
    { msg: '(・・?)', emotion: 'confused', eyeScale: { x: 1.5, y: 1.2 }, shape: 'sphere' },
    { msg: 'Huh...?', emotion: 'confused', eyeScale: { x: 1.4, y: 1.6 }, shape: 'sphere' },
    { msg: '(?_?)', emotion: 'confused', eyeScale: { x: 1.3, y: 1.4 }, shape: 'sphere' },
  ];
  
  // Special click reactions
  const clickReactions: Reaction[] = [
    { msg: 'Ask me anything!', emotion: 'excited', eyeScale: { x: 1.8, y: 1.8 }, shape: 'star' },
    { msg: 'Let\'s chat!', emotion: 'happy', eyeScale: { x: 1.5, y: 1.5 }, shape: 'sphere' },
    { msg: 'I\'m here to help!', emotion: 'happy', eyeScale: { x: 1.4, y: 1.4 }, shape: 'arc', rotation: Math.PI },
  ];
  
  // Idle/long hover reactions
  const sleepyReactions: Reaction[] = [
    { msg: 'zzZ...', emotion: 'sleepy', eyeScale: { x: 1.2, y: 0.2 }, shape: 'crescent' },
    { msg: 'Still here...', emotion: 'sleepy', eyeScale: { x: 1.0, y: 0.15 }, shape: 'crescent' },
    { msg: '*yawn*', emotion: 'sleepy', eyeScale: { x: 0.9, y: 0.1 }, shape: 'arc', rotation: 0 },
  ];
  
  // Apply reaction animation with emotion-based colors
  const applyReaction = useCallback((reaction: Reaction) => {
    if (!sceneRef.current) return;
    
    const { 
      leftEye, rightEye, leftEar, rightEar, particleSphere, sphereGeometry,
      eyeGeo, archedEyeGeo, starEyeGeo, heartEyeGeo, crescentEyeGeo,
      spiralEyeGeo, teardropEyeGeo
    } = sceneRef.current;
    
    // Get emotion config
    const emotionConfig = emotionConfigs[reaction.emotion];
    setCurrentEmotion(reaction.emotion);
    setGlowColor(emotionConfig.glowColor);
    
    // Change eye shape based on reaction
    const getEyeGeometry = () => {
      switch (reaction.shape) {
        case 'arc': return archedEyeGeo;
        case 'star': return starEyeGeo;
        case 'heart': return heartEyeGeo;
        case 'crescent': return crescentEyeGeo;
        case 'spiral': return spiralEyeGeo;
        case 'teardrop': return teardropEyeGeo;
        default: return eyeGeo;
      }
    };
    
    const targetGeo = getEyeGeometry();
    leftEye.geometry = targetGeo;
    rightEye.geometry = targetGeo;
    
    // Set rotation for arc and crescent
    if (reaction.shape === 'arc' || reaction.shape === 'crescent') {
      leftEye.rotation.x = reaction.rotation || 0;
      rightEye.rotation.x = reaction.rotation || 0;
      leftEye.rotation.y = 0;
      rightEye.rotation.y = 0;
    } else if (reaction.shape === 'star' || reaction.shape === 'heart' || reaction.shape === 'teardrop') {
      leftEye.rotation.x = 0;
      rightEye.rotation.x = 0;
      leftEye.rotation.y = 0;
      rightEye.rotation.y = 0;
    } else if (reaction.shape === 'spiral') {
      // Spiral eyes get a slight rotation for effect
      leftEye.rotation.x = 0;
      rightEye.rotation.x = 0;
      leftEye.rotation.z = Math.PI / 6;
      rightEye.rotation.z = -Math.PI / 6;
    } else {
      leftEye.rotation.x = 0;
      rightEye.rotation.x = 0;
    }
    
    // Animate eye scale
    const animateScale = (target: { x: number; y: number }) => {
      const duration = 300;
      const startScale = { x: leftEye.scale.x, y: leftEye.scale.y };
      const startTime = performance.now();
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
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
    
    // Animate ear color based on emotion
    const animateEarColor = (target: { r: number; g: number; b: number }) => {
      const duration = 300;
      const leftMat = leftEar.material as THREE.MeshBasicMaterial;
      const rightMat = rightEar.material as THREE.MeshBasicMaterial;
      const startColor = { r: leftMat.color.r, g: leftMat.color.g, b: leftMat.color.b };
      const startTime = performance.now();
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
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
    
    animateEarColor(emotionConfig.earColor);
    
    // Animate particle colors based on emotion
    const animateParticleColor = (target: { r: number; g: number; b: number }) => {
      const duration = 400;
      const colors = sphereGeometry.attributes.color;
      const startColors: number[] = [];
      for (let i = 0; i < colors.count; i++) {
        startColors.push(colors.getX(i), colors.getY(i), colors.getZ(i));
      }
      const startTime = performance.now();
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        for (let i = 0; i < colors.count; i++) {
          const sr = startColors[i * 3];
          const sg = startColors[i * 3 + 1];
          const sb = startColors[i * 3 + 2];
          colors.setXYZ(
            i,
            sr + (target.r - sr) * eased,
            sg + (target.g - sg) * eased,
            sb + (target.b - sb) * eased
          );
        }
        colors.needsUpdate = true;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    animateParticleColor(emotionConfig.particleColor);
    
    // Apply animation based on emotion type
    const playAnimation = (type: AnimationType) => {
      switch (type) {
        case 'bounce':
          animateBounce();
          break;
        case 'shake':
          animateShake();
          break;
        case 'pulse':
          animatePulse();
          break;
        case 'spin':
          animateSpin();
          break;
        case 'wobble':
          animateWobble();
          break;
        case 'tremble':
          animateTremble();
          break;
        case 'droop':
          animateDroop();
          break;
      }
    };
    
    // Bounce animation
    const animateBounce = () => {
      const bounceDuration = 200;
      const startTime = performance.now();
      const startY = particleSphere.position.y;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const bounceProgress = Math.min(elapsed / bounceDuration, 1);
        const bounceHeight = 2;
        const bounce = Math.sin(bounceProgress * Math.PI) * bounceHeight;
        particleSphere.position.y = startY + bounce;
        
        if (bounceProgress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    // Shake animation (for surprised/confused)
    const animateShake = () => {
      const shakeDuration = 300;
      const startTime = performance.now();
      const startX = particleSphere.position.x;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / shakeDuration, 1);
        const shakeIntensity = 1.5 * (1 - progress);
        const shake = Math.sin(progress * Math.PI * 8) * shakeIntensity;
        particleSphere.position.x = startX + shake;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particleSphere.position.x = startX;
        }
      };
      animate();
    };
    
    // Pulse animation (for shy/love)
    const animatePulse = () => {
      const pulseDuration = 400;
      const startTime = performance.now();
      const startScale = particleSphere.scale.x;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / pulseDuration, 1);
        const pulseScale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
        particleSphere.scale.setScalar(startScale * pulseScale);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particleSphere.scale.setScalar(startScale);
        }
      };
      animate();
    };
    
    // Spin animation (for excited/playful)
    const animateSpin = () => {
      const spinDuration = 400;
      const startTime = performance.now();
      const startRotY = particleSphere.rotation.y;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        particleSphere.rotation.y = startRotY + eased * Math.PI * 2;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    // Wobble animation (for sleepy/curious)
    const animateWobble = () => {
      const wobbleDuration = 600;
      const startTime = performance.now();
      const startRotZ = particleSphere.rotation.z;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / wobbleDuration, 1);
        const wobbleAngle = Math.sin(progress * Math.PI * 3) * 0.15 * (1 - progress);
        particleSphere.rotation.z = startRotZ + wobbleAngle;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particleSphere.rotation.z = startRotZ;
        }
      };
      animate();
    };
    
    // Tremble animation (for annoyed/overwhelmed)
    const animateTremble = () => {
      const trembleDuration = 500;
      const startTime = performance.now();
      const startX = particleSphere.position.x;
      const startY = particleSphere.position.y;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / trembleDuration, 1);
        const intensity = 0.5 * (1 - progress);
        const trembleX = (Math.random() - 0.5) * intensity;
        const trembleY = (Math.random() - 0.5) * intensity;
        particleSphere.position.x = startX + trembleX;
        particleSphere.position.y = startY + trembleY;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particleSphere.position.x = startX;
          particleSphere.position.y = startY;
        }
      };
      animate();
    };
    
    // Droop animation (for sad)
    const animateDroop = () => {
      const droopDuration = 600;
      const startTime = performance.now();
      const startY = particleSphere.position.y;
      const startScale = particleSphere.scale.y;
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / droopDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        
        // Slightly droop down and squish
        const droopAmount = Math.sin(eased * Math.PI) * 1.5;
        const squishAmount = 1 - Math.sin(eased * Math.PI) * 0.05;
        
        particleSphere.position.y = startY - droopAmount;
        particleSphere.scale.y = startScale * squishAmount;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particleSphere.position.y = startY;
          particleSphere.scale.y = startScale;
        }
      };
      animate();
    };
    
    playAnimation(emotionConfig.animationType);
  }, []);
  
  // Reset to default state
  const resetState = useCallback(() => {
    if (!sceneRef.current) return;
    
    const { leftEye, rightEye, leftEar, rightEar, eyeGeo, sphereGeometry } = sceneRef.current;
    
    leftEye.geometry = eyeGeo;
    rightEye.geometry = eyeGeo;
    leftEye.rotation.x = 0;
    rightEye.rotation.x = 0;
    leftEye.rotation.y = 0;
    rightEye.rotation.y = 0;
    leftEye.rotation.z = 0;
    rightEye.rotation.z = 0;
    
    // Reset emotion state
    setCurrentEmotion(null);
    setGlowColor('rgba(255, 255, 255, 0.15)');
    
    const animateReset = () => {
      const duration = 500;
      const startTime = performance.now();
      const startScale = { x: leftEye.scale.x, y: leftEye.scale.y };
      const leftMat = leftEar.material as THREE.MeshBasicMaterial;
      const rightMat = rightEar.material as THREE.MeshBasicMaterial;
      const startColor = { r: leftMat.color.r, g: leftMat.color.g, b: leftMat.color.b };
      
      // Store particle start colors
      const colors = sphereGeometry.attributes.color;
      const startParticleColors: number[] = [];
      for (let i = 0; i < colors.count; i++) {
        startParticleColors.push(colors.getX(i), colors.getY(i), colors.getZ(i));
      }
      
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Reset eye scale
        leftEye.scale.x = startScale.x + (1 - startScale.x) * eased;
        leftEye.scale.y = startScale.y + (1 - startScale.y) * eased;
        rightEye.scale.x = startScale.x + (1 - startScale.x) * eased;
        rightEye.scale.y = startScale.y + (1 - startScale.y) * eased;
        
        // Reset ear color to white
        leftMat.color.r = startColor.r + (1 - startColor.r) * eased;
        leftMat.color.g = startColor.g + (1 - startColor.g) * eased;
        leftMat.color.b = startColor.b + (1 - startColor.b) * eased;
        rightMat.color.r = startColor.r + (1 - startColor.r) * eased;
        rightMat.color.g = startColor.g + (1 - startColor.g) * eased;
        rightMat.color.b = startColor.b + (1 - startColor.b) * eased;
        
        // Reset particle colors to white
        for (let i = 0; i < colors.count; i++) {
          const sr = startParticleColors[i * 3];
          const sg = startParticleColors[i * 3 + 1];
          const sb = startParticleColors[i * 3 + 2];
          colors.setXYZ(
            i,
            sr + (1 - sr) * eased,
            sg + (1 - sg) * eased,
            sb + (1 - sb) * eased
          );
        }
        colors.needsUpdate = true;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    
    animateReset();
  }, []);
  
  // Weighted emotion selection based on mood, level, and time
  const selectWeightedEmotion = useCallback((
    availableEmotions: EmotionCategory[],
    currentMood: number,
    interactionType?: 'positive' | 'negative' | 'neutral'
  ): EmotionCategory => {
    const moodStateValue = getMoodState(currentMood);
    const moodConfig = moodConfigs[moodStateValue];
    const hour = new Date().getHours();
    const timeConfig = getTimePeriod(hour);
    
    // Build weights for each emotion
    const weights: Record<string, number> = {};
    for (const emotion of availableEmotions) {
      let weight = 1;
      
      // Apply mood bias
      if (moodConfig.emotionBias[emotion]) {
        weight *= moodConfig.emotionBias[emotion]!;
      }
      
      // Apply time bias
      if (timeConfig.emotionBias[emotion]) {
        weight *= timeConfig.emotionBias[emotion]!;
      }
      
      // Apply interaction type bias
      if (interactionType === 'negative') {
        const negativeEmotions: EmotionCategory[] = ['confused', 'annoyed', 'sad', 'dizzy', 'overwhelmed'];
        if (negativeEmotions.includes(emotion)) {
          weight *= 2;
        }
      } else if (interactionType === 'positive') {
        const positiveEmotions: EmotionCategory[] = ['happy', 'excited', 'love', 'playful'];
        if (positiveEmotions.includes(emotion)) {
          weight *= 1.5;
        }
      }
      
      weights[emotion] = weight;
    }
    
    // 20% chance for pure random (surprise factor)
    if (Math.random() < 0.2) {
      return availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
    }
    
    // Weighted random selection
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (const emotion of availableEmotions) {
      random -= weights[emotion];
      if (random <= 0) {
        return emotion;
      }
    }
    
    return availableEmotions[0];
  }, []);
  
  // Update mood value
  const updateMood = useCallback((delta: number, showFeedback: boolean = false) => {
    setAffection(prev => {
      const newMood = Math.max(-100, Math.min(100, prev.mood + delta));
      
      if (showFeedback && Math.abs(delta) >= 5) {
        setFloatingText(delta > 0 ? `Mood +${delta}` : `Mood ${delta}`);
        setFloatingTextType('mood');
        setShowFloatingText(true);
        setTimeout(() => setShowFloatingText(false), 800);
      }
      
      return { ...prev, mood: newMood };
    });
  }, []);
  
  // Handle negative behavior
  const handleNegativeBehavior = useCallback((behaviorType: NegativeBehaviorType) => {
    const config = negativeBehaviorConfigs[behaviorType];
    const nbs = negativeBehaviorStateRef.current;
    const now = Date.now();
    
    // Check cooldown
    const lastTriggerKey = `last${behaviorType.charAt(0).toUpperCase() + behaviorType.slice(1)}Time` as keyof NegativeBehaviorState;
    if (typeof nbs[lastTriggerKey] === 'number' && now - (nbs[lastTriggerKey] as number) < config.cooldown) {
      return; // Still in cooldown
    }
    
    // Apply penalties
    updateMood(config.moodPenalty, true);
    
    if (config.affectionPenalty < 0) {
      setAffection(prev => {
        const level = getAffectionLevel(prev.points);
        const newPoints = Math.max(level.minPoints, prev.points + config.affectionPenalty);
        return { ...prev, points: newPoints };
      });
    }
    
    // Show reaction
    const phrase = config.phrases[Math.floor(Math.random() * config.phrases.length)];
    const emotionConfig = emotionConfigs[config.emotion];
    const reaction: Reaction = {
      msg: phrase,
      emotion: config.emotion,
      eyeScale: { x: 1.5, y: 1.5 },
      shape: emotionConfig.eyeShape,
    };
    setGreetingText(reaction.msg);
    setShowGreeting(true);
    applyReaction(reaction);
    
    // Update last trigger time
    if (behaviorType === 'roughMovement') {
      nbs.lastRoughMovementTime = now;
    } else if (behaviorType === 'longIgnore') {
      nbs.lastIgnoreWarningTime = now;
    }
  }, [applyReaction, updateMood]);
  
  // Add affection points with mood and streak system
  const addAffection = useCallback((points: number, gestureType: GestureType) => {
    const config = gestureConfigs[gestureType];
    const randomPhrase = config.phrases[Math.floor(Math.random() * config.phrases.length)];
    
    setAffection(prev => {
      const level = getAffectionLevel(prev.points);
      const streakBonus = getStreakBonus(prev.streakDays);
      
      // Apply streak multiplier
      let adjustedPoints = points;
      if (streakBonus) {
        adjustedPoints = Math.floor(points * streakBonus.affectionMultiplier);
      }
      
      // Check for daily bonus
      const lastBonusDate = new Date(prev.lastDailyBonus).toDateString();
      const today = new Date().toDateString();
      let newStreakDays = prev.streakDays;
      let newLastDailyBonus = prev.lastDailyBonus;
      
      if (lastBonusDate !== today) {
        // First interaction of the day
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastBonusDate === yesterday) {
          newStreakDays = prev.streakDays + 1;
        } else {
          newStreakDays = 1;
        }
        newLastDailyBonus = Date.now();
        
        // Show streak notification
        if (newStreakDays > 1) {
          const currentStreakBonus = getStreakBonus(newStreakDays);
          if (currentStreakBonus && currentStreakBonus.days === newStreakDays) {
            setFloatingText(currentStreakBonus.specialPhrase);
            setFloatingTextType('streak');
            setShowFloatingText(true);
            setTimeout(() => setShowFloatingText(false), 2000);
          }
        }
      }
      
      const newPoints = prev.points + adjustedPoints;
      const newMood = Math.min(100, prev.mood + config.moodReward);
      const newLevel = getAffectionLevel(newPoints);
      const oldLevel = getAffectionLevel(prev.points);
      
      // Check for level up
      if (newLevel.tier > oldLevel.tier) {
        const celebrationPhrase = levelUpPhrases[newLevel.tier as AffectionTier][
          Math.floor(Math.random() * levelUpPhrases[newLevel.tier as AffectionTier].length)
        ];
        setFloatingText(`Level Up! ${newLevel.nameEn}`);
        setFloatingTextType('levelup');
        setShowFloatingText(true);
        
        // Select celebration emotion from newly unlocked pool
        const celebrationEmotion = selectWeightedEmotion(newLevel.baseEmotions, newMood, 'positive');
        const celebrationConfig = emotionConfigs[celebrationEmotion];
        
        const celebrationReaction: Reaction = {
          msg: celebrationPhrase || randomPhrase,
          emotion: celebrationEmotion,
          eyeScale: { x: 2, y: 2 },
          shape: celebrationConfig.eyeShape,
        };
        setGreetingText(celebrationReaction.msg);
        setShowGreeting(true);
        applyReaction(celebrationReaction);
        
        setTimeout(() => setShowFloatingText(false), 2000);
      } else {
        // Normal points gain - use weighted emotion selection
        const availableEmotions = level.unlockedEmotions.filter(e => !emotionConfigs[e].isNegative);
        const selectedEmotion = selectWeightedEmotion(availableEmotions, newMood, 'positive');
        const selectedConfig = emotionConfigs[selectedEmotion];
        
        setFloatingText(`+${adjustedPoints}`);
        setFloatingTextType('points');
        setShowFloatingText(true);
        
        const gestureReaction: Reaction = {
          msg: randomPhrase,
          emotion: selectedEmotion,
          eyeScale: { x: 1.5, y: 1.5 },
          shape: selectedConfig.eyeShape,
        };
        setGreetingText(gestureReaction.msg);
        setShowGreeting(true);
        applyReaction(gestureReaction);
        
        setTimeout(() => setShowFloatingText(false), 1000);
      }
      
      return {
        ...prev,
        points: newPoints,
        tier: newLevel.tier,
        mood: newMood,
        streakDays: newStreakDays,
        lastInteraction: Date.now(),
        lastDailyBonus: newLastDailyBonus,
        totalInteractions: prev.totalInteractions + 1,
      };
    });
  }, [applyReaction, selectWeightedEmotion]);
  
  // Gesture detection handler with negative behavior detection
  const detectGestures = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relX = clientX - centerX;
    const relY = clientY - centerY;
    
    const gs = gestureStateRef.current;
    const now = Date.now();
    
    // Detect rough/fast movement (negative behavior)
    if (lastMousePosRef.current) {
      const dx = clientX - lastMousePosRef.current.x;
      const dy = clientY - lastMousePosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastMouseSpeedRef.current = speed;
      
      // Rough movement detection (speed > 50 pixels)
      if (speed > 50) {
        handleNegativeBehavior('roughMovement');
      }
    }
    
    // 1. Circle detection - track angle changes
    const currentAngle = Math.atan2(relY, relX);
    if (gs.lastAngle !== null) {
      let angleDiff = currentAngle - gs.lastAngle;
      
      // Normalize angle difference to handle wrap-around
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      
      // Determine direction
      if (Math.abs(angleDiff) > 0.01) {
        const newDirection = angleDiff > 0 ? 'cw' : 'ccw';
        
        // Reset if direction changes
        if (gs.circleDirection && gs.circleDirection !== newDirection) {
          gs.circleAngleAccumulator = 0;
        }
        gs.circleDirection = newDirection;
        gs.circleAngleAccumulator += Math.abs(angleDiff);
        
        // Check for 5 complete circles (5 * 2π)
        const circleConfig = gestureConfigs.circle;
        if (gs.circleAngleAccumulator >= circleConfig.requiredCount * 2 * Math.PI) {
          // Track consecutive circles for excessive circle detection
          setAffection(prev => {
            const newCircleCount = prev.circleCount + 1;
            
            // Check for excessive circles (>10 in a session)
            if (newCircleCount > 10) {
              handleNegativeBehavior('excessiveCircle');
              return { ...prev, circleCount: 0 };
            }
            
            return { ...prev, circleCount: newCircleCount };
          });
          
          addAffection(circleConfig.affectionReward, 'circle');
          gs.circleAngleAccumulator = 0;
          gs.circleDirection = null;
        }
      }
    }
    gs.lastAngle = currentAngle;
    
    // 2. Vertical swipe detection (within sprite bounds)
    if (Math.abs(relX) < rect.width / 2 && Math.abs(relY) < rect.height / 2) {
      const currentVerticalSide = relY < 0 ? 'top' : 'bottom';
      if (gs.lastVerticalSide && gs.lastVerticalSide !== currentVerticalSide) {
        gs.verticalCrossCount++;
        
        const vConfig = gestureConfigs.verticalSwipe;
        if (gs.verticalCrossCount >= vConfig.requiredCount * 2) { // * 2 because crossing counts both ways
          addAffection(vConfig.affectionReward, 'verticalSwipe');
          gs.verticalCrossCount = 0;
        }
      }
      gs.lastVerticalSide = currentVerticalSide;
      
      // 3. Horizontal swipe detection
      const currentHorizontalSide = relX < 0 ? 'left' : 'right';
      if (gs.lastHorizontalSide && gs.lastHorizontalSide !== currentHorizontalSide) {
        gs.horizontalCrossCount++;
        
        const hConfig = gestureConfigs.horizontalSwipe;
        if (gs.horizontalCrossCount >= hConfig.requiredCount * 2) {
          addAffection(hConfig.affectionReward, 'horizontalSwipe');
          gs.horizontalCrossCount = 0;
        }
      }
      gs.lastHorizontalSide = currentHorizontalSide;
      
      // 4. Pat detection (slow movement in top area)
      const isInTopArea = relY < -rect.height / 4;
      if (isInTopArea) {
        if (!gs.isInPatZone) {
          gs.isInPatZone = true;
        }
        // Check for slow movement (pat)
        if (lastMousePosRef.current) {
          const dx = clientX - lastMousePosRef.current.x;
          const dy = clientY - lastMousePosRef.current.y;
          const speed = Math.sqrt(dx * dx + dy * dy);
          
          // Slow movement in pat zone
          if (speed < 5 && now - gs.lastPatTime > 300) {
            gs.patCount++;
            gs.lastPatTime = now;
            
            const patConfig = gestureConfigs.pat;
            if (gs.patCount >= patConfig.requiredCount) {
              addAffection(patConfig.affectionReward, 'pat');
              gs.patCount = 0;
            }
          }
        }
      } else {
        gs.isInPatZone = false;
        gs.patCount = 0;
      }
    }
    
    lastMousePosRef.current = { x: clientX, y: clientY };
  }, [addAffection]);
  
  // Reset gesture state when mouse leaves
  const resetGestureState = useCallback(() => {
    gestureStateRef.current = { ...initialGestureState };
    lastMousePosRef.current = null;
  }, []);
  
  // Handle mouse enter - show dynamic mood/level-based reaction
  const handleMouseEnter = useCallback(() => {
    if (showGreeting) return;
    
    // Clear any existing timeouts
    if (longHoverTimeoutRef.current) {
      clearTimeout(longHoverTimeoutRef.current);
    }
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (ignoreCheckIntervalRef.current) {
      clearTimeout(ignoreCheckIntervalRef.current);
    }
    
    // Track hover start time
    hoverStartTimeRef.current = Date.now();
    negativeBehaviorStateRef.current.hoverStartTime = Date.now();
    
    // Show progress bar and mood indicator on hover
    setShowProgressBar(true);
    setShowMoodIndicator(true);
    
    // Get level-appropriate greeting based on time of day
    const currentLevel = affectionLevels[affection.tier];
    const hour = new Date().getHours();
    const timeConfig = getTimePeriod(hour);
    
    // Choose between time-based greeting and level greeting
    const useTimeGreeting = Math.random() < 0.3;
    const greetingPhrase = useTimeGreeting
      ? timeConfig.greetings[Math.floor(Math.random() * timeConfig.greetings.length)]
      : currentLevel.greetingPhrases[Math.floor(Math.random() * currentLevel.greetingPhrases.length)];
    
    // Select emotion using weighted system
    const availableEmotions = currentLevel.unlockedEmotions.filter(e => !emotionConfigs[e].isNegative);
    const selectedEmotion = selectWeightedEmotion(availableEmotions, affection.mood, 'neutral');
    const emotionConfig = emotionConfigs[selectedEmotion];
    
    // Create dynamic reaction
    const levelReaction: Reaction = {
      msg: greetingPhrase,
      emotion: selectedEmotion,
      eyeScale: { x: 1.3 + affection.tier * 0.1, y: 1.3 + affection.tier * 0.1 },
      shape: emotionConfig.eyeShape,
    };
    
    setGreetingText(levelReaction.msg);
    setShowGreeting(true);
    applyReaction(levelReaction);
    
    // Apply emotion-specific glow
    setGlowColor(emotionConfig.glowColor);
    
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
    }
    
    // Set up long hover detection (5 seconds) - mood decreases if just staring
    longHoverTimeoutRef.current = setTimeout(() => {
      // After 5 seconds of hovering without interaction, show bored reaction
      const boredEmotions: EmotionCategory[] = ['sleepy', 'confused', 'curious'];
      const boredEmotion = boredEmotions[Math.floor(Math.random() * boredEmotions.length)];
      const boredConfig = emotionConfigs[boredEmotion];
      const boredPhrases = boredConfig.phrases;
      const boredPhrase = boredPhrases[Math.floor(Math.random() * boredPhrases.length)];
      
      const boredReaction: Reaction = {
        msg: boredPhrase,
        emotion: boredEmotion,
        eyeScale: { x: 1, y: 0.5 },
        shape: boredConfig.eyeShape,
      };
      setGreetingText(boredReaction.msg);
      applyReaction(boredReaction);
      updateMood(-3, false);
    }, 5000);
  }, [showGreeting, applyReaction, affection.tier, affection.mood, selectWeightedEmotion, updateMood]);
  
  // Handle mouse leave - reset after delay, check for sudden leave
  const handleMouseLeave = useCallback(() => {
    // Clear long hover timeout
    if (longHoverTimeoutRef.current) {
      clearTimeout(longHoverTimeoutRef.current);
    }
    if (ignoreCheckIntervalRef.current) {
      clearTimeout(ignoreCheckIntervalRef.current);
    }
    
    // Check for sudden leave (less than 500ms hover)
    const hoverDuration = negativeBehaviorStateRef.current.hoverStartTime 
      ? Date.now() - negativeBehaviorStateRef.current.hoverStartTime 
      : 1000;
    
    if (hoverDuration < 500 && hoverDuration > 100) {
      handleNegativeBehavior('suddenLeave');
    }
    
    hoverStartTimeRef.current = null;
    negativeBehaviorStateRef.current.hoverStartTime = null;
    
    // Reset gesture tracking
    resetGestureState();
    
    // Hide progress bar and mood indicator
    setShowProgressBar(false);
    setShowMoodIndicator(false);
    
    greetingTimeoutRef.current = setTimeout(() => {
      setShowGreeting(false);
      resetState();
      
      // Set up idle check - mood slowly decreases when ignored
      let ignoreCount = 0;
      ignoreCheckIntervalRef.current = setInterval(() => {
        ignoreCount++;
        
        // Every minute, decrease mood slightly
        if (ignoreCount >= 60) { // 60 seconds
          updateMood(-5, false);
          ignoreCount = 0;
          
          // After 5 minutes of ignore, show sad reaction
          handleNegativeBehavior('longIgnore');
        }
      }, 1000);
      
      // Set up idle animation (30 seconds)
      idleTimeoutRef.current = setTimeout(() => {
        // Show level-appropriate idle reaction with weighted emotion
        const currentLevel = affectionLevels[affection.tier];
        const idlePhrase = currentLevel.idlePhrases[
          Math.floor(Math.random() * currentLevel.idlePhrases.length)
        ];
        
        const availableEmotions = currentLevel.unlockedEmotions;
        const selectedEmotion = selectWeightedEmotion(availableEmotions, affection.mood, 'neutral');
        const emotionConfig = emotionConfigs[selectedEmotion];
        
        const idleReaction: Reaction = {
          msg: idlePhrase,
          emotion: selectedEmotion,
          eyeScale: { x: 1.2, y: 1.2 },
          shape: emotionConfig.eyeShape,
        };
        
        setGreetingText(idleReaction.msg);
        setShowGreeting(true);
        applyReaction(idleReaction);
        
        // Auto-hide after 2 seconds
        greetingTimeoutRef.current = setTimeout(() => {
          setShowGreeting(false);
          resetState();
        }, 2000);
      }, 30000);
    }, 500);
  }, [resetState, applyReaction, resetGestureState, affection.tier, affection.mood, handleNegativeBehavior, selectWeightedEmotion, updateMood]);
  
  // Handle click - show special click reaction and open dialog
  const handleClick = useCallback(() => {
    const now = Date.now();
    const nbs = negativeBehaviorStateRef.current;
    
    // Detect spam clicking
    if (now - nbs.lastClickTime < 200) {
      nbs.clickCount++;
      if (nbs.clickCount >= 5) {
        handleNegativeBehavior('spamClick');
        nbs.clickCount = 0;
        return; // Don't process this click
      }
    } else {
      nbs.clickCount = 1;
    }
    nbs.lastClickTime = now;
    
    // Clear timeouts
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
    }
    if (longHoverTimeoutRef.current) {
      clearTimeout(longHoverTimeoutRef.current);
    }
    
    // Add click affection
    addAffection(gestureConfigs.click.affectionReward, 'click');
    
    // Select click reaction using weighted emotion system
    const currentLevel = affectionLevels[affection.tier];
    const availableEmotions = currentLevel.unlockedEmotions.filter(e => !emotionConfigs[e].isNegative);
    const selectedEmotion = selectWeightedEmotion(availableEmotions, affection.mood, 'positive');
    const emotionConfig = emotionConfigs[selectedEmotion];
    
    const clickReaction: Reaction = {
      msg: clickReactions[Math.floor(Math.random() * clickReactions.length)].msg,
      emotion: selectedEmotion,
      eyeScale: { x: 1.5, y: 1.5 },
      shape: emotionConfig.eyeShape,
    };
    
    setGreetingText(clickReaction.msg);
    setShowGreeting(true);
    applyReaction(clickReaction);
    
    // Trigger the click callback
    onSpriteClick?.();
  }, [onSpriteClick, applyReaction, clickReactions, addAffection, handleNegativeBehavior, affection.tier, affection.mood, selectWeightedEmotion]);
  
  // Handle mouse move for gesture detection
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    detectGestures(e.clientX, e.clientY);
  }, [detectGestures]);
  
  // Helper function to get mood color
  const getMoodColor = (mood: number): string => {
    if (mood >= 50) return 'rgba(100, 255, 150, 0.8)'; // Green - happy
    if (mood >= 20) return 'rgba(200, 255, 150, 0.7)'; // Light green - content
    if (mood >= -19) return 'rgba(255, 255, 255, 0.6)'; // White - neutral
    if (mood >= -49) return 'rgba(255, 200, 100, 0.7)'; // Orange - bored
    if (mood >= -79) return 'rgba(255, 150, 100, 0.8)'; // Dark orange - annoyed
    return 'rgba(255, 100, 100, 0.8)'; // Red - upset
  };
  
  // Helper function to get mood emoji
  const getMoodEmoji = (state: MoodState): string => {
    switch (state) {
      case 'ecstatic': return '(ノ´ヮ`)ノ';
      case 'happy': return '(◕‿◕)';
      case 'content': return '(◠‿◠)';
      case 'neutral': return '( ・_・)';
      case 'bored': return '(－_－)';
      case 'annoyed': return '(￣^￣)';
      case 'upset': return '(´;ω;`)';
      default: return '(・・?)';
    }
  };
  
  // Get current level info for display
  const currentLevelInfo = affectionLevels[affection.tier];
  const progressPercent = getLevelProgress(affection.points);
  // Get glow color based on level's primary emotion
  const levelPrimaryEmotion = currentLevelInfo.baseEmotions[0] || 'curious';
  const levelGlowColor = emotionConfigs[levelPrimaryEmotion]?.glowColor || 'rgba(255, 255, 255, 0.4)';
  
  // Sprite content
  const spriteContent = (
    <div 
      ref={containerRef}
      id="sprite-container"
      className={cn("cursor-pointer group", className)}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: 180,
        height: 180,
        zIndex: 10000,
        pointerEvents: 'auto',
        filter: `drop-shadow(0 0 30px ${glowColor})`,
        transition: 'filter 0.3s ease-out',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Ambient glow ring - color changes with emotion */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-60 transition-all duration-500"
        style={{
          background: currentEmotion 
            ? `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
      />
      
      {/* Floating text for affection gain */}
      <div
        className="pointer-events-none"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: showFloatingText 
            ? 'translate(-50%, -20px) scale(1)' 
            : 'translate(-50%, 0) scale(0.5)',
          opacity: showFloatingText ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          zIndex: 10003,
        }}
      >
        <span
          className="font-display font-bold"
          style={{
            fontSize: floatingTextType === 'levelup' ? '1rem' : '1.2rem',
            color: floatingTextType === 'levelup' ? '#FFD700' : '#4ADE80',
            textShadow: floatingTextType === 'levelup' 
              ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)'
              : '0 0 10px rgba(74, 222, 128, 0.8)',
            letterSpacing: '2px',
          }}
        >
          {floatingText}
        </span>
      </div>
      
      {/* Progress bar */}
      <div
        className="pointer-events-none"
        style={{
          position: 'absolute',
          bottom: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '4px',
          background: 'rgba(10, 10, 10, 0.6)',
          borderRadius: '2px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          opacity: showProgressBar ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          zIndex: 10002,
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${levelGlowColor}, ${levelGlowColor.replace('0.', '0.8')})`,
            borderRadius: '2px',
            transition: 'width 0.3s ease-out',
            boxShadow: `0 0 6px ${levelGlowColor}`,
          }}
        />
      </div>
      
      {/* Level and points display (on hover) - simple text below progress bar */}
      <div
        className="pointer-events-none font-display text-[0.45rem] tracking-[1px]"
        style={{
          position: 'absolute',
          bottom: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.4)',
          opacity: showProgressBar ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          zIndex: 10002,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
          Lv.{affection.tier}
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>·</span>
        <span>{affection.points}pts</span>
        <span style={{ color: getMoodColor(affection.mood), fontSize: '0.5rem' }}>
          {getMoodEmoji(moodState)}
        </span>
        {affection.streakDays > 1 && (
          <span style={{ color: 'rgba(255, 200, 100, 0.6)', marginLeft: '2px' }}>
            🔥{affection.streakDays}
          </span>
        )}
      </div>
      
      {/* Greeting bubble - Sci-Fi style */}
      <div
        className="sprite-greeting font-display"
        style={{
          position: 'absolute',
          top: '50%',
          right: '110%',
          transform: showGreeting 
            ? 'translateY(-50%) scale(1) translateX(0)' 
            : 'translateY(-50%) scale(0.8) translateX(20px)',
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '12px 24px',
          borderRadius: '40px',
          color: '#ffffff',
          fontSize: '0.9rem',
          fontWeight: 400,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          opacity: showGreeting ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          zIndex: 10001,
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)',
        }}
      >
        {greetingText}
      </div>
      
      {/* Click hint on hover */}
      <div 
        className="absolute -bottom-38 left-1/2 -translate-x-1/2 font-display text-[0.6rem] tracking-[3px] uppercase text-white/0 group-hover:text-white/40 transition-all duration-300 whitespace-nowrap"
      >
        CLICK TO CHAT
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
