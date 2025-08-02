# AI_GUIDELINES.md

> **Estas directrices son de obligado cumplimiento para TODO el código, diseño y arquitectura generados en este proyecto, tanto ma- **Evita:** "Frankenstein code" (mezcla de estilos o arquitecturas en un mismo feature).

---

## 14. 🔄 Estado y Navegación

- **Estado:** 
  - `useSignal` para estado local simple
  - `useStore` para objetos complejos
  - Evitar estado global innecesario
- **Navegación:**
  - `useNavigate` para redirecciones programáticas
  - `Link` component para navegación declarativa
  - `throw redirect()` en loaders/actions para redirecciones del servidor

---

## 15. ♻️ Consistencia y Arquitectura

- **Patrón de autenticación:** Cliente-side con `useVisibleTask$` en layout principal
- **Estructura de rutas:** Usar grupos de rutas `(auth)` y `(dashboard)`
- **Componentes:** Separar lógica de presentación y reutilizar cuando sea posible
- **Tipos:** Centralizar tipos en `/src/lib/types.ts`

---

## 16. ☑️ Patrones Prohibidos

- **❌ No usar:** `routeLoader$` para autenticación (causa bucles)
- **❌ No usar:** `useVisibleTask$` sin comentario de disable
- **❌ No usar:** Estado global para autenticación 
- **❌ No usar:** Múltiples clientes de Supabase
- **❌ No usar:** Server actions para navegación simple

---

## 17. ✅ Patrones Recomendados

- **✅ Usar:** `useVisibleTask$` para verificación de sesión en layouts
- **✅ Usar:** Cliente único de Supabase en `/src/lib/supabase.ts`
- **✅ Usar:** Grupos de rutas para separar auth y dashboard
- **✅ Usar:** `routeAction$` solo para mutaciones (login, register)
- **✅ Usar:** Redirecciones del cliente con `useNavigate`

---

## 19. 📋 Mejores Prácticas de Qwik (Oficial)

### Operaciones en Plantillas
- **✅ SIEMPRE inlinear** operaciones en templates para mejor optimización del optimizer
- **❌ EVITAR** calcular valores fuera del template:
  ```tsx
  // ❌ NO hacer esto
  const result = signal.value > 0 ? 'Positivo' : 'Negativo'
  return <div>{result}</div>
  
  // ✅ Hacer esto
  return <div>{signal.value > 0 ? 'Positivo' : 'Negativo'}</div>
  ```

### Lectura de Signals
- **MOVER** lecturas de signals a `useTask$` o `useComputed$` cuando sea posible
- **EVITAR** leer signals directamente en componentes si causa re-renders innecesarios:
  ```tsx
  // ❌ NO - Todo el componente se re-renderiza
  const doubled = count.value * 2
  
  // ✅ SÍ - Solo se actualiza el valor computado
  const doubled = useComputed$(() => count.value * 2)
  ```

### Uso de useVisibleTask$ como Último Recurso
- **PREFERIR** en este orden de prioridad:
  1. `useTask$()` - ejecución en SSR
  2. `useOn()` - eventos en elemento raíz del componente
  3. `useOnWindow()` - eventos en window
  4. `useOnDocument()` - eventos en document
  5. `useVisibleTask$()` - solo como último recurso

### Eventos DOM Declarativos
- **✅ USAR** hooks de eventos en lugar de addEventListener:
  ```tsx
  // ❌ NO - Carga JavaScript eagerly
  useVisibleTask$(() => {
    document.addEventListener('mousemove', handler)
  })
  
  // ✅ SÍ - Solo carga cuando ocurre el evento
  useOnDocument('mousemove', $((event) => {
    // código del handler
  }))
  ```

### Ubicación y Navegación
- **❌ NUNCA** acceder a `window.location` directamente
- **✅ USAR** `useLocation()` hook para compatibilidad SSR:
  ```tsx
  // ❌ NO
  if (window.location.href.includes('foo')) { }
  
  // ✅ SÍ
  const location = useLocation()
  if (location.url.href.includes('foo')) { }
  ```

---

## 21. ⚡ Sistema de Tasks y Ciclo de Vida (Avanzado)

### Filosofía de Tasks
- **✅ Lazy execution**: JavaScript solo cuando es absolutamente necesario
- **✅ Minimal compilation**: Solo código mínimo necesario al cliente
- **✅ No hydration**: Componentes nunca "se hidratan"
- **✅ Streaming JS**: Carga en chunks bajo demanda

### useVisibleTask$ (Profundo)
- **✅ Solo cuando visible**: No antes, optimizando performance
- **✅ Compilación mínima**: Código específico compilado automáticamente
- **✅ Prefetch inteligente**: Qwikloader prefetch antes de necesitar
- **✅ Granular updates**: Sin virtual DOM, actualizaciones directas

### Diferencias vs React useEffect
| Concepto | React useEffect | Qwik useVisibleTask$ |
|----------|-----------------|----------------------|
| **Ejecución** | Siempre al montar | Solo cuando visible |
| **Hydration** | Requiere hidratación | Sin hidratación |
| **Código cliente** | Todo el componente | Código mínimo |
| **Performance** | Paga costo completo | Solo paga lo que usa |

