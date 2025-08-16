import { component$, type PropFunction } from '@builder.io/qwik'
import { Button } from '../../ui'

export interface ExpandedProps {
  isExpanded?: boolean
  onToggle$?: PropFunction<() => void>
  class?: string
}

export const Expanded = component$<ExpandedProps>(({
  isExpanded = false,
  onToggle$,
  class: className
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick$={onToggle$}
      class={className}
      aria-label={isExpanded ? "Contraer vista" : "Expandir vista"}
    >
      {isExpanded ? (
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
            d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9v4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5" 
          />
        </svg>
      ) : (
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
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" 
          />
        </svg>
      )}
    </Button>
  )
})
