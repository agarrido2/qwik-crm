# Implementaciones Específicas del Proyecto CRM

## 🎯 **Sistema de Autenticación Completo**

### **1. Estructura de Rutas**
```
routes/
├── (auth)/                    # Rutas de autenticación agrupadas
│   ├── layout.tsx            # Layout simple sin sidebar
│   ├── login/index.tsx       # Login con routeAction$
│   ├── register/index.tsx    # Registro con validación
│   ├── forgot-password/      # Sistema de recuperación
│   └── reset-password/       # Reset con token
├── (dashboard)/              # Rutas protegidas
│   ├── index.tsx            # Dashboard principal
│   ├── clientes/            # Gestión de clientes
│   ├── oportunidades/       # Gestión de oportunidades
│   └── reportes/            # Reportes y analytics
└── layout.tsx               # Layout principal con protección
```

## 🔥 **CONTEXTO GLOBAL DE USUARIO - IMPLEMENTADO Y FUNCIONANDO**

### **✅ Estado Actual: COMPLETAMENTE FUNCIONAL**
- **Fecha implementación**: 3 agosto 2025
- **Estado**: ✅ Probado y funcionando en servidor
- **Nivel técnico**: Senior/Expert level

### **🎯 Archivos del Contexto Global**

#### **Context Definition (src/lib/auth-context.ts)**
```typescript
import { createContextId, type QRL } from "@builder.io/qwik"
import type { User } from "@supabase/supabase-js"

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  logout: QRL<() => Promise<void>>
}

export const AuthContext = createContextId<AuthContextValue>('qwik-crm.auth.user-context')
```

#### **Hook de Consumo (src/lib/use-auth-context.ts)**
```typescript
import { useContext } from "@builder.io/qwik"
import { AuthContext, type AuthContextValue } from "./auth-context"

export const useAuthContext = (): AuthContextValue => {
  try {
    const authContext = useContext(AuthContext)
    
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

#### **Provider en Layout (src/routes/layout.tsx)**
```typescript
// 🔥 CONTEXT PROVIDER: Integración completa
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

useContextProvider(AuthContext, authContextValue)
```

### **🎨 Componentes Demo Implementados**

#### **UserProfileCard (src/components/UserProfileDemo.tsx)**
- ✅ **Funcionando**: Tarjeta completa de perfil
- ✅ **Zero Props**: Acceso directo al contexto
- ✅ **UI Moderna**: Avatar, metadatos, botón logout
- ✅ **Type Safe**: TypeScript completo

#### **QuickUserInfo (src/components/UserProfileDemo.tsx)**
- ✅ **Funcionando**: Info rápida del usuario
- ✅ **Reutilizable**: Usado en header y dashboard
- ✅ **Responsive**: Avatar compacto

#### **Header Refactorizado (src/components/HeaderNew.tsx)**
- ✅ **Migrado**: Usa contexto en lugar de hooks locales
- ✅ **Mejorado**: UI más profesional con avatar
- ✅ **Optimizado**: Zero props, lazy logout

### **📊 Dashboard Demo (src/routes/(dashboard)/index.tsx)**
- ✅ **Funcionando**: Demo completa del contexto
- ✅ **Interactivo**: Muestra datos reales del usuario
- ✅ **Educativo**: Explica beneficios técnicos
- ✅ **Responsive**: Grid layout moderno

## 🎯 **BENEFICIOS TÉCNICOS CONSEGUIDOS**

### **1. Arquitectura Server-First**
- ✅ **Server-verified**: Datos vienen de routeLoader$ con getUser()
- ✅ **Zero Flash**: Sin loading states en cliente
- ✅ **Secure**: Verificación en servidor Auth de Supabase

### **2. Performance Optimizada**
- ✅ **QRL Functions**: logout lazy-loaded
- ✅ **Bundle Splitting**: JavaScript mínimo
- ✅ **Zero Re-renders**: Contexto sin estado local

### **3. Developer Experience**
- ✅ **Type Safety**: TypeScript completo end-to-end
- ✅ **Error Handling**: Mensajes descriptivos
- ✅ **Debug Info**: Warnings en desarrollo
- ✅ **Zero Props**: useAuth() en cualquier componente

### **4. Escalabilidad**
- ✅ **Extensible**: Fácil añadir más funciones al contexto
- ✅ **Mantenible**: Separación clara de responsabilidades
- ✅ **Testeable**: Hooks aislados y contexto mockeable

## 🎯 **USO DEL CONTEXTO GLOBAL**

### **En Cualquier Componente:**
```typescript
import { useAuth } from "../lib/use-auth-context"

