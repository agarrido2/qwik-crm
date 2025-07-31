import { component$, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import { Form, routeAction$, zod$, z, DocumentHead } from '@builder.io/qwik-city';
import { supabase, getAuthErrorMessage } from '~/lib/supabase';

// Validación del formulario con Zod
const resetPasswordSchema = z.object({
  email: z.string().email('Introduce un email válido'),
});

// Action para procesar la solicitud de recuperación
export const useResetPasswordAction = routeAction$(
  async (form) => {
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: window.location.origin + '/update-password',
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
        friendlyError: getAuthErrorMessage(error.message)
      };
    }
    
    // Solicitud exitosa
    return {
      success: true,
    };
  },
  zod$(resetPasswordSchema)
);

export default component$(() => {
  // Estilos específicos para las páginas de autenticación
  useStylesScoped$(`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
    }
    
    .auth-card {
      width: 100%;
      max-width: 450px;
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
  `);
  
  const action = useResetPasswordAction();
  const successMessage = useSignal<string>('');

  // Si la acción fue exitosa, mostrar mensaje
  if (action.value?.success && !successMessage.value) {
    successMessage.value = 'Te hemos enviado un correo con las instrucciones para restablecer tu contraseña.';
  }

  return (
    <div class="auth-page">
      <div class="auth-card">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold">Recuperar contraseña</h2>
          <p class="text-gray-600 mt-2">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>
        
        {successMessage.value ? (
          <div class="text-center">
            <div class="p-4 bg-green-50 border border-green-200 rounded text-green-600 mb-4">
              {successMessage.value}
            </div>
            <a 
              href="/login" 
              class="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Volver al login
            </a>
          </div>
        ) : (
          <Form action={action} class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {action.value?.fieldErrors?.email && (
                <p class="mt-1 text-sm text-red-600">{action.value.fieldErrors.email[0]}</p>
              )}
            </div>

            {action.value?.error && (
              <div class="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {action.value.friendlyError || action.value.error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={action.isRunning}
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {action.isRunning ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </div>
          </Form>
        )}
        
        <p class="mt-6 text-center text-sm text-gray-600">
          ¿Recuerdas tu contraseña?{' '}
          <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Recuperar contraseña | CRM',
  meta: [
    {
      name: 'description',
      content: 'Recupera el acceso a tu cuenta CRM restableciendo tu contraseña',
    },
    {
      name: 'og:title',
      content: 'Recuperar contraseña | CRM',
    },
  ],
};
