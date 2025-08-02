import { createBrowserClient, createServerClient } from '@supabase/ssr'

/**
 * Variables de entorno - SIEMPRE usar import.meta.env en Qwik/Vite
 * VITE_* = Variables públicas (accesibles en el cliente)
 * Fallbacks para desarrollo (deberían estar en .env)
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://uyradeufmhqymutizwvt.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmFkZXVmbWhxeW11dGl6d3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTAyNjQsImV4cCI6MjA2OTQyNjI2NH0.EN0wLExRAcNGW6PrOUN9d4ejc-5Mdm3I6rx7QRd5qjU"

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
 * - Recibe Request para leer cookies del navegador
 * - Esencial para SSR y server actions
 * - ✅ USAR SIEMPRE en routeAction$ y routeLoader$
 */
export const createServerSupabaseClient = (request: Request) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      /**
       * get = Leer cookies del Request header
       * Parse manual porque estamos en server environment
       */
      get: (key: string) => {
        const cookieHeader = request.headers.get('cookie')
        if (!cookieHeader) return undefined
        
        // Parse cookies manualmente desde header
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=')
          if (name && value) {
            try {
              // Decodificar URL encoding
              acc[name] = decodeURIComponent(value)
            } catch (e) {
              // Si falla decodificación, usar valor raw
              acc[name] = value
            }
          }
          return acc
        }, {} as Record<string, string>)
        
        return cookies[key]
      },
      /**
       * set = Escribir cookies (manejado automáticamente por Qwik)
       * En server actions, Qwik se encarga de la implementación real
       */
      set: (key: string, value: string, options?: any) => {
        // Log para debug en desarrollo
        if (import.meta.env.DEV) {
          console.log(`Setting cookie: ${key} = ${value.substring(0, 50)}...`)
        }
      },
      /**
       * remove = Eliminar cookies (manejado automáticamente por Qwik)
       */
      remove: (key: string, options?: any) => {
        if (import.meta.env.DEV) {
          console.log(`Removing cookie: ${key}`)
        }
      },
    },
  })
}

/**
 * Cliente simple para casos básicos (backward compatibility)
 * Mejor usar createClient() explícitamente
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