### Compilación Inteligente
```tsx
// Lo que escribimos
useVisibleTask$(() => {
  animate.value = true
})

// Lo que se compila y envía
export const task_xyz = () => {
  const [animate] = useLexicalScope()
  animate.value = true
}
```

---

## 22. 🛣️ Sistema de Routing Avanzado (Qwik City)

### File-Based Routing
- **✅ Directory-based**: URLs determinadas por estructura de carpetas
- **✅ `index.tsx`**: Archivo especial que representa cada ruta
- **✅ Convención sobre configuración**: No routing manual
- **Beneficio**: Organización intuitiva y automática

### Tipos de Rutas
- **✅ Grouped routes**: `(auth)`, `(dashboard)` - organización sin afectar URLs
- **✅ Dynamic routes**: `[param]` - para IDs y parámetros variables
- **✅ Nested routes**: Estructura jerárquica con layouts compartidos
- **✅ Catch-all routes**: `[...slug]` - para documentación flexible

### Layouts Jerárquicos
- **✅ Root layout**: `layout.tsx` en routes (aplicado globalmente)
- **✅ Grouped layouts**: `(auth)/layout.tsx` (específico del grupo)
- **✅ Named layouts**: `layout-name.tsx` + `index@name.tsx`
- **✅ Slot component**: Para renderizar contenido hijo dinámicamente

### Estructura Implementada
```
src/routes/
├── layout.tsx              // Global + auth protection
├── (auth)/
│   ├── layout.tsx         // Solo auth
│   ├── login/index.tsx    // /login
│   └── register/index.tsx // /register
└── (dashboard)/
    ├── index.tsx          // /
    ├── clientes/index.tsx // /clientes
    └── oportunidades/index.tsx // /oportunidades
```

---

## 23. 🧠 Conceptos Fundamentales de Qwik (Nutshell)

### Filosofía Core: Resumabilidad
- **✅ Resumability over Hydration**: Qwik no "hidrata", "reanuda" ejecución
- **✅ Zero JavaScript por defecto**: Hasta que el usuario interactúa
- **✅ Lazy loading inteligente**: Solo carga lo que se necesita cuando se necesita
- **Diferencia clave**: React ejecuta todo en cliente, Qwik solo lo necesario

### Reglas del `$` (Dollar Sign)
- **✅ `$` = Lazy loading boundary**: Puntos de carga bajo demanda
- **✅ Primer argumento**: Variable importada o declarada en top-level
- **✅ Capturas permitidas**: Solo variables serializables
- **❌ Prohibido**: Variables locales no serializables en closures

### Estado Reactivo Profundo
- **✅ `useSignal()`**: Valores primitivos reactivos
- **✅ `useStore()`**: Objetos complejos con Proxy reactivo (usar `{deep: true}` si necesario)
- **✅ `useComputed$()`**: Valores derivados (equivalente a Vue computed)
- **Principio clave**: Solo lo que LEE un signal se actualiza

### Ciclo de Vida
- **✅ `useTask$()`**: SSR + Cliente, para data fetching y efectos universales
- **✅ `useVisibleTask$()`**: Solo cliente, después de montaje DOM (último recurso)
- **✅ Event handlers**: Solo ejecutan en browser automáticamente

### Server vs Cliente
- **✅ `routeLoader$()`**: Solo servidor, data fetching universal
- **✅ `routeAction$()`**: Solo servidor, form submissions y mutaciones
- **✅ `server$()`**: RPC calls desde cliente a servidor
- **✅ `isBrowser`/`isServer`**: Para código condicional por entorno

---

## 24. ☑️ Excepciones y cambios

- Cualquier excepción a estas reglas debe estar justificada en el PR y documentada en este archivo.
- Las reglas deben evolucionar basadas en la experiencia real del proyecto.

---

> **Estas reglas evolucionan basadas en la experiencia real del proyecto. Actualizar cuando se descubran nuevos patrones o antipatrones.**mo con inteligencia artificial (Copilot, ChatGPT, etc).**  
> Revisa este archivo antes de cualquier commit, push, merge o uso de IA.

---

## 1. 📦 Framework y Estructura

- **Frontend:** Solo Qwik + QwikCity.  
  Está prohibido usar React, Vue, Svelte u otros frameworks SPA.
- **Estructura:**  
  - `/src/routes` → Páginas y rutas  
  - `/src/components` → Componentes reutilizables  
  - `/src/lib` → Utilidades y configuraciones (Supabase, tipos, etc.)
  - `/src/styles` → Estilos globales  
  - `/public` → Assets estáticos
  - `/tests` → Pruebas (unitarias, E2E)

---

## 2. � Autenticación y Base de Datos

- **Backend obligatorio:** Supabase para:
  - Autenticación y autorización
  - Base de datos PostgreSQL
  - Almacenamiento de archivos
  - Funciones Edge (opcional)
