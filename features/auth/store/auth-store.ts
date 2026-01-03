// Auth Store - Zustand Implementation with Persistence
// Manages authentication state with localStorage persistence

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '@/lib/auth-service'
import type { User, LoginRequest } from '@/lib/types/auth.types'

interface AuthTokens {
  accessToken: string
  expiresAt?: number
}

interface AuthState {
  // State
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean // Tracks when Zustand finishes loading from localStorage
  error: string | null

  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>
  logout: () => void
  clearError: () => void
  initializeAuth: () => Promise<void>
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
}

// Flag to prevent multiple initializations
let hasInitialized = false

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true, // Start as loading until hydration completes
      isHydrated: false,
      error: null,

      // Initialize auth from persisted data
      initializeAuth: async () => {
        // Prevent multiple initializations
        if (hasInitialized) {
          console.log('[AuthStore] Already initialized, skipping')
          return
        }
        hasInitialized = true

        console.log('[AuthStore] 🔄 Initializing authentication...')
        const state = get()

        // Check if we have persisted data with valid token
        if (state.tokens && state.user) {
          console.log('[AuthStore] ✅ Found persisted auth data')
          
          // Check if token has expired locally (no API call needed)
          const now = Date.now()
          const expiresAt = state.tokens.expiresAt || 0
          
          if (expiresAt > now) {
            console.log('[AuthStore] ✅ Token still valid, restoring session')
            // Token is still valid, restore session
            set({
              isAuthenticated: true,
              isLoading: false,
              isHydrated: true
            })
          } else {
            console.log('[AuthStore] ⏰ Token expired, clearing session')
            // Token expired, clear everything
            authService.logout()
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              isLoading: false,
              isHydrated: true
            })
          }
        } else {
          console.log('[AuthStore] ℹ️ No persisted auth data found')
          set({ isLoading: false, isHydrated: true })
        }
      },

      // Login action
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null })
        console.log('[AuthStore] 🔑 Attempting login...')

        try {
          const response = await authService.login(credentials)

          if (response && response.access_token && response.user) {
            console.log('[AuthStore] ✅ Login successful')
            
            const tokens: AuthTokens = {
              accessToken: response.access_token,
              expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }

            set({
              user: response.user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })

            return true
          } else {
            console.error('[AuthStore] ❌ Invalid login response')
            set({
              error: 'Respuesta de autenticación inválida',
              isLoading: false
            })
            return false
          }
        } catch (error: any) {
          console.error('[AuthStore] ❌ Login error:', error)
          
          let errorMessage = 'Error de autenticación'

          if (error?.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos'
          } else if (error?.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor'
          } else if (error?.status === 500) {
            errorMessage = 'Error en el servidor. Intenta más tarde'
          } else if (error?.detail) {
            errorMessage = typeof error.detail === 'string' ? error.detail : 'Error de autenticación'
          } else if (error?.message) {
            errorMessage = error.message
          }

          set({
            error: errorMessage,
            isLoading: false
          })
          return false
        }
      },

      // Logout action
      logout: () => {
        console.log('[AuthStore] 🚪 Logging out...')
        authService.logout()
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },

      // Setter for user (used internally)
      setUser: (user: User | null) => {
        set({ user })
      },

      // Setter for tokens (used internally)
      setTokens: (tokens: AuthTokens | null) => {
        set({ tokens })
      }
    }),
    {
      name: 'mensajeria-auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => {
        console.log('[AuthStore] 💾 Rehydrating from localStorage...')
        return (state, error) => {
          if (error) {
            console.error('[AuthStore] ❌ Rehydration error:', error)
          } else if (state) {
            console.log('[AuthStore] ✅ Rehydrated successfully')
            // Initialize auth AFTER rehydration is complete
            state.initializeAuth()
          }
        }
      }
    }
  )
)
