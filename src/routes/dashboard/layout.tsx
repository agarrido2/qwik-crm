import { component$, Slot } from "@builder.io/qwik"

/**
 * 🔐 Dashboard Layout - Simplificado
 * 
 * REFACTORIZADO: Eliminada duplicación de lógica auth
 * - La verificación de autenticación se maneja en el layout global `src/routes/layout.tsx`
 * - Este layout es puramente visual para la zona `dashboard`
 * - Punto de extensión para customizaciones futuras del área Dashboard
 * 
 * NOTA: Este layout es opcional; se mantiene como hook para UI específica
 */

export default component$(() => {
  return (
    // Renderizar contenido; el layout visual viene del AppLayout global
    <Slot />
  )
})
