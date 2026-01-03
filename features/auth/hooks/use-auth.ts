'use client'

// Auth Hook - Zustand Implementation
// Simplified wrapper for the Zustand store

import { useAuthStore } from '../store/auth-store'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError
  }
}
