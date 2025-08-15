import { component$, Slot, useSignal, useTask$, type PropFunction } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const toastActionVariants = cva(
  'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive'
)

const toastCloseVariants = cva(
  'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600'
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  class?: string
  open?: boolean
  duration?: number
  onOpenChange$?: PropFunction<(open: boolean) => void>
}

export interface ToastActionProps extends VariantProps<typeof toastActionVariants> {
  class?: string
  onClick$?: PropFunction<() => void>
}

export interface ToastCloseProps extends VariantProps<typeof toastCloseVariants> {
  class?: string
  onClick$?: PropFunction<() => void>
}

export const Toast = component$<ToastProps>(({ 
  variant, 
  class: className, 
  open = true,
  duration = 5000,
  onOpenChange$,
  ...props 
}) => {
  const isOpen = useSignal(open)
  
  // Usar useTask$ en lugar de useVisibleTask$ para mejor performance
  useTask$(({ track }) => {
    track(() => open)
    isOpen.value = open
    
    // Auto-close después del duration especificado
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        isOpen.value = false
        onOpenChange$?.(false)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  })


  if (!isOpen.value) return null

  return (
    <div
      class={cn(
        toastVariants({ variant }),
        className
      )}
      data-state="open"
      role="alert"
      aria-live="polite"
      {...props}
    >
      <Slot />
    </div>
  )
})

export const ToastAction = component$<ToastActionProps>(({ 
  class: className, 
  onClick$,
  ...props 
}) => {
  return (
    <button
      type="button"
      class={cn(toastActionVariants(), className)}
      onClick$={onClick$}
      {...props}
    >
      <Slot />
    </button>
  )
})

export const ToastClose = component$<ToastCloseProps>(({ 
  class: className, 
  onClick$,
  ...props 
}) => {
  return (
    <button
      type="button"
      class={cn(toastCloseVariants(), className)}
      onClick$={onClick$}
      aria-label="Close notification"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m21 21-6-6m0 0L9 9m6 6 6-6M15 15l-6-6" />
      </svg>
      <span class="sr-only">Close</span>
    </button>
  )
})

export const ToastTitle = component$<{ class?: string }>(({ class: className }) => {
  return (
    <div class={cn('text-sm font-semibold', className)}>
      <Slot />
    </div>
  )
})

export const ToastDescription = component$<{ class?: string }>(({ class: className }) => {
  return (
    <div class={cn('text-sm opacity-90', className)}>
      <Slot />
    </div>
  )
})
