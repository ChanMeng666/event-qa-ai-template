/**
 * Sprite Affection & Mood System Configuration
 * 
 * This file defines the gamification system for the sprite mascot,
 * including gesture recognition, affection levels, mood system,
 * emotion unlocking, and dynamic emotion selection.
 */

// ============================================================================
// Type Definitions
// ============================================================================

// Gesture types that can affect affection/mood
export type GestureType = 'circle' | 'verticalSwipe' | 'horizontalSwipe' | 'click' | 'pat';

// Negative behavior types
export type NegativeBehaviorType = 'roughMovement' | 'spamClick' | 'suddenLeave' | 'longIgnore' | 'excessiveCircle';

// Affection level tiers
export type AffectionTier = 0 | 1 | 2 | 3 | 4 | 5;

// Mood states
export type MoodState = 'ecstatic' | 'happy' | 'content' | 'neutral' | 'bored' | 'annoyed' | 'upset';

// All emotion categories (extended with negative and rare emotions)
export type EmotionCategory = 
  // Positive emotions
  | 'happy'
  | 'excited'
  | 'shy'
  | 'love'
  | 'surprised'
  | 'curious'
  | 'playful'
  | 'sleepy'
  | 'cool'
  // Negative emotions
  | 'confused'
  | 'annoyed'
  | 'sad'
  | 'dizzy'
  | 'overwhelmed'
  // Rare emotions
  | 'mischievous'
  | 'devoted'
  | 'starry';

// Time periods
export type TimePeriod = 'lateNight' | 'earlyMorning' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';

// ============================================================================
// Gesture Configuration
// ============================================================================

export interface GestureConfig {
  type: GestureType;
  requiredCount: number;
  affectionReward: number;
  moodReward: number;
  emotion: EmotionCategory;
  phrases: string[];
}

export const gestureConfigs: Record<GestureType, GestureConfig> = {
  circle: {
    type: 'circle',
    requiredCount: 5,
    affectionReward: 10,
    moodReward: 20,
    emotion: 'excited',
    phrases: ['Wheee~!', 'So dizzy but fun!', '(≧▽≦)', 'Round and round!', 'You spin me right round~'],
  },
  verticalSwipe: {
    type: 'verticalSwipe',
    requiredCount: 5,
    affectionReward: 5,
    moodReward: 15,
    emotion: 'playful',
    phrases: ['Up and down~', 'Hehe that tickles!', '(〃▽〃)', 'Weee~', 'Again again!'],
  },
  horizontalSwipe: {
    type: 'horizontalSwipe',
    requiredCount: 5,
    affectionReward: 5,
    moodReward: 15,
    emotion: 'happy',
    phrases: ['Side to side~', 'Left right left!', '(◕‿◕)', 'Swoosh~', 'Having fun?'],
  },
  click: {
    type: 'click',
    requiredCount: 1,
    affectionReward: 1,
    moodReward: 5,
    emotion: 'happy',
    phrases: ['Hi there!', 'You clicked me!', '(◠‿◠)', 'Hello~'],
  },
  pat: {
    type: 'pat',
    requiredCount: 3,
    affectionReward: 3,
    moodReward: 10,
    emotion: 'shy',
    phrases: ['Aww~', '(>////<)', 'So gentle...', 'Pat pat~', 'Thank you~'],
  },
};

// ============================================================================
// Negative Behavior Configuration
// ============================================================================

export interface NegativeBehaviorConfig {
  type: NegativeBehaviorType;
  moodPenalty: number;
  affectionPenalty: number;
  emotion: EmotionCategory;
  phrases: string[];
  cooldown: number; // ms before can trigger again
}

