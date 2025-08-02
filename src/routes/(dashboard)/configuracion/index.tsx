import { component$ } from "@builder.io/qwik";

/**
 * Página de Configuración = Settings del usuario y app
 * - Ruta grupal (dashboard) = Hereda autenticación
 * - Futuro: Preferencias y configuración del CRM
 * - Gestión de perfil de usuario
 */
export default component$(() => {
  return (
    <section class="h-full flex flex-col items-center justify-center text-gray-600">
      <h1 class="text-3xl font-bold mb-4">Configuración</h1>
      <p class="text-lg">Aquí irán las opciones de configuración.</p>
      {/* 
        TODO: Panel de configuración
        - Perfil de usuario (editar info personal)
        - Preferencias de la aplicación
        - routeAction$ para updates de perfil
        - Integración con Supabase auth
      */}
    </section>
  );
});
