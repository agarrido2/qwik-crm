# Helpers y Custom Hooks - Qwik CRM

## 🎯 **Custom Hooks Implementados**

### **1. useAuth Hook**

#### **Ubicación:** `src/lib/use-auth.ts`
```typescript
import { useSignal, useTask$ } from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik/build'
import { createClient } from './supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Custom Hook para gestión del estado de autenticación
 * ✅ Reactivo con useSignal
 * ✅ Solo se ejecuta en el cliente (useVisibleTask$)
 * ✅ Maneja cambios de sesión automáticamente
 */
export const useAuth = () => {
  const user = useSignal<User | null>(null)
  const loading = useSignal(true)
  
  // Solo ejecutar en el cliente
  useTask$(async () => {
    if (isServer) return
    
    const supabase = createClient()
    
    // Obtener sesión inicial
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    loading.value = false
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        user.value = session?.user ?? null
        loading.value = false
      }
    )
    
    // Cleanup function
    return () => subscription.unsubscribe()
  })
  
  return {
    user: user.value,
    loading: loading.value,
    isAuthenticated: !!user.value
  }
}
```

### **2. Custom Hook para Form Reset**

#### **Patrón Reutilizable**
```typescript
/**
 * Hook para reset automático de formularios
 * ✅ Se usa en login, register, forgot-password
 * ✅ Fuerza re-render del Form cuando hay errores
 */
export const useFormReset = (action: any) => {
  const formKey = useSignal(Date.now())
  
  useTask$(({ track }) => {
    track(() => action.value)
    
    if (action.value?.formErrors || action.value?.fieldErrors) {
      formKey.value = Date.now()
    }
  })
  
  return formKey
}

// Uso en componentes:
export default component$(() => {
  const loginAction = useLoginAction()
  const formKey = useFormReset(loginAction)
  
  return (
    <Form action={loginAction} key={formKey.value}>
      {/* Formulario */}
    </Form>
  )
})
```

## 🎯 **Helpers de Supabase**

### **1. withSupabase Helper**

#### **Ubicación:** `src/lib/auth-helpers.ts`
```typescript
import { createServerSupabaseClient } from './supabase'
import type { RequestEventCommon } from '@builder.io/qwik-city'

/**
 * Higher-Order Function para eliminar boilerplate de Supabase
 * ✅ Maneja errores automáticamente
 * ✅ Pasa cliente Supabase inicializado
 * ✅ Reduce código repetitivo
 */
export const withSupabase = <T>(
  handler: (supabase: any, requestEvent: RequestEventCommon) => Promise<T>
) => {
  return async (requestEvent: RequestEventCommon): Promise<T> => {
    try {
      const supabase = createServerSupabaseClient(requestEvent)
      return await handler(supabase, requestEvent)
    } catch (error) {
      console.error('Supabase error:', error)
      throw error
    }
  }
}

// Uso en routeAction$:
export const useLoginAction = routeAction$(
  withSupabase(async (supabase, requestEvent) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    
    if (error) {
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message]
      })
    }
    
    throw requestEvent.redirect(302, '/')
  }),
  zod$({ /* schema */ })
)
```

### **2. Auth Schemas Helper**

#### **Ubicación:** `src/lib/auth-schemas.ts`
```typescript
import { z } from 'zod'

/**
 * Esquemas de validación centralizados
 * ✅ Reutilizables en múltiples formularios
 * ✅ Consistencia en validaciones
 * ✅ Fácil mantenimiento
 */
export const authSchemas = {
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  
  // Esquemas compuestos
  login: z.object({
    email: z.string().email('Por favor ingresa un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
  
  register: z.object({
    email: z.string().email('Por favor ingresa un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }),
  
  forgotPassword: z.object({
    email: z.string().email('Por favor ingresa un email válido'),
  }),
  
  resetPassword: z.object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
}

// Uso en routeAction$:
export const useLoginAction = routeAction$(async (values, requestEvent) => {
  // Lógica del action
}, zod$(authSchemas.login))
```

### **3. Password Validation Helper**

#### **Función Reutilizable**
```typescript
/**
 * Helper para validación de contraseñas coincidentes
 * ✅ Reutilizable en register y reset-password
 * ✅ Manejo consistente de errores
 */
export const validatePasswordMatch = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: {
        fieldErrors: {
          confirmPassword: ['Las contraseñas no coinciden']
        },
        formErrors: []
      }
    }
  }
  
  return { isValid: true, error: null }
}

// Uso en actions:
export const useRegisterAction = routeAction$(async (values, requestEvent) => {
  const validation = validatePasswordMatch(values.password, values.confirmPassword)
  
  if (!validation.isValid) {
    return requestEvent.fail(400, validation.error)
  }
  
  // Continuar con registro...
}, zod$(authSchemas.register))
```

