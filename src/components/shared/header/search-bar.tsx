import { component$, useSignal, type PropFunction } from '@builder.io/qwik'
import { Input } from '../../ui'

export interface SearchBarProps {
  placeholder?: string
  class?: string
  onSearch$?: PropFunction<(query: string) => void>
}

export const SearchBar = component$<SearchBarProps>(({
  placeholder = "Buscar...",
  class: className
}) => {
  const searchQuery = useSignal('')

  return (
    <div class={`relative ${className || ''}`}>
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery.value}
        onInput$={(_, el) => searchQuery.value = el.value}
        variant="default"
        size="sm"
        class="pl-10 pr-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      />
    </div>
  )
})
