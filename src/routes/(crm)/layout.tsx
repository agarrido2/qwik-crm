import { component$, Slot } from "@builder.io/qwik"

/**
 * 🔐 CRM Layout - Simplificado
 * 
 * REFACTORIZADO: Eliminada duplicación de lógica auth
 * - La verificación de autenticación se maneja en el layout principal
 * - Este layout solo se renderiza si el usuario está autenticado
 * - Layout específico para rutas CRM si se necesitan customizaciones futuras
 * 
 * NOTA: Este layout es opcional ahora que el layout principal maneja todo
 * Se mantiene para futuras customizaciones específicas del CRM
 */
export default component$(() => {
  // La verificación de auth ya se hizo en el layout principal
  // Si llegamos aquí, el usuario está autenticado
  
  return (
    // Solo renderizar el contenido - el layout visual viene del AppLayout
    <Slot />
  )
})
