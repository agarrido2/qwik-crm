import { createServerClient } from 'supabase-auth-helpers-qwik';
import type { RequestEventBase } from '@builder.io/qwik-city';

/**
 * IMPORTANTE: Esta implementación usa valores de dummy temporalmente
 * Recomendación: Migrar a @supabase/ssr que es la biblioteca oficial actual
 * La biblioteca supabase-auth-helpers-qwik está deprecada
 */

/**
 * Crea un cliente Supabase para autenticación en el servidor
 * Solución temporal mientras se migra a @supabase/ssr
 * 
 * @param event Evento de QwikCity
 * @param mockUrl URL de Supabase para pruebas (opcional)
 * @param mockKey Clave anónima de Supabase para pruebas (opcional)
 */
export function getAuthServerClient(
  event: RequestEventBase, 
  mockUrl: string = 'https://xyzcompany.supabase.co', 
  mockKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key'
) {
  // Usamos los valores de mock para desarrollo mientras se implementa la solución final
  // IMPORTANTE: Estos valores dummy solo permiten iniciar la aplicación, pero no harán peticiones reales a Supabase

  try {
    return createServerClient(
      mockUrl,
      mockKey,
      {
        request: event.request,
        // @ts-expect-error - El objeto event contiene los métodos necesarios en runtime
        response: event,
      }
    );
  } catch (error) {
    console.error('Error al crear cliente Supabase:', error);
    throw new Error('No se pudo inicializar la autenticación con Supabase');
  }
}

/**
 * Mapeo de mensajes de error comunes de Supabase a mensajes más amigables
 */
export const AUTH_ERROR_MESSAGES = {
  'Invalid login credentials': 'Credenciales inválidas. Por favor verifica tu email y contraseña.',
  'Email not confirmed': 'Tu email no ha sido confirmado. Por favor revisa tu bandeja de entrada.',
  'User not found': 'Usuario no encontrado. ¿Quizás deberías registrarte?',
  'Password recovery required': 'Debes restablecer tu contraseña antes de iniciar sesión.',
  // Más mensajes según necesidad...
  'default': 'Ocurrió un error de autenticación. Por favor intenta de nuevo.'
};

/**
 * Formatea errores de autenticación para presentarlos al usuario
 */
export function getAuthErrorMessage(errorMessage: string | undefined): string {
  if (!errorMessage) return '';
  return AUTH_ERROR_MESSAGES[errorMessage as keyof typeof AUTH_ERROR_MESSAGES] || AUTH_ERROR_MESSAGES.default;
}
