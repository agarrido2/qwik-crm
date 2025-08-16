import { component$, useSignal, useContext, $ } from '@builder.io/qwik'
import { Button, Avatar, AvatarImage, AvatarFallback } from '../../ui'
import { AuthContext } from '~/features/auth'

export interface ProfileProps {
  class?: string
}

export const Profile = component$<ProfileProps>(({
  class: className
}) => {
  const isOpen = useSignal(false)
  const auth = useContext(AuthContext)
  
  const user = auth.user
  const displayName = user?.user_metadata?.name || user?.email || 'Usuario'
  const avatar = user?.user_metadata?.avatar_url

  const toggleProfile = $(() => {
    isOpen.value = !isOpen.value
  })

  return (
    <div class={`relative ${className || ''}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick$={toggleProfile}
        class="flex items-center gap-2 px-2"
      >
        <Avatar class="h-8 w-8">
          {avatar ? (
            <AvatarImage src={avatar} alt={displayName} />
          ) : (
            <AvatarFallback class="bg-blue-500 text-white text-sm">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <span class="text-sm font-medium text-gray-700 hidden sm:block">
          {displayName}
        </span>
        <svg 
          class="h-4 w-4 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </Button>

      {/* Dropdown del perfil */}
      {isOpen.value && (
        <div class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <Avatar class="h-10 w-10">
                {avatar ? (
                  <AvatarImage src={avatar} alt={displayName} />
                ) : (
                  <AvatarFallback class="bg-blue-500 text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          
          <div class="py-2">
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi perfil
            </button>
            <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Preferencias
            </button>
          </div>
          
          <div class="border-t border-gray-100 py-2">
            <button 
              onClick$={() => auth.logout()}
              class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
