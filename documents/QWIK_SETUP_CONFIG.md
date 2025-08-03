# Configuración y Setup Completo - Qwik CRM

## 🎯 **Estructura del Proyecto**

### **1. Arquitectura de Carpetas**
```
qwik-crm/
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeaderNew.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   └── router-head/
│   │       └── router-head.tsx
│   ├── lib/
│   │   ├── auth-helpers.ts      # Helpers de autenticación
│   │   ├── auth-schemas.ts      # Esquemas de validación
│   │   ├── supabase.ts          # Configuración Supabase
│   │   ├── types.ts             # Definiciones de tipos
│   │   └── use-auth.ts          # Custom hook de auth
│   ├── routes/
│   │   ├── (auth)/              # Grupo de rutas de auth
│   │   │   ├── layout.tsx
│   │   │   ├── login/index.tsx
│   │   │   ├── register/index.tsx
│   │   │   ├── forgot-password/index.tsx
│   │   │   └── reset-password/index.tsx
│   │   ├── (dashboard)/         # Grupo de rutas protegidas
│   │   │   ├── index.tsx
│   │   │   ├── actividades/index.tsx
│   │   │   ├── clientes/index.tsx
│   │   │   ├── configuracion/index.tsx
│   │   │   ├── oportunidades/index.tsx
│   │   │   └── reportes/index.tsx
│   │   └── layout.tsx           # Layout principal con auth
│   ├── entry.dev.tsx
│   ├── entry.preview.tsx
│   ├── entry.ssr.tsx
│   ├── global.css
│   └── root.tsx
├── documents/                   # Documentación del proyecto
│   ├── QWIK_STUDY_COMPLETE.md
│   ├── QWIK_IMPLEMENTATIONS.md
│   ├── QWIK_HELPERS_HOOKS.md
│   └── QWIK_SETUP_CONFIG.md
├── .env                        # Variables de entorno
├── .gitignore
├── package.json
├── qwik.env.d.ts
├── tsconfig.json
└── vite.config.ts
```

## 🎯 **Configuración de package.json**

### **1. Dependencias Principales**
```json
{
  "name": "my-qwik-empty-starter",
  "description": "Blank project with routing included",
  "engines": {
    "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
  },
  "private": true,
  "type": "module",
  "scripts": {
    "build": "qwik build",
    "build.client": "vite build",
    "build.preview": "vite build --ssr src/entry.preview.tsx",
    "build.types": "tsc --incremental --noEmit",
    "deploy": "echo 'Run \"npm run qwik add\" to install a server adapter'",
    "dev": "vite --mode ssr",
    "dev.debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
    "fmt": "prettier --write .",
    "fmt.check": "prettier --check .",
    "lint": "eslint \"src/**/*.ts*\"",
    "preview": "qwik build preview && vite preview --open",
    "start": "vite --open --mode ssr",
    "qwik": "qwik"
  },
  "devDependencies": {
    "@builder.io/qwik": "^1.15.0",
    "@builder.io/qwik-city": "^1.15.0",
    "@eslint/js": "latest",
    "@tailwindcss/vite": "^4.0.0",
    "@types/node": "20.14.11",
    "eslint": "9.32.0",
    "eslint-plugin-qwik": "^1.15.0",
    "globals": "16.3.0",
    "prettier": "3.6.2",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "tailwindcss": "^4.1.11",
    "typescript": "5.9.2",
    "typescript-eslint": "8.38.0",
    "typescript-plugin-css-modules": "latest",
    "undici": "*",
    "vite": "5.4.19",
    "vite-tsconfig-paths": "^4.3.2",
    "@supabase/supabase-js": "^2.53.0",
    "supabase-auth-helpers-qwik": "^0.0.3"
  },
  "dependencies": {
    "@supabase/ssr": "^0.6.1"
  }
}
```

## 🎯 **Configuración de TypeScript**

### **1. tsconfig.json**
```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ES2022",
    "moduleResolution": "node",
    "noEmit": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUnusedParameters": false,
    "noUnusedLocals": false,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "files": ["./.eslintrc.cjs"],
  "include": ["src", "./*.d.ts", "./*.config.ts"],
  "exclude": ["node_modules", "dist", "build", ".cache", ".vscode"]
}
```

### **2. qwik.env.d.ts**
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 🎯 **Configuración de Vite**

