import { component$, Slot, useSignal, $ } from '@builder.io/qwik'
import { SidebarLeft } from '../shared/sidebar-left'
import { Header } from '../shared/header'

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
  // Estado para controlar la visibilidad del sidebar en móvil/tablet
  const isSidebarOpen = useSignal(false)
  
  // Toggle del sidebar
  const toggleSidebar = $(() => {
    isSidebarOpen.value = !isSidebarOpen.value
  })

  return (
    <div class="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarLeft 
        isOpen={isSidebarOpen.value}
        onToggle$={toggleSidebar}
      />
      
      {/* Main content area */}
      <div class="flex flex-col flex-1 overflow-hidden lg:ml-0">
        {/* Header */}
        <Header onToggleSidebar$={toggleSidebar} />
        
        {/* Content wrapper with sidebar spacing */}
        <div class={[
          "flex-1 overflow-hidden transition-all duration-300",
          // Mobile: No left margin (sidebar is overlay)
          "ml-0",
          // Tablet: No left margin (sidebar is overlay)
          "sm:ml-0",
          // Laptop: Left margin for collapsed sidebar
          "lg:ml-1",
          "lg:mt-1",
          // Desktop: Left margin for full sidebar
          "xl:ml-2",
          "xl:mt-2"
        ]}>
          {/* Page content */}
          <main class={[
            "h-full overflow-y-auto bg-gray-100 overflow-x-hidden transition-all duration-300 custom-scrollbar",
            // Mobile: Compact padding
            "p-4",
            // Tablet: Standard padding
            "sm:p-6",
            // Laptop: Standard padding
            "lg:p-8",
            // Desktop: Generous padding
            "xl:p-8"
          ]}>
            <div class={[
              "w-full max-w-none transition-all duration-300",
              // Mobile: Full width
              "mx-0",
              // Tablet: Slight margins
              "sm:mx-2",
              // Laptop: Standard container
              "lg:mx-4",
              // Desktop: Generous container
              "xl:mx-6"
            ]}>
              <Slot />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
})
