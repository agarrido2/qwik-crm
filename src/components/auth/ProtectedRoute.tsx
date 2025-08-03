import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { createServerSupabaseClient } from "~/lib/database"

/**
 * 🛡️ ProtectedRoute Component
 * 
 * Responsabilidad única: Verificación de autenticación server-side
 * - Ejecuta verificación antes del render (sin flash)
 * - Redirige automáticamente si no hay usuario
 * - Soporta redirectTo para UX optimizada
 * - Retorna usuario verificado para el contexto
 */

/**
 * Helper functions para determinar tipos de rutas
 */
const isPublicRoute = (pathname: string): boolean => {
  return pathname === '/' ||                          // Landing page
         pathname.startsWith('/login') || 
         pathname.startsWith('/register') ||
         pathname.startsWith('/forgot-password') ||
         pathname.startsWith('/reset-password')
}

const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/dashboard') ||
         pathname.startsWith('/clientes') ||
         pathname.startsWith('/oportunidades') ||
         pathname.startsWith('/actividades') ||
         pathname.startsWith('/reportes') ||
         pathname.startsWith('/configuracion')
}

/**
 * routeLoader$ = Verificación de autenticación en el SERVIDOR
 * - Se ejecuta ANTES del render, eliminando el flash
 * - Redirige en el servidor si es necesario
 * - Usa getUser() para verificación segura con el servidor Auth
 */
// eslint-disable-next-line qwik/loader-location
export const useAuthGuard = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  // ✅ SEGURO: getUser() verifica con el servidor Auth de Supabase
  const { data: { user } } = await supabase.auth.getUser()
  
  const pathname = requestEvent.url.pathname
  const isPublic = isPublicRoute(pathname)
  const isProtected = isProtectedRoute(pathname)
  
  // LÓGICA DE PROTECCIÓN DE RUTAS
  
  // Si es una ruta protegida y no hay usuario → redirigir al login
  if (isProtected && !user) {
    throw requestEvent.redirect(302, `/login?redirectTo=${encodeURIComponent(pathname)}`)
  }
  
  // Si está autenticado y trata de acceder a login → redirigir al dashboard
  if (user && pathname.startsWith('/login')) {
    const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard';
    throw requestEvent.redirect(302, redirectTo)
  }
  
  return {
    user,
    isPublic,
    isProtected
  }
})

/**
 * ProtectedRoute wrapper component
 * - Usa el hook de protección
 * - Renderiza contenido solo si la verificación pasa
 */
export const ProtectedRoute = component$(() => {
  // Si llegamos aquí, la verificación de auth pasó
  // (sino habría ocurrido redirect en el servidor)
  
  return <Slot />
})
