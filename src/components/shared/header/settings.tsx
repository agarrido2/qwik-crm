import { component$, useSignal, $ } from '@builder.io/qwik'
import { Button } from '../../ui'

export interface SettingsProps {
  class?: string
}

export const Settings = component$<SettingsProps>(({
  class: className
}) => {
  const isOpen = useSignal(false)

  const toggleSettings = $(() => {
    isOpen.value = !isOpen.value
  })

  return (
    <div class={`relative ${className || ''}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick$={toggleSettings}
        class="relative"
        aria-label="Configuración"
      >
        <svg 
          class="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      </Button>

      {/* Dropdown de configuración */}
      {isOpen.value && (
        <div class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div class="p-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Configuración</h3>
          </div>
          
          <div class="py-2">
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              Apariencia
            </button>
            
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notificaciones
            </button>
            
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacidad
            </button>
            
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Preferencias
            </button>
          </div>
          
          <div class="border-t border-gray-100 py-2">
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ayuda y soporte
            </button>
            
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Acerca de
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
