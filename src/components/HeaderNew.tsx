import { component$ } from "@builder.io/qwik"
import { useAuth } from "../lib/use-auth"

/**
 * Header Component = Barra superior del dashboard (REFACTORIZADO)
 * - Usa custom hook useAuth para manejo de estado
 * - Código más limpio y reutilizable
 * - Consistente con el resto de la app
 */
export const Header = component$(() => {
  // Custom hook que maneja todo el estado de autenticación
  const { user, isLoading, logout } = useAuth();

  return (
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
          
          {/* 
            User Info Section = Información del usuario y logout
            - Usa custom hook para estado reactivo
            - Loading state automático
            - Logout centralizado
          */}
          <div class="flex items-center space-x-4">
            {isLoading ? (
              <span class="text-sm text-gray-500">Cargando...</span>
            ) : user ? (
              <>
                <span class="text-sm text-gray-700">
                  {user.email || 'Usuario'}
                </span>
                <button
                  onClick$={logout}
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
});
