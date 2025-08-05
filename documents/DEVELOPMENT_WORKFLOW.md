# 🚀 DEVELOPMENT WORKFLOW - QWIK CRM

**Versión:** 2.0 - Workflow Optimizado  
**Fecha:** 5 de agosto de 2025  
**Propósito:** Guía práctica para desarrollo, testing y deployment

---

## ⚡ **QUICK START**

### **📦 COMANDOS ESENCIALES**

#### **Desarrollo Diario**
```bash
# Servidor de desarrollo
bun dev                     # Puerto 5173 con HMR
bun dev.debug              # Con debugging habilitado

# Build y preview
bun build                  # Build producción
bun preview               # Preview del build

# Calidad de código
bun lint                  # ESLint check
bun fmt                   # Prettier format
bun type-check           # TypeScript validation
```

#### **Setup Inicial**
```bash
# 1. Clonar proyecto
git clone <repository>
cd qwik-crm

# 2. Instalar dependencias
bun install

# 3. Variables de entorno
cp .env.example .env.local
# Configurar SUPABASE_URL y SUPABASE_ANON_KEY

# 4. Iniciar desarrollo
bun dev
```

---

## 🏗️ **ESTRUCTURA DE DESARROLLO**

### **📁 CREACIÓN DE NUEVAS FEATURES**

#### **1. Feature Structure Template**
```bash
# Crear nueva feature
mkdir -p src/features/nueva-feature/{components,hooks,services,schemas}

# Estructura esperada:
src/features/nueva-feature/
├── index.ts                    # Exports centralizados
├── components/                 # UI components
│   ├── ComponenteA.tsx
│   └── ComponenteB.tsx
├── hooks/                      # Custom hooks
│   └── use-nueva-feature.ts
├── services/                   # Business logic
│   └── nueva-feature-service.ts
└── schemas/                    # Validation schemas
    └── nueva-feature-schemas.ts
```

#### **2. Implementation Pattern**
```tsx
// src/features/nueva-feature/index.ts
export { ComponenteA, ComponenteB } from './components'
export { useNuevaFeature } from './hooks'
export * from './services'
export * from './schemas'

// src/features/nueva-feature/components/ComponenteA.tsx
import { component$ } from "@builder.io/qwik"

interface ComponenteAProps {
  readonly title: string
  readonly onAction$?: QRL<() => void>
}

export const ComponenteA = component$<ComponenteAProps>(({ 
  title, 
  onAction$ 
}) => {
  return (
    <div class="componente-a">
      <h3>{title}</h3>
      <button onClick$={onAction$}>Action</button>
    </div>
  )
})

// Uso en aplicación
import { ComponenteA } from '~/features/nueva-feature'
```

### **🛣️ CREACIÓN DE RUTAS**

#### **Route Pattern por Tipo**
```bash
# Rutas públicas → (landing)
src/routes/(landing)/nueva-pagina/index.tsx

# Rutas de autenticación → (auth)  
src/routes/(auth)/nueva-auth/index.tsx

# Rutas protegidas → (crm)
src/routes/(crm)/nueva-seccion/index.tsx
```

#### **Route Template**
```tsx
// src/routes/(crm)/nueva-seccion/index.tsx
import { component$ } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import { createServerSupabaseClient } from '~/lib/database'

// Server-side data loading
export const useNuevaSeccionData = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw requestEvent.redirect(302, '/auth/login')
  }
  
  // Cargar datos específicos
  const { data } = await supabase
    .from('tabla')
    .select('*')
    .eq('user_id', user.id)
  
  return { data, user }
})

// Component
export default component$(() => {
  const seccionData = useNuevaSeccionData()
  
  return (
    <div class="nueva-seccion">
      <h1>Nueva Sección</h1>
      <pre>{JSON.stringify(seccionData.value, null, 2)}</pre>
    </div>
  )
})

// Page metadata
export const head: DocumentHead = {
  title: "Nueva Sección - Qwik CRM",
  meta: [
    {
      name: "description",
      content: "Descripción de la nueva sección",
    },
  ],
}
```

### **🎨 COMPONENTES UI**

