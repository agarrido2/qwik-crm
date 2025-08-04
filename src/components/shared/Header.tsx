import { component$ } from "@builder.io/qwik"
import { useAuth } from "../../features/auth/hooks/use-auth-context"

/**
 * 🚀 Header Component = Barra superior del dashboard (CONTEXT-POWERED)
 * 
 * ✨ NUEVA IMPLEMENTACIÓN con Context API:
 * - 🎯 Zero prop drilling - acceso directo al contexto global
 * - 🔥 Server-side data - usuario ya verificado en el servidor
 * - ⚡ Lazy loading - función logout se carga solo cuando se usa
 * - 🛡️ Type safety - TypeScript completo end-to-end
 * - 🎨 Clean architecture - separación de responsabilidades
 */
export const Header = component$(() => {
  // 🔥 MAGIA DEL CONTEXTO: Acceso directo al estado global sin props
  const auth = useAuth()

  return (
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          
          {/* 🎯 Left Section: Dashboard Title */}
          <div>
            <h1 class="text-lg font-semibold text-gray-900">
              CRM Dashboard
            </h1>
          </div>
          
          {/* 
            🚀 Right Section: User Info (CONTEXT-POWERED)
            
            ✨ BENEFICIOS TÉCNICOS:
            - No props necesarias - datos vienen del contexto
            - Server-side verified - usuario ya validado
            - Lazy logout - función se carga solo al hacer click
            - Consistent UX - mismo estado en toda la app
          */}
          <div class="flex items-center space-x-4">
            {auth.isAuthenticated && auth.user ? (
              <>
                {/* 👤 User Avatar Placeholder */}
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {auth.user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                
                {/* 📧 User Email */}
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900">
                    {auth.user.user_metadata?.full_name || 'Usuario'}
                  </span>
                  <span class="text-xs text-gray-500">
                    {auth.user.email}
                  </span>
                </div>
                
                {/* 🚪 Logout Button (LAZY-LOADED) */}
                <button
                  onClick$={auth.logout}
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </>
            ) : (
              /* 🔒 Fallback: Usuario no autenticado (no debería pasar) */
              <span class="text-sm text-gray-500">
                No autenticado
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
})
