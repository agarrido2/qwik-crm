import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik"
import { useNavigate } from "@builder.io/qwik-city"
import { createClient } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"

/**
 * Header Component = Barra superior del dashboard
 * - Muestra info del usuario autenticado
 * - Maneja logout
 * - Escucha cambios de autenticación en tiempo real
 */
export const Header = component$(() => {
  // useNavigate = Para redirección programática
  const nav = useNavigate()
  
  // useSignal = Estado reactivo para datos del usuario
  const user = useSignal<User | null>(null)
  // Estado para feedback visual durante logout
  const isLoggingOut = useSignal(false)

  /**
   * useVisibleTask$ = JUSTIFICADO aquí porque:
   * - Necesita acceso al cliente Supabase del browser
   * - Configura listeners de autenticación
   * - Se ejecuta una vez al montar el componente
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // Cliente browser para operaciones del lado del cliente
    const supabase = createClient()
    
    // Obtener usuario actual de la sesión
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
    }
    
    /**
     * onAuthStateChange = Listener en tiempo real
     * Se ejecuta automáticamente cuando cambia la autenticación
     * Mantiene la UI sincronizada con el estado de auth
     */
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
  })
  
  /**
   * Event Handler con $ suffix
   * $ = Lazy loading boundary (se carga solo cuando se ejecuta)
   * async = Operación asíncrona (llamada a Supabase)
   */
  const handleLogout = $(async () => {
    // Estado visual para feedback inmediato
    isLoggingOut.value = true
    // Cliente browser para logout
    const supabase = createClient()
    
    try {
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error en logout:', error)
        alert('Error al cerrar sesión')
      } else {
        // Logout exitoso → redirigir al login
        nav('/login')
      }
    } catch (error) {
      console.error('Error inesperado en logout:', error)
      alert('Error inesperado al cerrar sesión')
    } finally {
      // Limpiar estado visual
      isLoggingOut.value = false
    }
  })

  return (
    <header class="w-full h-16 bg-white border-b flex items-center px-6 justify-between">
      <div class="text-xl font-semibold text-gray-800">
        CRM Dashboard
      </div>
      
      <div class="flex items-center gap-4">
        {/* Conditional rendering basado en estado reactivo */}
        {user.value && (
          <span class="text-sm text-gray-600">
            {user.value.email}
          </span>
        )}
        
        {/* 
          onClick$ = Event handler optimizado de Qwik
          disabled = Basado en estado reactivo para prevenir doble-click
        */}
        <button
          onClick$={handleLogout}
          disabled={isLoggingOut.value}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {/* Estado visual reactivo */}
          {isLoggingOut.value ? 'Cerrando...' : 'Cerrar sesión'}
        </button>
        
        {/* Avatar con inicial del usuario */}
        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <span class="font-bold">
            {/* Optional chaining con fallback */}
            {user.value?.email?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  )
})

export default Header
