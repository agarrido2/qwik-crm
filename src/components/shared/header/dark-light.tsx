import { component$, useSignal, $ } from '@builder.io/qwik'
import { Button } from '../../ui'

export interface DarkLightProps {
  class?: string
}

export const DarkLight = component$<DarkLightProps>(({
  class: className
}) => {
  const isDark = useSignal(false)

  const toggleTheme = $(() => {
    isDark.value = !isDark.value
    // Aquí se podría implementar la lógica para cambiar el tema
    // Por ejemplo, agregar/quitar clase 'dark' del document.documentElement
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  })

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick$={toggleTheme}
      class={className}
      aria-label={isDark.value ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark.value ? (
        // Sol (modo claro)
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Luna (modo oscuro)
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </Button>
  )
})
