import { component$ } from "@builder.io/qwik"
import { Link, type DocumentHead } from "@builder.io/qwik-city"

/**
 * 🏠 Landing Page Principal
 * 
 * Página de bienvenida pública del sitio.
 * TODO: Implementar diseño de marketing
 */
export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">
          Bienvenido a Qwik CRM
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          La solución CRM más rápida y eficiente del mercado
        </p>
        
        <div class="flex justify-center">
          <Link
            href="/dashboard" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            🚀 Acceso a la App
          </Link>
        </div>
      </div>
      
      {/* TODO: Añadir secciones de features, testimonios, etc. */}
    </div>
  )
})

export const head: DocumentHead = {
  title: "Qwik CRM - La solución CRM más rápida",
  meta: [
    {
      name: "description",
      content: "Sistema CRM construido con Qwik para máxima performance",
    },
  ],
}
