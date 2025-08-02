# Mejores Prácticas: Hooks de Qwik

## ❌ Problema Común: Uso Excesivo de useVisibleTask$

**Antipatrón frecuente:**
```typescript
// ❌ MALO - Bloquea el hilo principal
useVisibleTask$(() => {
  fetchData();
  setUpListeners();
});
```

**Por qué es problemático:**
- **Bloquea el hilo principal** hasta completarse
- **Pérdida de performance** notable
- **UX degradada** (interfaz no responsive)
- **Hydration más lenta**

## ✅ Mejores Prácticas por Caso de Uso

### 1. **useTask$** - Para Lógica Asíncrona (PREFERIR)

```typescript
// ✅ BUENO - Asíncrono, no bloquea
useTask$(async () => {
  const data = await fetchUserData();
  user.value = data;
});
```

**Cuándo usar:**
- Llamadas a APIs
- Configuración de listeners
- Lógica que NO requiere DOM
- Computaciones asíncronas

### 2. **useResource$** - Para Data Fetching

```typescript
// ✅ EXCELENTE - Manejo automático de estados
const userResource = useResource$(async ({ track }) => {
  track(() => userId.value);
  return await fetchUser(userId.value);
});
```

**Beneficios:**
- **Loading states** automáticos
- **Error handling** incorporado
- **Cache automático**
- **Tracking de dependencias**

### 3. **useVisibleTask$** - SOLO Cuando Sea ESTRICTAMENTE Necesario

```typescript
// ✅ JUSTIFICADO - Necesita DOM
useVisibleTask$(() => {
  // Casos válidos:
  // - Inicializar librerías de terceros que requieren DOM
  // - Medir elementos del DOM
  // - Configurar event listeners específicos del DOM
  // - Integración con APIs del browser que requieren estar "visible"
});
```

**Cuándo es REALMENTE necesario:**
- Inicializar librerías de terceros (mapas, charts)
- Medir dimensiones del DOM
- APIs que requieren visibilidad (Intersection Observer)
- Canvas/WebGL rendering

### 4. **Event Handlers** - Para Interacciones del Usuario

```typescript
// ✅ MEJOR - Event handlers reactivos
const handleClick$ = $(() => {
  // Lógica del evento
});

// En el JSX
<button onClick$={handleClick$}>Click me</button>
```

## 🔧 Refactoring: Casos Específicos en Nuestro CRM

### Antes vs Después: Header Component

```typescript
// ❌ ANTES - useVisibleTask$ innecesario
useVisibleTask$(() => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  user.value = data.user;
});

// ✅ DESPUÉS - useTask$ más eficiente
useTask$(async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  user.value = data.user;
});
```

### Autenticación: Layout vs RouteLoader$

```typescript
// ❌ ANTES - Flash de contenido
useVisibleTask$(() => {
  // Verificación en el cliente causa flash
});

// ✅ DESPUÉS - Server-side, sin flash
export const useAuthLoader = routeLoader$(async (event) => {
  // Verificación en el servidor, sin flash
});
```

## 📋 Checklist de Optimización

### Antes de usar useVisibleTask$, pregúntate:

- [ ] **¿Realmente necesito DOM?** → Si no, usa `useTask$`
- [ ] **¿Es data fetching?** → Usa `useResource$`
- [ ] **¿Es interacción de usuario?** → Usa event handlers con `$`
- [ ] **¿Es verificación de auth?** → Usa `routeLoader$`
- [ ] **¿Es configuración inicial?** → Usa `useTask$`

### Solo usa useVisibleTask$ si:

- [ ] Necesitas APIs específicas del DOM
- [ ] Integras librerías de terceros que requieren DOM
- [ ] Mides o manipulas elementos visibles
- [ ] Usas APIs que requieren "visibilidad"

## 🚀 Impacto en Performance

### Métricas de Mejora:

| Hook | Blocking | Performance | Use Case |
|------|----------|------------|----------|
| `useVisibleTask$` | ❌ Bloquea | Baja | Solo DOM crítico |
| `useTask$` | ✅ Asíncrono | Alta | Lógica general |
| `useResource$` | ✅ Asíncrono | Alta | Data fetching |
| Event Handlers | ✅ Lazy | Alta | Interacciones |

### Resultado en Nuestro CRM:

- ✅ **Flash eliminado** - routeLoader$ en lugar de useVisibleTask$
- ✅ **Header más eficiente** - useTask$ en lugar de useVisibleTask$
- ✅ **Mejor UX** - UI no se bloquea durante autenticación
- ✅ **SSR optimizado** - Verificaciones en servidor

## 💡 Regla de Oro

> **"Si no necesitas DOM, no uses useVisibleTask$"**

La mayoría de casos de uso se resuelven mejor con:
1. **useTask$** para lógica asíncrona
2. **useResource$** para data fetching
3. **routeLoader$** para datos del servidor
4. **Event handlers** para interacciones

**useVisibleTask$ solo cuando realmente no hay alternativa.**
