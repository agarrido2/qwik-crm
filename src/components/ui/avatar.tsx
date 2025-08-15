import { component$, Slot } from '@builder.io/qwik'
import { Image } from '@unpic/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm hover:shadow-md transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const avatarImageVariants = cva(
  'aspect-square h-full w-full object-cover transition-transform duration-200 hover:scale-110'
)

const avatarFallbackVariants = cva(
  'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted/80',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
        '2xl': 'text-xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  class?: string
}

export interface AvatarImageProps extends VariantProps<typeof avatarImageVariants> {
  src: string
  alt: string
  class?: string
}

export interface AvatarFallbackProps extends VariantProps<typeof avatarFallbackVariants> {
  class?: string
}

export const Avatar = component$<AvatarProps>(({ size, class: className }) => {
  return (
    <span class={cn(avatarVariants({ size, className }))}>
      <Slot />
    </span>
  )
})

export const AvatarImage = component$<AvatarImageProps>(({ src, alt, class: className }) => {
  return (
    <Image
      class={cn(avatarImageVariants({ className }))}
      src={src}
      alt={alt}
      width={40}
      height={40}
      aspectRatio={1}
      priority={false}
    />
  )
})

export const AvatarFallback = component$<AvatarFallbackProps>(({ size, class: className }) => {
  return (
    <span class={cn(avatarFallbackVariants({ size, className }))}>
      <Slot />
    </span>
  )
})
