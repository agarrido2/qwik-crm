import { component$, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import { Form, routeAction$, zod$, z, routeLoader$, DocumentHead } from '@builder.io/qwik-city';
import { createSupabaseServerClient, getAuthErrorMessage } from '~/lib/supabase';

// Validación del formulario con Zod
const signupSchema = z.object({
  email: z.string().email('Introduce un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

// Verificar si el usuario ya está autenticado
export const useRedirectIfLoggedIn = routeLoader$(async (event) => {
  const supabaseClient = createSupabaseServerClient(event);
  
  const { data } = await supabaseClient.auth.getSession();
  
  if (data.session) {
    // Si ya hay sesión, redirigir al dashboard
    throw event.redirect(302, '/');
  }
  
  return null;
});

// Action para procesar el registro
export const useSignupAction = routeAction$(
  async (form, event) => {
    // Usamos la utilidad centralizada para crear el cliente
    const supabaseClient = createSupabaseServerClient(event);
    
    const { error } = await supabaseClient.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        // Opcional: redirigir a la página principal tras confirmar el email
        emailRedirectTo: `${event.url.origin}/auth/callback`,
      }
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
        friendlyError: getAuthErrorMessage(error.message)
      };
    }
    
    // Registro exitoso
    return {
      success: true,
    };
  },
  zod$(signupSchema)
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
  
  const action = useSignupAction();
  const successMessage = useSignal<string>('');

  return (
    <div class="auth-page">
      <div class="auth-card">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold">Crear cuenta</h2>
          <p class="text-gray-600 mt-2">Regístrate para acceder al CRM</p>
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
              Ir a iniciar sesión
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

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {action.value?.fieldErrors?.password && (
                <p class="mt-1 text-sm text-red-600">{action.value.fieldErrors.password[0]}</p>
              )}
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {action.value?.fieldErrors?.confirmPassword && (
                <p class="mt-1 text-sm text-red-600">{action.value.fieldErrors.confirmPassword[0]}</p>
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
                {action.isRunning ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>

            <p class="text-center text-sm text-gray-600">
              Al registrarte aceptas nuestros <a href="/terminos" class="text-indigo-600 hover:text-indigo-500">términos y condiciones</a>
            </p>
          </Form>
        )}
        
        <p class="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Crear cuenta | CRM',
  meta: [
    {
      name: 'description',
      content: 'Regístrate para acceder a tu cuenta CRM y gestionar clientes, oportunidades y más',
    },
    {
      name: 'og:title',
      content: 'Crear cuenta | CRM',
    },
  ],
};
