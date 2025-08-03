import { component$, useSignal, useTask$ } from '@builder.io/qwik'
import { type DocumentHead, routeAction$, Form, z, zod$, Link } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase'


/**
 * Server Action - SE EJECUTA SOLO EN EL SERVIDOR
 * routeAction$ = Función que maneja form submissions en el servidor
 * zod$ = Validación de esquemas que ocurre antes de ejecutar la función
 */
export const useLoginAction = routeAction$(async (values, requestEvent) => {
  // IMPORTANTE: Pasar requestEvent completo para manejo correcto de cookies
  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    // Llamada a Supabase para autenticar - esto ocurre en el servidor
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    
    if (error) {
      // requestEvent.fail() = Retorna error 400 con datos estructurados
      // timestamp = Fuerza re-render del formulario para limpiar estado
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message],
        timestamp: Date.now() // ✨ Clave para resetear formulario
      })
    }
    
    // throw redirect = ÚNICA manera de redirigir desde server action
    // 302 = Redirect temporal (usuario autenticado exitosamente)
    throw requestEvent.redirect(302, '/')
  } catch (error) {
    // Si es una Response (redirect), re-lanzarla
    if (error instanceof Response) {
      throw error
    }
    // Error genérico del servidor
    if (error instanceof Error) {
      return requestEvent.fail(500, {
        fieldErrors: {},
        formErrors: ['Error interno del servidor'],
        timestamp: Date.now()
      })
    }
    throw error
  }
}, zod$({
  // zod$ = Validación que ocurre ANTES de ejecutar la función
  // Si falla validación, nunca se ejecuta la función principal
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}))

export default component$(() => {
  // useLoginAction = Acceso al server action desde el componente
  const loginAction = useLoginAction()
  
  // useSignal = Estado reactivo (como useState en React)
  // Cambia cuando hay errores para forzar re-render del Form
  const formKey = useSignal(Date.now())
  
  /**
   * useTask$ = Hook reactivo que se ejecuta en servidor Y cliente
   * ✅ Más eficiente que useVisibleTask$ para este caso
   * ✅ No necesita esperar hidratación del cliente
   * track() = Escucha cambios en valores específicos (reactividad)
   */
  useTask$(({ track }) => {
    // track() convierte loginAction.value en una dependencia reactiva
    track(() => loginAction.value)
    
    // Cuando hay errores, regenerar key del formulario
    // Esto fuerza a Qwik a crear un nuevo Form component (limpia estado)
    if (loginAction.value?.formErrors || loginAction.value?.fieldErrors) {
      formKey.value = Date.now() // ✨ Nuevo timestamp = nuevo Form
    }
  })
  
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Wellcome back to CRM 👋
          </h2>
        <h3 class="font-semibold text-lg">Please sign in to continue</h3>
        </div>
        
        {/* 
          Form de Qwik = Progressive Enhancement
          - Funciona sin JavaScript (server-side form submission)
          - Con JS, se convierte en AJAX submission
          - action={loginAction} conecta con el server action
          - key={formKey.value} fuerza recrear componente cuando cambia
        */}
        <Form action={loginAction} class="mt-8 space-y-6" key={formKey.value}>
          <div class="shadow-sm border border-gray-300 rounded-lg p-5 lg:p-7 flex flex-col gap-4">
            <div>
              <label for="email" class="sr-only">
                Email
              </label>
              {/* 
                Input SIN value prop = No mantiene estado entre submissions
                name="email" = Se mapea automáticamente con zod$ schema
                autoComplete = Mejora UX del browser
              */}
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                class={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  loginAction.value?.fieldErrors && 'email' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.email?.length ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="email@email.com"
              />
              {/* Mostrar errores de campo específicos (validación zod$) */}
              {loginAction.value?.fieldErrors && 'email' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.email && (
                <p class="mt-1 text-sm text-red-600">
                  {loginAction.value.fieldErrors.email[0]}
                </p>
              )}
            </div>
            <div>
              <label for="password" class="sr-only">
                Password
              </label>
              {/* Password input sin value = Seguridad y UX mejorados */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                class={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  loginAction.value?.fieldErrors && 'password' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.password?.length ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your-password here"
              />
              {loginAction.value?.fieldErrors && 'password' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.password && (
                <p class="mt-1 text-sm text-red-600">
                  {loginAction.value.fieldErrors.password[0]}
                </p>
              )}
            </div>
          </div>

          {/* 
            formErrors = Errores globales del servidor (ej: credenciales inválidas)
            fieldErrors = Errores específicos de campos (ej: email mal formateado)
          */}
          {loginAction.value?.formErrors && (
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    Error de autenticación
                  </h3>
                  <div class="mt-2 text-sm text-red-700">
                    {loginAction.value.formErrors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            {/* 
              loginAction.isRunning = Estado automático de Qwik
              - true mientras el server action se ejecuta
              - false cuando termina (exitoso o error)
              disabled previene múltiples submissions
            */}
            <button
              type="submit"
              disabled={loginAction.isRunning}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Conditional rendering basado en estado del action */}
              {loginAction.isRunning ? (
                <span class="flex items-center">
                  {/* Loading spinner - solo se muestra durante submission */}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>

          <div class="flex items-center justify-between text-sm">
            <Link
              href="/register"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
            <Link
              href="/forgot-password"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
})

/**
 * DocumentHead = SEO y metadatos para esta página
 * Se ejecuta en el servidor y cliente
 * Equivalente a <Head> en Next.js
 */
export const head: DocumentHead = {
  title: 'Login - CRM',
  meta: [
    {
      name: 'description',
      content: 'Inicia sesión en el CRM',
    },
  ],
}
