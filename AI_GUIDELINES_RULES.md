# AI_GUIDELINES.md - Next.js 15

> **Directrices obligatorias para desarrollo con Next.js 15**  
> Aplicable a humanos y sistemas automáticos (Copilot, ChatGPT, etc.)

---

## 1. 🚀 Framework y Arquitectura

- **Framework principal:** Exclusivamente **Next.js 15** con App Router
- **React:** Version 19+ (soporte para Server Components)
- **TypeScript:** Obligatorio en todos los archivos
- **Bundler:** Turbopack (desarrollo) / Webpack (producción)
- **Runtime:** Node.js 18+ o Edge Runtime cuando sea apropiado

### Estructura de carpetas obligatoria:
```
src/
├── app/                    # App Router (Next.js 15)
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error UI
│   ├── not-found.tsx      # 404 page
│   └── (routes)/          # Route groups
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── shared/           # Componentes compartidos
├── lib/                  # Utilities y configuraciones
├── hooks/                # Custom hooks
├── types/                # Definiciones TypeScript
├── utils/                # Funciones auxiliares
└── styles/               # Archivos CSS adicionales
```

---

## 2. 🎨 Estilos y UI

- **CSS Framework:** **Tailwind CSS v4** únicamente
- **Configuración:** Solo via `@config` en CSS, **nunca** `tailwind.config.js`
- **Componentes UI:** **shadcn/ui** como librería base
- **Icons:** **Lucide React** o **Heroicons**
- **Fonts:** Usar `next/font` para optimización automática

### Configuración Tailwind v4:
```css
/* globals.css */
@import "tailwindcss";

@config {
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... custom colors
      }
    }
  }
}
```

---

## 3. 🏗️ Componentes y Server/Client

### Server Components (por defecto):
- **Ubicación:** Cualquier componente en `/app` es Server Component por defecto
- **Data fetching:** Usar `fetch()` con caching automático
- **No pueden:** Usar hooks, event handlers, o browser APIs

### Client Components:
- **Declaración:** Usar `"use client"` al inicio del archivo
- **Cuándo usar:** Interactividad, hooks, event handlers, browser APIs
- **Ubicación:** Preferentemente en `/components`

```tsx
// Server Component (por defecto)
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data.title}</div>
}

// Client Component
"use client"
import { useState } from 'react'

function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

---

## 4. 🗄️ Base de Datos y ORM

- **Base de datos:** **PostgreSQL** (obligatorio)
- **ORM:** **Prisma** como estándar
- **Migrations:** Gestionadas exclusivamente por Prisma
- **Conexión:** Pool de conexiones con `@prisma/client`

### Configuración Prisma:
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 5. 🔄 Data Fetching y Estado

### Server-side:
- **Fetch API:** Con caching automático de Next.js
- **Server Actions:** Para mutations con `"use server"`
- **Route Handlers:** Para APIs en `/app/api`

### Client-side:
- **TanStack Query (React Query):** Para client-side data fetching
- **Zustand:** Para estado global client-side
- **React Hook Form:** Para formularios complejos

```tsx
// Server Action
"use server"
export async function createUser(formData: FormData) {
  const result = await prisma.user.create({
    data: {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    }
  })
  revalidatePath('/users')
  return result
}

// Client-side con React Query
"use client"
import { useQuery } from '@tanstack/react-query'

function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  })
  
  if (isLoading) return <div>Loading...</div>
  return <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>
}
```

---

## 6. 🔐 Autenticación y Autorización

- **Provider:** **Supabase Auth** o **NextAuth.js v5** (Auth.js)
- **Session:** Server-side con cookies seguras
- **Middleware:** Para protección de rutas
- **RBAC:** Role-Based Access Control cuando sea necesario

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
}
```

---

## 7. 📝 Formularios y Validación

- **Validación:** **Zod** para esquemas TypeScript-first
- **Formularios simples:** Server Actions con `useFormState`
- **Formularios complejos:** **React Hook Form** + **Zod**
- **UI:** **shadcn/ui** Form components

```tsx
// Schema con Zod
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Debe ser mayor de edad')
})

export type UserInput = z.infer<typeof userSchema>

// Server Action con validación
"use server"
export async function createUser(data: UserInput) {
  const validatedData = userSchema.parse(data)
  // ... crear usuario
}
```

---

## 8. 🎯 Routing y Navegación

