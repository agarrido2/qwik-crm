import { component$, Slot, type PropFunction } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

const selectVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'border-destructive focus:ring-destructive',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface SelectProps extends VariantProps<typeof selectVariants> {
  class?: string
  disabled?: boolean
  value?: string
  name?: string
  id?: string
  required?: boolean
  onChange$?: PropFunction<(event: Event, element: HTMLSelectElement) => void>
  onFocus$?: PropFunction<(event: FocusEvent, element: HTMLSelectElement) => void>
  onBlur$?: PropFunction<(event: FocusEvent, element: HTMLSelectElement) => void>
}

export const Select = component$<SelectProps>(({ 
  variant, 
  size, 
  class: className, 
  ...props 
}) => {
  return (
    <select
      class={cn(selectVariants({ variant, size, className }))}
      {...props}
    >
      <Slot />
    </select>
  )
})

export interface SelectOptionProps {
  value: string
  disabled?: boolean
  class?: string
}

export const SelectOption = component$<SelectOptionProps>(({ value, disabled, class: className }) => {
  return (
    <option value={value} disabled={disabled} class={className}>
      <Slot />
    </option>
  )
})
