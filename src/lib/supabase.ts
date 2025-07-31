import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { RequestEventBase } from '@builder.io/qwik-city'

// Constantes para acceder a las variables de entorno de Supabase
export const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co'
export const SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key'

/**
 * Cliente de Supabase para el navegador
 * Se usa en componentes cliente que no tienen acceso al contexto del servidor
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Crea un cliente de Supabase para el servidor con soporte para cookies
 * Versión moderna usando @supabase/ssr (recomendado por Supabase)
 */
export function createSupabaseServerClient(event: RequestEventBase) {
  // Adaptador para las cookies de QwikCity a formato compatible con @supabase/ssr
  const cookieAdapter = {
    // Función para obtener una cookie por nombre
    get(name: string) {
      return event.cookie.get(name)?.value
    },
    // Función para obtener todas las cookies (requerido por la interfaz)
    getAll() {
      // QwikCity no proporciona una forma directa de obtener todas las cookies
      // Esta es una implementación de fallback para compatibilidad
      return []
    },
    // Función para establecer una cookie
    set(name: string, value: string, options?: CookieOptions) {
      event.cookie.set(name, value, {
        ...options,
        path: options?.path || '/'
      })
    },
    // Función para eliminar una cookie
    remove(name: string, options?: CookieOptions) {
      event.cookie.delete(name, {
        ...options,
        path: options?.path || '/'
      })
    }
  }

  // Crear cliente de Supabase para servidor con soporte para cookies
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: cookieAdapter,
      cookieOptions: {
        name: 'sb-auth',
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD === true,
        maxAge: 60 * 60 * 24 * 7 // 7 días
      }
    }
  )
}

/**
 * Mapeo de mensajes de error comunes de Supabase a mensajes más amigables
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Credenciales inválidas. Por favor verifica tu email y contraseña.',
  'Email not confirmed': 'Tu email no ha sido confirmado. Por favor revisa tu bandeja de entrada.',
  'User not found': 'Usuario no encontrado. ¿Quizás deberías registrarte?',
  'Password recovery required': 'Debes restablecer tu contraseña antes de iniciar sesión.',
  'default': 'Ocurrió un error de autenticación. Por favor intenta de nuevo.'
}

/**
 * Formatea errores de autenticación para presentarlos al usuario
 */
export function getAuthErrorMessage(errorMessage: string | undefined): string {
  if (!errorMessage) return ''
  return AUTH_ERROR_MESSAGES[errorMessage] || AUTH_ERROR_MESSAGES.default
}
