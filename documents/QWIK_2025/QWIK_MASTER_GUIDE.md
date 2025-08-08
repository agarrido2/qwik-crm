# 🎯 QWIK MASTER GUIDE - GUÍA DEFINITIVA

**Versión:** 2.0 - Consolidada y Verificada  
**Fecha:** 8 de agosto de 2025  
**Propósito:** Guía completa y autoritativa sobre Qwik para desarrollo profesional

---

## 🔥 **CONCEPTOS FUNDAMENTALES DE QWIK**

### **🎯 RESUMABILITY - EL CORE DE QWIK**

**Qwik NO usa hidratación** - Es el primer framework O(1) que elimina completamente este proceso:

- **Estado serializado** - El estado del servidor se serializa y se resume en el cliente
- **Zero JavaScript** - Payload inicial mínimo, JavaScript se carga bajo demanda
- **Instant interactivity** - Event handlers disponibles inmediatamente
- **Performance constante** - O(1) independiente del número de componentes

```tsx
// ✅ Resumability en acción
export default component$(() => {
  const count = useSignal(0)
  
  // Este handler estará disponible inmediatamente, sin hidratación
  return <button onClick$={() => count.value++}>Count: {count.value}</button>
})
```

### **💲 DOLLAR SIGN ($) - LAZY BOUNDARIES**

El símbolo `$` marca **lazy boundaries** para el optimizer de Qwik:

```tsx
component$()        // Componente lazy-loaded
useTask$()         // Task con lazy execution  
onClick$()         // Event handler lazy
$(async () => {})  // QRL function lazy
routeLoader$()     // Server loader lazy
routeAction$()     // Server action lazy
```

**Regla de oro:** Si puede ser lazy-loaded, usa `$`

### **🎨 QRL (Qwik Resource Locator)**

QRL permite que las funciones sean serializables y lazy-loaded:

```tsx
// ✅ QRL function - serializable y lazy
const handleClick = $(async () => {
  // Esta función se carga solo cuando se necesita
  console.log('Clicked!')
})

// ✅ Uso en componente
<button onClick$={handleClick}>Click me</button>

// ✅ QRL en context
const logout = $(async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  nav('/login')
})
```

### **🏗️ VIRTUAL DOM HÍBRIDO**

Qwik usa virtual DOM **estratégicamente**:

- **Cambios no-estructurales** → Actualizaciones directas del DOM (como SolidJS)
- **Cambios estructurales** → Virtual DOM diff (cuando necesario)
- **Auto-memoization** → Todos los componentes auto-memoized
- **Performance óptima** → Mejor performance que React/Vue en la mayoría de casos

```tsx
// Actualización directa (no vDOM)
<div>Count: {count.value}</div>

// Virtual DOM (cambio estructural)
{count.value > 5 ? <button>Reset</button> : <span>Continue</span>}
```

---

## 🏗️ **QWIK CITY - META-FRAMEWORK**

### **🛣️ FILE-BASED ROUTING**

```text
src/routes/
├── layout.tsx                 // Layout global
├── index.tsx                  // Ruta raíz (/)
├── (auth)/                   // Route group - no afecta URL
│   ├── layout.tsx            // Layout específico
│   ├── login/index.tsx       // /login
│   └── register/index.tsx    // /register
├── (dashboard)/              // Route group protegido
│   ├── index.tsx             // /dashboard
│   ├── users/
│   │   ├── index.tsx         // /users
│   │   └── [id]/index.tsx    // /users/123 (dinámico)
│   └── settings/index.tsx    // /settings
└── [...slug]/index.tsx       // Catch-all routes
```

**Route Groups** `(name)` organizan sin afectar la URL.

### **📊 DATA LOADING PATTERNS**

#### **routeLoader$ - Server-side Data**

```tsx
export const useUserData = routeLoader$(async (requestEvent) => {
  // Ejecuta ANTES del render en el servidor
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && isProtectedRoute) {
    throw requestEvent.redirect(302, '/login')
  }
  
  return { user, timestamp: Date.now() }
})

// Uso en component
export default component$(() => {
  const userData = useUserData() // Datos ya verificados
  return <div>Hello {userData.value.user?.email}</div>
})
```

#### **routeAction$ - Server Actions**

```tsx
export const useLoginAction = routeAction$(async (formData, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
  })
  
  if (error) return fail(400, { message: error.message })
  
  throw requestEvent.redirect(302, '/dashboard')
}, zod$(loginSchema))
```

### **🔄 LAYOUTS JERÁRQUICOS**

```tsx
// Root layout - src/routes/layout.tsx
export default component$(() => {
  const authData = useAuthLoader()
  
  useContextProvider(AuthContext, {
    user: authData.value.user,
    isAuthenticated: !!authData.value.user
  })
  
  return (
    <html>
      <head><meta charSet="utf-8" /></head>
      <body>
        <Slot /> {/* Contenido de rutas hijo */}
      </body>
    </html>
  )
})

// Group layout - src/routes/(auth)/layout.tsx  
export default component$(() => {
  return (
    <div class="auth-layout">
      <h1>Authentication</h1>
      <Slot /> {/* Páginas de auth */}
    </div>
  )
})
```

