import { component$, Slot, useContextProvider, $, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { useNavigate } from "@builder.io/qwik-city"
import { isBrowser } from "@builder.io/qwik/build"
import { createClient } from "~/lib/database"
import { AuthContext, type AuthContextValue } from "~/features/auth"
import type { User } from "@supabase/supabase-js"

/**
 * AuthProvider Component
 * 
 * Provides authentication context using Qwik's reactive primitives:
 * - useSignal for reactive user state
 * - SSR initialization with client-side sync
 * - Supabase auth event subscription
 */

interface AuthProviderProps {
  user: User | null
}

export const AuthProvider = component$<AuthProviderProps>((props) => {
  const nav = useNavigate()
  
  // Initialize user signal with SSR props
  const currentUser = useSignal<User | null>(props.user || null)

  // Logout function
  const logout = $(async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      currentUser.value = null
      nav('/')
    }
  })

  // Client-side auth synchronization
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (!isBrowser) return
    
    const supabase = createClient()

    // Sync with current session on hydration
    supabase.auth.getUser().then(({ data }) => {
      const serverUser = data?.user ?? null
      if (currentUser.value?.id !== serverUser?.id) {
        currentUser.value = serverUser
      }
    })

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      currentUser.value = session?.user ?? null
    })

    cleanup(() => subscription.unsubscribe())
  }, { strategy: 'document-ready' })

  // Provide auth context
  const ctx: AuthContextValue = {
    user: currentUser.value,
    isAuthenticated: !!currentUser.value,
    logout,
  }

  useContextProvider(AuthContext, ctx)
  return <Slot />
})
