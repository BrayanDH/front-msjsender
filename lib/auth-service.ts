// Authentication Service - Connects to Login API
import { API_CONFIG, buildApiUrl, AUTH_STORAGE_KEYS } from './api-config'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyResponse,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiSuccessResponse,
} from './types/auth.types'

class AuthService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token)
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
    }
  }

  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user))
    }
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER)
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  getStoredToken(): string | null {
    return this.getToken()
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(buildApiUrl(endpoint), {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }))
      throw new Error(errorData.detail || `Error ${response.status}`)
    }

    return response.json()
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      API_CONFIG.endpoints.auth.login,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    )

    // Store token and user
    this.setToken(response.access_token)
    this.setUser(response.user)

    return response
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>(
      API_CONFIG.endpoints.auth.register,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  async verify(): Promise<VerifyResponse> {
    return this.makeRequest<VerifyResponse>(API_CONFIG.endpoints.auth.verify)
  }

  async getProfile(): Promise<User> {
    const user = await this.makeRequest<User>(API_CONFIG.endpoints.users.me)
    this.setUser(user)
    return user
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiSuccessResponse> {
    const response = await this.makeRequest<ApiSuccessResponse>(
      API_CONFIG.endpoints.users.me,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    
    // Refresh user data after update
    await this.getProfile()
    
    return response
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiSuccessResponse> {
    return this.makeRequest<ApiSuccessResponse>(
      API_CONFIG.endpoints.users.changePassword,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  logout(): void {
    this.removeToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  async validateSession(): Promise<boolean> {
    try {
      await this.verify()
      return true
    } catch {
      this.logout()
      return false
    }
  }
}

export const authService = new AuthService()
export default authService
