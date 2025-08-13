# Qwik + Supabase Auth Boilerplate

Este documento describe la arquitectura de autenticación del proyecto, sus archivos, responsabilidades y cómo extenderlo o modificarlo de forma segura.

Importante: este documento solo se actualizará cuando lo solicites explícitamente.


## Resumen

- Autenticación con Supabase usando `@supabase/ssr`.
- Verificación SSR central en `src/routes/layout.tsx` para evitar FOUC y redirigir en el servidor.
- Estado global de usuario mediante `AuthContext` + `AuthProvider` y hook `useAuth` (alias de `useAuthContext`).
- Formularios (login, registro, forgot/reset) con `routeAction$` y validación Zod centralizada.
- Clientes Supabase diferenciados para navegador y servidor.
- Estructura modular: contexto, hooks, servicios, schemas y páginas separadas.


## Estructura (resumen)

```txt
src/
  features/
    auth/
      auth-context.ts
      index.ts
      components/
        UserProfileDemo.tsx
      hooks/
        use-auth-context.ts
      schemas/
        auth-schemas.ts
      services/
        auth-helpers.ts
  lib/
    database/
      index.ts
      supabase.ts
  routes/
    (auth)/
      layout.tsx
      login/
        index.tsx
      register/
        index.tsx
      forgot-password/
        index.tsx
      reset-password/
        index.tsx
    (crm)/
      layout.tsx  (opcional; ver notas)
    layout.tsx     (guard SSR global)
```

Notas de routing:
- Los grupos de rutas entre paréntesis (p. ej. `(auth)`) son organizativos y no aparecen en la URL; la página `src/routes/(auth)/login/index.tsx` publica `/login`.


## Piezas principales y responsabilidades

- `src/lib/database/supabase.ts`
  - `createClient()`: cliente de navegador (usar en `useVisibleTask$`, handlers del cliente).
  - `createServerSupabaseClient(requestEvent)`: cliente SSR (usar en `routeLoader$`, `routeAction$`). Maneja cookies con la API moderna de `@supabase/ssr`.
  - Requiere variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

- `src/lib/database/index.ts`
  - Re-exporta los creadores de cliente.

- `src/routes/layout.tsx` (Guard SSR Global)
  - `useAuthGuard = routeLoader$`: verifica sesión en servidor con `supabase.auth.getUser()`.
  - Clasifica rutas en públicas/protegidas y redirige según corresponda.
  - Renderiza `AuthProvider` y decide si aplica `AppLayout` (protegidAs) o solo `<Slot />` (públicas).

- `src/features/auth/auth-context.ts`
  - Define `AuthContext` y tipos (`AuthContextValue`).
  - El contexto expone: `user`, `isAuthenticated`, `isLoading?` y `logout` como `QRL`.

- `src/components/auth/AuthProvider.tsx`
  - Proveedor global que sincroniza el contexto con Supabase (suscripciones a `onAuthStateChange`).
  - Integra logout (cliente) y propaga el usuario SSR verificado por el guard.

- `src/features/auth/hooks/use-auth-context.ts`
  - `useAuthContext()` y alias `useAuth`. Forma recomendada de consumir el estado global.

- `src/features/auth/services/auth-helpers.ts`
  - Helpers para acciones de servidor con Supabase: factorías que inyectan cliente SSR y unifican manejo de errores.

- `src/features/auth/schemas/auth-schemas.ts`
  - Esquemas Zod centralizados: `login`, `register`, `forgotPassword`, `resetPassword`.
  - Helper `validatePasswordMatch(password, confirmPassword)` reutilizable.

- Páginas Auth (`src/routes/(auth)/**`)
  - `login/index.tsx`: `routeAction$` con `authSchemas.login`; llama `supabase.auth.signInWithPassword` (o equivalente según implementación) vía cliente SSR. Gestiona `redirectTo`.
  - `register/index.tsx`: `routeAction$` con `authSchemas.register`; `supabase.auth.signUp`.
  - `forgot-password/index.tsx`: `routeAction$` con `authSchemas.forgotPassword`; `supabase.auth.resetPasswordForEmail` (con `redirectTo`).
  - `reset-password/index.tsx`: `routeAction$` con `authSchemas.resetPassword`; `supabase.auth.updateUser` tras validar confirmación.

