import { component$, Slot } from "@builder.io/qwik"
import { Header } from "~/components/shared/Header"
import Sidebar from "~/components/shared/Sidebar"
import { useAuth } from "~/features/auth"

/**
 * 🏗️ AppLayout Component
 * 
 * Responsabilidad única: Estructura visual de la aplicación
 * - Layout con sidebar y header para rutas protegidas
 * - UI limpia sin lógica de autenticación
 * - Responsive design con Flexbox
 * - Estructura consistente para toda la app
 */

export const AppLayout = component$(() => {
  const auth = useAuth()
  
  // Usar el ID del usuario como clave para forzar re-mount del Header
  const headerKey = auth.user?.id || 'anonymous'
  

  return (
    <div class="flex h-screen bg-gray-100">
      {/* Sidebar = Navegación lateral */}
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        {/* Header = Barra superior con info del usuario */}
        {/* Usar key para forzar re-mount cuando cambia el usuario */}
        <Header key={headerKey} />
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
