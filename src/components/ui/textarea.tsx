import { component$, type QRL } from '@builder.io/qwik'
import { cn } from '~/lib/utils'

export interface TextareaProps {
  class?: string
  placeholder?: string
  value?: string
  rows?: number
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  onInput$?: QRL<(event: Event, element: HTMLTextAreaElement) => void>
  onChange$?: QRL<(event: Event, element: HTMLTextAreaElement) => void>
  onFocus$?: QRL<(event: FocusEvent, element: HTMLTextAreaElement) => void>
  onBlur$?: QRL<(event: FocusEvent, element: HTMLTextAreaElement) => void>
}

export const Textarea = component$<TextareaProps>(({
  class: className,
  placeholder,
  value,
  rows = 3,
  disabled = false,
  required = false,
  name,
  id,
  onInput$,
  onChange$,
  onFocus$,
  onBlur$,
  ...props
}) => {
  return (
    <textarea
      class={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
        'ring-offset-background placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none',
        className
      )}
      placeholder={placeholder}
      value={value}
      rows={rows}
      disabled={disabled}
      required={required}
      name={name}
      id={id}
      onInput$={onInput$}
      onChange$={onChange$}
      onFocus$={onFocus$}
      onBlur$={onBlur$}
      {...props}
    />
  )
})
