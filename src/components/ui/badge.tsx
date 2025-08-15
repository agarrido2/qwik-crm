import { component$, Slot } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm hover:shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm hover:shadow',
        outline: 'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm hover:shadow',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  class?: string
}

export const Badge = component$<BadgeProps>(({ variant, size, class: className }) => {
  return (
    <div class={cn(badgeVariants({ variant, size, className }))}>
      <Slot />
    </div>
  )
})
