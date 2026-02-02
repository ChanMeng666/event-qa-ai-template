/**
 * Sprite Affection System Configuration
 * 
 * This file defines the gamification system for the sprite mascot,
 * including gesture recognition rewards and affection level tiers.
 */

// Gesture types that can increase affection
export type GestureType = 'circle' | 'verticalSwipe' | 'horizontalSwipe' | 'click' | 'pat';

// Affection level tiers
export type AffectionTier = 0 | 1 | 2 | 3 | 4 | 5;

// Emotion categories (matches sprite-chat.tsx)
export type EmotionCategory = 
  | 'happy'
  | 'excited'
  | 'shy'
  | 'love'
  | 'surprised'
  | 'curious'
  | 'playful'
  | 'sleepy'
  | 'cool'
  | 'confused';

// Gesture configuration
export interface GestureConfig {
  type: GestureType;
  requiredCount: number;      // Number of times to complete gesture
  affectionReward: number;    // Points awarded
  emotion: EmotionCategory;   // Emotion to show when completed
  phrases: string[];          // Phrases to show when completed
}

// Level configuration
export interface AffectionLevelConfig {
  tier: AffectionTier;
  minPoints: number;
  maxPoints: number;
  name: string;
  nameEn: string;
  defaultEmotion: EmotionCategory;
  idlePhrases: string[];
  greetingPhrases: string[];
  earColor: { r: number; g: number; b: number };
  glowColor: string;
  particleColor: { r: number; g: number; b: number };
}

// Gesture configurations
export const gestureConfigs: Record<GestureType, GestureConfig> = {
  circle: {
    type: 'circle',
    requiredCount: 5,           // 5 full circles
    affectionReward: 10,
    emotion: 'excited',
    phrases: [
      'Wheee~!',
      'So dizzy but fun!',
      '(≧▽≦)',
      'Round and round!',
      'You spin me right round~',
    ],
  },
  verticalSwipe: {
    type: 'verticalSwipe',
    requiredCount: 5,           // 5 vertical swipes
    affectionReward: 5,
    emotion: 'playful',
    phrases: [
      'Up and down~',
      'Hehe that tickles!',
      '(〃▽〃)',
      'Weee~',
      'Again again!',
    ],
  },
  horizontalSwipe: {
    type: 'horizontalSwipe',
    requiredCount: 5,           // 5 horizontal swipes
    affectionReward: 5,
    emotion: 'happy',
    phrases: [
      'Side to side~',
      'Left right left!',
      '(◕‿◕)',
      'Swoosh~',
      'Having fun?',
    ],
  },
  click: {
    type: 'click',
    requiredCount: 1,
    affectionReward: 1,
    emotion: 'happy',
    phrases: [
      'Hi there!',
      'You clicked me!',
      '(◠‿◠)',
      'Hello~',
    ],
  },
  pat: {
    type: 'pat',
    requiredCount: 3,           // 3 gentle pats (slow movement on head area)
    affectionReward: 3,
    emotion: 'shy',
    phrases: [
      'Aww~',
      '(>////<)',
      'So gentle...',
      'Pat pat~',
      'Thank you~',
    ],
  },
};

