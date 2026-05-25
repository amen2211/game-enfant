/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum WorldId {
  Math = 'math',
  Memory = 'memory',
  Colors = 'colors',
  Words = 'words',
  Mazes = 'mazes',
  Secret = 'secret',
  Logic = 'logic',
  Hidden = 'hidden'
}

export interface World {
  id: WorldId;
  name: string;
  description: string;
  icon: string; // Emoji
  accentColor: string; // Tailwind class
  bannerColor: string;
  minStarsRequired: number;
}

export enum Difficulty {
  Easy = 'سهل',
  Medium = 'متوسط',
  Hard = 'صعب'
}

export interface CharacterSkin {
  id: string;
  name: string;
  avatar: string; // Character visual avatar (Emoji or SVG component name)
  cost: number;
  unlocked: boolean;
}

export interface PetSkin {
  id: string;
  name: string;
  avatar: string; // Pet visual avatar
  cost: number;
  unlocked: boolean;
}

export interface UserProgress {
  selectedAvatar: string;
  playerName: string;
  selectedSkinId: string;
  selectedPetId: string;
  coins: number;
  stars: number;
  claimedDailyRewards: string[]; // Dates claimed
  levelProgress: Record<WorldId, number>; // current level in each world (1-indexed)
  solvedLevelsHistory: Record<string, { starsEarned: number; attempts: number }>; // key: `world_level`
  unlockedSkins: string[];
  unlockedPets: string[];
  hintsLeft: number;
  achievements: string[]; // Badge IDs
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji
  conditionText: string;
}

export interface PuzzleQuestion {
  id: number;
  worldId: WorldId;
  levelNumber: number;
  instruction: string; // Arabic instruction
  data: any; // Dynamic data for the specific puzzle (choices, matrix, maze grid, etc.)
  correctAnswer: any;
  hint: string;
  rewardCoins: number;
  rewardStars: number;
}

export interface ParentSettings {
  musicOn: boolean;
  sfxOn: boolean;
  difficulty: Difficulty;
  restrictPlayTime: boolean; // limit to 30 mins
  playTimeMinutes: number;
}
