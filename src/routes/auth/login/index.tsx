import { component$, useStore, $ } from '@builder.io/qwik';
import { useNavigate, type DocumentHead } from '@builder.io/qwik-city';
import { supabase } from '../../../lib/supabase';

export default component$(() => {
  const nav = useNavigate();
  
  const formState = useStore({
    email: '',
    password: '',
    confirmPassword: '',
    isRegister: false,
    loading: false,
    error: '',
  });

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    formState.loading = true;
    formState.error = '';
    
    try {
      if (formState.isRegister) {
        if (formState.password !== formState.confirmPassword) {
          formState.error = 'Las contraseñas no coinciden';
          return;
        }
        
        const { error } = await supabase.auth.signUp({
          email: formState.email,
          password: formState.password,
        });
        
        if (error) {
          formState.error = error.message;
        } else {
          formState.error = 'Revisa tu email para confirmar la cuenta';
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formState.email,
          password: formState.password,
        });
        
        if (error) {
          formState.error = error.message;
        } else {
          nav('/');
        }
      }
    } catch (error) {
      formState.error = error instanceof Error ? error.message : 'Error inesperado';
    } finally {
      formState.loading = false;
    }
  });

  const toggleMode = $(() => {
    formState.isRegister = !formState.isRegister;
    formState.error = '';
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {formState.isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {formState.isRegister ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            <button
              type="button"
              onClick$={toggleMode}
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              {formState.isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
        
        <form class="mt-8 space-y-6" onSubmit$={handleSubmit} preventdefault:submit>
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
                value={formState.email}
                onInput$={(e) => {
                  formState.email = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
            <div>
              <label for="password" class="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={formState.isRegister ? 'new-password' : 'current-password'}
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formState.password}
                onInput$={(e) => {
                  formState.password = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
            {formState.isRegister && (
              <div>
                <label for="confirmPassword" class="sr-only">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmar contraseña"
                  value={formState.confirmPassword}
                  onInput$={(e) => {
                    formState.confirmPassword = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            )}
          </div>

          {formState.error && (
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    {formState.isRegister && formState.error.includes('email') ? 'Información' : 'Error'}
                  </h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{formState.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={formState.loading}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState.loading ? (
                <span class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                formState.isRegister ? 'Crear cuenta' : 'Iniciar sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Autenticación - CRM',
  meta: [
    {
      name: 'description',
      content: 'Inicia sesión o regístrate en el CRM',
    },
  ],
};
