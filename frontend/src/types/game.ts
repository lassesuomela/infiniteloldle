/**
 * Game state type definitions
 * Used in Redux store and game components
 */

export type GameMode = 'champion' | 'splash' | 'item' | 'oldItem' | 'ability';

export interface GameState {
  guessCount: number;
  solved: boolean;
  guesses: any[];
  currentId?: number;
  victory?: boolean;
}

export interface GuessResult {
  correct: boolean;
  data?: any;
  matchResult?: any;
}

export interface GameSettings {
  showHints: boolean;
  soundEnabled: boolean;
  [key: string]: any;
}
