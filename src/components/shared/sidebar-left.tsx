/**
 * SidebarLeft - Componente sidebar principal del dashboard
 * 
 * Sidebar izquierdo con navegación jerárquica, logo de empresa,
 * selector de proyecto y menú colapsable.
 */

import { component$, useStore, useSignal, $, type PropFunction } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { CompanyLogo } from './company-logo'
import { sidebarData, type SidebarItem } from './sidebar-data'
import { NavLink } from '../ui/nav-link'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

export interface SidebarLeftProps {
  class?: string
  isOpen?: boolean
  onToggle$?: PropFunction<() => void>
}

export const SidebarLeft = component$<SidebarLeftProps>(({
  class: className,
  isOpen = false,
  onToggle$
}) => {
  const location = useLocation()
  const currentPath = location.url.pathname
  
  // Estado para controlar elementos expandidos
  const expandedItems = useStore<Record<string, boolean>>({
    dashboard: true, // My Dashboard expandido por defecto
  })
  
  // Estado para el proyecto seleccionado
  const selectedProject = useSignal("Select Project")
  
  // Toggle expansión de items
  const toggleExpanded = $((itemId: string) => {
    expandedItems[itemId] = !expandedItems[itemId]
  })
  
  // Verificar si un item está activo
  const isItemActive = (item: SidebarItem): boolean => {
    if (item.path === currentPath) return true
    if (item.children) {
      return item.children.some(child => isItemActive(child))
    }
    return false
  }
  
  // Renderizar item individual del menú
  const renderMenuItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]
    const isActive = isItemActive(item)
    const paddingLeft = level * 16 + 16 // Indentación por nivel
    
    return (
      <div key={item.id} class="w-full">
        {/* Item principal */}
        <div
          class={cn(
            'flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group',
            isActive 
              ? 'bg-red-50 text-red-600 border-r-2 border-red-600' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            'cursor-pointer'
          )}
          style={`padding-left: ${paddingLeft}px`}
          onClick$={hasChildren ? $(() => toggleExpanded(item.id)) : undefined}
        >
          <div class="flex items-center gap-3">
            <span class="text-base">{item.icon}</span>
            <span class="font-medium">{item.title}</span>
            {item.badge && (
              <span class="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          
          {hasChildren && (
            <span class={cn(
              'text-gray-400 transition-transform duration-200',
              isExpanded ? 'rotate-90' : 'rotate-0'
            )}>
              ▶
            </span>
          )}
        </div>
        
        {/* NavLink wrapper si tiene path */}
        {item.path && !hasChildren && (
          <NavLink
            href={item.path}
            activeClass="bg-red-50 text-red-600 border-r-2 border-red-600"
            inactiveClass="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            class={cn(
              'flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group'
            )}
            style={`padding-left: ${paddingLeft}px`}
          >
            <span class="text-base">{item.icon}</span>
            <span class="font-medium">{item.title}</span>
            {item.badge && (
              <span class="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        )}
        
        {/* Subitems */}
        {hasChildren && isExpanded && (
          <div class="mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }
  
  // Backdrop para móvil/tablet
  const backdrop = (
    <div 
      class={cn(
        "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick$={onToggle$}
    />
  )

  return (
    <>
      {backdrop}
      <aside class={cn(
        // Base styles
        "bg-white border-r border-gray-200 flex flex-col h-full transition-transform duration-300 ease-in-out",
        // Mobile: Hidden by default, overlay when open
        "fixed inset-y-0 left-0 z-50 w-80 transform",
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Tablet: Overlay behavior
        "sm:fixed sm:inset-y-0 sm:left-0 sm:z-50 sm:w-80",
        // Laptop: Collapsible, smaller width
        "lg:relative lg:z-auto lg:translate-x-0 lg:w-60",
        // Desktop: Full width, always visible
        "xl:w-80",
        className
      )}>
        {/* Header con logo */}
        <div class="p-6 border-b border-gray-100">
          <CompanyLogo variant="full" />
        </div>
        
        {/* Selector de proyecto con botón + */}
        <div class="p-4">
          <div class="flex items-center gap-3">
            <button
              class="flex items-center justify-between flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onClick$={() => {
                // TODO: Implementar dropdown de proyectos
              }}
            >
              <span>{selectedProject.value}</span>
              <span class="text-gray-400">▼</span>
            </button>
            
            {/* Botón + */}
            <button class="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
              <span class="text-lg font-bold">+</span>
            </button>
          </div>
        </div>
      
      {/* Navegación */}
      <nav class="flex-1 overflow-y-auto p-4">
        <div class="space-y-6">
          {sidebarData.map(section => (
            <div key={section.title} class="space-y-2">
              {/* Título de sección */}
              <h3 class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              
              {/* Items de la sección */}
              <div class="space-y-1">
                {section.items.map(item => renderMenuItem(item))}
              </div>
            </div>
          ))}
        </div>
      </nav>
      
        {/* Footer con iconos */}
        <div class="flex items-center justify-center p-4 border-t border-gray-200">
          <div class="flex items-center gap-4">
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              📅
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              💬
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              💬
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              🔄
            </button>
          </div>
        </div>
      </aside>
    </>
  )
})
