import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { UserProfileCard, QuickUserInfo } from "../../components/UserProfileDemo";
import { useAuth } from "../../lib/use-auth-context";

export default component$(() => {
  // 🔥 CONTEXTO EN ACCIÓN: Acceso directo sin configuración
  const auth = useAuth()
  
  return (
    <div class="space-y-8">
      {/* 🎯 Hero Section */}
      <div class="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">
              ¡Bienvenido al CRM! 🚀
            </h1>
            <p class="text-blue-100 text-lg">
              Contexto global implementado con excelencia técnica
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <QuickUserInfo />
          </div>
        </div>
      </div>

      {/* 📊 Stats Grid */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100">
              <span class="text-2xl">👥</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Clientes</h3>
              <p class="text-gray-600">Gestiona tu cartera</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100">
              <span class="text-2xl">💼</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Oportunidades</h3>
              <p class="text-gray-600">Cierra más ventas</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100">
              <span class="text-2xl">📈</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Reportes</h3>
              <p class="text-gray-600">Analiza resultados</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Two Column Layout */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 🚀 Left: Context Demo */}
        <div>
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              🔥 Contexto Global en Acción
            </h2>
            <p class="text-gray-600">
              Este componente accede al usuario sin props ni configuración adicional.
            </p>
          </div>
          
          <UserProfileCard />
        </div>

        {/* 📝 Right: Technical Details */}
        <div>
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              ⚡ Beneficios Técnicos
            </h2>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">✓</span>
              </span>
              <div>
                <h4 class="font-semibold text-gray-900">Server-Side Verified</h4>
                <p class="text-sm text-gray-600">Usuario verificado con getUser() en el servidor</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">✓</span>
              </span>
              <div>
                <h4 class="font-semibold text-gray-900">Zero Prop Drilling</h4>
                <p class="text-sm text-gray-600">Acceso directo sin pasar props entre componentes</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">✓</span>
              </span>
              <div>
                <h4 class="font-semibold text-gray-900">Lazy Loading</h4>
                <p class="text-sm text-gray-600">Funciones QRL cargadas solo cuando se necesitan</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">✓</span>
              </span>
              <div>
                <h4 class="font-semibold text-gray-900">Type Safety</h4>
                <p class="text-sm text-gray-600">TypeScript completo end-to-end</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">✓</span>
              </span>
              <div>
                <h4 class="font-semibold text-gray-900">Consistent State</h4>
                <p class="text-sm text-gray-600">Estado sincronizado en toda la aplicación</p>
              </div>
            </div>
          </div>

          {/* 📖 Usage Example */}
          <div class="mt-6 bg-gray-900 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-300 mb-2">Uso en cualquier componente:</h4>
            <pre class="text-green-400 text-sm">
{`import { useAuth } from "../lib/use-auth-context"

export default component$(() => {
  const auth = useAuth() // 🔥 ¡Así de simple!
  
  return <div>{auth.user?.email}</div>
})`}
            </pre>
          </div>
        </div>
      </div>

      {/* 🎯 Status Bar */}
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <span class="text-green-600 text-lg mr-3">🎉</span>
          <div>
            <h4 class="text-green-800 font-semibold">
              Contexto Global Implementado Exitosamente
            </h4>
            <p class="text-green-700 text-sm">
              Estado: <strong>{auth.isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}</strong> | 
              Usuario: <strong>{auth.user?.email || 'N/A'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: "Dashboard - CRM",
  meta: [
    {
      name: "description",
      content: "Panel principal del sistema CRM con contexto global implementado",
    },
  ],
}