- **App Router:** Exclusivamente (no Pages Router)
- **Route Groups:** Usar `(group)` para organización
- **Parallel Routes:** Para layouts complejos
- **Intercepting Routes:** Para modales y overlays
- **Middleware:** Para autenticación y redirects

### Ejemplos de rutas:
```
app/
├── (dashboard)/          # Route group
│   ├── layout.tsx       # Layout para dashboard
│   ├── page.tsx         # /dashboard
│   └── users/
│       └── page.tsx     # /dashboard/users
├── (auth)/              # Route group para auth
│   ├── login/
│   │   └── page.tsx     # /login
│   └── register/
│       └── page.tsx     # /register
└── @modal/              # Parallel route para modales
    └── users/
        └── [id]/
            └── page.tsx # Modal intercepting
```

---

## 9. 🧪 Testing

- **Unit/Integration:** **Vitest** + **Testing Library**
- **E2E:** **Playwright** para pruebas end-to-end
- **Coverage:** Mínimo 80% en funciones críticas
- **Mocking:** **MSW** para APIs en tests

### Estructura de tests:
```
__tests__/
├── unit/
├── integration/
└── e2e/
```

---

## 10. 🔒 Seguridad y Variables de Entorno

- **Prohibido:** Hardcodear credenciales, secretos o API keys
- **Variables de entorno:**
  - **Públicas:** `NEXT_PUBLIC_*` (accesibles en cliente)
  - **Privadas:** Sin prefijo (solo servidor)
- **Validación:** Usar Zod para validar env vars al inicio

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

---

## 11. 🛑 Error Handling

- **Error Boundaries:** Usar `error.tsx` en App Router
- **Server Actions:** Always try/catch con retorno de errores tipados
- **API Routes:** Consistent error responses
- **Logging:** **Sentry** para producción, **console** para desarrollo

```tsx
// error.tsx
"use client"
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
      <button onClick={reset} className="btn btn-primary">
        Intentar de nuevo
      </button>
    </div>
  )
}
```

---

## 12. ⚡ Performance y Optimización

- **Images:** Siempre usar `next/image` con optimización
- **Fonts:** `next/font` para optimización automática
- **Bundling:** Code splitting automático
- **Caching:** Aprovechar el caching de Next.js 15
- **Streaming:** Usar Suspense boundaries
- **Partial Pre-rendering (PPR):** Habilitar cuando sea estable

```tsx
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  return (
    <div className={inter.className}>
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={600}
        priority
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />
    </div>
  )
}
```

---

## 13. 🤖 Contenido generado por IA

- Si el contenido es generado por IA (texto, imágenes, código), debe quedar reflejado en comentarios del código o aviso visible en UI.

---

## 14. ♻️ Consistencia y Estilo

### Naming Conventions:
- **Componentes:** `PascalCase` (ej: `UserDashboard.tsx`)
- **Archivos:** `kebab-case` para rutas, `PascalCase` para componentes
- **Variables/Funciones:** `camelCase`
- **Constantes:** `UPPER_SNAKE_CASE`
- **CSS Classes:** `kebab-case` (Tailwind)
- **Database:** `snake_case` para tablas y columnas

### Code Style:
- **Prettier** + **ESLint** configurados
- **Absolute imports** con `@/` para `/src`
- **Barrel exports** en `/components/ui/index.ts`

---

## 15. 🚀 Deployment y DevOps

- **Platform:** **Vercel** como primera opción
- **Database:** **Supabase** o **Railway** para PostgreSQL
- **Storage:** **Supabase Storage** o **Cloudinary**
- **Monitoring:** **Sentry** + **Vercel Analytics**
- **CI/CD:** GitHub Actions con Vercel

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: 'incremental', // Partial Pre-rendering
    typedRoutes: true,  // Type-safe routing
  },
  images: {
    domains: ['supabase.co', 'cloudinary.com'],
  },
}

module.exports = nextConfig
```

---

## 16. ☑️ Excepciones y Cambios

- Cualquier excepción a estas reglas debe estar justificada en el PR y documentada en este archivo.
- Las reglas deben evolucionar mediante consenso del equipo.
- **Next.js 15 features experimentales** deben ser evaluadas caso por caso.

---

> **Estas reglas son de aplicación obligatoria para humanos y sistemas automáticos (Copilot, ChatGPT, etc). Antes de generar o aceptar código, verifica que cumple este estándar de Next.js 15.**

---

## 📚 Referencias oficiales:

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Turbopack](https://turbo.build/pack/docs)