import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-gray-900">Configuración</h1>
      <p class="text-gray-600 mt-2">Página en construcción.</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Configuración - Dashboard | Qwik CRM",
};
