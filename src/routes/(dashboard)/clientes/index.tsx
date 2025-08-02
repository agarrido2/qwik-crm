import { component$ } from "@builder.io/qwik";

/**
 * Página de Clientes = Página protegida del dashboard
 * - Ruta grupal (dashboard) = Comparte layout automáticamente
 * - Componente estático (será dinámico con datos reales)
 * - Estructura responsive con Tailwind CSS
 */
export default component$(() => {
  return (
    <section class="h-full flex flex-col items-center justify-center text-gray-600">
      <h1 class="text-3xl font-bold mb-4">Clientes</h1>
      <p class="text-lg">Aquí irán los clientes.</p>
      {/* 
        TODO: Implementar funcionalidad completa
        - routeLoader$ para cargar datos del servidor
        - useStore para estado del componente
        - Tabla con paginación y búsqueda
        - Modal para agregar/editar clientes
      */}
    </section>
  );
});
