"use client"

import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import { useAuth } from '../hooks/use-auth'
import type {
  AuthContextType,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/lib/types/auth.types'

const AuthContext = createContext<AuthContextType | null>(null)

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, isHydrated, error, login: storeLogin, logout: storeLogout, clearError } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Route protection effect - wait until hydration is complete
  useEffect(() => {
    // Don't do anything until Zustand has finished loading from localStorage
    if (!isHydrated) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if (!isAuthenticated && !isPublicRoute) {
      // Store the attempted path for redirect after login
      sessionStorage.setItem('redirect_after_login', pathname)
      // Redirect to login if trying to access protected route
      router.push('/login')
    } else if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      // Check for redirect
      const storedRedirect = sessionStorage.getItem('redirect_after_login')
      if (storedRedirect) {
        sessionStorage.removeItem('redirect_after_login')
        router.push(storedRedirect)
      } else {
        // Redirect to dashboard if already authenticated
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isHydrated, pathname, router])

  const login = useCallback(async (email: string, password: string) => {
    const success = await storeLogin({ email, password })
    if (success) {
      // Check for redirect
      const storedRedirect = sessionStorage.getItem('redirect_after_login')
      if (storedRedirect) {
        sessionStorage.removeItem('redirect_after_login')
        router.push(storedRedirect)
      } else {
        router.push('/dashboard')
      }
    }
    return success
  }, [storeLogin, router])

  const logout = useCallback(() => {
    storeLogout()
    router.push('/login')
  }, [storeLogout, router])

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      await authService.register(data)
      // After registration, redirect to login
      router.push('/login')
    } catch (error) {
      throw error
    }
  }, [router])

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      await authService.updateProfile(data)
      
      // Refresh user data
      const updatedUser = authService.getStoredUser()
      if (updatedUser) {
        // Update in Zustand store
        useAuth.getState().setUser(updatedUser)
      }
    } catch (error) {
      throw error
    }
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      await authService.changePassword(data)
    } catch (error) {
      throw error
    }
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getProfile()
      if (profile) {
        // Update in Zustand store
        useAuth.getState().setUser(profile)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }, [])

  const value: AuthContextType = {
    user,
    token: user ? (authService.getStoredToken() || null) : null,
    isAuthenticated,
    isLoading,
    error: error || null,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}

// Hook for checking if user is admin
export function useIsAdmin(): boolean {
  const { user } = useAuthContext()
  return user?.rol === 'admin'
}

export default AuthContext
