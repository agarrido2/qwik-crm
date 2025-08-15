import { component$, type QRL } from '@builder.io/qwik'
import { cn } from '~/lib/utils'

export interface RadioProps {
  class?: string
  checked?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  value: string
  onValueChange$?: QRL<(value: string) => void>
}

export const Radio = component$<RadioProps>(({
  class: className,
  checked = false,
  disabled = false,
  required = false,
  name,
  id,
  value,
  onValueChange$,
  ...props
}) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      class={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      disabled={disabled}
      onClick$={() => {
        if (!disabled && onValueChange$) {
          onValueChange$(value)
        }
      }}
      {...props}
    >
      {/* Hidden input for form submission */}
      <input
        type="radio"
        class="sr-only"
        name={name}
        id={id}
        value={value}
        checked={checked}
        required={required}
        disabled={disabled}
        tabIndex={-1}
      />
      
      {/* Radio dot */}
      {checked && (
        <div class="flex items-center justify-center">
          <div class="h-2.5 w-2.5 rounded-full bg-current" />
        </div>
      )}
    </button>
  )
})

export interface RadioGroupProps {
  class?: string
  value?: string
  name?: string
  required?: boolean
  disabled?: boolean
  onValueChange$?: QRL<(value: string) => void>
}

export const RadioGroup = component$<RadioGroupProps>(({
  class: className,
  value,
  name,
  required = false,
  disabled = false,
  onValueChange$
}) => {
  return (
    <div
      class={cn('grid gap-2', className)}
      role="radiogroup"
      aria-required={required}
      aria-disabled={disabled}
    >
      {/* Radio options will be slotted here */}
    </div>
  )
})
