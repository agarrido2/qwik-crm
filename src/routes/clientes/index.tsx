import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <section class="h-full flex flex-col items-center justify-center text-gray-600">
      <h1 class="text-3xl font-bold mb-4">Clientes</h1>
      <p class="text-lg">Aquí irán los clientes.</p>
    </section>
  );
});