## 🎯 **Utilities Generales**

### **1. Route Helper Functions**

#### **Ubicación:** `src/lib/route-utils.ts`
```typescript
/**
 * Helper para determinar tipo de ruta
 * ✅ Centraliza lógica de routing
 * ✅ Fácil mantenimiento
 */
export const isAuthenticationRoute = (pathname: string): boolean => {
  return pathname.startsWith('/login') || 
         pathname.startsWith('/register') ||
         pathname.startsWith('/forgot-password') ||
         pathname.startsWith('/reset-password')
}

export const isDashboardRoute = (pathname: string): boolean => {
  return !isAuthenticationRoute(pathname) && pathname !== '/'
}

export const getRouteType = (pathname: string): 'auth' | 'dashboard' | 'home' => {
  if (isAuthenticationRoute(pathname)) return 'auth'
  if (pathname === '/') return 'home'
  return 'dashboard'
}
```

### **2. Error Handling Helper**

#### **Manejo Consistente de Errores**
```typescript
/**
 * Helper para manejo de errores en server actions
 * ✅ Formato consistente
 * ✅ Logging automático
 */
export const handleActionError = (error: unknown, requestEvent: any) => {
  console.error('Action error:', error)
  
  if (error instanceof Response) {
    throw error // Re-throw redirects
  }
  
  if (error instanceof Error) {
    return requestEvent.fail(500, {
      fieldErrors: {},
      formErrors: ['Error interno del servidor'],
      timestamp: Date.now()
    })
  }
  
  return requestEvent.fail(500, {
    fieldErrors: {},
    formErrors: ['Error desconocido'],
    timestamp: Date.now()
  })
}

// Uso en actions:
export const useLoginAction = routeAction$(async (values, requestEvent) => {
  try {
    // Lógica del action
  } catch (error) {
    return handleActionError(error, requestEvent)
  }
}, zod$(authSchemas.login))
```

### **3. Form Utilities**

#### **Helpers para Formularios**
```typescript
/**
 * Utilities para manejo de formularios Qwik
 */
export const formUtils = {
  /**
   * Genera clases CSS dinámicas para inputs con errores
   */
  getInputClasses: (hasError: boolean, baseClasses: string = '') => {
    const defaultClasses = 'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
    const errorClasses = hasError ? 'border-red-300' : 'border-gray-300'
    
    return `${defaultClasses} ${errorClasses} ${baseClasses}`.trim()
  },
  
  /**
   * Extrae errores de campo específico
   */
  getFieldError: (actionValue: any, fieldName: string): string | undefined => {
    return actionValue?.fieldErrors?.[fieldName]?.[0]
  },
  
  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError: (actionValue: any, fieldName: string): boolean => {
    return !!(actionValue?.fieldErrors?.[fieldName]?.length)
  }
}

// Uso en componentes:
<input
  name="email"
  type="email"
  class={formUtils.getInputClasses(
    formUtils.hasFieldError(loginAction.value, 'email')
  )}
/>

{formUtils.getFieldError(loginAction.value, 'email') && (
  <p class="mt-1 text-sm text-red-600">
    {formUtils.getFieldError(loginAction.value, 'email')}
  </p>
)}
```

## 🎯 **Type Definitions**

### **1. Auth Types**

#### **Ubicación:** `src/lib/types.ts`
```typescript
import type { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export interface FormError {
  fieldErrors: Record<string, string[]>
  formErrors: string[]
  timestamp?: number
}

export interface ActionResult<T = any> {
  success?: boolean
  message?: string
  data?: T
  fieldErrors?: Record<string, string[]>
  formErrors?: string[]
  timestamp?: number
}
```

### **2. Route Types**
```typescript
export type RouteType = 'auth' | 'dashboard' | 'home'

export interface RouteConfig {
  path: string
  type: RouteType
  requiresAuth: boolean
  redirectOnAuth?: string
}
```

## 🎯 **Composables Patterns**

### **1. Data Fetching Composable**
```typescript
/**
 * Composable para fetch de datos con Supabase
 */
export const useSupabaseQuery = <T>(
  queryFn: (supabase: any) => Promise<T>,
  dependencies: any[] = []
) => {
  const data = useSignal<T | null>(null)
  const loading = useSignal(true)
  const error = useSignal<string | null>(null)
  
  useTask$(async ({ track }) => {
    dependencies.forEach(dep => track(() => dep))
    
    if (isServer) return
    
    try {
      loading.value = true
      error.value = null
      const supabase = createClient()
      const result = await queryFn(supabase)
      data.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
    } finally {
      loading.value = false
    }
  })
  
  return {
    data: data.value,
    loading: loading.value,
    error: error.value
  }
}
```