// Affection level configurations
export const affectionLevels: AffectionLevelConfig[] = [
  {
    tier: 0,
    minPoints: 0,
    maxPoints: 9,
    name: '陌生人',
    nameEn: 'Stranger',
    defaultEmotion: 'curious',
    idlePhrases: ['...', '(?_?)', 'Hello?'],
    greetingPhrases: ['Hi.', 'Hello.', '...'],
    earColor: { r: 1, g: 1, b: 1 },
    glowColor: 'rgba(255, 255, 255, 0.15)',
    particleColor: { r: 1, g: 1, b: 1 },
  },
  {
    tier: 1,
    minPoints: 10,
    maxPoints: 29,
    name: '初识',
    nameEn: 'Acquaintance',
    defaultEmotion: 'happy',
    idlePhrases: ['(◕‿◕)', 'Nice day~', 'Hmm~'],
    greetingPhrases: ['Hey there!', 'Nice to see you!', 'Welcome back~'],
    earColor: { r: 1, g: 0.95, b: 0.7 },
    glowColor: 'rgba(255, 240, 180, 0.3)',
    particleColor: { r: 1, g: 0.95, b: 0.85 },
  },
  {
    tier: 2,
    minPoints: 30,
    maxPoints: 59,
    name: '朋友',
    nameEn: 'Friend',
    defaultEmotion: 'happy',
    idlePhrases: ['(◠‿◠)', 'What\'s up?', 'Good vibes~'],
    greetingPhrases: ['Hey friend!', 'Glad you\'re here!', 'Yay you\'re back!'],
    earColor: { r: 1, g: 0.86, b: 0.4 },
    glowColor: 'rgba(255, 220, 100, 0.4)',
    particleColor: { r: 1, g: 0.9, b: 0.6 },
  },
  {
    tier: 3,
    minPoints: 60,
    maxPoints: 99,
    name: '好友',
    nameEn: 'Good Friend',
    defaultEmotion: 'excited',
    idlePhrases: ['(ﾉ´ヮ`)ﾉ', 'Let\'s play!', 'Exciting~'],
    greetingPhrases: ['Missed you!', 'So happy to see you!', 'Best buddy!'],
    earColor: { r: 1, g: 0.6, b: 0.2 },
    glowColor: 'rgba(255, 150, 50, 0.5)',
    particleColor: { r: 1, g: 0.7, b: 0.3 },
  },
  {
    tier: 4,
    minPoints: 100,
    maxPoints: 149,
    name: '挚友',
    nameEn: 'Best Friend',
    defaultEmotion: 'love',
    idlePhrases: ['(♥‿♥)', 'Love you~', 'The best!'],
    greetingPhrases: ['You\'re amazing!', 'My favorite human!', 'So glad you\'re here!'],
    earColor: { r: 1, g: 0.5, b: 0.65 },
    glowColor: 'rgba(255, 130, 165, 0.5)',
    particleColor: { r: 1, g: 0.75, b: 0.85 },
  },
  {
    tier: 5,
    minPoints: 150,
    maxPoints: Infinity,
    name: '灵魂伴侣',
    nameEn: 'Soulmate',
    defaultEmotion: 'love',
    idlePhrases: ['(｡♥‿♥｡)', 'Forever~', '♡♡♡'],
    greetingPhrases: ['Soulmate!', 'Together forever~', 'You complete me!'],
    earColor: { r: 1, g: 0.4, b: 0.6 },
    glowColor: 'rgba(255, 100, 150, 0.6)',
    particleColor: { r: 1, g: 0.6, b: 0.75 },
  },
];

// Level up celebration phrases
export const levelUpPhrases: Record<AffectionTier, string[]> = {
  0: [],
  1: ['We\'re getting to know each other!', 'Nice to meet you~', '(◕‿◕)'],
  2: ['We\'re friends now!', 'Friendship unlocked!', 'Yay~!'],
  3: ['Best friends!', 'Our bond grows stronger!', '(ﾉ´ヮ`)ﾉ*:・゚✧'],
  4: ['You\'re my best friend!', 'I treasure you!', '(♥‿♥)'],
  5: ['SOULMATES!', 'Maximum bond achieved!', '(｡♥‿♥｡) ♡♡♡'],
};

// Helper function to get level from points
export function getAffectionLevel(points: number): AffectionLevelConfig {
  for (let i = affectionLevels.length - 1; i >= 0; i--) {
    if (points >= affectionLevels[i].minPoints) {
      return affectionLevels[i];
    }
  }
  return affectionLevels[0];
}

// Helper function to get progress percentage within current level
export function getLevelProgress(points: number): number {
  const level = getAffectionLevel(points);
  if (level.tier === 5) return 100; // Max level
  const nextLevel = affectionLevels[level.tier + 1];
  const levelRange = nextLevel.minPoints - level.minPoints;
  const pointsInLevel = points - level.minPoints;
  return Math.min(100, (pointsInLevel / levelRange) * 100);
}

// Helper function to get points needed for next level
export function getPointsToNextLevel(points: number): number {
  const level = getAffectionLevel(points);
  if (level.tier === 5) return 0; // Max level
  const nextLevel = affectionLevels[level.tier + 1];
  return nextLevel.minPoints - points;
}

// Storage key for persistence
export const AFFECTION_STORAGE_KEY = 'sprite-affection-points';

// Default affection state
export interface AffectionState {
  points: number;
  tier: AffectionTier;
  lastInteraction: number;
}

export const defaultAffectionState: AffectionState = {
  points: 0,
  tier: 0,
  lastInteraction: Date.now(),
};
