# Patrones de Código y Mejores Prácticas - Qwik CRM

## 🔥 **CONTEXTO GLOBAL - PATRÓN IMPLEMENTADO (AGOSTO 2025)**

### **✅ Estado: FUNCIONANDO Y PROBADO**

#### **1. Context ID y Tipos Avanzados**
```typescript
// ✅ IMPLEMENTADO: src/lib/auth-context.ts
import { createContextId, type QRL } from "@builder.io/qwik"
import type { User } from "@supabase/supabase-js"

export interface AuthContextValue {
  user: User | null                     // Server-verified user
  isAuthenticated: boolean              // Computed boolean
  logout: QRL<() => Promise<void>>      // Lazy-loaded function
}

export const AuthContext = createContextId<AuthContextValue>(
  'qwik-crm.auth.user-context' // Naming convention
)
```

#### **2. Hook de Consumo con Error Handling**
```typescript
// ✅ IMPLEMENTADO: src/lib/use-auth-context.ts
export const useAuthContext = (): AuthContextValue => {
  try {
    const authContext = useContext(AuthContext)
    
    // Development debugging
    if (import.meta.env.DEV && !authContext) {
      console.warn('🚨 AuthContext: No se encontró el contexto...')
    }
    
    return authContext
  } catch (error) {
    throw new Error('❌ useAuthContext debe ser usado dentro de un componente...')
  }
}

export const useAuth = useAuthContext // Alias conciso
```

#### **3. Provider en Layout Principal**
```typescript
// ✅ IMPLEMENTADO: src/routes/layout.tsx
export default component$(() => {
  const authState = useAuthLoader() // Server-side data
  const nav = useNavigate()
  
  // Context value preparation
  const authContextValue: AuthContextValue = {
    user: authState.value.user,
    isAuthenticated: !!authState.value.user,
    logout: $(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (!error) {
        nav('/login')
      }
    })
  }
  
  // Global context provider
  useContextProvider(AuthContext, authContextValue)
  
  // Conditional rendering...
})
```

#### **4. Uso en Componentes**
```typescript
// ✅ PATRÓN UNIVERSAL: En cualquier componente
import { useAuth } from "../lib/use-auth-context"

export default component$(() => {
  const auth = useAuth() // 🔥 Zero configuration!
  
  return (
    <div>
      <h1>Hola, {auth.user?.email}</h1>
      <button onClick$={auth.logout}>Cerrar Sesión</button>
      <p>Estado: {auth.isAuthenticated ? 'Conectado' : 'Desconectado'}</p>
    </div>
  )
})
```

### **🎯 Beneficios Técnicos Conseguidos**

#### **✅ Server-First Architecture**
- Datos vienen de `routeLoader$` (server-verified)
- Zero flash loading states
- Secure con `getUser()` en lugar de `getSession()`

#### **✅ Performance Optimizada**
- QRL functions para lazy loading
- Bundle splitting automático
- Zero re-renders innecesarios

#### **✅ Developer Experience**
- Type safety completo end-to-end
- Error handling descriptivo
- Zero prop drilling
- Debugging info en desarrollo

#### **✅ Escalabilidad**
- Fácil extensión de funcionalidades
- Separación clara de responsabilidades
- Testeable y mantenible

---

## 🎯 **Patrones de Server Actions**

### **1. Patrón Estándar con routeAction$**
```typescript
/**
 * ✅ PATRÓN CORRECTO para server actions
 * - Validación con zod$ antes de ejecutar
 * - Manejo de errores estructurado
 * - Redirect con throw requestEvent.redirect()
 * - timestamp para reset de formularios
 */
export const useActionName = routeAction$(async (values, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    // Lógica principal del action
    const { error } = await supabase.someMethod(values)
    
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message],
        timestamp: Date.now() // ✨ Fuerza reset del form
      })
    }
    
    // Redirect exitoso
    throw requestEvent.redirect(302, '/success-route')
  } catch (error) {
    // Re-throw redirects
    if (error instanceof Response) throw error
    
    // Manejo de errores
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor'],
      timestamp: Date.now()
    })
  }
}, zod$({
  // Esquema de validación
  field: z.string().min(1, 'Campo requerido'),
}))
```