export default component$(() => {
  const auth = useAuth() // 🔥 ¡Así de simple!
  
  return (
    <div>
      <h1>Hola, {auth.user?.email}</h1>
      <button onClick$={auth.logout}>Cerrar Sesión</button>
      <p>Estado: {auth.isAuthenticated ? 'Conectado' : 'Desconectado'}</p>
    </div>
  )
})
```

### **Patrones Implementados:**
- ✅ **Context without local state**: Usa datos del server
- ✅ **QRL lazy functions**: Performance optimizada
- ✅ **Error boundaries**: Manejo profesional de errores
- ✅ **Type-safe context**: Interface completa

---

## 🎯 **Sistema de Autenticación Original**

### **2. Server Actions Implementados**

#### **Login Action (routes/(auth)/login/index.tsx)**
```typescript
export const useLoginAction = routeAction$(async (values, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message],
        timestamp: Date.now() // ✨ Fuerza reset del form
      })
    }
    
    throw requestEvent.redirect(302, '/') // ✨ Única forma de redirect
  } catch (error) {
    if (error instanceof Response) throw error
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor'],
      timestamp: Date.now()
    })
  }
}, zod$({
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}))
```

#### **Register Action (routes/(auth)/register/index.tsx)**
```typescript
export const useRegisterAction = routeAction$(async (values, requestEvent) => {
  // Validación personalizada de contraseñas
  if (values.password !== values.confirmPassword) {
    return requestEvent.fail(400, {
      fieldErrors: {
        confirmPassword: ['Las contraseñas no coinciden']
      },
      formErrors: []
    })
  }

  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })
    
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message]
      })
    }
    
    return {
      success: true,
      message: 'Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.'
    }
  } catch (error) {
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor']
    })
  }
}, zod$({
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}))
```

#### **Forgot Password Action**
```typescript
export const useForgotPasswordAction = routeAction$(async (values, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${requestEvent.url.origin}/reset-password`
    })
    
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message]
      })
    }
    
    return {
      success: true,
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña.'
    }
  } catch (error) {
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor']
    })
  }
}, zod$({
  email: z.string().email('Por favor ingresa un email válido'),
}))
```

### **3. Protección de Rutas (routes/layout.tsx)**

#### **Auth Loader - Verificación Server-Side**
```typescript
export const useAuthLoader = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()
  
  const pathname = requestEvent.url.pathname
  const isAuthRoute = isAuthenticationRoute(pathname)
  
  // Si no hay sesión y no está en ruta de auth → redirigir al login
  if (!session && !isAuthRoute) {
    throw requestEvent.redirect(302, '/login')
  }
  
  // Si hay sesión y está en login/register → redirigir al dashboard
  if (session && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    throw requestEvent.redirect(302, '/')
  }
  
  return {
    session,
    isAuthRoute
  }
})
```

#### **Layout Condicional**
```typescript
export default component$(() => {
  const authState = useAuthLoader()
  const isAuthRoute = authState.value.isAuthRoute
  
  // Si es una ruta de auth, renderizar solo el slot
  if (isAuthRoute) {
    return <Slot />
  }
  
  // Para las rutas del dashboard, renderizar con sidebar y header
  return (
    <div class="flex h-screen bg-gray-100">
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div class="container mx-auto px-6 py-8">
            <Slot />
          </div>
        </main>
      </div>
    </div>
  )
})
```

### **4. Formularios con Progressive Enhancement**

#### **Patrón Estándar Implementado**
```typescript
// 1. Form con key para reset automático
<Form action={loginAction} class="mt-8 space-y-6" key={formKey.value}>

// 2. Inputs SIN value prop (no mantienen estado entre submissions)
<input
  name="email"
  type="email"
  autoComplete="email"
  required
  class={`${errorStyles}`}
  placeholder="email@email.com"
/>

// 3. Manejo de errores de campo específicos
{loginAction.value?.fieldErrors?.email && (
  <p class="mt-1 text-sm text-red-600">
    {loginAction.value.fieldErrors.email[0]}
  </p>
)}

// 4. Button con estado automático
<button
  type="submit"
  disabled={loginAction.isRunning}
  class="..."
>
  {loginAction.isRunning ? 'Procesando...' : 'Enviar'}
</button>
```

### **5. Reset de Formularios con useTask$**

#### **Patrón para Limpiar Estado**
```typescript
const formKey = useSignal(Date.now())

useTask$(({ track }) => {
  track(() => loginAction.value)
  
  // Cuando hay errores, regenerar key del formulario
  if (loginAction.value?.formErrors || loginAction.value?.fieldErrors) {
    formKey.value = Date.now() // ✨ Nuevo timestamp = nuevo Form
  }
})
```

## 🎯 **Integración Supabase**

### **1. Configuración de Clientes**

#### **Cliente Browser (createClient)**
```typescript
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
```

#### **Cliente Server (createServerSupabaseClient)**
```typescript
export const createServerSupabaseClient = (requestEvent: RequestEventCommon) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookieHeader = requestEvent.request.headers.get('cookie')
        if (!cookieHeader) return []
        
        return cookieHeader.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=')
          return {
            name: name || '',
            value: value ? decodeURIComponent(value) : ''
          }
        }).filter(cookie => cookie.name && cookie.value)
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (requestEvent.cookie) {
            requestEvent.cookie.set(name, value, {
              path: '/',
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 365,
              ...options
            })
          }
        })
      },
    },
  })
}
```

### **2. Manejo de Cookies Moderno**
- ✅ **API moderna:** `getAll()` y `setAll()` (no deprecada)
- ✅ **Integración Qwik:** Usa `requestEvent.cookie.set()`
- ✅ **Configuración segura:** httpOnly, secure, sameSite
- ✅ **Persistencia:** maxAge de 1 año

## 🎯 **Patrones de Componentes**

### **1. Estructura de Página Estándar**
```typescript
export default component$(() => {
  const action = useAction()
  
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2>Título</h2>
        </div>
        
        <Form action={action} key={formKey.value}>
          {/* Campos del formulario */}
        </Form>
      </div>
    </div>
  )
})
```

### **2. DocumentHead Estándar**
```typescript
export const head: DocumentHead = {
  title: 'Página - CRM',
  meta: [
    {
      name: 'description',
      content: 'Descripción de la página',
    },
  ],
}
```

## 🎯 **Variables de Entorno**

### **Configuración Segura (.env)**
```bash
# Supabase Configuration
VITE_SUPABASE_URL="https://uyradeufmhqymutizwvt.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Development Configuration
VITE_NODE_ENV=development
```

### **Validación en supabase.ts**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno requeridas:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY\n' +
    'Crea un archivo .env con estas variables.'
  )
}
```
