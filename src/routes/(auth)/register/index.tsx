import { component$, useSignal, useTask$ } from '@builder.io/qwik'
import { Form, routeAction$, Link, zod$, type DocumentHead } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/database'
import { authSchemas } from '~/features/auth'


/**
 * Server Action - SE EJECUTA SOLO EN EL SERVIDOR
 * routeAction$ = Función que maneja form submissions en el servidor
 * zod$ = Validación de esquemas que ocurre antes de ejecutar la función
 */
export const useRegisterAction = routeAction$(async (values, requestEvent) => {
  // Validación personalizada de contraseñas
  if (values.password !== values.confirmPassword) {
    return requestEvent.fail(400, {
      fieldErrors: {
        confirmPassword: ['Las contraseñas no coinciden']
      },
      formErrors: [],
      timestamp: Date.now() // ✨ Clave para resetear formulario
    })
  }

  // IMPORTANTE: Pasar requestEvent completo para manejo correcto de cookies
  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    // Extraer y limpiar el nombre del usuario
    const name = (values as any).name?.toString().trim() || ''
    
    // Llamada a Supabase para registrar - esto ocurre en el servidor
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: name ? { name } : undefined, // Guardar nombre en metadatos
      }
    })
    
    // Si hay un error explícito de Supabase, mostrarlo
    if (error) {
      // requestEvent.fail() = Retorna error 400 con datos estructurados
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message],
        timestamp: Date.now() // ✨ Fuerza re-render del formulario
      })
    }
    
    // Verificar si el usuario ya existe (Supabase devuelve user pero con identities vacío)
    if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
      return requestEvent.fail(400, {
        fieldErrors: {
          email: ['Este email ya está registrado']
        },
        formErrors: ['El email ya está en uso. Intenta iniciar sesión o recuperar tu contraseña.'],
        timestamp: Date.now()
      })
    }
    
    // Registro exitoso - mostrar mensaje de confirmación
    return {
      success: true,
      message: 'Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.'
    }
  } catch (error) {
    console.error('Error en registro:', error)
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor'],
      timestamp: Date.now()
    })
  }
}, zod$({
  ...authSchemas.register, // Esquema centralizado con validación de name, email, password y confirmPassword
}))

