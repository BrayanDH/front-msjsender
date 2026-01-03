// Authentication types based on login-api specs

export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: 'user' | 'admin'
  activo: boolean
  fecha_creacion: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: 'bearer'
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  nombre: string
  apellido: string
  rol?: 'user' | 'admin'
}

export interface RegisterResponse {
  message: string
  success: boolean
}

export interface VerifyResponse {
  message: string
  success: boolean
}

export interface UpdateProfileRequest {
  nombre?: string
  apellido?: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface ApiSuccessResponse {
  message: string
  success: boolean
}

export interface ApiErrorResponse {
  detail: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  changePassword: (data: ChangePasswordRequest) => Promise<void>
  refreshUser: () => Promise<void>
}
