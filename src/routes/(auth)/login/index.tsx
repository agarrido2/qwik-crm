import { component$, useSignal, useTask$ } from '@builder.io/qwik'
import { type DocumentHead, routeAction$, Form, zod$, Link } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/database'
import { authSchemas } from '~/features/auth'


/**
 * Server Action para Google OAuth - SE EJECUTA SOLO EN EL SERVIDOR
 * Maneja la redirección a Google OAuth sin necesidad de formulario
 */
export const useGoogleLoginAction = routeAction$(async (_, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    // Configurar la URL de redirección tras el login exitoso
    const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard'
    const baseUrl = `${requestEvent.url.protocol}//${requestEvent.url.host}`
    
    // Iniciar flujo OAuth con Google
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}${redirectTo}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google OAuth error:', error.message)
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message],
        timestamp: Date.now()
      })
    }

    // Redirigir a Google OAuth
    if (data.url) {
      throw requestEvent.redirect(302, data.url)
    }

    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error al iniciar sesión con Google - No se recibió URL'],
      timestamp: Date.now()
    })
  } catch (error) {
    // Si es una Response (redirect), re-lanzarla
    if (error instanceof Response) {
      throw error
    }
    
    console.error('Google OAuth unexpected error:', error)
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor'],
      timestamp: Date.now()
    })
  }
})

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
    
    // Verificar si hay una URL de redirección en query params
    const redirectTo = requestEvent.url.searchParams.get('redirectTo') || '/dashboard';
    throw requestEvent.redirect(302, redirectTo)
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
  ...authSchemas.login,
}))

