/**
 * User entity and statistics type definitions
 * Used in frontend components and state management
 */

export interface User {
  id?: number;
  nickname: string;
  token: string;
  currentChampion?: number;
  timestamp?: string;
  prestige: number;
  score: number;
  country?: string;
  currentItemId?: number;
  currentOldItemId?: number;
  currentSplashSkinId?: number;
  currentAbilityId?: number;
}

export interface UserStats {
  nickname: string;
  prestige: number;
  score: number;
  country?: string;
  timestamp?: string;
  rank?: number;
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  country?: string;
}
