import { component$ } from "@builder.io/qwik"
import { useAuth } from "../../features/auth/hooks/use-auth-context"

/**
 * 🎯 UserProfileCard Component
 * 
 * ✨ DEMOSTRACIÓN DEL PODER DEL CONTEXTO:
 * - 🔥 Zero props - acceso directo al contexto
 * - 🚀 Server-verified data - sin loading states
 * - ⚡ Lazy functions - logout optimizado
 * - 🎨 Consistent UI - mismo estado global
 * 
 * Este componente puede usarse EN CUALQUIER LUGAR de la app
 * sin necesidad de pasar props o manejar estado local.
 */
export const UserProfileCard = component$(() => {
  // 🔥 CONTEXTO GLOBAL: Un solo hook, acceso completo
  const auth = useAuth()

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-gray-500 text-sm">Usuario no autenticado</p>
      </div>
    )
  }

  const { user } = auth

  return (
    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* 👤 Avatar Section */}
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-white text-lg font-bold">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">
            {user.user_metadata?.full_name || 'Usuario CRM'}
          </h3>
          <p class="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* 📊 User Metadata */}
      <div class="mt-6 space-y-3">
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-600">ID de Usuario:</span>
          <span class="text-sm text-gray-900 font-mono">
            {user.id.slice(0, 8)}...
          </span>
        </div>
        
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-600">Último acceso:</span>
          <span class="text-sm text-gray-900">
            {user.last_sign_in_at ? 
              new Date(user.last_sign_in_at).toLocaleDateString('es-ES') : 
              'Primera vez'
            }
          </span>
        </div>
        
        <div class="flex justify-between items-center py-2">
          <span class="text-sm font-medium text-gray-600">Email verificado:</span>
          <span class={`text-sm font-medium ${user.email_confirmed_at ? 'text-green-600' : 'text-orange-600'}`}>
            {user.email_confirmed_at ? '✅ Verificado' : '⏳ Pendiente'}
          </span>
        </div>
      </div>

      {/* 🚪 Action Button */}
      <div class="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick$={auth.logout}
          class="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 border border-red-200"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  )
})

/**
 * 🎯 QuickUserInfo Component
 * 
 * ✨ OTRO EJEMPLO DE CONTEXTO:
 * - Componente mínimo que muestra info del usuario
 * - Zero configuración - solo importar y usar
 * - Consistente con el resto de la app
 */
export const QuickUserInfo = component$(() => {
  const auth = useAuth()

  if (!auth.isAuthenticated) {
    return <span class="text-gray-500">No autenticado</span>
  }

  return (
    <div class="flex items-center space-x-2">
      <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
        <span class="text-white text-xs font-bold">
          {auth.user?.email?.charAt(0).toUpperCase()}
        </span>
      </div>
      <span class="text-sm text-gray-700">
        {auth.user?.email}
      </span>
    </div>
  )
})
