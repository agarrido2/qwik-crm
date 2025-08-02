import { component$ } from '@builder.io/qwik'
import { Form, routeAction$, Link, z, zod$, type DocumentHead } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase'


// Server Action para registro usando routeAction$ con validación zod$
export const useRegisterAction = routeAction$(async (values, requestEvent) => {
  // Validación personalizada de contraseñas
  if (values.password !== values.confirmPassword) {
    return requestEvent.fail(400, {
      fieldErrors: {
        confirmPassword: ['Las contraseñas no coinciden']
      },
      formErrors: []
    })
  }

  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })
    
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message]
      })
    }
    
    // Registro exitoso
    return {
      success: true,
      message: 'Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.'
    }
  } catch (error) {
    console.error('Error en registro:', error)
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor']
    })
  }
}, zod$({
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}))

export default component$(() => {
  const registerAction = useRegisterAction();
  
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h2>
         
        </div>
        
        <Form action={registerAction} class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Dirección de email"
                value={registerAction.formData?.get('email') as string}
              />
              {registerAction.value?.fieldErrors && 'email' in registerAction.value.fieldErrors && (
                <p class="mt-1 text-sm text-red-600">
                  {registerAction.value.fieldErrors.email}
                </p>
              )}
            </div>
            <div>
              <label for="password" class="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={registerAction.formData?.get('password') as string}
              />
              {registerAction.value?.fieldErrors && 'password' in registerAction.value.fieldErrors && (
                <p class="mt-1 text-sm text-red-600">
                  {registerAction.value.fieldErrors.password}
                </p>
              )}
            </div>
            <div>
              <label for="confirmPassword" class="sr-only">
                Confirmar Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar Password"
                value={registerAction.formData?.get('confirmPassword') as string}
              />
              {registerAction.value?.fieldErrors && 'confirmPassword' in registerAction.value.fieldErrors && (
                <p class="mt-1 text-sm text-red-600">
                  {registerAction.value.fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {registerAction.value?.formErrors && registerAction.value.formErrors.length > 0 && (
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div class="mt-2 text-sm text-red-700">
                    {registerAction.value.formErrors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {registerAction.value?.success && (
            <div class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    ¡Éxito!
                  </h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>{registerAction.value.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={registerAction.isRunning}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerAction.isRunning ? (
                <span class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>

          <div class="flex items-center justify-between text-sm">
            <Link
              href="/login"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              ¿Ya tienes cuenta? Inicia sesión
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
  );
});

export const head: DocumentHead = {
  title: 'Registro - CRM',
  meta: [
    {
      name: 'description',
      content: 'Crea una nueva cuenta en el CRM',
    },
  ],
};