#### **Component Template**
```tsx
// src/shared/components/ui/Button.tsx
import { component$, type QRL } from "@builder.io/qwik"

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly disabled?: boolean
  readonly loading?: boolean
  readonly type?: 'button' | 'submit' | 'reset'
  readonly onClick$?: QRL<() => void>
  readonly children: any
}

export const Button = component$<ButtonProps>(({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick$,
  children
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
  ].join(' ')
  
  return (
    <button
      type={type}
      class={classes}
      disabled={disabled || loading}
      onClick$={onClick$}
    >
      {loading && <span class="animate-spin mr-2">⭐</span>}
      {children}
    </button>
  )
})
```

---

## 🧪 **TESTING STRATEGY**

### **📋 Testing Setup** (Próximamente)
```bash
# Instalar testing dependencies
bun add -d vitest @testing-library/qwik jsdom

# Configurar vitest.config.ts
import { defineConfig } from 'vitest/config'
import { qwikVite } from '@builder.io/qwik/optimizer'

export default defineConfig({
  test: {
    environment: 'jsdom'
  },
  plugins: [qwikVite()]
})
```

### **🧪 Test Patterns**
```tsx
// tests/components/Button.test.tsx
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/qwik'
import { Button } from '~/shared/components/ui/Button'

test('Button renders with correct text', async () => {
  await render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeTruthy()
})

test('Button calls onClick when clicked', async () => {
  let clicked = false
  const handleClick = $(() => { clicked = true })
  
  await render(<Button onClick$={handleClick}>Click me</Button>)
  await userEvent.click(screen.getByText('Click me'))
  
  expect(clicked).toBe(true)
})
```

### **🔍 E2E Testing** (Próximamente)
```tsx
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login and access dashboard', async ({ page }) => {
  await page.goto('/auth/login')
  
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('Dashboard')
})
```

---

## 🔧 **DEBUGGING & TROUBLESHOOTING**

### **🐛 DEBUGGING PATTERNS**

#### **Server-side Debugging**
```tsx
// En routeLoader$ o routeAction$
export const useDebugLoader = routeLoader$(async (requestEvent) => {
  console.log('🔍 Server Debug:', {
    url: requestEvent.url.pathname,
    method: requestEvent.request.method,
    headers: Object.fromEntries(requestEvent.request.headers)
  })
  
  return { debug: 'server data' }
})
```

#### **Client-side Debugging**
```tsx
// En componentes
export default component$(() => {
  const debugSignal = useSignal('initial')
  
  useVisibleTask$(() => {
    console.log('🔍 Client Debug: Component mounted')
  })
  
  useTask$(({ track }) => {
    const value = track(() => debugSignal.value)
    console.log('🔍 Signal Debug:', value)
  })
  
  return <div>Debug Component</div>
})
```

### **❌ ERRORES COMUNES Y SOLUCIONES**

#### **1. "Cannot find module" Errors**
```bash
# ❌ Error común
Error: Cannot find module '~/features/auth'

# ✅ Solución: Verificar exports
# src/features/auth/index.ts debe existir y exportar todo
export { useAuth } from './hooks/use-auth-context'
export { AuthContext } from './auth-context'
```

#### **2. "routeLoader$ outside route boundary"**
```tsx
// ❌ INCORRECTO
const MyComponent = component$(() => {
  const data = useRouteLoader() // Error!
})

// ✅ CORRECTO - Solo en route files
// src/routes/pagina/index.tsx
export const usePageData = routeLoader$(...)
export default component$(() => {
  const data = usePageData() // ✅ Funciona
})
```

#### **3. Context Provider Issues**
```tsx
// ❌ Error: useContext returns undefined
const auth = useContext(AuthContext) // undefined

// ✅ Verificación: Provider debe estar en layout.tsx
// src/routes/layout.tsx
useContextProvider(AuthContext, contextValue) // ✅ Required
```

