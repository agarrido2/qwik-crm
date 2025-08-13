import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { AuthProvider, AppLayout } from "~/components"
import { createServerSupabaseClient } from "~/lib/database"

/**
 * 🏛️ Layout Global - Arquitectura Limpia
 * 
 * Responsabilidades separadas:
 * - AuthProvider: Contexto global de autenticación
 * - useAuthGuard: Verificación y protección de rutas (server-side)
 * - AppLayout: Estructura visual de la aplicación
 * - Renderizado condicional basado en el tipo de ruta
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
  // Nueva estructura: todo lo protegido vive bajo /dashboard
  return pathname.startsWith('/dashboard')
}

/**
 * Rutas de autenticación (excluye la landing "/")
 */
const isAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith('/login') ||
         pathname.startsWith('/register') ||
         pathname.startsWith('/forgot-password') ||
         pathname.startsWith('/reset-password')
}

/**
 * routeLoader$ = Verificación de autenticación en el SERVIDOR
 * - Se ejecuta ANTES del render, eliminando el flash
 * - Redirige en el servidor si es necesario
 * - Usa getUser() para verificación segura con el servidor Auth
 */
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
  
  // Si está autenticado y trata de acceder a páginas de auth → redirigir al dashboard
  if (user && isAuthRoute(pathname)) {
    const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard';
    throw requestEvent.redirect(302, redirectTo)
  }
  
  return {
    user,
    isPublic,
    isProtected
  }
})

export default component$(() => {
  // Server-side auth verification (implementado en useAuthGuard)
  const authState = useAuthGuard()
  
  // Usar el estado ya calculado en el servidor (más eficiente)
  const isPublic = authState.value.isPublic
  const user = authState.value.user
  
  return (
    <AuthProvider user={user}>
      {/* 
        CONDITIONAL RENDERING basado en tipo de ruta
        - Rutas públicas (landing, auth): Solo el contenido (sin sidebar/header)
        - Rutas protegidas (dashboard): Layout completo con sidebar y header
      */}
      {isPublic ? (
        // Rutas públicas: Solo el contenido
        <Slot />
      ) : (
        // Rutas protegidas: Layout completo con AppLayout
        <AppLayout>
          <Slot />
        </AppLayout>
      )}
    </AuthProvider>
  )
})