---

## 🎯 **PATTERNS ARQUITECTÓNICOS**

### **🔐 CONTEXT API PATTERN**

#### **1. Definir Context**
```tsx
// src/lib/auth-context.ts
import { createContextId, type QRL } from "@builder.io/qwik"

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  logout: QRL<() => Promise<void>>
}

export const AuthContext = createContextId<AuthContextValue>('app.auth')
```

#### **2. Provider en Layout**
```tsx
// src/routes/layout.tsx
export default component$(() => {
  const authData = useAuthLoader()
  const nav = useNavigate()
  
  const authValue: AuthContextValue = {
    user: authData.value.user,
    isAuthenticated: !!authData.value.user,
    logout: $(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      nav('/login')
    })
  }
  
  useContextProvider(AuthContext, authValue)
  
  return (
    <>
      {authValue.isAuthenticated ? (
        <AppLayout><Slot /></AppLayout>
      ) : (
        <Slot />
      )}
    </>
  )
})
```

#### **3. Consumer Hook**
```tsx
// src/lib/use-auth.ts
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}

// Uso en cualquier componente
export default component$(() => {
  const { user, isAuthenticated, logout } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <span>Welcome {user?.email}</span>
          <button onClick$={logout}>Logout</button>
        </div>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  )
})
```

### **🛡️ SERVER-FIRST AUTHENTICATION**

```tsx
// Pattern completo de auth server-first
export const useAuthGuard = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { user } } = await supabase.auth.getUser()
  
  // Verificación server-side
  const currentPath = requestEvent.url.pathname
  const isProtectedRoute = currentPath.startsWith('/dashboard')
  const isAuthRoute = currentPath.startsWith('/auth')
  
  // Redirects server-side (sin flash)
  if (isProtectedRoute && !user) {
    throw requestEvent.redirect(302, '/auth/login')
  }
  
  if (isAuthRoute && user) {
    throw requestEvent.redirect(302, '/dashboard')
  }
  
  return { user, isAuthenticated: !!user, currentPath }
})
```

### **🎨 COMPONENT COMPOSITION**

```tsx
// Separación limpia de responsabilidades
export const AppLayout = component$(() => {
  // Solo estructura UI - no lógica de negocio
  return (
    <div class="min-h-screen bg-gray-50">
      <Sidebar />
      <main class="ml-64">
        <Header />
        <div class="p-6">
          <Slot />
        </div>
      </main>
    </div>
  )
})

export const AuthProvider = component$<{ children: any }>(({ children }) => {
  // Solo context - no UI
  const authData = useAuthLoader()
  
  useContextProvider(AuthContext, {
    user: authData.value.user,
    isAuthenticated: !!authData.value.user
  })
  
  return <>{children}</>
})
```

---

## ⚡ **PERFORMANCE & OPTIMIZACIÓN**

### **🚀 QWIK-SPECIFIC OPTIMIZATIONS**

1. **O(1) Loading** - JavaScript payload constante independiente del tamaño
2. **Speculative fetching** - Service workers prefetch modules automáticamente
3. **Lazy boundaries** - Code splitting granular con $
4. **Auto-memoization** - Todos los componentes optimizados automáticamente
5. **No hydration** - Eliminación completa del proceso de hidratación

### **📦 BUNDLE OPTIMIZATION**

```tsx
// ✅ Code splitting automático
const LazyComponent = lazy$(() => import('./HeavyComponent'))

// ✅ Resource optimization
const loadUserData = $(async (userId: string) => {
  // Solo se carga cuando se necesita
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
})

// ✅ Conditional loading
{showAdvanced && <LazyAdvancedFeatures />}
```

### **🎯 SIGNALS PARA REACTIVIDAD**

```tsx
// useSignal para estado primitivo
const count = useSignal(0)
const name = useSignal('')

// useStore para objetos complejos
const user = useStore({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})

// Computed values
const displayName = useComputed$(() => 
  user.name ? `Hello ${user.name}` : 'Hello Guest'
)

// Watchers
useTask$(({ track }) => {
  track(() => count.value)
  console.log('Count changed:', count.value)
})
```

---

## 🛠️ **TROUBLESHOOTING GUIDE**

### **❌ ERRORES COMUNES**

#### **1. routeLoader$ Scope Error**
```tsx
// ❌ INCORRECTO - routeLoader$ fuera de route boundary
const MyComponent = component$(() => {
  const data = useLoader() // Error: no route context
})

// ✅ CORRECTO - routeLoader$ en archivo de ruta
// src/routes/dashboard/index.tsx
export const useData = routeLoader$(async () => {
  return { data: 'from server' }
})

export default component$(() => {
  const data = useData() // ✅ Funciona
})
```

#### **2. Context Provider Missing**
```tsx
// ❌ Error: useContext outside provider
const auth = useContext(AuthContext) // undefined

// ✅ Solución: Verificar Provider hierarchy
// layout.tsx debe tener useContextProvider
useContextProvider(AuthContext, contextValue)
```