### **2. Patrón con Validación Personalizada**
```typescript
export const useRegisterAction = routeAction$(async (values, requestEvent) => {
  // ✅ Validación personalizada DESPUÉS de zod$
  if (values.password !== values.confirmPassword) {
    return requestEvent.fail(400, {
      fieldErrors: {
        confirmPassword: ['Las contraseñas no coinciden']
      },
      formErrors: []
    })
  }
  
  // Continuar con lógica principal...
}, zod$(schema))
```

### **3. Patrón con withSupabase Helper**
```typescript
export const useActionName = routeAction$(
  withSupabase(async (supabase, requestEvent, values) => {
    // ✅ Supabase ya inicializado, manejo de errores automático
    const { error } = await supabase.someMethod(values)
    
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message]
      })
    }
    
    throw requestEvent.redirect(302, '/success')
  }),
  zod$(schema)
)
```

## 🎯 **Patrones de routeLoader$**

### **1. Patrón para Protección de Rutas**
```typescript
/**
 * ✅ PATRÓN CORRECTO para auth loaders
 * - Verificación server-side (sin flash)
 * - Redirect con throw requestEvent.redirect()
 * - Retorna datos para el componente
 */
export const useAuthLoader = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()
  
  const pathname = requestEvent.url.pathname
  const isAuthRoute = isAuthenticationRoute(pathname)
  
  // Lógica de protección
  if (!session && !isAuthRoute) {
    throw requestEvent.redirect(302, '/login')
  }
  
  if (session && isAuthRoute) {
    throw requestEvent.redirect(302, '/')
  }
  
  return { session, isAuthRoute }
})
```

### **2. Patrón para Datos de Dashboard**
```typescript
export const useDashboardLoader = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  // Verificar autenticación primero
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw requestEvent.redirect(302, '/login')
  }
  
  // Cargar datos del dashboard
  const [users, activities, reports] = await Promise.all([
    supabase.from('users').select('*'),
    supabase.from('activities').select('*').limit(10),
    supabase.from('reports').select('*').eq('user_id', session.user.id)
  ])
  
  return {
    users: users.data || [],
    activities: activities.data || [],
    reports: reports.data || []
  }
})
```

## 🎯 **Patrones de Formularios**

### **1. Patrón con Progressive Enhancement**
```typescript
export default component$(() => {
  const action = useAction()
  const formKey = useSignal(Date.now())
  
  // ✅ Reset automático en errores
  useTask$(({ track }) => {
    track(() => action.value)
    if (action.value?.formErrors || action.value?.fieldErrors) {
      formKey.value = Date.now()
    }
  })
  
  return (
    <Form action={action} key={formKey.value}>
      {/* ✅ Input SIN value prop */}
      <input
        name="email"
        type="email"
        required
        class={getInputClasses(hasFieldError(action.value, 'email'))}
        placeholder="email@ejemplo.com"
      />
      
      {/* ✅ Manejo de errores de campo */}
      {getFieldError(action.value, 'email') && (
        <p class="text-red-600 text-sm">
          {getFieldError(action.value, 'email')}
        </p>
      )}
      
      {/* ✅ Button con estado automático */}
      <button
        type="submit"
        disabled={action.isRunning}
        class="btn-primary"
      >
        {action.isRunning ? 'Procesando...' : 'Enviar'}
      </button>
    </Form>
  )
})
```

