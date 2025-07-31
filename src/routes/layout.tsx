import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { createSupabaseServerClient } from '~/lib/supabase';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// Loader para verificar autenticación en el layout
export const useAuthSession = routeLoader$(async (event) => {
  const supabase = createSupabaseServerClient(event);
  const { data } = await supabase.auth.getSession();
  return data.session;
});

export default component$(() => {
  const session = useAuthSession();
  const location = useLocation();
  
  // Rutas que no requieren autenticación (páginas de auth)
  const authRoutes = ['/login', '/signup', '/reset-password'];
  const isAuthRoute = authRoutes.includes(location.url.pathname);
  
  // Si es una ruta de autenticación, mostrar layout simple
  if (isAuthRoute) {
    return (
      <div class="min-h-screen bg-gray-50">
        <Slot />
      </div>
    );
  }
  
  // Si no hay sesión y no es ruta de auth, mostrar layout simple
  // (la redirección se maneja en cada página individual)
  if (!session.value) {
    return (
      <div class="min-h-screen bg-gray-50">
        <Slot />
      </div>
    );
  }
  
  // Si hay sesión, mostrar layout completo del CRM
  return (
    <div class="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div class="flex-1 flex flex-col">
        <Header>
          <span q:slot="title">CRM</span>
        </Header>
        <main class="flex-1 p-8">
          <Slot />
        </main>
      </div>
    </div>
  );
});