### **1. vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { qwikCity } from '@builder.io/qwik-city/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
      tailwindcss(),
    ],
    dev: {
      headers: {
        'Cache-Control': 'public, max-age=0',
      },
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  }
})
```

## 🎯 **Variables de Entorno**

### **1. Archivo .env**
```bash
# Supabase Configuration
VITE_SUPABASE_URL="https://uyradeufmhqymutizwvt.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmFkZXVmbWhxeW11dGl6d3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTAyNjQsImV4cCI6MjA2OTQyNjI2NH0.EN0wLExRAcNGW6PrOUN9d4ejc-5Mdm3I6rx7QRd5qjU"

# Development Configuration
VITE_NODE_ENV=development
```

### **2. Archivo .env.example (para otros desarrolladores)**
```bash
# Supabase Configuration
VITE_SUPABASE_URL="your_supabase_url_here"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key_here"

# Development Configuration
VITE_NODE_ENV=development
```

### **3. Validación en supabase.ts**
```typescript
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación de variables requeridas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno requeridas:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY\n' +
    'Crea un archivo .env con estas variables.'
  )
}
```

## 🎯 **Configuración de Git**

### **1. .gitignore**
```gitignore
# Build
/dist
/lib
/lib-types
/server

# Development
node_modules
.env
*.local

# Cache
.cache
.mf
.rollup.cache
tsconfig.tsbuildinfo

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# IDE
.vscode/
.idea/
*.swp
*.swo
```

## 🎯 **Configuración de ESLint**

### **1. eslint.config.js**
```javascript
import eslint from '@eslint/js'
import qwikPlugin from 'eslint-plugin-qwik'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['**/*.d.ts', '**/*.config.js', 'node_modules/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      qwik: qwikPlugin,
    },
    rules: {
      ...qwikPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'qwik/no-use-visible-task': 'warn',
    },
  }
)
```

## 🎯 **Configuración de Tailwind CSS**

### **1. Configuración básica (viene integrada)**
- ✅ **@tailwindcss/vite**: Plugin oficial para Vite
- ✅ **tailwindcss**: Framework CSS utility-first
- ✅ **prettier-plugin-tailwindcss**: Ordenamiento automático de clases

### **2. Clases utilizadas en el proyecto**
```css
/* Layout y contenedores */
.min-h-screen
.flex
.items-center
.justify-center
.max-w-md
.w-full
.space-y-8

/* Formularios */
.appearance-none
.rounded-md
.border
.border-gray-300
.px-3
.py-2
.placeholder-gray-500
.text-gray-900
.focus:outline-none
.focus:ring-blue-500
.focus:border-blue-500

/* Estados */
.disabled:opacity-50
.disabled:cursor-not-allowed
.hover:bg-blue-700

/* Colores y tipografía */
.bg-gray-50
.text-red-600
.text-blue-600
.font-medium
.text-sm
```

## 🎯 **Scripts de Desarrollo**

### **1. Comandos Principales**
```bash
# Desarrollo
bun run dev              # Servidor de desarrollo con SSR
bun run dev.debug        # Servidor con debug mode

# Build
bun run build            # Build completo para producción
bun run build.client     # Solo build del cliente
bun run build.preview    # Build para preview

# Calidad de código
bun run lint             # ESLint
bun run fmt              # Prettier format
bun run fmt.check        # Check formatting

# Preview
bun run preview          # Preview del build
bun run start            # Servidor de desarrollo simple
```

### **2. Variables de entorno por script**
```bash
# Desarrollo
VITE_MODE=ssr bun run dev

# Producción
NODE_ENV=production bun run build

# Debug
DEBUG=1 bun run dev.debug
```

## 🎯 **Configuración de Supabase**

### **1. Estructura de la base de datos recomendada**
```sql
-- Tabla de usuarios personalizada (se crea con trigger)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

### **2. Trigger para creación automática de usuarios**
```sql
-- Función para crear usuario en tabla personalizada
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta al crear usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 🎯 **Setup Instructions para Nuevos Desarrolladores**

### **1. Instalación inicial**
```bash
# 1. Clonar repositorio
git clone <repository-url>
cd qwik-crm

# 2. Instalar dependencias
bun install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de Supabase

# 4. Iniciar desarrollo
bun run dev
```

### **2. Verificación del setup**
```bash
# Verificar que todo funciona
curl http://localhost:5173/login    # Debe cargar la página de login
bun run lint                        # No debe haber errores
bun run build                       # Debe compilar sin errores
```

### **3. Estructura de commits recomendada**
```bash
# Tipos de commits
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato/estilo
refactor: refactoring de código
test: agregar o modificar tests
chore: tareas de mantenimiento

# Ejemplos
git commit -m "feat: add login form with validation"
git commit -m "fix: resolve cookie handling in auth"
git commit -m "docs: update setup instructions"
```