### **2. Patrón con Validación Client-Side Opcional**
```typescript
export default component$(() => {
  const action = useAction()
  const email = useSignal('')
  const password = useSignal('')
  
  // ✅ Validación reactiva opcional (UX)
  const isValid = useComputed$(() => 
    email.value.includes('@') && password.value.length >= 6
  )
  
  return (
    <Form action={action}>
      <input
        name="email"
        value={email.value}
        onInput$={(e) => email.value = e.target.value}
      />
      <input
        name="password"
        value={password.value}
        onInput$={(e) => password.value = e.target.value}
      />
      
      <button
        type="submit"
        disabled={action.isRunning || !isValid.value}
      >
        Enviar
      </button>
    </Form>
  )
})
```

## 🎯 **Patrones de Tasks**

### **1. useTask$ - Patrón Recomendado**
```typescript
/**
 * ✅ USAR useTask$ para:
 * - Reactividad general
 * - Lógica que funciona en servidor y cliente
 * - Sincronización de estado
 */
useTask$(({ track }) => {
  track(() => signal.value)
  
  // Lógica reactiva que se ejecuta en servidor Y cliente
  if (signal.value) {
    otherSignal.value = computeValue(signal.value)
  }
})
```

### **2. useVisibleTask$ - Solo Casos Específicos**
```typescript
/**
 * ⚠️ USAR useVisibleTask$ SOLO para:
 * - Manipulación directa del DOM
 * - APIs del browser (localStorage, addEventListener)
 * - Librerías que requieren el cliente
 */
// eslint-disable-next-line qwik/no-use-visible-task
useVisibleTask$(() => {
  // Solo se ejecuta en el cliente
  const element = document.getElementById('chart')
  if (element) {
    initializeChart(element)
  }
})
```

### **3. useComputed$ - Valores Derivados**
```typescript
/**
 * ✅ USAR useComputed$ para:
 * - Valores calculados reactivos
 * - Transformaciones de datos
 * - Estado derivado
 */
const fullName = useComputed$(() => 
  `${firstName.value} ${lastName.value}`.trim()
)

const filteredItems = useComputed$(() =>
  items.value.filter(item => 
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
```

## 🎯 **Patrones de Layouts**

### **1. Layout Principal con Protección**
```typescript
export default component$(() => {
  const authState = useAuthLoader()
  const isAuthRoute = authState.value.isAuthRoute
  
  // ✅ Renderizado condicional basado en tipo de ruta
  if (isAuthRoute) {
    return <Slot /> // Solo contenido para auth
  }
  
  // Layout completo para dashboard
  return (
    <div class="layout-container">
      <Sidebar />
      <div class="main-content">
        <Header />
        <main>
          <Slot />
        </main>
      </div>
    </div>
  )
})
```

### **2. Layout de Auth Simple**
```typescript
export default component$(() => {
  return (
    <div class="min-h-screen bg-gray-50">
      <Slot />
    </div>
  )
})
```

### **3. Layout con Provider Pattern**
```typescript
export const AuthProvider = component$(() => {
  const auth = useAuth()
  
  // ✅ Contexto global de autenticación
  useContextProvider(AuthContext, auth)
  
  return <Slot />
})
```

## 🎯 **Patrones de Error Handling**

### **1. Manejo de Errores en Actions**
```typescript
export const useAction = routeAction$(async (values, requestEvent) => {
  try {
    // Lógica principal
  } catch (error) {
    // ✅ Patrón estándar de manejo de errores
    if (error instanceof Response) throw error
    
    console.error('Action error:', error)
    
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor'],
      timestamp: Date.now()
    })
  }
}, zod$(schema))
```

### **2. Error Boundaries en Componentes**
```typescript
export default component$(() => {
  const action = useAction()
  
  return (
    <div>
      {/* ✅ Manejo de errores globales */}
      {action.value?.formErrors && (
        <div class="error-container">
          {action.value.formErrors.map(error => (
            <p key={error} class="error-message">{error}</p>
          ))}
        </div>
      )}
      
      {/* ✅ Manejo de errores de campo */}
      <Form action={action}>
        <input name="email" />
        {action.value?.fieldErrors?.email && (
          <span class="field-error">
            {action.value.fieldErrors.email[0]}
          </span>
        )}
      </Form>
    </div>
  )
})
```

