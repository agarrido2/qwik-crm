import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik"
import { useLocation, useNavigate } from "@builder.io/qwik-city"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { createClient } from "../lib/supabase"

/**
 * Layout Global = Wrapper que envuelve TODAS las rutas
 * - Se ejecuta en cada navegación
 * - Maneja autenticación global
 * - Renderiza UI diferente según el tipo de ruta
 */
export default component$(() => {
  // useLocation = Acceso reactivo a la URL actual (sin causar re-render innecesario)
  const location = useLocation()
  // useNavigate = Función para navegar programáticamente
  const nav = useNavigate()
  
  /**
   * ⚠️ useVisibleTask$ aquí es JUSTIFICADO porque:
   * 1. Verificación de sesión requiere acceso al browser
   * 2. No hay forma de hacer esto en servidor sin cookies complejas
   * 3. Se ejecuta una sola vez por carga de página
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // Cliente browser (solo funciona en el cliente)
    const supabase = createClient()
    
    // Verificar sesión actual
    const { data: { session } } = await supabase.auth.getSession()
    
    // Determinar si estamos en ruta de autenticación
    const isAuthRoute = location.url.pathname.startsWith('/login') || 
                       location.url.pathname.startsWith('/register')
    
    // LÓGICA DE PROTECCIÓN DE RUTAS
    // Si no hay sesión y no está en auth → redirigir al login
    if (!session && !isAuthRoute) {
      nav('/login')
      return
    }
    
    // Si hay sesión y está en auth → redirigir al dashboard
    if (session && isAuthRoute) {
      nav('/')
      return
    }
    
    /**
     * onAuthStateChange = Listener de cambios de autenticación
     * Se ejecuta cuando:
     * - Usuario hace login/logout
     * - Token expira
     * - Sesión cambia en otra pestaña
     */
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        nav('/login')
      } else if (event === 'SIGNED_IN' && isAuthRoute) {
        nav('/')
      }
    })
  })
  
  // Verificar si es una ruta de auth (se calcula en cada render)
  const isAuthRoute = location.url.pathname.startsWith('/login') || 
                     location.url.pathname.startsWith('/register')
  
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
