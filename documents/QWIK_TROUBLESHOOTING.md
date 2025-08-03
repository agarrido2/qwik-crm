# Troubleshooting y Soluciones - Qwik CRM

## 🚨 **Problemas Comunes y Soluciones**

### **1. Login Exitoso No Redirige al Dashboard**

#### **💥 Problema:**
```
- Usuario hace login correctamente
- No se redirige al dashboard 
- Las cookies no se almacenan
```

#### **🔍 Causa Raíz:**
```typescript
// ❌ PROBLEMA: Cookie API incorrecta
set: (key: string, value: string, options?: any) => {
  console.log('Setting cookie:', key) // Solo logging, no acción real
}
```

#### **✅ Solución Implementada:**
```typescript
// ✅ SOLUCIÓN: API moderna de @supabase/ssr v0.6+
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

### **2. Flash de Contenido No Autenticado (FOUC)**

#### **💥 Problema:**
```
- Usuario autenticado ve login por milisegundos
- Pantalla parpadea entre login y dashboard
- Mala experiencia de usuario
```

#### **🔍 Causa Raíz:**
```typescript
// ❌ PROBLEMA: Verificación client-side
useVisibleTask$(async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    nav('/login') // Flash visible antes del redirect
  }
})
```

#### **✅ Solución Implementada:**
```typescript
// ✅ SOLUCIÓN: Verificación server-side con routeLoader$
export const useAuthLoader = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session } } = await supabase.auth.getSession()
  
  const pathname = requestEvent.url.pathname
  const isAuthRoute = isAuthenticationRoute(pathname)
  
  // Redirect en el servidor (sin flash)
  if (!session && !isAuthRoute) {
    throw requestEvent.redirect(302, '/login')
  }
  
  if (session && isAuthRoute) {
    throw requestEvent.redirect(302, '/')
  }
  
  return { session, isAuthRoute }
})
```

### **3. Formularios No Se Resetean Después de Errores**

#### **💥 Problema:**
```
- Usuario comete error en formulario
- Corrige el error y envía de nuevo
- Formulario mantiene estado del error anterior
```

#### **🔍 Causa Raíz:**
```typescript
// ❌ PROBLEMA: Form sin key o key estática
<Form action={loginAction} class="mt-8 space-y-6">
  {/* Sin manera de forzar re-render */}
</Form>
```

#### **✅ Solución Implementada:**
```typescript
// ✅ SOLUCIÓN: Form key dinámico con useTask$
const formKey = useSignal(Date.now())

useTask$(({ track }) => {
  track(() => loginAction.value)
  
  // Regenerar key cuando hay errores (fuerza re-render)
  if (loginAction.value?.formErrors || loginAction.value?.fieldErrors) {
    formKey.value = Date.now()
  }
})

return (
  <Form action={loginAction} key={formKey.value}>
    {/* Form se recrea completamente */}
  </Form>
)
```

### **4. useVisibleTask$ vs useTask$ Confusion**

#### **💥 Problema:**
```
- Usar useVisibleTask$ para reactividad general
- Warnings de ESLint constantes
- Performance subóptima
```

#### **🔍 Causa Raíz:**
```typescript
// ❌ PROBLEMA: useVisibleTask$ innecesario
// eslint-disable-next-line qwik/no-use-visible-task
useVisibleTask$(({ track }) => {
  track(() => loginAction.value)
  // Lógica que no requiere cliente específicamente
})
```

#### **✅ Solución Implementada:**
```typescript
// ✅ SOLUCIÓN: useTask$ para reactividad general
useTask$(({ track }) => {
  track(() => loginAction.value)
  
  // Se ejecuta en servidor Y cliente (más eficiente)
  if (loginAction.value?.formErrors || loginAction.value?.fieldErrors) {
    formKey.value = Date.now()
  }
})

// ✅ useVisibleTask$ SOLO para APIs del browser
// eslint-disable-next-line qwik/no-use-visible-task
useVisibleTask$(() => {
  // Solo para DOM manipulation, localStorage, etc.
  document.addEventListener('click', handler)
})
```

### **5. Variables de Entorno Hardcodeadas**

#### **💥 Problema:**
```
- Credenciales expuestas en el código fuente
- Riesgo de seguridad en repositorios públicos
- Problemas con diferentes entornos
```

#### **🔍 Causa Raíz:**
```typescript
// ❌ PROBLEMA: Credenciales hardcodeadas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://hardcoded-url.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "hardcoded-key"
```

#### **✅ Solución Implementada:**
```typescript
// ✅ SOLUCIÓN: Solo variables de entorno + validación
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación estricta
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno requeridas:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY\n' +
    'Crea un archivo .env con estas variables.'
  )
}
```

### **6. API Deprecada de Supabase SSR**

#### **💥 Problema:**
```
- Warnings de deprecación en consola
- API antigua get(), set(), remove()
- Posible ruptura en futuras versiones
```

#### **🔍 Causa Raíz:**
```typescript
// ❌ PROBLEMA: API deprecada
createServerClient(url, key, {
  cookies: {
    get: (key) => getCookie(key),
    set: (key, value) => setCookie(key, value),
    remove: (key) => removeCookie(key)
  }
})
```

#### **✅ Solución Implementada:**
```typescript
// ✅ SOLUCIÓN: API moderna @supabase/ssr v0.6+
createServerClient(url, key, {
  cookies: {
    getAll() {
      // Retorna array de cookies
      return parseCookies()
    },
    setAll(cookiesToSet) {
      // Establece múltiples cookies eficientemente
      cookiesToSet.forEach(({ name, value, options }) => {
        requestEvent.cookie.set(name, value, options)
      })
    }
  }
})
```

## 🛠️ **Herramientas de Debug**

### **1. Debug de Server Actions**

#### **Logging Estructurado:**
```typescript
export const useLoginAction = routeAction$(async (values, requestEvent) => {
  console.log('🔵 Login attempt:', {
    email: values.email,
    timestamp: new Date().toISOString(),
    userAgent: requestEvent.request.headers.get('user-agent')
  })
  
  try {
    const { error } = await supabase.auth.signInWithPassword(values)
    
    if (error) {
      console.log('🔴 Login failed:', error.message)
      return requestEvent.fail(400, {
        fieldErrors: {},
        formErrors: [error.message]
      })
    }
    
    console.log('🟢 Login successful, redirecting...')
    throw requestEvent.redirect(302, '/')
  } catch (error) {
    console.log('🟠 Unexpected error:', error)
    // Handle error
  }
})
```

### **2. Debug de Cookies**

#### **Inspección de Cookies:**
```typescript
// En browser dev tools
document.cookie // Ver todas las cookies

