import { component$, useSignal } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$, zod$ } from "@builder.io/qwik-city";
import { createServerSupabaseClient } from "~/lib/supabase";
import { authSchemas } from "~/lib/auth-schemas";
import { withSupabase } from "~/lib/auth-helpers";

/**
 * routeLoader$ = Verificar si usuario ya está autenticado
 * - Se ejecuta en el servidor ANTES del render
 * - Evita el flash de contenido al redirigir usuarios autenticados
 */
export const useAuthCheck = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent);
  const { data: { session } } = await supabase.auth.getSession();
  
  // Si ya está autenticado, redirigir al dashboard
  if (session) {
    throw requestEvent.redirect(302, "/");
  }
  
  return { hasSession: !!session };
});

/**
 * Schema de validación usando schemas centralizados
 */
const forgotPasswordSchema = zod$(authSchemas.forgotPassword);

/**
 * routeAction$ = Server action para enviar email de recuperación (REFACTORIZADO)
 * - Usa withSupabase helper para eliminar boilerplate
 * - Manejo de errores consistente
 * - Supabase maneja el envío del email automáticamente
 */
export const useForgotPasswordAction = routeAction$(async (data, requestEvent) => {
  try {
    // Usar helper para manejar Supabase
    const result = await withSupabase(async (supabase) => {
      return await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${requestEvent.url.origin}/reset-password`,
      });
    })(requestEvent);

    if (result.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      message: "Se ha enviado un email de recuperación a tu dirección de correo",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al enviar email de recuperación",
    };
  }
}, forgotPasswordSchema);

/**
 * Página de Forgot Password = Recuperación de contraseña
 * - Formulario con email únicamente
 * - Server action integrado con Supabase
 * - Feedback visual para el usuario
 */
export default component$(() => {
    // Esta función se ejecuta en el servidor para verificar si el usuario ya está autenticado
  useAuthCheck(); // Server-side auth verification (auto-redirige si está autenticado)
  const forgotPasswordAction = useForgotPasswordAction();
  const isSubmitting = useSignal(false);

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar Contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* 
          Form = Componente de Qwik con progressive enhancement
          - key con timestamp para reset automático después de submit exitoso
          - Conectado con routeAction$ mediante action prop
        */}
        <Form
          action={forgotPasswordAction}
          class="mt-8 space-y-6"
          onSubmitCompleted$={() => {
            isSubmitting.value = false;
          }}
          onSubmit$={() => {
            isSubmitting.value = true;
          }}
        >
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
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Dirección de email"
            />
          </div>

          {/* 
            Feedback Messages = Estados de éxito y error
            - Renderizado condicional basado en el resultado del action
            - UX clara para informar al usuario del estado
          */}
          {forgotPasswordAction.value?.success && (
            <div class="rounded-md bg-green-50 p-4">
              <div class="text-sm text-green-700">
                {forgotPasswordAction.value.message}
              </div>
            </div>
          )}

          {forgotPasswordAction.value?.error && (
            <div class="rounded-md bg-red-50 p-4">
              <div class="text-sm text-red-700">
                {typeof forgotPasswordAction.value.error === 'string' 
                  ? forgotPasswordAction.value.error 
                  : forgotPasswordAction.value.error.message || 'Error al procesar la solicitud'}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting.value}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting.value ? "Enviando..." : "Enviar Email de Recuperación"}
            </button>
          </div>

          <div class="text-center">
            <a
              href="/login"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Volver al Login
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
});
