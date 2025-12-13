/**
 * API response type definitions
 * Common response structures used across the application
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  error?: any;
}

export interface ApiSuccessResponse<T = any> {
  status: 'success';
  data?: T;
  [key: string]: any;
}

export interface GameState {
  guessCount?: number;
  solved?: boolean;
  currentId?: number;
}