export const negativeBehaviorConfigs: Record<NegativeBehaviorType, NegativeBehaviorConfig> = {
  roughMovement: {
    type: 'roughMovement',
    moodPenalty: -10,
    affectionPenalty: 0,
    emotion: 'surprised',
    phrases: ['Whoa!', 'Too fast!', '(°△°)', 'Slow down!', 'Eek!'],
    cooldown: 2000,
  },
  spamClick: {
    type: 'spamClick',
    moodPenalty: -15,
    affectionPenalty: -1,
    emotion: 'overwhelmed',
    phrases: ['Too much!', '(>_<)', 'Stop stop!', 'Overwhelmed...', 'Aaah!'],
    cooldown: 3000,
  },
  suddenLeave: {
    type: 'suddenLeave',
    moodPenalty: -5,
    affectionPenalty: 0,
    emotion: 'sad',
    phrases: ['Wait...', "(´;ω;`)", 'Come back...', 'Aww...'],
    cooldown: 5000,
  },
  longIgnore: {
    type: 'longIgnore',
    moodPenalty: -5, // per minute
    affectionPenalty: 0,
    emotion: 'sad',
    phrases: ['Hello...?', 'Still there?', '(._.)','Anyone...?', 'So lonely...'],
    cooldown: 60000,
  },
  excessiveCircle: {
    type: 'excessiveCircle',
    moodPenalty: -20,
    affectionPenalty: -2,
    emotion: 'dizzy',
    phrases: ['Dizzy...', '@_@', 'Stop spinning!', 'The world is turning...', 'Ugh...'],
    cooldown: 5000,
  },
};

// ============================================================================
// Mood Configuration
// ============================================================================

export interface MoodConfig {
  state: MoodState;
  minValue: number;
  maxValue: number;
  emotionBias: Partial<Record<EmotionCategory, number>>; // Multiplier for emotion weights
  phrases: string[];
}

export const moodConfigs: Record<MoodState, MoodConfig> = {
  ecstatic: {
    state: 'ecstatic',
    minValue: 80,
    maxValue: 100,
    emotionBias: { love: 3, excited: 2.5, happy: 2, mischievous: 2 },
    phrases: ['Best day ever!', 'So happy!', '(ノ´ヮ`)ノ*: ・゚✧', 'Yay yay yay!'],
  },
  happy: {
    state: 'happy',
    minValue: 50,
    maxValue: 79,
    emotionBias: { happy: 2, excited: 1.5, playful: 1.5, love: 1.3 },
    phrases: ['Feeling good~', 'Nice!', '(◕‿◕)', 'Great vibes!'],
  },
  content: {
    state: 'content',
    minValue: 20,
    maxValue: 49,
    emotionBias: { happy: 1.3, curious: 1.2, cool: 1.2 },
    phrases: ['All is well~', 'Hmm~', 'Peaceful...'],
  },
  neutral: {
    state: 'neutral',
    minValue: -19,
    maxValue: 19,
    emotionBias: { curious: 1.2, confused: 1.1 },
    phrases: ['...', 'Hmm?', '( ・_・)'],
  },
  bored: {
    state: 'bored',
    minValue: -49,
    maxValue: -20,
    emotionBias: { sleepy: 2, confused: 1.5, sad: 1.3 },
    phrases: ['Boring...', '*yawn*', 'Nothing to do...', 'Zzz...'],
  },
  annoyed: {
    state: 'annoyed',
    minValue: -79,
    maxValue: -50,
    emotionBias: { annoyed: 2.5, confused: 1.5, overwhelmed: 1.3 },
    phrases: ['Hmph!', '(￣^￣)', 'Stop it...', 'Not funny...'],
  },
  upset: {
    state: 'upset',
    minValue: -100,
    maxValue: -80,
    emotionBias: { sad: 3, annoyed: 2, overwhelmed: 1.5 },
    phrases: ["(´;ω;`)", 'Why...', 'So mean...', '*sniff*'],
  },
};

// ============================================================================
// Emotion Configuration (Extended)
// ============================================================================

export interface EmotionConfig {
  category: EmotionCategory;
  isNegative: boolean;
  isRare: boolean;
  unlockTier: AffectionTier;
  earColor: { r: number; g: number; b: number };
  glowColor: string;
  particleColor: { r: number; g: number; b: number };
  animationType: 'bounce' | 'shake' | 'pulse' | 'spin' | 'wobble' | 'tremble' | 'droop';
  eyeShape: 'sphere' | 'arc' | 'star' | 'heart' | 'crescent' | 'spiral' | 'teardrop';
  phrases: string[];
}

