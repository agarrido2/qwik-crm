import { component$, useSignal, $ } from '@builder.io/qwik'
import { Button, Badge } from '../../ui'

export interface NotificationProps {
  count?: number
  class?: string
}

export const Notification = component$<NotificationProps>(({
  count = 0,
  class: className
}) => {
  const isOpen = useSignal(false)

  const toggleNotifications = $(() => {
    isOpen.value = !isOpen.value
  })

  return (
    <div class={`relative ${className || ''}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick$={toggleNotifications}
        class="relative"
        aria-label="Notificaciones"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        {count > 0 && (
          <Badge 
            variant="destructive" 
            class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
          >
            {count > 99 ? '99+' : count}
          </Badge>
        )}
      </Button>

      {/* Dropdown de notificaciones */}
      {isOpen.value && (
        <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div class="p-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Notificaciones</h3>
          </div>
          <div class="max-h-96 overflow-y-auto">
            {count === 0 ? (
              <div class="p-4 text-center text-gray-500 text-sm">
                No hay notificaciones nuevas
              </div>
            ) : (
              <div class="p-2">
                {/* Ejemplo de notificaciones */}
                <div class="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900">Nueva oportunidad creada</p>
                      <p class="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div class="p-3 border-t border-gray-100">
            <Button variant="ghost" size="sm" class="w-full">
              Ver todas las notificaciones
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})
