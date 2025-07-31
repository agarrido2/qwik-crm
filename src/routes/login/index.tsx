import { component$, useSignal, $, useStylesScoped$ } from '@builder.io/qwik';
import { Form, routeAction$, zod$, z, routeLoader$, DocumentHead } from '@builder.io/qwik-city';
import { createSupabaseServerClient, getAuthErrorMessage, supabase } from '~/lib/supabase';

// Validación del formulario con Zod
const loginSchema = z.object({
  email: z.string().email('Introduce un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
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

// Action para procesar el login
export const useLoginAction = routeAction$(
  async (form, event) => {
    // Usamos la utilidad centralizada para crear el cliente
    const supabaseClient = createSupabaseServerClient(event);
    
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
        friendlyError: getAuthErrorMessage(error.message)
      };
    }
    
    // Login exitoso
    return {
      success: true,
    };
  },
  zod$(loginSchema)
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
  const action = useLoginAction();
  const errorSignal = useSignal<string>('');
  const isLoading = useSignal<boolean>(false);

  // Método para login mágico (passwordless)
  const handleMagicLink = $(async (email: string) => {
    if (!email || !email.includes('@')) {
      errorSignal.value = 'Introduce un email válido';
      return;
    }
    
    isLoading.value = true;
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + '/auth/callback' },
      });
      
      if (error) {
        const errorMessage = getAuthErrorMessage(error.message);
        errorSignal.value = errorMessage;
      } else {
        errorSignal.value = '';
        // Mostrar mensaje de éxito
        alert('Revisa tu correo para iniciar sesión');
      }
      
    } catch (error) {
      // Capturamos error genérico
      errorSignal.value = 'Error al enviar el enlace de inicio de sesión';
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="auth-page">
      <div class="auth-card">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold">Iniciar Sesión</h2>
          <p class="text-gray-600 mt-2">Accede a tu cuenta CRM</p>
        </div>
        
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
              autocomplete="current-password"
              required
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {action.value?.fieldErrors?.password && (
              <p class="mt-1 text-sm text-red-600">{action.value.fieldErrors.password[0]}</p>
            )}
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <a href="/reset-password" class="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {action.value?.error && (
            <div class="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {action.value.friendlyError || action.value.error}
            </div>
          )}
          
          {errorSignal.value && (
            <div class="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {errorSignal.value}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={action.isRunning || isLoading.value}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {action.isRunning ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </Form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <div class="mt-6 grid gap-3">
            <button
              onClick$={async () => {
                const email = (document.getElementById('email') as HTMLInputElement).value;
                await handleMagicLink(email);
              }}
              disabled={isLoading.value}
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              {isLoading.value ? 'Enviando enlace...' : 'Enlace mágico (sin contraseña)'}
            </button>
          </div>
        </div>
        
        <p class="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <a href="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Iniciar Sesión | CRM',
  meta: [
    {
      name: 'description',
      content: 'Accede a tu cuenta CRM para gestionar clientes, oportunidades y más',
    },
    {
      name: 'og:title',
      content: 'Iniciar Sesión | CRM',
    },
  ],
};