export const emotionConfigs: Record<EmotionCategory, EmotionConfig> = {
  // Positive emotions
  happy: {
    category: 'happy',
    isNegative: false,
    isRare: false,
    unlockTier: 1,
    earColor: { r: 1, g: 0.86, b: 0.4 },
    glowColor: 'rgba(255, 220, 100, 0.4)',
    particleColor: { r: 1, g: 0.9, b: 0.6 },
    animationType: 'bounce',
    eyeShape: 'arc',
    phrases: ['(◕‿◕)', 'Yay~!', 'Nice!', 'Happy!', '(◠‿◠)'],
  },
  excited: {
    category: 'excited',
    isNegative: false,
    isRare: false,
    unlockTier: 3,
    earColor: { r: 1, g: 0.6, b: 0.2 },
    glowColor: 'rgba(255, 150, 50, 0.5)',
    particleColor: { r: 1, g: 0.7, b: 0.3 },
    animationType: 'spin',
    eyeShape: 'star',
    phrases: ['✨ WOW! ✨', 'AMAZING!', '(ﾉ´ヮ`)ﾉ*:・゚✧', 'So exciting!'],
  },
  shy: {
    category: 'shy',
    isNegative: false,
    isRare: false,
    unlockTier: 3,
    earColor: { r: 1, g: 0.5, b: 0.63 },
    glowColor: 'rgba(255, 130, 160, 0.4)',
    particleColor: { r: 1, g: 0.8, b: 0.85 },
    animationType: 'pulse',
    eyeShape: 'sphere',
    phrases: ['(>////<)', 'H-hi...', '(/▽＼)', '(〃▽〃)'],
  },
  love: {
    category: 'love',
    isNegative: false,
    isRare: false,
    unlockTier: 4,
    earColor: { r: 1, g: 0.4, b: 0.6 },
    glowColor: 'rgba(255, 100, 150, 0.5)',
    particleColor: { r: 1, g: 0.6, b: 0.75 },
    animationType: 'pulse',
    eyeShape: 'heart',
    phrases: ['(♥‿♥)', 'Love you~', '(｡♥‿♥｡)', 'So cute~'],
  },
  surprised: {
    category: 'surprised',
    isNegative: false,
    isRare: false,
    unlockTier: 1,
    earColor: { r: 1, g: 1, b: 1 },
    glowColor: 'rgba(255, 255, 255, 0.6)',
    particleColor: { r: 1, g: 1, b: 1 },
    animationType: 'shake',
    eyeShape: 'sphere',
    phrases: ['Whoa!', '(°o°)', 'EH?!', '😳'],
  },
  curious: {
    category: 'curious',
    isNegative: false,
    isRare: false,
    unlockTier: 0,
    earColor: { r: 0.4, g: 0.78, b: 1 },
    glowColor: 'rgba(100, 200, 255, 0.4)',
    particleColor: { r: 0.7, g: 0.9, b: 1 },
    animationType: 'wobble',
    eyeShape: 'sphere',
    phrases: ['Hmm...?', '(・・?)', 'Tell me more', '👀'],
  },
  playful: {
    category: 'playful',
    isNegative: false,
    isRare: false,
    unlockTier: 2,
    earColor: { r: 0.9, g: 0.5, b: 1 },
    glowColor: 'rgba(230, 130, 255, 0.5)',
    particleColor: { r: 0.85, g: 0.7, b: 1 },
    animationType: 'spin',
    eyeShape: 'arc',
    phrases: ['(〃∀〃)', 'Hehe~', 'Gotcha!', '( ͡° ͜ʖ ͡°)'],
  },
  sleepy: {
    category: 'sleepy',
    isNegative: false,
    isRare: false,
    unlockTier: 0,
    earColor: { r: 0.6, g: 0.7, b: 0.86 },
    glowColor: 'rgba(150, 180, 220, 0.3)',
    particleColor: { r: 0.75, g: 0.8, b: 0.9 },
    animationType: 'wobble',
    eyeShape: 'crescent',
    phrases: ['zzZ...', '(－ω－)', '*yawn*', 'Sleepy...'],
  },
  cool: {
    category: 'cool',
    isNegative: false,
    isRare: false,
    unlockTier: 2,
    earColor: { r: 0.78, g: 0.9, b: 1 },
    glowColor: 'rgba(200, 230, 255, 0.4)',
    particleColor: { r: 0.85, g: 0.95, b: 1 },
    animationType: 'bounce',
    eyeShape: 'sphere',
    phrases: ['( •̀ᴗ•́ )و', 'Nice one', '(‾◡◝)', 'Cool~'],
  },
  // Negative emotions
  confused: {
    category: 'confused',
    isNegative: true,
    isRare: false,
    unlockTier: 0,
    earColor: { r: 0.7, g: 0.5, b: 0.86 },
    glowColor: 'rgba(180, 130, 220, 0.4)',
    particleColor: { r: 0.8, g: 0.7, b: 0.9 },
    animationType: 'shake',
    eyeShape: 'sphere',
    phrases: ['(・・?)', 'Huh...?', '(?_?)', 'What?'],
  },
  annoyed: {
    category: 'annoyed',
    isNegative: true,
    isRare: false,
    unlockTier: 0,
    earColor: { r: 1, g: 0.5, b: 0.3 },
    glowColor: 'rgba(255, 130, 80, 0.5)',
    particleColor: { r: 1, g: 0.6, b: 0.4 },
    animationType: 'tremble',
    eyeShape: 'sphere',
    phrases: ['Hmph!', '(￣^￣)', 'Stop it...', 'Not funny...', '(-_-)'],
  },
  sad: {
    category: 'sad',
    isNegative: true,
    isRare: false,
    unlockTier: 0,
    earColor: { r: 0.5, g: 0.6, b: 0.8 },
    glowColor: 'rgba(130, 150, 200, 0.4)',
    particleColor: { r: 0.6, g: 0.7, b: 0.85 },
    animationType: 'droop',
    eyeShape: 'teardrop',
    phrases: ["(´;ω;`)", 'Why...', 'So sad...', '*sniff*', '(T_T)'],
  },
  dizzy: {
    category: 'dizzy',
    isNegative: true,
    isRare: false,
    unlockTier: 0,
    earColor: { r: 0.8, g: 0.8, b: 0.5 },
    glowColor: 'rgba(200, 200, 130, 0.4)',
    particleColor: { r: 0.85, g: 0.85, b: 0.6 },
    animationType: 'spin',
    eyeShape: 'spiral',
    phrases: ['@_@', 'Dizzy...', 'The world is spinning...', 'Ugh...'],
  },
  overwhelmed: {
    category: 'overwhelmed',
    isNegative: true,
    isRare: false,
    unlockTier: 0,
    earColor: { r: 1, g: 0.8, b: 0.8 },
    glowColor: 'rgba(255, 200, 200, 0.5)',
    particleColor: { r: 1, g: 0.85, b: 0.85 },
    animationType: 'tremble',
    eyeShape: 'sphere',
    phrases: ['(>_<)', 'Too much!', 'Overwhelmed...', 'Aaah!'],
  },
  // Rare emotions
  mischievous: {
    category: 'mischievous',
    isNegative: false,
    isRare: true,
    unlockTier: 4,
    earColor: { r: 1, g: 0.7, b: 0.9 },
    glowColor: 'rgba(255, 180, 230, 0.5)',
    particleColor: { r: 1, g: 0.8, b: 0.95 },
    animationType: 'spin',
    eyeShape: 'arc',
    phrases: ['Hehehe~', '( ͡° ͜ʖ ͡°)', 'Up to something~', 'Secret~'],
  },
  devoted: {
    category: 'devoted',
    isNegative: false,
    isRare: true,
    unlockTier: 5,
    earColor: { r: 1, g: 0.85, b: 0.95 },
    glowColor: 'rgba(255, 220, 240, 0.6)',
    particleColor: { r: 1, g: 0.9, b: 0.95 },
    animationType: 'pulse',
    eyeShape: 'heart',
    phrases: ['Forever yours~', 'Always together', '♡♡♡', 'My everything~'],
  },
  starry: {
    category: 'starry',
    isNegative: false,
    isRare: true,
    unlockTier: 5,
    earColor: { r: 0.9, g: 0.9, b: 1 },
    glowColor: 'rgba(230, 230, 255, 0.6)',
    particleColor: { r: 0.95, g: 0.95, b: 1 },
    animationType: 'pulse',
    eyeShape: 'star',
    phrases: ['✨✨✨', 'Starlight~', 'Magical!', 'Sparkle sparkle~'],
  },
};

