import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { createSupabaseServerClient } from '~/lib/supabase';

// Loader para verificar autenticación y redirigir apropiadamente
export const useCheckAuth = routeLoader$(async (event) => {
  const supabase = createSupabaseServerClient(event);
  const { data } = await supabase.auth.getSession();
  
  // Si no hay sesión, redirigir a login
  if (!data.session) {
    throw event.redirect(302, '/login');
  }
  
  // Si hay sesión, permitir acceso a la página principal
  return data.session;
});

export default component$(() => {
  const session = useCheckAuth();
  
  return (
    <>
      <h1>Bienvenido al CRM 👋</h1>
      <div>
        <p>¡Hola! Has iniciado sesión correctamente.</p>
        <p>Email: {session.value?.user?.email}</p>
        <br />
        <p>Aquí irá el dashboard del CRM...</p>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
