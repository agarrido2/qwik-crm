import { component$, useContext, type PropFunction } from "@builder.io/qwik"
import { AuthContext } from "~/features/auth"

/**
 * Header Component
 * 
 * Displays user information and logout functionality.
 * Consumes auth context for reactive user state.
 */

export interface HeaderProps {
  onToggleSidebar$?: PropFunction<() => void>
}

export const Header = component$<HeaderProps>(({ onToggleSidebar$ }) => {
  const auth = useContext(AuthContext)
  
  const user = auth.user
  const isAuthenticated = auth.isAuthenticated
  const displayName = user?.user_metadata?.name || user?.email || 'Usuario'
  const avatar = user?.user_metadata?.avatar_url

  return (
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* Left side - Hamburger + Logo */}
          <div class="flex items-center">
            {/* Hamburger menu button - visible on mobile/tablet */}
            <button
              onClick$={onToggleSidebar$}
              class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
              aria-label="Toggle sidebar"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 class="text-xl font-semibold text-gray-900">
              CRM Dashboard
            </h1>
          </div>

          {/* User Info */}
          <div class="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div class="flex items-center space-x-3">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      width="32"
                      height="32"
                      class="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white text-sm font-medium">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span class="text-sm font-medium text-gray-700">
                    {displayName}
                  </span>
                </div>
                <button
                  onClick$={() => auth.logout()}
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
})