// ============================================================================
// Affection Level Configuration
// ============================================================================

export interface AffectionLevelConfig {
  tier: AffectionTier;
  minPoints: number;
  maxPoints: number;
  name: string;
  nameEn: string;
  unlockedEmotions: EmotionCategory[];
  baseEmotions: EmotionCategory[]; // Default pool for this level
  greetingPhrases: string[];
  idlePhrases: string[];
  returnPhrases: string[]; // When user returns after absence
  decayRate: number; // Points lost per day of absence
}

export const affectionLevels: AffectionLevelConfig[] = [
  {
    tier: 0,
    minPoints: 0,
    maxPoints: 9,
    name: '陌生人',
    nameEn: 'Stranger',
    unlockedEmotions: ['curious', 'confused', 'sleepy', 'surprised'],
    baseEmotions: ['curious', 'confused'],
    greetingPhrases: ['Hi.', 'Hello.', '...', 'Hmm?'],
    idlePhrases: ['...', '(?_?)', 'Hello?'],
    returnPhrases: ['You again?', '...', 'Hi.'],
    decayRate: 0,
  },
  {
    tier: 1,
    minPoints: 10,
    maxPoints: 29,
    name: '初识',
    nameEn: 'Acquaintance',
    unlockedEmotions: ['curious', 'confused', 'sleepy', 'surprised', 'happy'],
    baseEmotions: ['curious', 'happy', 'surprised'],
    greetingPhrases: ['Hey there!', 'Nice to see you!', 'Welcome~', 'Hi hi!'],
    idlePhrases: ['(◕‿◕)', 'Nice day~', 'Hmm~'],
    returnPhrases: ['Welcome back!', 'Oh, hi!', 'You came back~'],
    decayRate: 1,
  },
  {
    tier: 2,
    minPoints: 30,
    maxPoints: 59,
    name: '朋友',
    nameEn: 'Friend',
    unlockedEmotions: ['curious', 'confused', 'sleepy', 'surprised', 'happy', 'playful', 'cool'],
    baseEmotions: ['happy', 'playful', 'curious'],
    greetingPhrases: ['Hey friend!', 'Glad you\'re here!', 'Yay you\'re back!', 'Friend!'],
    idlePhrases: ['(◠‿◠)', 'What\'s up?', 'Good vibes~'],
    returnPhrases: ['Missed you!', 'There you are!', 'Friend!'],
    decayRate: 2,
  },
  {
    tier: 3,
    minPoints: 60,
    maxPoints: 99,
    name: '好友',
    nameEn: 'Good Friend',
    unlockedEmotions: ['curious', 'confused', 'sleepy', 'surprised', 'happy', 'playful', 'cool', 'excited', 'shy'],
    baseEmotions: ['happy', 'excited', 'playful', 'shy'],
    greetingPhrases: ['Best buddy!', 'So happy to see you!', 'Yay~!', 'My friend!'],
    idlePhrases: ['(ﾉ´ヮ`)ﾉ', 'Let\'s play!', 'Exciting~'],
    returnPhrases: ['I missed you so much!', 'Finally!', 'Where were you?!'],
    decayRate: 3,
  },
  {
    tier: 4,
    minPoints: 100,
    maxPoints: 149,
    name: '挚友',
    nameEn: 'Best Friend',
    unlockedEmotions: ['curious', 'confused', 'sleepy', 'surprised', 'happy', 'playful', 'cool', 'excited', 'shy', 'love', 'mischievous'],
    baseEmotions: ['happy', 'excited', 'love', 'playful', 'mischievous'],
    greetingPhrases: ['You\'re amazing!', 'My favorite human!', 'So glad you\'re here!', '♡'],
    idlePhrases: ['(♥‿♥)', 'Love you~', 'The best!'],
    returnPhrases: ['I waited for you!', 'Never leave again!', 'My heart~'],
    decayRate: 4,
  },
  {
    tier: 5,
    minPoints: 150,
    maxPoints: Infinity,
    name: '灵魂伴侣',
    nameEn: 'Soulmate',
    unlockedEmotions: ['curious', 'confused', 'sleepy', 'surprised', 'happy', 'playful', 'cool', 'excited', 'shy', 'love', 'mischievous', 'devoted', 'starry'],
    baseEmotions: ['love', 'excited', 'happy', 'devoted', 'starry', 'mischievous'],
    greetingPhrases: ['Soulmate!', 'Together forever~', 'You complete me!', '♡♡♡'],
    idlePhrases: ['(｡♥‿♥｡)', 'Forever~', '♡♡♡'],
    returnPhrases: ['My soulmate!', 'I knew you\'d come back!', 'We\'re meant to be~'],
    decayRate: 5,
  },
];

