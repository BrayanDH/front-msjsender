"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import type {
  AuthContextType,
  AuthState,
  User,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/lib/types/auth.types'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const AuthContext = createContext<AuthContextType | null>(null)

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getStoredToken()
      const storedUser = authService.getStoredUser()

      if (token && storedUser) {
        // Validate session with the server
        const isValid = await authService.validateSession()
        
        if (isValid) {
          setState({
            user: storedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          // Session invalid, clear state
          setState({
            ...initialState,
            isLoading: false,
          })
        }
      } else {
        setState({
          ...initialState,
          isLoading: false,
        })
      }
    }

    initializeAuth()
  }, [])

  // Route protection effect
  useEffect(() => {
    if (state.isLoading) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if (!state.isAuthenticated && !isPublicRoute) {
      // Redirect to login if trying to access protected route
      router.push('/login')
    } else if (state.isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      // Redirect to dashboard if already authenticated
      router.push('/dashboard')
    }
  }, [state.isAuthenticated, state.isLoading, pathname, router])

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const response = await authService.login({ email, password })
      
      setState({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
      
      router.push('/dashboard')
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [router])

  const register = useCallback(async (data: RegisterRequest) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      await authService.register(data)
      setState(prev => ({ ...prev, isLoading: false }))
      
      // After registration, redirect to login
      router.push('/login')
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [router])

  const logout = useCallback(() => {
    authService.logout()
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
    router.push('/login')
  }, [router])

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      await authService.updateProfile(data)
      
      // Refresh user data
      const updatedUser = authService.getStoredUser()
      if (updatedUser) {
        setState(prev => ({ ...prev, user: updatedUser }))
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
      const user = await authService.getProfile()
      setState(prev => ({ ...prev, user }))
    } catch (error) {
      // If refresh fails, logout
      logout()
    }
  }, [logout])

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Hook for checking if user is admin
export function useIsAdmin(): boolean {
  const { user } = useAuth()
  return user?.rol === 'admin'
}

export default AuthContext