### **🔧 DEBUG COMMANDS**
```bash
# Verificar estructura
find src -name "*.tsx" -o -name "*.ts" | grep -E "(index|component)" | head -10

# Verificar imports problemáticos
grep -r "import.*from.*'~/" src/ | grep -v "node_modules"

# Verificar build issues
bun run build --verbose

# Analizar bundle
bun run build && npx vite-bundle-analyzer dist/
```

---

## 🚢 **DEPLOYMENT**

### **🌐 PRODUCTION BUILD**
```bash
# 1. Build optimizado
bun run build

# 2. Verificar bundle
ls -la dist/

# 3. Test local production
bun run preview

# 4. Deploy (ejemplo con Vercel)
vercel deploy
```

### **⚙️ ENVIRONMENT VARIABLES**
```bash
# .env.local (development)
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
PRIVATE_SUPABASE_SERVICE_KEY=your_service_key

# Production deployment
# Configurar las mismas variables en tu plataforma de deploy
```

### **📊 PRODUCTION CHECKLIST**
- [ ] Environment variables configuradas
- [ ] Build sin errores
- [ ] Lighthouse score > 90
- [ ] Error tracking configurado
- [ ] Analytics implementado
- [ ] Security headers configurados
- [ ] HTTPS habilitado

---

## 📈 **PERFORMANCE MONITORING**

### **🎯 METRICS TO TRACK**
```tsx
// Performance monitoring
useVisibleTask$(() => {
  // Core Web Vitals
  if ('web-vital' in window) {
    window.webVitals.getCLS(console.log)
    window.webVitals.getFID(console.log)
    window.webVitals.getLCP(console.log)
  }
})

// Bundle analysis
// bun run build --analyze
```

### **⚡ OPTIMIZATION TIPS**
1. **Lazy load heavy components** - `lazy$(() => import('./Heavy'))`
2. **Use server actions** for data mutations
3. **Minimize client-side state** - prefer server state
4. **Optimize images** - WebP, proper sizing
5. **Monitor bundle size** - Keep chunks small

---

## 🔄 **GIT WORKFLOW**

### **📝 COMMIT CONVENTIONS**
```bash
# Conventional Commits format
feat: add user dashboard component
fix: resolve auth context issue
docs: update API documentation
style: format code with prettier
refactor: extract auth logic to separate hook
test: add component unit tests
```

### **🌿 BRANCH STRATEGY**
```bash
# Feature branches
git checkout -b feature/nueva-caracteristica
git commit -m "feat: implement nueva caracteristica"
git push origin feature/nueva-caracteristica

# Hotfix branches
git checkout -b hotfix/critical-fix
git commit -m "fix: resolve critical auth issue"
git push origin hotfix/critical-fix
```

---

## 📚 **DOCUMENTATION WORKFLOW**

### **📝 DOCUMENTATION UPDATES**
```markdown
# Al agregar nueva feature:
1. Actualizar PROJECT_ARCHITECTURE.md con nuevos componentes
2. Documentar nuevos patterns en QWIK_MASTER_GUIDE.md
3. Agregar ejemplos de uso en esta guía
4. Actualizar README.md si es necesario
```

### **🔄 KNOWLEDGE TRANSFER**
```bash
# Para nuevos desarrolladores:
1. Leer QWIK_MASTER_GUIDE.md
2. Revisar PROJECT_ARCHITECTURE.md  
3. Seguir DEVELOPMENT_WORKFLOW.md
4. Usar AI_KNOWLEDGE_TRANSFER.md para AI assistants
```

---

## ✅ **QUALITY GATES**

### **🚦 PRE-COMMIT CHECKS**
```bash
# Automated checks
bun run lint        # ESLint pass
bun run type-check  # TypeScript pass
bun run build       # Build success
bun run test        # Tests pass (when implemented)
```

### **📊 DEFINITION OF DONE**
- [ ] Feature implemented siguiendo patterns establecidos
- [ ] TypeScript types definidos
- [ ] Responsive design verificado
- [ ] Error boundaries considerados
- [ ] Performance impact evaluado
- [ ] Documentation actualizada
- [ ] Code review completado

---

**Este workflow asegura desarrollo consistente, mantenible y escalable siguiendo las mejores prácticas de Qwik y la arquitectura establecida del proyecto.**