// ============================================================================
// Time Period Configuration
// ============================================================================

export interface TimePeriodConfig {
  period: TimePeriod;
  startHour: number;
  endHour: number;
  emotionBias: Partial<Record<EmotionCategory, number>>;
  greetings: string[];
}

export const timePeriodConfigs: TimePeriodConfig[] = [
  {
    period: 'lateNight',
    startHour: 0,
    endHour: 6,
    emotionBias: { sleepy: 3, confused: 1.5 },
    greetings: ['Still awake...?', 'zzZ...', 'Night owl?', '*yawn*'],
  },
  {
    period: 'earlyMorning',
    startHour: 6,
    endHour: 9,
    emotionBias: { happy: 1.5, excited: 1.3, sleepy: 1.2 },
    greetings: ['Good morning!', 'New day~', 'Rise and shine!', 'Morning~'],
  },
  {
    period: 'morning',
    startHour: 9,
    endHour: 12,
    emotionBias: { curious: 1.3, playful: 1.2 },
    greetings: ['Hello!', 'Nice morning!', 'What\'s up?'],
  },
  {
    period: 'noon',
    startHour: 12,
    endHour: 14,
    emotionBias: { sleepy: 1.5, happy: 1.2 },
    greetings: ['Lunch time~', 'Hungry?', 'Afternoon!'],
  },
  {
    period: 'afternoon',
    startHour: 14,
    endHour: 18,
    emotionBias: { happy: 1.3, excited: 1.2, playful: 1.2 },
    greetings: ['Hey!', 'Good afternoon!', 'Nice day!'],
  },
  {
    period: 'evening',
    startHour: 18,
    endHour: 21,
    emotionBias: { love: 1.3, shy: 1.2, happy: 1.1 },
    greetings: ['Evening~', 'Good evening!', 'Nice night~'],
  },
  {
    period: 'night',
    startHour: 21,
    endHour: 24,
    emotionBias: { sleepy: 2, love: 1.2 },
    greetings: ['Getting sleepy...', 'Night night?', 'Sweet dreams soon~'],
  },
];

