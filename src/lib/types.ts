import type { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string       
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string
  fullName: string
}

// Tipos específicos para el contexto de autenticación
export interface AuthContextValue extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

// Tipos para los loaders de Qwik
export interface AuthLoaderData {
  session: Session | null
  user: User | null
  error: string | null
}
