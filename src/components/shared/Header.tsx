import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik"
import { SearchBar } from "./header/search-bar"
import { Notification } from "./header/notification"
import { Expanded } from "./header/expanded"
import { DarkLight } from "./header/dark-light"
import { Profile } from "./header/profile"
import { Settings } from "./header/settings"

/**
 * Header Component
 * 
 * Header modular con todos los componentes integrados:
 * - SearchBar: Buscador global
 * - Notification: Sistema de notificaciones
 * - Expanded: Toggle para vista expandida
 * - DarkLight: Cambio de tema
 * - Profile: Menú de perfil de usuario
 * - Settings: Configuración general
 */

export interface HeaderProps {
  onToggleSidebar$?: PropFunction<() => void>
}

export const Header = component$<HeaderProps>(({ onToggleSidebar$ }) => {
  const isExpanded = useSignal(false)

  const handleToggleExpanded = $(() => {
    isExpanded.value = !isExpanded.value
  })

  const handleSearch = $((query: string) => {
    console.log('Búsqueda:', query)
    // Aquí se implementaría la lógica de búsqueda
  })

  return (
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* Left side - Hamburger + Title + Search */}
          <div class="flex items-center gap-4">
            {/* Hamburger menu button - visible on mobile/tablet */}
            <button
              onClick$={onToggleSidebar$}
              class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle sidebar"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 class="text-xl font-semibold text-gray-900 hidden sm:block">
              QwikCar Dashboard
            </h1>

            {/* Search Bar */}
            <SearchBar 
              placeholder="Buscar clientes, oportunidades..."
              onSearch$={handleSearch}
              class="hidden md:block"
            />
          </div>

          {/* Right side - Header Components */}
          <div class="flex items-center gap-2">
            {/* Search Bar móvil */}
            <SearchBar 
              placeholder="Buscar..."
              onSearch$={handleSearch}
              class="md:hidden w-48"
            />
            
            {/* Notification */}
            <Notification count={3} />
            
            {/* Expanded Toggle */}
            <Expanded 
              isExpanded={isExpanded.value}
              onToggle$={handleToggleExpanded}
            />
            
            {/* Dark/Light Mode */}
            <DarkLight />
            
            {/* Settings */}
            <Settings />
            
            {/* Profile */}
            <Profile />
          </div>
        </div>
      </div>
    </header>
  )
})
