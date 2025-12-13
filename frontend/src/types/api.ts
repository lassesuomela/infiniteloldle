/**
 * API response type definitions
 * Common response structures from backend API
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  [key: string]: any;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  error?: any;
}

export interface ChampionsResponse {
  status: 'success';
  champions: any[];
}

export interface ItemsResponse {
  status: 'success';
  items: any[];
}

export interface UserResponse {
  status: 'success';
  token: string;
  user?: any;
}