#### **3. QRL Serialization Error**
```tsx
// ❌ INCORRECTO - función regular no serializable
<button onClick={() => console.log('click')}> // Error

// ✅ CORRECTO - QRL function serializable
<button onClick$={() => console.log('click')}> // ✅ Funciona
```

#### **4. Server/Client Mismatch**
```tsx
// ❌ INCORRECTO - diferencias server/client
const isClient = typeof window !== 'undefined' // Hydration mismatch

// ✅ CORRECTO - consistent rendering
const value = useSignal('default')

useVisibleTask$(() => {
  // Solo ejecuta en cliente después del mount
  value.value = 'client-specific'
})
```

### **🔧 DEBUGGING TECHNIQUES**

```tsx
// 1. Server-side debugging
export const useDebugLoader = routeLoader$(async (requestEvent) => {
  console.log('Server log:', requestEvent.url.pathname)
  return { path: requestEvent.url.pathname }
})

// 2. Client-side debugging
useVisibleTask$(() => {
  console.log('Client task executed')
})

// 3. Signal debugging
useTask$(({ track }) => {
  const value = track(() => mySignal.value)
  console.log('Signal changed:', value)
})
```

---

## 📋 **BEST PRACTICES CONSOLIDADAS**

### **✅ COMPONENT PATTERNS**
```tsx
// Template óptimo para componentes
interface ComponentProps {
  title: string
  items?: Item[]
  onAction$?: PropFunction<(id: string) => void>
}

export const MyComponent = component$<ComponentProps>(({ 
  title, 
  items = [], 
  onAction$ 
}) => {
  // 1. Signals/stores
  const loading = useSignal(false)
  
  // 2. Context/loaders
  const auth = useAuth()
  
  // 3. Event handlers (QRL)
  const handleClick = $(async (id: string) => {
    loading.value = true
    await onAction$?.(id)
    loading.value = false
  })
  
  // 4. JSX
  return (
    <div class="component">
      <h2>{title}</h2>
      {items.map(item => (
        <button 
          key={item.id}
          onClick$={() => handleClick(item.id)}
          disabled={loading.value}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
})
```

### **✅ SERVER ACTIONS PATTERN**
```tsx
export const useActionName = routeAction$(async (formData, requestEvent) => {
  try {
    // 1. Validation
    const validatedData = schema.parse(formData)
    
    // 2. Business logic
    const result = await performAction(validatedData)
    
    // 3. Success response
    if (result.success) {
      throw requestEvent.redirect(302, '/success')
    }
    
    return result
  } catch (error) {
    // 4. Error handling
    return fail(400, { 
      message: error.message,
      formData 
    })
  }
}, zod$(schema))
```

### **✅ TYPESCRIPT PATTERNS**
```tsx
// Strict typing para props
interface StrictProps {
  readonly id: string
  readonly data: readonly Item[]
  readonly onUpdate$?: PropFunction<(item: Item) => Promise<void>>
}

// Union types para variants
type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  children: any
  onClick$?: PropFunction<() => void>
}
```

---

## 🎯 **VALIDACIÓN DE CONOCIMIENTO**

Para verificar que has absorvido este contenido, deberías poder:

1. **Explicar resumability** sin consultar documentación
2. **Identificar cuándo usar $** en funciones y componentes
3. **Implementar Context API** siguiendo el pattern establecido
4. **Crear routeLoader$ y routeAction$** para server-side logic
5. **Debuggear errores comunes** de serialización y scope
6. **Aplicar patterns de performance** específicos de Qwik

---

## 📚 **RECURSOS OFICIALES CRÍTICOS**

### **🔗 DOCUMENTACIÓN PRINCIPAL**
- **[Qwik Docs](https://qwik.dev/docs/)** - Documentación completa
- **[⭐ Qwik API Reference](https://qwik.dev/api/)** - **API COMPLETA** (consultar para funciones específicas)
- **[QwikCity](https://qwik.dev/docs/qwikcity/)** - Meta-framework
- **[Tutorial Interactivo](https://qwik.dev/tutorial/)** - Aprendizaje hands-on

### **🛠️ RECURSOS DE DESARROLLO**
- **[Best Practices](https://qwik.dev/docs/guides/best-practices/)** - Mejores prácticas oficiales
- **[Troubleshooting](https://qwik.dev/docs/troubleshooting/)** - Solución de problemas
- **[FAQ](https://qwik.dev/docs/faq/)** - Preguntas frecuentes
- **[Deployment](https://qwik.dev/docs/deployments/)** - Opciones de deployment

> **⚠️ REGLA CRÍTICA**: Para cualquier duda específica sobre APIs, tipos o funciones de Qwik, SIEMPRE consultar primero: **https://qwik.dev/api/**

---

**Esta guía contiene todo el conocimiento esencial para desarrollo profesional con Qwik. Es la referencia autoritativa para transferencia de conocimiento entre sesiones de desarrollo.**