// ============================================================================
// Streak Bonus Configuration
// ============================================================================

export interface StreakBonusConfig {
  days: number;
  affectionMultiplier: number;
  moodBonus: number;
  specialPhrase: string;
  unlockEmotion?: EmotionCategory;
}

export const streakBonuses: StreakBonusConfig[] = [
  { days: 1, affectionMultiplier: 1.1, moodBonus: 5, specialPhrase: 'Day 1!' },
  { days: 3, affectionMultiplier: 1.25, moodBonus: 10, specialPhrase: '3 days in a row!' },
  { days: 7, affectionMultiplier: 1.5, moodBonus: 20, specialPhrase: 'A whole week!' },
  { days: 14, affectionMultiplier: 1.75, moodBonus: 25, specialPhrase: 'Two weeks!' },
  { days: 30, affectionMultiplier: 2.0, moodBonus: 30, specialPhrase: 'One month!', unlockEmotion: 'devoted' },
];

// ============================================================================
// Level Up Celebration
// ============================================================================

export const levelUpPhrases: Record<AffectionTier, string[]> = {
  0: [],
  1: ['We\'re getting to know each other!', 'Nice to meet you~', '(◕‿◕)'],
  2: ['We\'re friends now!', 'Friendship unlocked!', 'Yay~!'],
  3: ['Best friends!', 'Our bond grows stronger!', '(ﾉ´ヮ`)ﾉ*:・゚✧'],
  4: ['You\'re my best friend!', 'I treasure you!', '(♥‿♥)'],
  5: ['SOULMATES!', 'Maximum bond achieved!', '(｡♥‿♥｡) ♡♡♡'],
};