export default component$(() => {
  // useRegisterAction = Acceso al server action desde el componente
  const registerAction = useRegisterAction()
  
  // useSignal = Estado reactivo (como useState en React)
  // Cambia cuando hay errores para forzar re-render del Form
  const formKey = useSignal(Date.now())
  const showPassword = useSignal(false)
  const showConfirmPassword = useSignal(false)

  /**
   * useTask$ = Hook reactivo que se ejecuta en servidor Y cliente
   * ✅ Más eficiente que useVisibleTask$ para este caso
   * ✅ No necesita esperar hidratación del cliente
   * track() = Escucha cambios en valores específicos (reactividad)
   */
  useTask$(({ track }) => {
    // track() convierte registerAction.value en una dependencia reactiva
    track(() => registerAction.value)
    
    // Cuando hay errores, regenerar key del formulario
    // Esto fuerza a Qwik a crear un nuevo Form component (limpia estado)
    if (registerAction.value?.formErrors || registerAction.value?.fieldErrors) {
      formKey.value = Date.now() // ✨ Nuevo timestamp = nuevo Form
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

          {/* Right register card */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10">
            <h2 class="text-2xl font-semibold text-center text-gray-900">Create Account</h2>
            <p class="mt-1 text-center text-sm text-gray-500">Free access to our dashboard.</p>

            {/* Google button (no funcionalidad) */}
            <div class="mt-6 flex justify-center">
              <button type="button" class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-4 w-4"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.158,7.961,3.039l5.657-5.657C33.64,6.053,29.083,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.158,7.961,3.039l5.657-5.657C33.64,6.053,29.083,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.155,35.091,26.715,36,24,36c-5.202,0-9.619-3.326-11.283-7.955l-6.532,5.025C9.568,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.237-2.231,4.215-4.103,5.683c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C35.851,40.355,44,34.5,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                Sign up with Google
              </button>
            </div>

            {/* Divider */}
            <div class="my-6">
              <div class="flex items-center gap-4">
                <div class="h-px flex-1 bg-gray-200" />
                <span class="text-xs text-gray-400">OR</span>
                <div class="h-px flex-1 bg-gray-200" />
              </div>
            </div>

            {/* Form */}
            <Form action={registerAction} key={formKey.value} class="space-y-5">
              <div class="space-y-5">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    class={`mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      registerAction.value?.fieldErrors && 'name' in (registerAction.value.fieldErrors as any) ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                    value={registerAction.formData?.get('name') as string}
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    class={`mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      registerAction.value?.fieldErrors && 'email' in registerAction.value.fieldErrors ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="name@example.com"
                    value={registerAction.formData?.get('email') as string}
                  />
                  {registerAction.value?.fieldErrors && 'email' in registerAction.value.fieldErrors && (
                    <p class="mt-1 text-sm text-red-600">{(registerAction.value.fieldErrors as any).email?.[0] ?? (registerAction.value.fieldErrors as any).email}</p>
                  )}
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <div class="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword.value ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      class={`block w-full rounded-md border px-3 py-2 pr-10 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        registerAction.value?.fieldErrors && 'password' in registerAction.value.fieldErrors ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Create a password"
                      value={registerAction.formData?.get('password') as string}
                    />
                    <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600" onClick$={() => (showPassword.value = !showPassword.value)} aria-label="Toggle password visibility">
                      {showPassword.value ? (
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.94 4.94a.75.75 0 011.06 0l10.06 10.06a.75.75 0 11-1.06 1.06l-1.821-1.822A8.967 8.967 0 0110 16c-4.478 0-8.268-2.943-9.542-7a9.05 9.05 0 012.92-4.295L3.94 4.94zm6.8 6.8l-1.48-1.48a2 2 0 002.12-2.12l1.48 1.48a4 4 0 01-2.12 2.12z"/><path d="M10 4c4.478 0 8.268 2.943 9.542 7a9.05 9.05 0 01-3.25 4.485l-1.086-1.086A7.466 7.466 0 0017.94 11C16.732 8.067 13.627 6 10 6a7.466 7.466 0 00-3.148.663L5.478 5.29A8.965 8.965 0 0110 4z"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 4c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7C1.732 6.943 5.522 4 10 4zm0 3a4 4 0 100 8 4 4 0 000-8z"/></svg>
                      )}
                    </button>
                  </div>
                  {registerAction.value?.fieldErrors && 'password' in registerAction.value.fieldErrors && (
                    <p class="mt-1 text-sm text-red-600">{(registerAction.value.fieldErrors as any).password?.[0] ?? (registerAction.value.fieldErrors as any).password}</p>
                  )}
                </div>

                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div class="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword.value ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      class={`block w-full rounded-md border px-3 py-2 pr-10 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        registerAction.value?.fieldErrors && 'confirmPassword' in registerAction.value.fieldErrors ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Repeat the password"
                      value={registerAction.formData?.get('confirmPassword') as string}
                    />
                    <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600" onClick$={() => (showConfirmPassword.value = !showConfirmPassword.value)} aria-label="Toggle confirm password visibility">
                      {showConfirmPassword.value ? (
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.94 4.94a.75.75 0 011.06 0l10.06 10.06a.75.75 0 11-1.06 1.06l-1.821-1.822A8.967 8.967 0 0110 16c-4.478 0-8.268-2.943-9.542-7a9.05 9.05 0 012.92-4.295L3.94 4.94zm6.8 6.8l-1.48-1.48a2 2 0 002.12-2.12l1.48 1.48a4 4 0 01-2.12 2.12z"/><path d="M10 4c4.478 0 8.268 2.943 9.542 7a9.05 9.05 0 01-3.25 4.485l-1.086-1.086A7.466 7.466 0 0017.94 11C16.732 8.067 13.627 6 10 6a7.466 7.466 0 00-3.148.663L5.478 5.29A8.965 8.965 0 0110 4z"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 4c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7C1.732 6.943 5.522 4 10 4zm0 3a4 4 0 100 8 4 4 0 000-8z"/></svg>
                      )}
                    </button>
                  </div>
                  {registerAction.value?.fieldErrors && 'confirmPassword' in registerAction.value.fieldErrors && (
                    <p class="mt-1 text-sm text-red-600">{(registerAction.value.fieldErrors as any).confirmPassword?.[0] ?? (registerAction.value.fieldErrors as any).confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Global errors */}
              {registerAction.value?.formErrors && (
                <div class="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                  {registerAction.value.formErrors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}

              {registerAction.value?.success && (
                <div class="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
                  <p>{registerAction.value.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={registerAction.isRunning}
                class="w-full rounded-md bg-gray-700 hover:bg-gray-800 text-white py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerAction.isRunning ? 'Creating account…' : 'CREATE ACCOUNT'}
              </button>

              <p class="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" class="text-blue-600 hover:text-blue-500">Sign in here</Link>
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
  title: 'Register - Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Crea una cuenta en el dashboard',
    },
  ],
}