export default component$(() => {
  // useLoginAction = Acceso al server action desde el componente
  const loginAction = useLoginAction()
  // useGoogleLoginAction = Acceso al server action de Google OAuth
  const googleLoginAction = useGoogleLoginAction()
  
  // useSignal = Estado reactivo (como useState en React)
  // Cambia cuando hay errores para forzar re-render del Form
  const formKey = useSignal(Date.now())
  const showPassword = useSignal(false)
  
  // useTask$ = Efecto que se ejecuta cuando cambian las dependencias
  // track() = Suscribirse a cambios en loginAction.value
  useTask$(({ track }) => {
    const actionValue = track(() => loginAction.value)
    if (actionValue?.formErrors || actionValue?.fieldErrors) {
      // Cambiar key para forzar re-render del formulario tras error
      formKey.value = Date.now()
    }
  })


  
  return (
    <div class="min-h-screen bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-10 lg:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left marketing panel */}
          <div class="hidden lg:block text-gray-700">
            <div class="mb-10">
              <div class="text-3xl font-semibold tracking-wide">
                <span class="text-gray-900">LU</span><span class="text-red-500">N</span><span class="text-gray-400">O</span>
              </div>
            </div>
            <h1 class="text-3xl font-semibold text-gray-900 mb-6">Build digital products with:</h1>
            <div class="space-y-8">
              <div>
                <h3 class="text-lg font-medium text-gray-900">All-in-one tool</h3>
                <p class="text-sm text-gray-600">Amazing features to make your life easier & work efficient</p>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Easily add & manage your services</h3>
                <p class="text-sm text-gray-600">It brings together your tasks, projects, timelines, files and more</p>
              </div>
            </div>
            <div class="mt-12 flex items-center gap-6 text-sm text-gray-500">
              <a href="#" class="hover:text-gray-700">Home</a>
              <a href="#" class="hover:text-gray-700">About Us</a>
              <a href="#" class="hover:text-gray-700">FAQs</a>
            </div>
            <div class="mt-6 flex items-center gap-4 text-gray-400">
              <span class="sr-only">Twitter</span>
              <span class="sr-only">Facebook</span>
              <span class="sr-only">GitHub</span>
              <span class="sr-only">YouTube</span>
            </div>
          </div>

          {/* Right login card */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10">
            <h2 class="text-2xl font-semibold text-center text-gray-900">Sign In</h2>
            <p class="mt-1 text-center text-sm text-gray-500">Free access to our dashboard.</p>

            {/* Google OAuth Login */}
            <div class="mt-6 flex justify-center">
              <Form action={googleLoginAction}>
                <button 
                  type="submit" 
                  class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={googleLoginAction.isRunning}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-4 w-4">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.158,7.961,3.039l5.657-5.657C33.64,6.053,29.083,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.158,7.961,3.039l5.657-5.657C33.64,6.053,29.083,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.155,35.091,26.715,36,24,36c-5.202,0-9.619-3.326-11.283-7.955l-6.532,5.025C9.568,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.237-2.231,4.215-4.103,5.683c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C35.851,40.355,44,34.5,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  {googleLoginAction.isRunning ? 'Connecting...' : 'Sign in with Google'}
                </button>
              </Form>
            </div>

            {/* Mostrar errores de Google OAuth si los hay */}
            {googleLoginAction.value?.formErrors && (
              <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div class="text-sm text-red-600">
                  {googleLoginAction.value.formErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div class="my-6">
              <div class="flex items-center gap-4">
                <div class="h-px flex-1 bg-gray-200" />
                <span class="text-xs text-gray-400">OR</span>
                <div class="h-px flex-1 bg-gray-200" />
              </div>
            </div>

            {/* Form */}
            <Form action={loginAction} key={formKey.value} class="space-y-5">
              <div class="space-y-5">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    class={`mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      loginAction.value?.fieldErrors && 'email' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.email?.length ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="name@example.com"
                  />
                  {loginAction.value?.fieldErrors && 'email' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.email && (
                    <p class="mt-1 text-sm text-red-600">{loginAction.value.fieldErrors.email[0]}</p>
                  )}
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <div class="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword.value ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      class={`block w-full rounded-md border px-3 py-2 pr-10 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        loginAction.value?.fieldErrors && 'password' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.password?.length ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter the password"
                    />
                    <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600" onClick$={() => (showPassword.value = !showPassword.value)} aria-label="Toggle password visibility">
                      {showPassword.value ? (
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.94 4.94a.75.75 0 011.06 0l10.06 10.06a.75.75 0 11-1.06 1.06l-1.821-1.822A8.967 8.967 0 0110 16c-4.478 0-8.268-2.943-9.542-7a9.05 9.05 0 012.92-4.295L3.94 4.94zm6.8 6.8l-1.48-1.48a2 2 0 002.12-2.12l1.48 1.48a4 4 0 01-2.12 2.12z"/><path d="M10 4c4.478 0 8.268 2.943 9.542 7a9.05 9.05 0 01-3.25 4.485l-1.086-1.086A7.466 7.466 0 0017.94 11C16.732 8.067 13.627 6 10 6a7.466 7.466 0 00-3.148.663L5.478 5.29A8.965 8.965 0 0110 4z"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 4c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7C1.732 6.943 5.522 4 10 4zm0 3a4 4 0 100 8 4 4 0 000-8z"/></svg>
                      )}
                    </button>
                  </div>
                  {loginAction.value?.fieldErrors && 'password' in loginAction.value.fieldErrors && loginAction.value.fieldErrors.password && (
                    <p class="mt-1 text-sm text-red-600">{loginAction.value.fieldErrors.password[0]}</p>
                  )}
                </div>

                <div class="flex items-center justify-between">
                  <label class="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">Forgot Password?</Link>
                </div>
              </div>

              {/* Global errors */}
              {loginAction.value?.formErrors && (
                <div class="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                  {loginAction.value.formErrors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loginAction.isRunning}
                class="w-full rounded-md bg-gray-700 hover:bg-gray-800 text-white py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginAction.isRunning ? 'Signing in…' : 'SIGN IN'}
              </button>

              <p class="text-center text-sm text-gray-600">
                Don’t have an account yet?{' '}
                <Link href="/register" class="text-blue-600 hover:text-blue-500">Sign up here</Link>
              </p>
            </Form>
          </div>
        </div>
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
  title: 'Login - Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Inicia sesión en el dashboard',
    },
  ],
}
