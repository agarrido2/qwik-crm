# 🎨 Design System - Qwik CRM

## Paleta de Colores

### 🔵 Primary (Azul - Brand Principal)
```css
primary-50:  #eff6ff  /* Muy claro - fondos sutiles */
primary-100: #dbeafe  /* Claro - hover states */
primary-200: #bfdbfe  /* Medio claro - borders */
primary-300: #93c5fd  /* Medio - elementos secundarios */
primary-400: #60a5fa  /* Medio oscuro - botones secundarios */
primary-500: #3b82f6  /* Base - botones principales */
primary-600: #2563eb  /* Oscuro - hover botones principales */
primary-700: #1d4ed8  /* Muy oscuro - estados activos */
primary-800: #1e40af  /* Extra oscuro - texto sobre claro */
primary-900: #1e3a8a  /* Máximo oscuro - headers */
primary-950: #172554  /* Ultra oscuro - texto crítico */
```

### ✅ Success (Verde - Estados Exitosos)
```css
success-50:  #ecfdf5  /* Fondos de éxito sutiles */
success-100: #d1fae5  /* Notificaciones exitosas */
success-200: #a7f3d0  /* Borders de éxito */
success-300: #6ee7b7  /* Iconos de éxito */
success-400: #34d399  /* Botones de confirmación */
success-500: #10b981  /* Base - acciones positivas */
success-600: #059669  /* Hover estados exitosos */
success-700: #047857  /* Estados activos */
success-800: #065f46  /* Texto sobre fondos claros */
success-900: #064e3b  /* Texto crítico exitoso */
success-950: #022c22  /* Ultra oscuro */
```

### ⚠️ Warning (Ámbar - Advertencias)
```css
warning-50:  #fffbeb  /* Fondos de advertencia sutiles */
warning-100: #fef3c7  /* Notificaciones de advertencia */
warning-200: #fde68a  /* Borders de advertencia */
warning-300: #fcd34d  /* Iconos de advertencia */
warning-400: #fbbf24  /* Botones de precaución */
warning-500: #f59e0b  /* Base - advertencias */
warning-600: #d97706  /* Hover advertencias */
warning-700: #b45309  /* Estados activos */
warning-800: #92400e  /* Texto sobre fondos claros */
warning-900: #78350f  /* Texto crítico advertencia */
warning-950: #451a03  /* Ultra oscuro */
```

### ❌ Error (Rojo - Errores y Peligros)
```css
error-50:  #fef2f2  /* Fondos de error sutiles */
error-100: #fee2e2  /* Notificaciones de error */
error-200: #fecaca  /* Borders de error */
error-300: #fca5a5  /* Iconos de error */
error-400: #f87171  /* Botones de peligro */
error-500: #ef4444  /* Base - errores */
error-600: #dc2626  /* Hover errores */
error-700: #b91c1c  /* Estados activos */
error-800: #991b1b  /* Texto sobre fondos claros */
error-900: #7f1d1d  /* Texto crítico error */
error-950: #450a0a  /* Ultra oscuro */
```

### ⚫ Neutral (Gris - Elementos Neutros)
```css
gray-50:  #f9fafb  /* Fondos muy claros */
gray-100: #f3f4f6  /* Fondos de secciones */
gray-200: #e5e7eb  /* Borders sutiles */
gray-300: #d1d5db  /* Borders normales */
gray-400: #9ca3af  /* Texto placeholder */
gray-500: #6b7280  /* Texto secundario */
gray-600: #4b5563  /* Texto normal */
gray-700: #374151  /* Texto principal */
gray-800: #1f2937  /* Texto importante */
gray-900: #111827  /* Texto crítico / fondos oscuros */
gray-950: #030712  /* Ultra oscuro */
```

## Uso en Componentes CRM

### 🏢 Entidades del CRM
- **Clientes**: `primary` (azul) - representa confianza y profesionalismo
- **Oportunidades**: `success` (verde) - representa crecimiento y dinero
- **Actividades**: `warning` (ámbar) - representa acción y seguimiento
- **Errores**: `error` (rojo) - representa problemas y alertas

### 📊 Estados de Datos
- **Activo/Completado**: `success-500`
- **Pendiente/En Proceso**: `warning-500`
- **Inactivo/Cancelado**: `error-500`
- **Borrador/Neutro**: `gray-500`

### 🎯 Botones y Acciones
- **Acción Principal**: `primary-600` con hover `primary-700`
- **Acción Secundaria**: `gray-600` con hover `gray-700`
- **Acción Positiva**: `success-600` con hover `success-700`
- **Acción Destructiva**: `error-600` con hover `error-700`

## Dark Mode

En modo oscuro, todos los colores se invierten automáticamente usando:
```css
--color-bgContrast: #111827; /* Fondo principal oscuro */
```

## Componentes Flowbite Qwik Disponibles

### 📋 Formularios
- `Button`, `Input`, `Select`, `Checkbox`, `Radio`
- `DatePicker`, `FileInput`, `Textarea`

### 📊 Datos
- `Table`, `Card`, `Badge`, `Avatar`
- `Pagination`, `Breadcrumb`

### 🔔 Feedback
- `Alert`, `Toast`, `Modal`, `Drawer`
- `Progress`, `Spinner`

### 🧭 Navegación
- `Navbar`, `Sidebar`, `Dropdown`
- `Tabs`, `Accordion`

## Animaciones

```css
/* Deslizamiento desde la izquierda */
animate-from-left: slideFromLeft 0.2s 1

/* Deslizamiento desde la derecha */
animate-from-right: slideFromRight 0.2s 1
```

## Contenedores

```css
/* Contenedor extra grande */
container-8xl: 90rem (1440px)

/* Ancho mínimo para pantallas grandes */
min-width-screen-lg: 1024px
```
