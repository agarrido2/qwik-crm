import { component$ } from "@builder.io/qwik";

/**
 * Página de Reportes = Analytics y métricas del CRM
 * - Ruta grupal (dashboard) = Acceso protegido
 * - Futuro: Gráficos y dashboards analíticos
 * - Data visualization con charts
 */
export default component$(() => {
  return (
    <section class="h-full flex flex-col items-center justify-center text-gray-600">
      <h1 class="text-3xl font-bold mb-4">Reportes</h1>
      <p class="text-lg">Aquí irán los reportes y análisis.</p>
      {/* 
        TODO: Sistema de reportes
        - Gráficos de ventas y conversión
        - routeLoader$ para datos agregados
        - Filtros por fecha y categoría
        - Export a PDF/Excel
      */}
    </section>
  );
});
