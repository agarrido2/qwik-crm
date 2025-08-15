import { component$, Slot } from '@builder.io/qwik'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

export interface CardProps {
  class?: string
}

export const Card = component$<CardProps>(({ class: className }) => {
  return (
    <div class={cn('rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200', className)}>
      <Slot />
    </div>
  )
})

export interface CardHeaderProps {
  class?: string
}

export const CardHeader = component$<CardHeaderProps>(({ class: className }) => {
  return (
    <div class={cn('flex flex-col space-y-1.5 p-6', className)}>
      <Slot />
    </div>
  )
})

export interface CardTitleProps {
  class?: string
}

export const CardTitle = component$<CardTitleProps>(({ class: className }) => {
  return (
    <h3 class={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      <Slot />
    </h3>
  )
})

export interface CardContentProps {
  class?: string
}

export const CardContent = component$<CardContentProps>(({ class: className }) => {
  return (
    <div class={cn('p-6 pt-0', className)}>
      <Slot />
    </div>
  )
})
