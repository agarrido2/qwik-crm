import { component$ } from "@builder.io/qwik";

/**
 * Página de Actividades = Gestión de tareas y seguimientos
 * - Ruta grupal (dashboard) = Protegida automáticamente
 * - Futuro: Calendario de actividades y tareas
 * - Layout compartido del grupo dashboard
 */
export default component$(() => {
  return (
    <section class="h-full flex flex-col items-center justify-center text-gray-600">
      <h1 class="text-3xl font-bold mb-4">Actividades</h1>
      <p class="text-lg">Aquí irán las actividades programadas.</p>
      {/* 
        TODO: Sistema de actividades
        - Calendario con vista mensual/semanal
        - routeLoader$ para cargar eventos
        - CRUD de actividades (crear/editar/eliminar)
        - Notificaciones y recordatorios
      */}
    </section>
  );
});