- `(crm)/layout.tsx` (opcional)
  - Puede mantenerse minimalista si el guard global ya protege las rutas del área CRM. Incluye un guard propio únicamente si necesitas lógica específica de ese grupo.


## Flujo de ejecución (alto nivel)

1) Petición entra al servidor y ejecuta `useAuthGuard` en `src/routes/layout.tsx`.
2) `createServerSupabaseClient` lee cookies, consulta `supabase.auth.getUser()` y determina si hay sesión.
3) Si la ruta es protegida y no hay sesión, redirige a `/login?redirectTo=...` (SSR, sin parpadeos).
4) Si todo es correcto, se renderiza `AuthProvider` con el `user` ya verificado en SSR.
5) En el cliente, `AuthProvider` mantiene sincronizado el estado con `onAuthStateChange`.
6) Formularios de auth usan `routeAction$` y los schemas centralizados para validación previa.


## Variables de entorno

- Definir en `.env` (no commitear):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`


## Cómo añadir una ruta protegida nueva

1) Crea la página dentro de `src/routes/` (por ejemplo, `src/routes/reportes/index.tsx`).
2) Asegúrate de que `isProtectedRoute()` del guard global reconozca el prefijo (`/reportes`).
3) Listo: el guard SSR redirigirá si no hay sesión; si hay sesión, `AppLayout` se aplicará automáticamente si no es pública.


## Cómo añadir una página pública nueva

1) Crea la página (por ejemplo, `src/routes/about/index.tsx`).
2) Añade el prefijo a `isPublicRoute()` si quieres que evite el `AppLayout` y no requiera sesión.


## Cómo extender el sistema de auth

- Añadir OAuth providers: usar los métodos de Supabase (`signInWithOAuth`) en un `routeAction$`.
- Cambiar destino tras login: en el guard, al detectar usuario en `/login`, redirigir a otra ruta (p. ej., `/dashboard`).
- Añadir campos a registro: ampliar `authSchemas.register` y adaptar la `routeAction$` de `register`.


## Seguridad y buenas prácticas

- Usar siempre `createServerSupabaseClient(requestEvent)` en `routeAction$`/`routeLoader$`.
- Validar datos con Zod antes de ejecutar la lógica (ya integrado con `zod$`).
- No hardcodear claves; usar `.env`.
- `logout` expuesto como `QRL` para lazy-loading en cliente.


## Pruebas rápidas (manuales)

- Anónimo → `/login` renderiza formulario.
- Login válido → redirige a `/dashboard` (o ruta `redirectTo`).
- Autenticado → visita `/login` → redirige automáticamente a `/dashboard`.
- Forgot → envía email y muestra mensaje de éxito.
- Reset → con enlace válido permite cambiar contraseña y redirige.
- Logout desde el header → estado se limpia y navega a página pública.


## Decisiones de diseño clave

- Guard SSR centralizado para UX sin parpadeos y seguridad consistente.
- Contexto único para evitar duplicidades de estado.
- Schemas centralizados para validación coherente.
- Route groups para organización sin afectar URLs.


## Ficheros eliminados/evitados (para evitar duplicidades)

- Hooks duplicados: `src/features/auth/hooks/use-auth.ts` (reemplazado por `use-auth-context`).
- Componentes duplicados: `src/components/auth/UserProfileDemo.tsx`.
- `ProtectedRoute` redundante: `src/components/auth/ProtectedRoute.tsx` (el guard vive en `routes/layout.tsx`).
- Árbol de rutas alternativo: `src/routes/auth/` (preferimos `(auth)` para URLs limpias).
- Stubs en `src/lib/auth-*.ts(x)` no usados.


## Referencias rápidas

- Hook de consumo: `import { useAuth } from '~/features/auth'`
- Cliente SSR: `import { createServerSupabaseClient } from '~/lib/database'`
- Schemas: `import { authSchemas } from '~/features/auth'`


---

Ante cualquier cambio (p. ej., añadir multi-factor, providers sociales, o modificar flujos), consúltame para actualizar este documento y mantener el boilerplate alineado con las mejores prácticas del proyecto.
