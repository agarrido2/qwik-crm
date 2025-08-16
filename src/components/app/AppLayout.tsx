import { component$, Slot, useSignal, $ } from '@builder.io/qwik'
import { SidebarLeft } from '../shared/sidebar-left'
import { Header } from '../shared/Header'

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
        
        {/* Page content */}
        <main class={[
          "flex-1 overflow-auto transition-all duration-300",
          // Mobile: Compact padding
          "p-4",
          // Tablet: Standard padding
          "sm:p-6",
          // Laptop: Standard padding with collapsed sidebar space
          "lg:p-8",
          // Desktop: Generous padding with full sidebar
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
  )
})
