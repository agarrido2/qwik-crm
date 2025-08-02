import { useSignal, useTask$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { createClient } from "./supabase";
import type { User } from "@supabase/supabase-js";

/**
 * useAuth = Custom hook para manejo de estado de autenticación
 * - Estado reactivo del usuario
 * - Listeners de cambios de auth
 * - Métodos para login/logout
 * - Manejo consistente en toda la app
 */
export const useAuth = () => {
  const user = useSignal<User | null>(null);
  const isLoading = useSignal(true);
  const nav = useNavigate();

  /**
   * useTask$ = Inicialización del estado de auth
   * - Carga usuario inicial
   * - Configura listeners de cambios
   * - Mejor performance que useVisibleTask$
   */
  useTask$(async () => {
    const supabase = createClient();
    
    // Obtener usuario inicial
    const { data: { user: initialUser } } = await supabase.auth.getUser();
    user.value = initialUser;
    isLoading.value = false;

    /**
     * onAuthStateChange = Listener para cambios de autenticación
     * - Actualiza estado reactivo automáticamente
     * - Maneja navegación en logout
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null;
      
      // Navegación automática en logout
      if (event === 'SIGNED_OUT') {
        nav('/login');
      }
    });

    // Cleanup del subscription
    return () => subscription.unsubscribe();
  });

  /**
   * logout = Método para cerrar sesión
   * - Event handler con $ para lazy loading
   * - Manejo centralizado del logout
   */
  const logout = $(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // La navegación se maneja automáticamente en el listener
  });

  return {
    user: user.value,
    isLoading: isLoading.value,
    isAuthenticated: !!user.value,
    logout,
  };
};
