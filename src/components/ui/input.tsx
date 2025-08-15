import { component$, type PropFunction } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-ring/50 focus:border-ring',
  {
    variants: {
      variant: {
        default: 'border-input focus-visible:ring-ring',
        destructive: 'border-destructive text-destructive focus-visible:ring-destructive placeholder:text-destructive/70',
        success: 'border-green-500 focus-visible:ring-green-500 text-green-700 placeholder:text-green-600/70',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-1 text-xs',
        lg: 'h-11 px-4 py-3 text-base',
        xl: 'h-12 px-4 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps extends VariantProps<typeof inputVariants> {
  class?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  value?: string
  name?: string
  id?: string
  required?: boolean
  onInput$?: PropFunction<(event: Event, element: HTMLInputElement) => void>
  onChange$?: PropFunction<(event: Event, element: HTMLInputElement) => void>
  onFocus$?: PropFunction<(event: FocusEvent, element: HTMLInputElement) => void>
  onBlur$?: PropFunction<(event: FocusEvent, element: HTMLInputElement) => void>
}

export const Input = component$<InputProps>(({ 
  variant, 
  size, 
  class: className, 
  type = 'text',
  ...props 
}) => {
  return (
    <input
      type={type}
      class={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  )
})
