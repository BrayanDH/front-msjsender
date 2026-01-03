'use client'

// Auth Hook - Zustand Implementation
// Simplified wrapper for the Zustand store

import { useEffect } from 'react'
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
    initializeAuth
  } = useAuthStore()

  // Initialize auth on mount (only runs once globally due to flag in store)
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

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
