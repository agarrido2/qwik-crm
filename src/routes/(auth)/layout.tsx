import { component$, Slot } from "@builder.io/qwik";

/**
 * Layout para páginas de autenticación
 * No incluye verificación de sesión para evitar bucles de redirección
 */
export default component$(() => {
  return (
    <div class="min-h-screen bg-gray-50">
      <Slot />
    </div>
  );
});
