# Quick Reference Guide - Qwik CRM

## 🚀 **Comandos Esenciales**

### **Desarrollo**
```bash
bun run dev              # Servidor desarrollo (Puerto 5173)
bun run dev.debug        # Servidor con debug mode
bun run build            # Build para producción
bun run preview          # Preview del build
```

### **Calidad de Código**
```bash
bun run lint             # ESLint
bun run fmt              # Prettier format
bun run fmt.check        # Check formatting
bun run build.types      # Verificar tipos TypeScript
```

## 🎯 **Patrones de Código Rápidos**

### **1. Server Action Básico**
```typescript
export const useAction = routeAction$(async (values, requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  
  try {
    const { error } = await supabase.someMethod(values)
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message],
        timestamp: Date.now()
      })
    }
    throw requestEvent.redirect(302, '/success')
  } catch (error) {
    if (error instanceof Response) throw error
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno'],
      timestamp: Date.now()
    })
  }
}, zod$({
  field: z.string().min(1, 'Required')
}))
```

### **2. Formulario con Reset Automático**
```typescript
export default component$(() => {
  const action = useAction()
  const formKey = useSignal(Date.now())
  
  useTask$(({ track }) => {
    track(() => action.value)
    if (action.value?.formErrors || action.value?.fieldErrors) {
      formKey.value = Date.now()
    }
  })
  
  return (
    <Form action={action} key={formKey.value}>
      <input name="field" required />
      <button type="submit" disabled={action.isRunning}>
        {action.isRunning ? 'Loading...' : 'Submit'}
      </button>
    </Form>
  )
})
```

### **3. Route Loader con Auth**
```typescript
export const useLoader = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw requestEvent.redirect(302, '/login')
  }
  
  return { session }
})
```

### **4. Layout Condicional**
```typescript
export default component$(() => {
  const authState = useAuthLoader()
  const isAuthRoute = authState.value.isAuthRoute
  
  if (isAuthRoute) {
    return <Slot />
  }
  
  return (
    <div class="layout">
      <Sidebar />
      <main><Slot /></main>
    </div>
  )
})
```

## 🛠️ **Supabase Quick Setup**

### **1. Cliente Server**
```typescript
export const createServerSupabaseClient = (requestEvent: RequestEventCommon) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookieHeader = requestEvent.request.headers.get('cookie')
        if (!cookieHeader) return []
        return cookieHeader.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=')
          return { name: name || '', value: value ? decodeURIComponent(value) : '' }
        }).filter(cookie => cookie.name && cookie.value)
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (requestEvent.cookie) {
            requestEvent.cookie.set(name, value, {
              path: '/', httpOnly: true, secure: true, sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 365, ...options
            })
          }
        })
      },
    },
  })
}
```

### **2. Cliente Browser**
```typescript
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
```

## 📋 **Validación Zod Rápida**

### **Esquemas Comunes**
```typescript
const authSchemas = {
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  
  login: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
  }),
  
  register: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma contraseña'),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Contraseñas no coinciden",
    path: ["confirmPassword"],
  })
}
```

## 🎨 **Clases CSS Rápidas**

### **Layout**
```css
.layout-container { @apply flex h-screen bg-gray-100; }
.main-content { @apply flex-1 flex flex-col overflow-hidden; }
.content-area { @apply flex-1 overflow-x-hidden overflow-y-auto bg-gray-100; }
```

### **Formularios**
```css
.form-container { @apply min-h-screen flex items-center justify-center bg-gray-50; }
.form-card { @apply max-w-md w-full space-y-8; }
.form-input { @apply appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500; }
.form-input-error { @apply border-red-300; }
.btn-primary { @apply w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50; }
```

### **Errores**
```css
.error-container { @apply rounded-md bg-red-50 p-4; }
.error-message { @apply text-sm text-red-700; }
.field-error { @apply mt-1 text-sm text-red-600; }
```

## 🔧 **Debug Rápido**

### **Logs Estructurados**
```typescript
console.log('🔵 Info:', data)
console.log('🟢 Success:', result)
console.log('🟠 Warning:', warning)
console.log('🔴 Error:', error)
```

### **Verificar Auth State**
```typescript
const debugAuth = async (requestEvent: any) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()
  console.log('🔐 Auth:', {
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email
  })
}
```

### **Verificar Cookies**
```typescript
const debugCookies = (requestEvent: any) => {
  const cookies = requestEvent.request.headers.get('cookie')
  console.log('🍪 Cookies:', cookies)
}
```

## 📁 **Estructura de Archivos**

### **Nuevo Componente**
```typescript
// src/components/MyComponent.tsx
import { component$ } from '@builder.io/qwik'

export default component$(() => {
  return <div>My Component</div>
})
```

### **Nueva Ruta**
```typescript
// src/routes/nueva-ruta/index.tsx
import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => {
  return <div>Nueva Ruta</div>
})

export const head: DocumentHead = {
  title: 'Nueva Ruta - CRM',
  meta: [{ name: 'description', content: 'Descripción' }],
}
```

### **Nuevo Helper**
```typescript
// src/lib/my-helper.ts
export const myHelper = (param: string) => {
  return param.toUpperCase()
}
```

## 🚨 **Troubleshooting Rápido**

### **Login No Funciona**
1. ✅ Verificar `.env` tiene variables correctas
2. ✅ Verificar cookies en DevTools → Application
3. ✅ Verificar Network tab para errores 400/500
4. ✅ Verificar logs del servidor en terminal

### **Flash de Contenido**
1. ✅ Usar `routeLoader$` en lugar de `useVisibleTask$`
2. ✅ Verificar que redirect usa `throw requestEvent.redirect()`
3. ✅ No usar navegación client-side en server actions

### **Formulario No Se Resetea**
1. ✅ Usar `key={formKey.value}` en Form
2. ✅ Implementar `useTask$` para regenerar key
3. ✅ No usar `value` props en inputs

### **Variables de Entorno**
1. ✅ Verificar que `.env` existe
2. ✅ Variables deben empezar con `VITE_`
3. ✅ Reiniciar servidor después de cambios

## 📚 **Documentos de Referencia**

1. **QWIK_STUDY_COMPLETE.md** - Fundamentos y teoría
2. **QWIK_IMPLEMENTATIONS.md** - Implementaciones específicas
3. **QWIK_HELPERS_HOOKS.md** - Helpers y custom hooks
4. **QWIK_SETUP_CONFIG.md** - Configuración completa
5. **QWIK_PATTERNS_PRACTICES.md** - Patrones de código
6. **QWIK_TROUBLESHOOTING.md** - Solución de problemas

## 🎯 **Protocolo de Recuperación**

**Al reiniciar la sesión, lee:**

> "Lee todos los documentos en la carpeta 'documents' y alcanza el nivel de Qwik que tenías ayer"

**Los documentos contienen:**
- ✅ Fundamentos teóricos completos
- ✅ Implementaciones prácticas paso a paso  
- ✅ Código específico con explicaciones
- ✅ Configuraciones exactas reproducibles
- ✅ Soluciones a problemas específicos
- ✅ Quick reference para consultas rápidas
