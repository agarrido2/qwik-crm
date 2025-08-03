import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import Sidebar from "../components/Sidebar"
import { Header } from "../components/HeaderNew"
import { createServerSupabaseClient } from "../lib/supabase"

/**
 * Helper function = Determinar si es una ruta de autenticación
 * Incluye todas las rutas públicas que no requieren login
 */
const isAuthenticationRoute = (pathname: string) => {
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
export const useAuthLoader = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  // ✅ SEGURO: getUser() verifica con el servidor Auth de Supabase
  const { data: { user }, error } = await supabase.auth.getUser()
  
  const pathname = requestEvent.url.pathname
  const isAuthRoute = isAuthenticationRoute(pathname)
  
  // LÓGICA DE PROTECCIÓN DE RUTAS EN EL SERVIDOR
  
  // Si no hay usuario autenticado y no está en ruta de auth → redirigir al login
  if (!user && !isAuthRoute) {
    throw requestEvent.redirect(302, '/login')
  }
  
  // Si hay usuario autenticado y está en login/register → redirigir al dashboard
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    throw requestEvent.redirect(302, '/')
  }
  
  return {
    user,
    isAuthRoute
  }
})

/**
 * Layout Global = Wrapper que envuelve TODAS las rutas
 * - Verificación de auth se hace en el servidor (sin flash)
 * - Renderiza UI diferente según el tipo de ruta
 */
export default component$(() => {
  // Server-side auth verification (no flash!)
  const authState = useAuthLoader()
  
  // Usar el estado ya calculado en el servidor (más eficiente)
  const isAuthRoute = authState.value.isAuthRoute
  
  /**
   * CONDITIONAL RENDERING basado en tipo de ruta
   * - Auth routes: Solo el contenido (sin sidebar/header)
   * - Dashboard routes: Layout completo con sidebar y header
   */
  
  // Si es una ruta de auth, renderizar solo el slot
  if (isAuthRoute) {
    // Slot = Donde se renderiza el contenido de la ruta hija
    return <Slot />
  }
  
  // Para las rutas del dashboard, renderizar con sidebar y header
  return (
    <div class="flex h-screen bg-gray-100">
      {/* Sidebar = Navegación lateral */}
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        {/* Header = Barra superior con info del usuario */}
        <Header />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div class="container mx-auto px-6 py-8">
            {/* Slot = Contenido específico de cada ruta */}
            <Slot />
          </div>
        </main>
      </div>
    </div>
  )
})
