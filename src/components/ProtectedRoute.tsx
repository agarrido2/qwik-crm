import { component$, Slot } from '@builder.io/qwik';

interface ProtectedRouteProps {
  redirectTo?: string;
}

/**
 * Componente legacy para protección de rutas
 * NOTA: En la nueva implementación, la protección se maneja a nivel del layout
 * con routeLoader$. Este componente se mantiene por compatibilidad pero
 * no es necesario usarlo.
 */
export const ProtectedRoute = component$<ProtectedRouteProps>(() => {
  // En la nueva implementación con routeLoader$, la protección
  // se maneja automáticamente en el layout principal
  // Este componente simplemente renderiza el contenido
  return <Slot />;
});

export default ProtectedRoute;
