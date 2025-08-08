import { component$, Slot, useContextProvider, $, useStore, useVisibleTask$, useTask$ } from "@builder.io/qwik"
import { useNavigate, useLocation } from "@builder.io/qwik-city"
import { isBrowser } from "@builder.io/qwik/build"
import { createClient } from "~/lib/database"
import { AuthContext, type AuthContextValue } from "~/features/auth"
import type { User } from "@supabase/supabase-js"

/**
 * 🔐 AuthProvider Component
 * 
 * Responsabilidad única: Proveer contexto de autenticación global
 * - Envuelve toda la aplicación
 * - Provee estado de usuario y funciones auth
 * - Maneja logout con navegación automática
 * - Optimizado para Qwik (mínimo JavaScript)
 */

interface AuthProviderProps {
  user: User | null
}

export const AuthProvider = component$<AuthProviderProps>((props) => {
  const nav = useNavigate()
  const loc = useLocation()

  // Store SOLO para datos (serializable)
  const state = useStore({
    user: props.user as User | null,
    isAuthenticated: !!props.user,
  })

  // QRL fuera del store (no serializar funciones dentro del store)
  const logout = $(async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      nav('/')
    } else {
      console.error('❌ Error en logout:', error?.message)
    }
  })

  // Suscripción client-side a cambios de autenticación para refrescar el contexto sin recargar
  useVisibleTask$(({ cleanup }) => {
    const supabase = createClient()

    // Hidratar estado inmediatamente al montar (caso: redirect tras login)
    supabase.auth.getUser().then(({ data }) => {
      state.user = data.user ?? null
      state.isAuthenticated = !!data.user
    }).catch((err) => {
      console.warn('No se pudo hidratar el usuario inicial:', err?.message)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      state.user = session?.user ?? null
      state.isAuthenticated = !!session?.user
    })
    cleanup(() => subscription.unsubscribe())
  }, { strategy: 'document-ready' })

  // Re-hidratar en navegaciones client-side (p.ej., redirect desde server action)
  useTask$(({ track }) => {
    track(() => loc.url.href)
    if (!isBrowser) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      state.user = data.user ?? null
      state.isAuthenticated = !!data.user
    }).catch(() => {})
  })

  // Sincronizar cambios del prop SSR 'user' (por routeLoader$) con el store
  useTask$(({ track }) => {
    track(() => props.user)
    state.user = props.user as User | null
    state.isAuthenticated = !!props.user
  })

  // Incluir logout en el store para exponerlo desde el contexto
  // (QRL es serializable y apto para el store)
  ;(state as any).logout = logout

  // Proveer el store directamente para máxima reactividad
  useContextProvider(AuthContext, state as unknown as AuthContextValue)
  return <Slot />
})
