# Guía Tipográfica - CRM Typography System

## 🎯 Estrategia de Fuentes

Basada en criterios de expertos UI/UX, hemos optimizado el sistema a **solo 2 fuentes** para máximo rendimiento y consistencia visual.

### **Roboto** - Fuente Principal (Application UI)
- **Uso**: Formularios, mensajes, texto general del CRM
- **Clase Tailwind**: `font-primary`
- **Pesos disponibles**: 300, 400, 500, 700
- **Razón**: Superior legibilidad, menos fatiga visual, ideal para uso prolongado

### **Lufga** - Fuente Secundaria (Landing & Branding)
- **Uso**: Landing page, H1, H2, CTAs, branding
- **Clase Tailwind**: `font-secondary`
- **Pesos disponibles**: 300, 400, 500, 600, 700, 800, 900
- **Razón**: Impacto visual, personalidad, memorable para la marca

---

## 📋 Guía de Uso

### **Aplicación CRM (Roboto)**

```html
<!-- Formularios y campos de entrada -->
<input class="font-primary font-normal text-base" />
<label class="font-primary font-medium text-sm">Nombre del cliente</label>

<!-- Texto del cuerpo -->
<p class="font-primary font-normal text-base">Contenido principal del CRM</p>

<!-- Mensajes y notificaciones -->
<div class="font-primary font-medium text-sm">Mensaje del sistema</div>

<!-- Navegación y UI elements -->
<nav class="font-primary font-medium text-sm">Dashboard</nav>
```

### **Landing Page (Lufga)**

```html
<!-- Títulos principales -->
<h1 class="font-secondary font-bold text-4xl">Bienvenido a nuestro CRM</h1>
<h2 class="font-secondary font-semibold text-3xl">Gestiona tus clientes</h2>

<!-- CTAs y botones importantes -->
<button class="font-secondary font-semibold text-lg">Comenzar Ahora</button>

<!-- Branding y elementos destacados -->
<span class="font-secondary font-extrabold text-xl">CRM Pro</span>
```

---

## 🎨 Jerarquía Tipográfica

### **Roboto (CRM Application)**
- **Light (300)**: Texto secundario, descripciones
- **Regular (400)**: Texto del cuerpo, contenido principal
- **Medium (500)**: Labels, navegación, elementos UI
- **Bold (700)**: Énfasis, títulos internos

### **Lufga (Landing & Branding)**
- **Light (300)**: Subtítulos suaves
- **Regular (400)**: Texto destacado
- **Medium (500)**: Títulos secundarios
- **SemiBold (600)**: Títulos importantes
- **Bold (700)**: Títulos principales
- **ExtraBold (800)**: CTAs, elementos de impacto
- **Black (900)**: Branding, máximo impacto

---

## ⚡ Performance

### **Optimizaciones aplicadas:**
- ✅ Solo 2 familias de fuentes (vs 5 anteriores)
- ✅ Pesos optimizados según uso real
- ✅ `font-display: swap` para mejor UX
- ✅ Fallbacks robustos del sistema
- ✅ Rutas optimizadas desde `assets/css/`

### **Beneficios:**
- 🚀 **Carga más rápida**: Menos archivos de fuente
- 🎯 **Consistencia visual**: Jerarquía clara
- 🛠️ **Mantenimiento simple**: Solo 2 fuentes que gestionar
- 💼 **Profesional**: Estándar en aplicaciones empresariales

---

## 🔧 Implementación Técnica

### **Archivos organizados:**
```
src/assets/css/
├── fonts.css      # Definiciones @font-face optimizadas
└── global.css     # Variables Tailwind y configuración
```

### **Variables Tailwind disponibles:**
```css
font-primary    → Roboto (Application UI)
font-secondary  → Lufga (Landing & Branding)
font-system     → Fallback del sistema
```

### **Clases eliminadas (ya no disponibles):**
- ~~`font-alternative`~~ (era Lufga, ahora es `font-secondary`)
- ~~`font-tertiary`~~ (era Montserrat, eliminada)

---

## 📝 Ejemplos Prácticos

### **Dashboard CRM**
```tsx
export default component$(() => {
  return (
    <div>
      <h1 class="font-primary font-bold text-2xl">Dashboard</h1>
      <p class="font-primary font-normal text-base">
        Gestiona tus clientes y oportunidades de venta.
      </p>
      <button class="font-primary font-medium text-sm">
        Nuevo Cliente
      </button>
    </div>
  )
})
```

### **Landing Page**
```tsx
export default component$(() => {
  return (
    <div>
      <h1 class="font-secondary font-black text-5xl">
        El CRM que necesitas
      </h1>
      <h2 class="font-secondary font-semibold text-3xl">
        Aumenta tus ventas un 40%
      </h2>
      <button class="font-secondary font-bold text-xl">
        Prueba Gratis
      </button>
    </div>
  )
})
```

---

## 🎯 Decisión Estratégica

Esta combinación **Roboto + Lufga** fue elegida siguiendo criterios de expertos UI/UX:

1. **Contraste perfecto**: Funcional + Expresiva
2. **Performance óptima**: Solo 2 fuentes
3. **Jerarquía clara**: Cada fuente tiene su propósito específico
4. **Profesional**: Estándar en aplicaciones empresariales
5. **Memorable**: Lufga da personalidad sin sacrificar usabilidad

---

*Última actualización: Optimización completa del sistema tipográfico*
