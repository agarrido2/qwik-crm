import { component$, type PropFunction } from '@builder.io/qwik'
import { cn } from '~/lib/utils'

export interface CheckboxProps {
  class?: string
  checked?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  value?: string
  onCheckedChange$?: PropFunction<(checked: boolean) => void>
}

export const Checkbox = component$<CheckboxProps>(({
  class: className,
  checked = false,
  disabled = false,
  required = false,
  name,
  id,
  value,
  onCheckedChange$,
  ...props
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      class={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked && 'bg-primary text-primary-foreground',
        className
      )}
      disabled={disabled}
      onClick$={() => {
        if (!disabled && onCheckedChange$) {
          onCheckedChange$(!checked)
        }
      }}
      {...props}
    >
      {/* Hidden input for form submission */}
      <input
        type="checkbox"
        class="sr-only"
        name={name}
        id={id}
        value={value}
        checked={checked}
        required={required}
        disabled={disabled}
        tabIndex={-1}
      />
      
      {/* Check icon */}
      {checked && (
        <svg
          class="h-4 w-4 text-current"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  )
})