- **Cliente Supabase:**  
  - Usar `@supabase/ssr` para compatibilidad total con SSR
  - Cliente unificado en `/src/lib/supabase.ts`
  - Autenticación del lado del cliente con `useVisibleTask$` en layouts
- **Tipos:** Definir interfaces TypeScript para User, Session, etc. en `/src/lib/types.ts`

---

## 3. 🎨 Estilos y Diseño

- **Principal:** Tailwind CSS v4 (configuración solo en CSS, nunca JS).
- **Permitido:** CSS nativo o CSS Modules si aporta valor.
- **Prohibido:** Uso de `tailwind.config.js` (toda personalización vía CSS).
- **Inspiración:** Solo de plataformas modernas como Land-book, Lapa, UIdeck, OnePageLove, Godly.
- **Prohibido:** Copiar patrones de marcas (Stripe, Linear, Notion, etc).

---

## 4. 🌐 HTML, Accesibilidad y SEO

- **HTML:** Semántico, accesible, mobile-first, SEO-friendly.
- **Imágenes:** Siempre `<Image>` de Qwik, nunca `<img>`.
- **SEO:**  
  - Todas las páginas deben exportar `DocumentHead` desde `@builder.io/qwik-city`.
  - Incluir `title`, `description`, `og:title` y meta-tags relevantes.

---

## 5. 🧩 Componentes, Hooks y Validación

- **Componentes:** Solo los oficiales de Qwik/QwikCity.
- **Hooks Qwik:**  
  - Usar solo `useSignal`, `useStore`, `useComputed$`, `useTask$`
  - Para rutas: `routeLoader$`, `routeAction$`, `server$`
  - Para efectos cliente: `useVisibleTask$` (con `// eslint-disable-next-line qwik/no-use-visible-task`)
  - Para navegación: `useNavigate` de QwikCity
- **Validación:**  
  - Preferente: Zod para formularios con `routeAction$`
  - Alternativa: Validación manual en cliente
- **Estructura:**  
  - Componentes pequeños y reutilizables
  - Separar lógica de presentación
  - Props tipadas con TypeScript

---

## 6. 📝 Naming y Convenciones

- **Funciones y variables:** `camelCase`
- **Componentes:** `PascalCase`
- **Archivos:** `kebab-case.tsx` o `index.tsx`
- **Rutas:** Estructura de carpetas de QwikCity
- **Clases CSS:** Tailwind por defecto
- **Funciones:** Principio de responsabilidad única, nombres descriptivos

---

## 7. 🔗 Backend y APIs

- **Backend:** Supabase es el estándar para:
  - Autenticación (Auth, RLS, Policies)
  - Base de datos PostgreSQL
  - Almacenamiento (Storage)
  - Funciones Edge (opcional)
- **APIs:**  
  - Usar `routeAction$` para mutations
  - Usar `routeLoader$` para data fetching
  - Endpoints en `/src/routes/api/` solo si es necesario
- **Seguridad:** Nunca exponer lógica de negocio al cliente

---

## 8. ⚡ Performance y Carga

- **Prioridades:**  
  - Usar SSR por defecto (Qwik City)
  - Lazy loading automático de Qwik
  - Mínimo JavaScript en cliente
  - `useVisibleTask$` solo cuando sea necesario
- **Optimizaciones:**  
  - Componentes con `component$()` para lazy loading
  - `$` en todas las funciones que se ejecutan en cliente

---

## 9. 🧪 Testing

- **Unitarios:** Vitest para utilidades y lógica
- **Componentes:** @builder.io/qwik/testing
- **End-to-End:** Playwright
- **Estructura:** Tests organizados por feature/módulo

---

## 10. 🔒 Seguridad y Variables

- **Prohibido:** Hardcodear credenciales, secretos o API keys.
- **Variables de entorno:**  
  - Usar siempre `process.env` o `import.meta.env`  
  - Mantener claves frontend/backend separadas
- **Revisión:** Cualquier dato sensible debe gestionarse fuera del código fuente.

---

## 11. 🛑 Error Handling

- **Async:** Siempre `try/catch` en funciones asíncronas.
- **Promesas:** No dejar promesas sin tratar.
- **Gestión:** Informar y gestionar los errores explícitamente.

---

## 12. 🤖 Contenido generado por IA

- Si el contenido es generado por IA (texto, imágenes, etc.), debe quedar reflejado (comentario en código o aviso visible en UI).

---

## 13. ♻️ Consistencia y Estilo

- **Diseño y código:** Uniformes, consistentes y documentados.
- **Estructura de carpetas:** Debe seguir las convenciones anteriores.
- **Evita:** “Frankenstein code” (mezcla de estilos o arquitecturas en un mismo feature).

---

## 14. ☑️ Excepciones y cambios

- Cualquier excepción a estas reglas debe estar justificada en el PR y documentada en este archivo.
- Las reglas deben evolucionar, pero solo mediante consenso del equipo/proyecto.

---

> **Estas reglas son de aplicación obligatoria para humanos y sistemas automáticos (Copilot, ChatGPT, etc). Antes de generar o aceptar código, verifica que cumple este estándar.**
