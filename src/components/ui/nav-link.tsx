import { Slot, component$ } from '@builder.io/qwik'
import { Link, useLocation, type LinkProps } from '@builder.io/qwik-city'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

export interface NavLinkProps extends LinkProps {
  activeClass?: string
  inactiveClass?: string
}

export const NavLink = component$<NavLinkProps>(({ 
  activeClass, 
  inactiveClass,
  class: className,
  ...props 
}) => {
  const location = useLocation()
  const toPathname = props.href ?? ''
  const locationPathname = location.url.pathname
  
  // Lógica mejorada para detectar rutas activas
  const startSlashPosition = toPathname !== '/' && toPathname.startsWith('/') 
    ? toPathname.length - 1 
    : toPathname.length
  const endSlashPosition = toPathname !== '/' && toPathname.endsWith('/') 
    ? toPathname.length - 1 
    : toPathname.length
  
  const isActive = locationPathname === toPathname || 
    (locationPathname.endsWith(toPathname) && 
     (locationPathname.charAt(endSlashPosition) === '/' || 
      locationPathname.charAt(startSlashPosition) === '/'))

  return (
    <Link 
      {...props} 
      class={cn(
        className as string,
        isActive ? activeClass : inactiveClass
      )}
    >
      <Slot />
    </Link>
  )
})
