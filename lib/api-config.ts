// API Configuration for msjs-send frontend
// This file contains all API endpoints and configuration

export const API_CONFIG = {
  // Base URLs - Use environment variables in production
  LOGIN_API_URL: process.env.NEXT_PUBLIC_LOGIN_API_URL || 'http://localhost:8190',
  
  // API Endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      verify: '/api/auth/verify',
    },
    users: {
      me: '/api/v1/users/me',
      changePassword: '/api/v1/users/me/change-password',
      list: '/api/v1/users',
      byId: (id: string) => `/api/v1/users/${id}`,
    },
  },
} as const

// Helper function to build full URLs
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.LOGIN_API_URL}${endpoint}`
}

// Token storage keys
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
} as const
