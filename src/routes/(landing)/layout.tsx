import { component$, Slot } from "@builder.io/qwik"

/**
 * 🏠 Landing Layout
 * 
 * Layout simple para páginas públicas:
 * - Sin sidebar ni header de dashboard
 * - Navegación pública
 * - Footer opcional
 */
export default component$(() => {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* TODO: Añadir navegación pública aquí */}
      <main>
        <Slot />
      </main>
      {/* TODO: Añadir footer aquí */}
    </div>
  )
})
