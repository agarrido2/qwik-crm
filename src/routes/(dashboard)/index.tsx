import { component$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { createClient } from "../../lib/supabase";

export default component$(() => {
  const nav = useNavigate()
  
  const handleTestLogout = $(async () => {
    const supabase = createClient()
    
    try {
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error en logout:', error)
        alert('Error al cerrar sesión: ' + error.message)
        return
      }
      
      // Limpiar localStorage y sessionStorage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Redirigir al login
      nav('/login')
      
      // Mostrar confirmación
      alert('Sesión cerrada correctamente. ¡Ahora puedes probar el login desde cero!')
    } catch (error) {
      console.error('Error inesperado en logout:', error)
      alert('Error inesperado al cerrar sesión')
    }
  })

  return (
    <div class="max-w-7xl mx-auto">
      {/* Botón de logout para testing */}
      <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-yellow-800">🧪 Botón de Testing</h3>
            <p class="text-sm text-yellow-700">
              Usa este botón para cerrar sesión y probar el login desde cero
            </p>
          </div>
          <button
            onClick$={handleTestLogout}
            class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            🚪 Logout Completo (Testing)
          </button>
        </div>
      </div>
      
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido al CRM 👋
        </h1>
        <p class="text-lg text-gray-600">
          ¡Hola! Has iniciado sesión correctamente en tu sistema de gestión de relaciones con clientes.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span class="text-white font-bold">C</span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Clientes</h3>
              <p class="text-sm text-gray-500">Gestiona tus clientes</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span class="text-white font-bold">O</span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Oportunidades</h3>
              <p class="text-sm text-gray-500">Seguimiento de ventas</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span class="text-white font-bold">A</span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Actividades</h3>
              <p class="text-sm text-gray-500">Tareas y eventos</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <span class="text-white font-bold">R</span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Reportes</h3>
              <p class="text-sm text-gray-500">Análisis y métricas</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-500 text-center py-8">
            No hay actividad reciente para mostrar.
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard - CRM",
  meta: [
    {
      name: "description",
      content: "Panel principal del sistema CRM",
    },
  ],
};
