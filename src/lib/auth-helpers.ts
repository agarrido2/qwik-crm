import type { RequestEventAction } from "@builder.io/qwik-city";
import { createServerSupabaseClient } from "./supabase";

/**
 * withSupabase = Helper que wrappea server actions con cliente Supabase
 * - Elimina boilerplate de crear cliente en cada action
 * - Manejo consistente de errores
 * - Tipado automático mejorado
 */
export const withSupabase = <T extends any[], R>(
  handler: (supabase: ReturnType<typeof createServerSupabaseClient>, ...args: T) => Promise<R>
) => {
  return async (requestEvent: RequestEventAction, ...args: T): Promise<R> => {
    const supabase = createServerSupabaseClient(requestEvent);
    return await handler(supabase, ...args);
  };
};

/**
 * createAuthAction = Factory para crear auth actions estandarizadas
 * - Manejo consistente de errores de autenticación
 * - Formato de respuesta uniforme
 * - Logging automático (futuro)
 */
export const createAuthAction = <TData, TResult>(
  handler: (supabase: ReturnType<typeof createServerSupabaseClient>, data: TData) => Promise<TResult>
) => {
  return withSupabase(async (supabase, data: TData) => {
    try {
      const result = await handler(supabase, data);
      
      // Si el resultado tiene error (patrón Supabase)
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        return {
          success: false,
          error: (result.error as any).message || 'Error de autenticación',
        };
      }
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Auth action error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      };
    }
  });
};
