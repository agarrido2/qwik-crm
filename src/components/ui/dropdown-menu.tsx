import { component$, Slot, useSignal, useTask$, $, type QRL } from '@builder.io/qwik'
import { cn } from '~/lib/utils'

export interface DropdownMenuProps {
  class?: string
}

export const DropdownMenu = component$<DropdownMenuProps>(({ class: className }) => {
  const isOpen = useSignal(false)

  const toggle = $(() => {
    isOpen.value = !isOpen.value
  })

  const close = $(() => {
    isOpen.value = false
  })

  // Close on outside click
  useTask$(({ track, cleanup }) => {
    track(() => isOpen.value)
    
    if (typeof document !== 'undefined' && isOpen.value) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element
        if (!target.closest('[data-dropdown]')) {
          isOpen.value = false
        }
      }

      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)
      
      cleanup(() => {
        document.removeEventListener('click', handleClickOutside)
      })
    }
  })

  return (
    <div class={cn('relative inline-block text-left', className)} data-dropdown>
      <DropdownMenuTrigger toggle={toggle} />
      <DropdownMenuContent isOpen={isOpen.value} />
    </div>
  )
})

export interface DropdownMenuTriggerProps {
  class?: string
  toggle?: QRL<() => void>
  children?: any
}

export const DropdownMenuTrigger = component$<DropdownMenuTriggerProps>(({ class: className, toggle, children }) => {
  return (
    <button
      type="button"
      class={cn(
        'inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900',
        'shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
      onClick$={toggle}
      aria-expanded="true"
      aria-haspopup="true"
    >
      {children || <Slot />}
      <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>
  )
})

export interface DropdownMenuContentProps {
  class?: string
  align?: 'start' | 'center' | 'end'
  isOpen?: boolean
  children?: any
}

export const DropdownMenuContent = component$<DropdownMenuContentProps>(({ class: className, align = 'end', isOpen = false, children }) => {
  if (!isOpen) return null

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div
      class={cn(
        'absolute z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
        alignClasses[align],
        className
      )}
      role="menu"
      aria-orientation="vertical"
    >
      <div class="py-1" role="none">
        {children || <Slot />}
      </div>
    </div>
  )
})

export interface DropdownMenuItemProps {
  class?: string
  onClick$?: QRL<() => void>
  disabled?: boolean
}

export const DropdownMenuItem = component$<DropdownMenuItemProps>(({ class: className, onClick$, disabled = false }) => {
  return (
    <button
      type="button"
      class={cn(
        'group flex w-full items-center px-4 py-2 text-sm text-gray-700',
        'hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white hover:text-gray-700',
        className
      )}
      role="menuitem"
      onClick$={!disabled ? onClick$ : undefined}
      disabled={disabled}
    >
      <Slot />
    </button>
  )
})

export interface DropdownMenuSeparatorProps {
  class?: string
}

export const DropdownMenuSeparator = component$<DropdownMenuSeparatorProps>(({ class: className }) => {
  return (
    <div class={cn('my-1 h-px bg-gray-200', className)} role="separator" />
  )
})

export interface DropdownMenuLabelProps {
  class?: string
}

export const DropdownMenuLabel = component$<DropdownMenuLabelProps>(({ class: className }) => {
  return (
    <div class={cn('px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider', className)}>
      <Slot />
    </div>
  )
})