// ============================================================================
// Helper Functions
// ============================================================================

export function getMoodState(moodValue: number): MoodState {
  if (moodValue >= 80) return 'ecstatic';
  if (moodValue >= 50) return 'happy';
  if (moodValue >= 20) return 'content';
  if (moodValue >= -19) return 'neutral';
  if (moodValue >= -49) return 'bored';
  if (moodValue >= -79) return 'annoyed';
  return 'upset';
}

export function getAffectionLevel(points: number): AffectionLevelConfig {
  for (let i = affectionLevels.length - 1; i >= 0; i--) {
    if (points >= affectionLevels[i].minPoints) {
      return affectionLevels[i];
    }
  }
  return affectionLevels[0];
}

export function getLevelProgress(points: number): number {
  const level = getAffectionLevel(points);
  if (level.tier === 5) return 100;
  const nextLevel = affectionLevels[level.tier + 1];
  const levelRange = nextLevel.minPoints - level.minPoints;
  const pointsInLevel = points - level.minPoints;
  return Math.min(100, (pointsInLevel / levelRange) * 100);
}

export function getTimePeriod(hour: number): TimePeriodConfig {
  for (const config of timePeriodConfigs) {
    if (config.startHour <= hour && hour < config.endHour) {
      return config;
    }
  }
  return timePeriodConfigs[0]; // Default to late night
}

export function getStreakBonus(days: number): StreakBonusConfig | null {
  for (let i = streakBonuses.length - 1; i >= 0; i--) {
    if (days >= streakBonuses[i].days) {
      return streakBonuses[i];
    }
  }
  return null;
}

export function calculateDaysSinceLastInteraction(lastInteraction: number): number {
  const now = Date.now();
  const diffMs = now - lastInteraction;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ============================================================================
// Storage Keys
// ============================================================================

export const AFFECTION_STORAGE_KEY = 'sprite-affection-data';

// ============================================================================
// State Interfaces
// ============================================================================

export interface AffectionState {
  points: number;
  tier: AffectionTier;
  mood: number; // -100 to 100
  streakDays: number;
  lastInteraction: number;
  lastDailyBonus: number; // Timestamp of last daily bonus
  totalInteractions: number;
  circleCount: number; // Track excessive circles
}

export const defaultAffectionState: AffectionState = {
  points: 0,
  tier: 0,
  mood: 0,
  streakDays: 0,
  lastInteraction: Date.now(),
  lastDailyBonus: 0,
  totalInteractions: 0,
  circleCount: 0,
};
