import { component$ } from "@builder.io/qwik";

/**
 * Página de Oportunidades = Gestión de ventas potenciales
 * - Ruta grupal (dashboard) = Hereda protección de autenticación
 * - Componente placeholder para desarrollo futuro
 * - Layout automático del grupo dashboard
 */
export default component$(() => {
  return (
    <section class="h-full flex flex-col items-center justify-center text-gray-600">
      <h1 class="text-3xl font-bold mb-4">Oportunidades</h1>
      <p class="text-lg">Aquí irán las oportunidades de venta.</p>
      {/* 
        TODO: CRM Pipeline Implementation
        - Kanban board para etapas de venta
        - routeLoader$ para cargar oportunidades
        - Drag & drop entre columnas
        - Filtros por estado y fecha
      */}
    </section>
  );
});
