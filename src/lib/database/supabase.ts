import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { RequestEventCommon } from '@builder.io/qwik-city'

/**
 * Variables de entorno - SIEMPRE usar import.meta.env en Qwik/Vite
 * VITE_* = Variables públicas (accesibles en el cliente)
 * ⚠️ NUNCA hardcodear credenciales - usar archivos .env
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación de variables requeridas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno requeridas:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY\n' +
    'Crea un archivo .env con estas variables.'
  )
}

/**
 * Cliente Supabase para el NAVEGADOR (client components)
 * - Usar en useVisibleTask$, event handlers, etc.
 * - Maneja cookies automáticamente
 * - ⚠️ NO usar en routeAction$ o routeLoader$
 */
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Cliente Supabase para el SERVIDOR (routeLoader$, routeAction$)
 * - Recibe RequestEvent completo para manejar cookies correctamente
 * - Esencial para SSR y server actions
 * - ✅ USAR SIEMPRE en routeAction$ y routeLoader$
 * 
 * API moderna de @supabase/ssr v0.6+
 */
export const createServerSupabaseClient = (requestEvent: RequestEventCommon) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      /**
       * getAll = Método moderno para obtener todas las cookies
       */
      getAll() {
        const cookieHeader = requestEvent.request.headers.get('cookie')
        if (!cookieHeader) return []
        
        return cookieHeader.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=')
          return {
            name: name || '',
            value: value ? decodeURIComponent(value) : ''
          }
        }).filter(cookie => cookie.name && cookie.value)
      },
      /**
       * setAll = Método moderno para establecer múltiples cookies
       */
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (requestEvent.cookie) {
            requestEvent.cookie.set(name, value, {
              path: '/',
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 365, // 1 año
              ...options
            })
          }
        })
      },
    },
  })
}

/**
 * Cliente simple para casos básicos (backward compatibility)
 * Mejor usar createClient() explícitamente
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