// En server-side debugging
export const debugCookies = (requestEvent: any) => {
  const cookieHeader = requestEvent.request.headers.get('cookie')
  console.log('🍪 Raw cookies:', cookieHeader)
  
  if (cookieHeader) {
    const parsed = cookieHeader.split(';').map(cookie => {
      const [name, value] = cookie.trim().split('=')
      return { name, value }
    })
    console.log('🍪 Parsed cookies:', parsed)
  }
}
```

### **3. Debug de Auth State**

#### **Verificación de Estado:**
```typescript
export const debugAuthState = async (requestEvent: any) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { session }, error } = await supabase.auth.getSession()
  
  console.log('🔐 Auth Debug:', {
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
    expiresAt: session?.expires_at,
    error: error?.message
  })
  
  return session
}
```

## 🔧 **Scripts de Diagnóstico**

### **1. Script de Verificación de Setup**

#### **verify-setup.js:**
```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando configuración del proyecto...\n')

// Verificar .env
const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env encontrado')
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  if (envContent.includes('VITE_SUPABASE_URL')) {
    console.log('✅ VITE_SUPABASE_URL configurado')
  } else {
    console.log('❌ VITE_SUPABASE_URL faltante')
  }
  
  if (envContent.includes('VITE_SUPABASE_ANON_KEY')) {
    console.log('✅ VITE_SUPABASE_ANON_KEY configurado')
  } else {
    console.log('❌ VITE_SUPABASE_ANON_KEY faltante')
  }
} else {
  console.log('❌ Archivo .env no encontrado')
}

// Verificar package.json
const packagePath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  if (pkg.dependencies['@supabase/ssr']) {
    console.log('✅ @supabase/ssr instalado:', pkg.dependencies['@supabase/ssr'])
  } else {
    console.log('❌ @supabase/ssr no instalado')
  }
  
  if (pkg.devDependencies['@builder.io/qwik']) {
    console.log('✅ Qwik instalado:', pkg.devDependencies['@builder.io/qwik'])
  } else {
    console.log('❌ Qwik no instalado')
  }
}

console.log('\n🏁 Verificación completada')
```

### **2. Health Check Route**

#### **routes/api/health/index.ts:**
```typescript
import type { RequestHandler } from '@builder.io/qwik-city'
import { createServerSupabaseClient } from '~/lib/supabase'

export const onGet: RequestHandler = async (requestEvent) => {
  try {
    // Test Supabase connection
    const supabase = createServerSupabaseClient(requestEvent)
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: error ? 'error' : 'ok',
      environment: import.meta.env.VITE_NODE_ENV || 'unknown'
    }
    
    requestEvent.json(200, health)
  } catch (error) {
    requestEvent.json(500, {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
```

## 📋 **Checklist de Troubleshooting**

### **Cuando algo no funciona:**

#### **1. ✅ Verificar Variables de Entorno**
```bash
# Verificar que .env existe y tiene las variables
cat .env | grep VITE_SUPABASE

# Verificar que las variables se cargan
echo $VITE_SUPABASE_URL
```

#### **2. ✅ Verificar Logs del Servidor**
```bash
# Iniciar con logs verbose
bun run dev

# Buscar errores específicos
grep -i "error\|fail\|404" logs.txt
```

#### **3. ✅ Verificar Network Tab**
```
- Abrir DevTools → Network
- Hacer login y verificar:
  * ✅ Request a /login con status 200
  * ✅ Response contiene redirect
  * ✅ Cookies se establecen correctamente
```

#### **4. ✅ Verificar Application Tab**
```
- DevTools → Application → Cookies
- Verificar que cookies de Supabase existen:
  * sb-[project]-auth-token
  * sb-[project]-auth-token.0, .1, etc.
```

#### **5. ✅ Verificar Supabase Dashboard**
```
- Logs de autenticación
- Configuración de URLs
- Políticas RLS
- Usuarios registrados
```

### **Comandos de Emergencia:**

```bash
# Reset completo
rm -rf node_modules bun.lockb
bun install
bun run dev

# Debug mode
DEBUG=1 bun run dev

# Build para verificar errores
bun run build

# Verificar tipos
bun run build.types
```
