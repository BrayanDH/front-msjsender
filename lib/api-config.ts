// API Configuration for msjs-send frontend
// This file contains all API endpoints and configuration

export const API_CONFIG = {
  // Base URLs - Use environment variables in production
  LOGIN_API_URL: process.env.NEXT_PUBLIC_LOGIN_API_URL || 'http://localhost:8190',
  MESSAGES_API_URL: process.env.NEXT_PUBLIC_MESSAGES_API_URL || 'http://localhost:8082',
  CONTACTS_API_URL: process.env.NEXT_PUBLIC_CONTACTS_API_URL || 'http://localhost:8081',
  CHANNELS_API_URL: process.env.NEXT_PUBLIC_CHANNELS_API_URL || 'http://localhost:8095',
  SCHEDULER_API_URL: process.env.NEXT_PUBLIC_SCHEDULER_API_URL || 'http://localhost:8083',
  ANALYTICS_API_URL: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:8084',
  
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
    messages: {
      send: '/api/v1/messages/send',
      schedule: '/api/v1/messages/schedule',
      history: '/api/v1/messages/history',
      byId: (id: string) => `/api/v1/messages/${id}`,
      cancel: (id: string) => `/api/v1/messages/${id}/cancel`,
      retry: (id: string) => `/api/v1/messages/${id}/retry`,
    },
    batches: {
      byId: (id: string) => `/api/v1/batches/${id}`,
    },
  },
} as const

// Helper function to build full URLs
export function buildApiUrl(endpoint: string, apiType: 'login' | 'messages' | 'contacts' | 'channels' | 'scheduler' | 'analytics' = 'login'): string {
  const baseUrlMap = {
    login: API_CONFIG.LOGIN_API_URL,
    messages: API_CONFIG.MESSAGES_API_URL,
    contacts: API_CONFIG.CONTACTS_API_URL,
    channels: API_CONFIG.CHANNELS_API_URL,
    scheduler: API_CONFIG.SCHEDULER_API_URL,
    analytics: API_CONFIG.ANALYTICS_API_URL,
  }
  return `${baseUrlMap[apiType]}${endpoint}`
}

// Token storage keys
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
} as const
