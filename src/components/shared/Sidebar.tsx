import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

/**
 * Sidebar Component = Navegación lateral del dashboard
 * - Componente 100% estático (sin estado)
 * - Usa Link de Qwik City para navegación SPA
 * - Prefetch automático en hover
 */
export const Sidebar = component$(() => {
  return (
    <aside class="bg-gray-900 text-white w-60 min-h-screen flex flex-col p-4">
      <div class="mb-8 text-2xl font-bold tracking-wide">CRM Dashboard</div>
      <nav class="flex-1 flex flex-col gap-2">
        {/* 
          Link = Componente de Qwik City para navegación SPA
          - Prefetch automático en hover
          - Preserva el estado de la app
          - Faster navigation que <a> tags
        */}
        <Link href="/clientes" class="py-2 px-3 rounded hover:bg-gray-800">Clientes</Link>
        <Link href="/oportunidades" class="py-2 px-3 rounded hover:bg-gray-800">Oportunidades</Link>
        <Link href="/actividades" class="py-2 px-3 rounded hover:bg-gray-800">Actividades</Link>
        <Link href="/reportes" class="py-2 px-3 rounded hover:bg-gray-800">Reportes</Link>
        <Link href="/configuracion" class="py-2 px-3 rounded hover:bg-gray-800">Configuración</Link>
      </nav>
    </aside>
  );
});

export default Sidebar;
