# 🚀 Qwik CRM - Sistema de Gestión de Clientes

Un CRM moderno construido con **Qwik**, **QwikUI**, **Supabase** y **Drizzle ORM**.

## ✨ Estado Actual del Proyecto

### 🎯 Componentes Implementados
- ✅ **DataTable** - Tabla avanzada con búsqueda, ordenamiento y paginación
- ✅ **Button** - Componente con múltiples variantes y tamaños
- ✅ **Card** - Sistema de tarjetas para contenido
- ✅ **Input** - Campos de entrada con validación
- ✅ **Avatar** - Componente para imágenes de perfil
- ✅ **Badge** - Etiquetas de estado
- ✅ **Toast** - Sistema de notificaciones
- ✅ **Table** - Componente base de tabla

### 🎨 Sistema de Diseño
- **Tipografía**: Roboto (principal) + Lufga (cabeceras)
- **Framework**: QwikUI (headless components)
- **Estilos**: Tailwind CSS v4
- **Iconos**: Lucide Icons
- **Temas**: Sistema de variables CSS

### 🛠 Stack Tecnológico
- **Frontend**: Qwik + QwikCity
- **UI**: QwikUI (shadcn/ui approach)
- **Backend**: Supabase
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Supabase Auth + Google OAuth
- **Deployment**: Netlify/Vercel ready

## 🚀 Scripts de Desarrollo

### Push Seguro a GitHub
```bash
# Script completo con verificaciones
./scripts/safe-push.sh "mensaje del commit"

# Script rápido
./scripts/quick-push.sh "mensaje del commit"
```

### Comandos de Desarrollo
```bash
# Desarrollo
bun dev

# Build
bun build

# Preview
bun preview

# Base de datos
bun db:generate  # Generar migraciones
bun db:push      # Aplicar cambios
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes QwikUI
│   │   ├── auth/         # Componentes de autenticación
│   │   └── app/          # Componentes específicos del CRM
│   ├── routes/
│   │   ├── (auth)/       # Rutas de autenticación
│   │   └── dashboard/    # Panel principal del CRM
│   ├── hooks/            # Hooks personalizados
│   ├── lib/              # Utilidades y configuración
│   └── assets/           # CSS y fuentes
├── drizzle/              # Schema y migraciones
├── scripts/              # Scripts de automatización
└── docs/                 # Documentación del proyecto
```

## 🎯 Próximos Componentes
- [ ] Dialog/Modal - Para formularios y confirmaciones
- [ ] Dropdown Menu - Para acciones contextuales
- [ ] Form Components - Textarea, Select, Checkbox, Radio
- [ ] Tabs - Para organización de contenido

## 📖 Documentación Completa

Para desarrollo con IA, lee estos archivos en orden:

# ESTO HAY QUE DECIRLE A LA IA PARA QUE ESTE AL DIA.
🎯 Lee completamente estos archivos en orden:
1. QWIK_MASTER_GUIDE.md
2. PROJECT_ARCHITECTURE.md  
3. DEVELOPMENT_WORKFLOW.md
4. AI_KNOWLEDGE_TRANSFER.md

Responde al test de validación antes de empezar.