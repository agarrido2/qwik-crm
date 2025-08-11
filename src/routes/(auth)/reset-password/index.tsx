import { component$, useSignal } from "@builder.io/qwik";
import {type DocumentHead, Form, routeAction$, routeLoader$, zod$ } from "@builder.io/qwik-city";
import { createServerSupabaseClient } from "~/lib/database";
import { authSchemas, validatePasswordMatch } from "~/features/auth/schemas/auth-schemas";
import { withSupabase } from "~/features/auth/services/auth-helpers";

/**
 * Schema de validación para reset password usando schemas centralizados
 */
const resetPasswordSchema = zod$(authSchemas.resetPassword);

/**
 * routeLoader$ = Verificar si hay sesión válida para reset de contraseña
 * - Usa getUser() para verificación segura
 * - Redirige al login si no hay usuario válido
 */
export const useResetSession = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent);
  
  // ✅ SEGURO: getUser() verifica autenticidad con servidor Auth
  const { data: { user } } = await supabase.auth.getUser();
  
  return {
    hasValidUser: !!user,
  };
});

/**
 * routeAction$ = Server action para actualizar la contraseña (REFACTORIZADO)
 * - Usa helper validatePasswordMatch para consistencia
 * - Usa withSupabase para eliminar boilerplate
 * - Manejo de errores mejorado
 */
export const useResetPasswordAction = routeAction$(async (data, requestEvent) => {
  try {
    // Validación usando helper centralizado
    validatePasswordMatch(data.password, data.confirmPassword);
    
    // Usar helper para manejar Supabase
    const result = await withSupabase(async (supabase) => {
      return await supabase.auth.updateUser({
        password: data.password
      });
    })(requestEvent);
    
    if (result.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Redirigir al dashboard después de reset exitoso
    throw requestEvent.redirect(302, "/");
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar contraseña",
    };
  }
}, resetPasswordSchema);

/**
 * Página de Reset Password = Cambio de contraseña con token
 * - Accesible solo con link válido de recuperación
 * - Formulario para nueva contraseña
 * - Integración completa con Supabase Auth
 */
export default component$(() => {
  const resetSession = useResetSession();
  const resetPasswordAction = useResetPasswordAction();
  const isSubmitting = useSignal(false);
  const showPassword = useSignal(false);

  // Si no hay usuario válido, mostrar mensaje de error
  if (!resetSession.value.hasValidUser) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Enlace Inválido o Expirado
          </h2>
          <p class="text-gray-600 mb-4">
            El enlace de recuperación no es válido o ha expirado.
          </p>
          <a
            href="/forgot-password"
            class="text-indigo-600 hover:text-indigo-500"
          >
            Solicitar nuevo enlace de recuperación
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Restablecer Contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* 
          Form = Formulario para nueva contraseña
          - Validación de confirmación de password
          - Progressive enhancement con Qwik
        */}
        <Form
          action={resetPasswordAction}
          class="mt-8 space-y-6"
          onSubmitCompleted$={() => {
            isSubmitting.value = false;
          }}
          onSubmit$={() => {
            isSubmitting.value = true;
          }}
        >
          <div class="space-y-4">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword.value ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick$={() => showPassword.value = !showPassword.value}
                >
                  {showPassword.value ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.value ? "text" : "password"}
                autoComplete="new-password"
                required
                class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>
          </div>

          {/* 
            Error Display = Mostrar errores de validación o servidor
            - Feedback claro para el usuario
          */}
          {resetPasswordAction.value?.error && (
            <div class="rounded-md bg-red-50 p-4">
              <div class="text-sm text-red-700">
                {typeof resetPasswordAction.value.error === 'string' 
                  ? resetPasswordAction.value.error 
                  : resetPasswordAction.value.error.message || 'Error al procesar la solicitud'}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting.value}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting.value ? "Actualizando..." : "Restablecer Contraseña"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
});
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