## 🎯 **Patrones de Routing**

### **1. File-Based Routing Estructura**
```
routes/
├── layout.tsx              # Layout global
├── index.tsx               # Ruta raíz (/)
├── (auth)/                 # Grupo que no afecta URL
│   ├── layout.tsx          # Layout para auth
│   ├── login/index.tsx     # /login
│   └── register/index.tsx  # /register
├── (dashboard)/            # Grupo protegido
│   ├── layout.tsx          # Layout con sidebar
│   ├── index.tsx           # / (dashboard home)
│   ├── users/
│   │   ├── index.tsx       # /users
│   │   └── [id]/index.tsx  # /users/123
│   └── settings/index.tsx  # /settings
└── 404.tsx                 # Página de error
```

### **2. Navegación Programática**
```typescript
export default component$(() => {
  const nav = useNavigate()
  
  const handleSubmit = $(async () => {
    try {
      await submitForm()
      // ✅ Navegación client-side
      nav('/success')
    } catch (error) {
      // Manejo de errores
    }
  })
  
  return (
    <div>
      <Link href="/users" class="nav-link">
        Ver Usuarios
      </Link>
      <button onClick$={handleSubmit}>
        Enviar
      </button>
    </div>
  )
})
```

## 🎯 **Patrones de Optimización**

### **1. Lazy Loading de Componentes**
```typescript
// ✅ Lazy import de componentes pesados
const HeavyChart = lazy$(() => import('./heavy-chart'))

export default component$(() => {
  const showChart = useSignal(false)
  
  return (
    <div>
      <button onClick$={() => showChart.value = true}>
        Mostrar Gráfico
      </button>
      
      {showChart.value && (
        <Suspense fallback={<div>Cargando gráfico...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  )
})
```

### **2. Memoización con useComputed$**
```typescript
export default component$(() => {
  const items = useSignal([])
  const filter = useSignal('')
  
  // ✅ Memoización automática con useComputed$
  const filteredItems = useComputed$(() => {
    console.log('Recomputando...') // Solo cuando cambian dependencias
    return items.value.filter(item => 
      item.name.includes(filter.value)
    )
  })
  
  return (
    <div>
      <input bind:value={filter} />
      {filteredItems.value.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
})
```

### **3. Resource Loading Pattern**
```typescript
export const useDataResource = routeLoader$(async () => {
  // ✅ Carga de datos en el servidor
  const data = await fetchExpensiveData()
  return data
})

export default component$(() => {
  const data = useDataResource()
  
  // ✅ Los datos ya están disponibles (no flash loading)
  return (
    <div>
      {data.value.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
})
```

## 🎯 **Anti-Patrones a Evitar**

### **❌ NO usar useVisibleTask$ innecesariamente**
```typescript
// ❌ MALO - usar useVisibleTask$ para reactividad simple
useVisibleTask$(({ track }) => {
  track(() => signal.value)
  otherSignal.value = signal.value * 2
})

// ✅ BUENO - usar useComputed$ para valores derivados
const otherSignal = useComputed$(() => signal.value * 2)
```

### **❌ NO usar value props en formularios**
```typescript
// ❌ MALO - mantiene estado entre submissions
<input name="email" value={email.value} />

// ✅ BUENO - sin value prop para progressive enhancement
<input name="email" placeholder="email@ejemplo.com" />
```

### **❌ NO manejar navigation en try/catch de actions**
```typescript
// ❌ MALO - no funciona correctamente
try {
  await action()
  nav('/success') // No se ejecuta si hay redirect
} catch (error) {}

// ✅ BUENO - usar throw redirect en el action
throw requestEvent.redirect(302, '/success')
```
