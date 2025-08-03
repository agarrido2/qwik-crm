import { component$, Slot, useContextProvider, $ } from "@builder.io/qwik"
import { useNavigate } from "@builder.io/qwik-city"
import { createClient } from "~/lib/database"
import { AuthContext, type AuthContextValue } from "~/features/auth"
import type { User } from "@supabase/supabase-js"

/**
 * 🔐 AuthProvider Component
 * 
 * Responsabilidad única: Proveer contexto de autenticación global
 * - Envuelve toda la aplicación
 * - Provee estado de usuario y funciones auth
 * - Maneja logout con navegación automática
 * - Optimizado para Qwik (mínimo JavaScript)
 */

interface AuthProviderProps {
  user: User | null
}

export const AuthProvider = component$<AuthProviderProps>(({ user }) => {
  const nav = useNavigate()
  
  // 🎯 CONTEXT VALUE: Preparar valor optimizado para el contexto
  const authContextValue: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    logout: $(async () => {
      // 🚀 Logout optimizado con navegación automática
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (!error) {
        // ✅ Navegación client-side tras logout exitoso - redirigir a landing page
        nav('/')
      } else {
        console.error('❌ Error en logout:', error.message)
      }
    })
  }
  
  // 🔥 CONTEXT PROVIDER: Proveer contexto a TODA la aplicación
  useContextProvider(AuthContext, authContextValue)
  
  return <Slot />
})
