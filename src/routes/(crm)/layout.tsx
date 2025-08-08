import { component$, Slot } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { createServerSupabaseClient } from "~/lib/database"

/**
 * 🔐 CRM Layout - Simplificado
 * 
 * REFACTORIZADO: Eliminada duplicación de lógica auth
 * - La verificación de autenticación se maneja en el layout principal
 * - Este layout solo se renderiza si el usuario está autenticado
 * - Layout específico para rutas CRM si se necesitan customizaciones futuras
 * 
 * NOTA: Este layout es opcional ahora que el layout principal maneja todo
 * Se mantiene para futuras customizaciones específicas del CRM
 */
/**
 * SSR Guard específico del área CRM
 * - Protege cualquier ruta dentro de `src/routes/(crm)/**`
 * - Redirige a /login con redirectTo si no hay sesión
 */
export const useCrmGuard = routeLoader$(async (ev) => {
  const supabase = createServerSupabaseClient(ev)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const redirectTo = ev.url.pathname + ev.url.search
    throw ev.redirect(302, `/login?redirectTo=${encodeURIComponent(redirectTo)}`)
  }

  return { user }
})

export default component$(() => {
  // Ejecuta el guard (asegura protección SSR y dispone de `user` si se necesita)
  useCrmGuard()

  return (
    // Solo renderizar el contenido - el layout visual viene del AppLayout global
    <Slot />
  )
})
