/**
 * User entity type definitions
 * Based on Prisma schema and database structure
 */

export interface User {
  id: number;
  nickname: string;
  token: string;
  currentChampion: number;
  timestamp: string;
  prestige: number;
  score: number;
  country?: string;
  currentItemId?: number;
  currentOldItemId?: number;
  currentSplashSkinId?: number;
  currentAbilityId?: number;
}

export interface UserUpdate {
  token: string;
  currentChampion: number;
  prestige: number;
  score: number;
}

export interface UserItemUpdate {
  token: string;
  currentItemId: number;
  solvedItemIds: string;
  prestige: number;
  score: number;
}

export interface UserOldItemUpdate {
  token: string;
  currentOldItemId: number;
  solvedOldItemIds: string;
  prestige: number;
  score: number;
}

export interface UserNicknameUpdate {
  token: string;
  nickname: string;
}

export interface UserCountryUpdate {
  token: string;
  country: string;
}
