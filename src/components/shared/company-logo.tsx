/**
 * CompanyLogo - Logo de la empresa para el sidebar
 * 
 * Componente reutilizable que muestra el logo y nombre de la empresa
 * con diferentes variantes (completo, compacto, solo icono).
 */

import { component$ } from '@builder.io/qwik'

export interface CompanyLogoProps {
  variant?: 'full' | 'compact' | 'icon-only'
  class?: string
}

export const CompanyLogo = component$<CompanyLogoProps>(({
  variant = 'full',
  class: className
}) => {
  const baseClasses = 'flex items-center gap-3 font-bold text-foreground'
  
  return (
    <div class={`${baseClasses} ${className || ''}`}>
      {/* Logo Icon */}
      <div class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full shadow-lg bg-gradient-to-br from-purple-600 to-purple-800">
        <span class="text-white text-xl font-bold">Q</span>
      </div>
      
      {/* Company Name */}
      {variant !== 'icon-only' && (
        <div class="flex flex-col">
          <span class="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            Qwik
          </span>
          {variant === 'full' && (
            <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Car
            </span>
          )}
        </div>
      )}
    </div>
  )
})
