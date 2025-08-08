# 🤖 AI KNOWLEDGE TRANSFER - QWIK CRM

**Versión:** 2.0 - Optimizado para transferencia entre modelos AI  
**Fecha:** 8 de agosto de 2025  
**Propósito:** Instrucciones precisas para que cualquier modelo AI mantenga el nivel técnico

---

## 🎯 **QUICK START PARA NUEVAS SESIONES**

### **📋 COMANDO ESENCIAL**
```
Lee completamente estos 4 archivos en orden:
1. QWIK_MASTER_GUIDE.md (conceptos fundamentales)
2. PROJECT_ARCHITECTURE.md (arquitectura del proyecto) 
3. DEVELOPMENT_WORKFLOW.md (workflows prácticos)
4. AI_KNOWLEDGE_TRANSFER.md (este archivo)

📚 RECURSOS CRÍTICOS:
- API Oficial Qwik: https://qwik.dev/api/
- Consulta la API para dudas específicas sobre funciones y tipos

Después responde al test de validación antes de comenzar cualquier tarea.
```

### **✅ TEST DE VALIDACIÓN DE CONOCIMIENTO**

**Responde estas preguntas SIN consultar documentación:**

1. **¿Qué es resumability en Qwik y cómo difiere de hydration?**
   - **Respuesta esperada:** "Resumability permite continuar ejecución desde estado serializado sin hidratación. Qwik serializa el estado del servidor y lo resume en cliente sin ejecutar JavaScript para bootstrap."

2. **¿Cuándo usar el símbolo $ en Qwik?**
   - **Respuesta esperada:** "Para crear lazy boundaries: component$(), onClick$(), useTask$(), routeLoader$(), $(async () => {}) - cualquier función que pueda ser lazy-loaded."

3. **¿Cuál es el flujo de auth implementado en el proyecto?**
   - **Respuesta esperada:** "routeLoader$ verifica user server-side → AuthProvider proporciona context global → componentes usan useAuth() hook → UI sincronizada con estado."

4. **¿Cómo crear un nuevo componente siguiendo los patterns?**
   - **Respuesta esperada:** "Interface props con readonly, component$<Props>, PropFunction para function props y QRL para handlers internos, exports centralizados en index.ts."

**Si no puedes responder correctamente, VUELVE A LEER la documentación.**

---

## 🎯 **PATTERNS CRÍTICOS - TEMPLATES**

### **✅ COMPONENT PATTERN CORRECTO**
```tsx
// ✅ SIEMPRE usar este template
interface ComponentProps {
  readonly title: string
  readonly items?: readonly Item[]
  readonly onAction$?: PropFunction<(id: string) => void>
}

export const Component = component$<ComponentProps>(({ 
  title, 
  items = [], 
  onAction$ 
}) => {
  // 1. Signals/context first
  const loading = useSignal(false)
  const auth = useAuth()
  
  // 2. Event handlers with $
  const handleClick = $(async (id: string) => {
    loading.value = true
    await onAction$?.(id)
    loading.value = false
  })
  
  // 3. JSX return
  return (
    <div class="component">
      <h2>{title}</h2>
      {items.map(item => (
        <button 
          key={item.id}
          onClick$={() => handleClick(item.id)}
          disabled={loading.value}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
})
```

### **❌ ERRORES COMUNES A EVITAR**
```tsx
// ❌ NUNCA hagas esto:
const Button = ({ children, onClick }) => {  // Sin component$
  return <button onClick={onClick}>{children}</button>  // Sin $
}

// ❌ NUNCA hagas esto:
<button onClick={() => console.log('click')}>  // Sin $

// ❌ NUNCA hagas esto:
const user = useContext(AuthContext)  // Sin validación

// ❌ NUNCA hagas esto:
const data = useRouteLoader()  // Fuera de route boundary
```

### **✅ ROUTELOADER PATTERN**
```tsx
// ✅ SIEMPRE en route files (src/routes/*/index.tsx)
export const usePageData = routeLoader$(async (requestEvent) => {
  const supabase = createServerSupabaseClient(requestEvent)
  const { data: { user } } = await supabase.auth.getUser()
  
  // Auth verification server-side
  if (requiresAuth && !user) {
    throw requestEvent.redirect(302, '/auth/login')
  }
  
  return { user, data: 'server-verified' }
})

export default component$(() => {
  const pageData = usePageData()  // ✅ Solo en mismo archivo
  return <div>{JSON.stringify(pageData.value)}</div>
})
```

### **✅ SERVER ACTION PATTERN**
```tsx
export const useFormAction = routeAction$(async (formData, requestEvent) => {
  try {
    // 1. Validation
    const validated = schema.parse(formData)
    
    // 2. Business logic
    const result = await processData(validated)
    
    // 3. Success redirect
    if (result.success) {
      throw requestEvent.redirect(302, '/success')
    }
    
    return result
  } catch (error) {
    return fail(400, { message: error.message, formData })
  }
}, zod$(schema))
```

---

## 🔧 **FEEDBACK ACTIVO - CORRECCIONES TIPO**

### **🚨 FRASES DE CORRECCIÓN**

Si el código no sigue patterns, usa estas frases:

```
"❌ Esto no sigue los patterns de Qwik. Debe usar component$() y $ syntax para lazy loading. Revisa QWIK_MASTER_GUIDE.md"

"❌ Falta TypeScript strict typing. Todos los componentes deben tener interfaces. Revisa PROJECT_ARCHITECTURE.md"

"❌ Error en Context usage. Debe usar useAuth() hook implementado. Revisa la documentación de auth system."

"❌ routeLoader$ debe estar en route boundary (src/routes/*/index.tsx). Revisa DEVELOPMENT_WORKFLOW.md"

"❌ Event handlers necesitan $ syntax para lazy loading: onClick$, onSubmit$, etc."

"📚 Para dudas específicas sobre APIs de Qwik, consulta: https://qwik.dev/api/"
```

### **✅ VALIDACIÓN INMEDIATA**

Después de cada código generado, verificar:
- [ ] Usa `component$()` syntax
- [ ] Event handlers con `$` (onClick$, onSubmit$)
- [ ] QRL functions para async operations
- [ ] TypeScript interfaces definidas  
- [ ] Imports desde exports centralizados
- [ ] Sigue architecture patterns documentados

---

## 🎯 **ARQUITECTURA DEL PROYECTO**

### **📁 ESTRUCTURA OBLIGATORIA**
```
src/
├── features/           # Domain logic por feature
├── shared/components/  # Componentes reutilizables
├── lib/                # Configuration & utils
└── routes/             # File-based routing con groups
```

### **🔐 AUTH SYSTEM - FLUJO EXACTO**
```
1. Browser Request
   ↓
2. routeLoader$ (useAuthGuard) - SERVER VERIFICATION
   ↓ 
3. AuthProvider (Context) - GLOBAL STATE
   ↓
4. useAuth() hook - COMPONENT ACCESS
   ↓
5. UI Components - SYNCHRONIZED
```

### **🛣️ ROUTING GROUPS**
```
(landing)/   # Rutas públicas
(auth)/      # Autenticación sin sidebar  
(crm)/       # Aplicación protegida con layout completo
```

---

## 📋 **CHECKLIST DE CALIDAD**

### **✅ ANTES DE GENERAR CÓDIGO**
- [ ] ¿He leído completamente la documentación?
- [ ] ¿Entiendo los patterns específicos de Qwik?
- [ ] ¿Conozco la arquitectura del auth system?
- [ ] ¿Sé cuándo usar $ syntax?

### **✅ DESPUÉS DE GENERAR CÓDIGO**
- [ ] ¿Usa component$() correctamente?
- [ ] ¿Tiene TypeScript interfaces?
- [ ] ¿Event handlers usan $ syntax?
- [ ] ¿Sigue la estructura de carpetas?
- [ ] ¿Imports desde exports centralizados?

### **✅ PARA NUEVAS FEATURES**
- [ ] ¿Creé estructura features/nueva-feature/?
- [ ] ¿Agregué index.ts con exports?
- [ ] ¿Seguí component patterns establecidos?
- [ ] ¿Documenté changes si son significativos?

---

## 🎯 **EXPECTATIVAS DE EFECTIVIDAD**

### **📊 NIVELES ESPERADOS**
```
Sonnet 3.5:     ████████████████████ 100% (referencia)
GPT-4.1:        ████████████████░░░░  85-90%
Claude 3.5:     ████████████████░░░░  85-90%  
GPT-4o:         ███████████████░░░░░  80-85%
Otros modelos:  ██████████████░░░░░░  70-80%
```

### **🎯 PARA MAXIMIZAR EFECTIVIDAD**
1. **Leer documentación COMPLETA** antes de empezar
2. **Responder test de validación** correctamente
3. **Aplicar feedback activo** cuando el código no sigue patterns
4. **Usar templates** proporcionados como base
5. **Verificar checklist** después de cada implementación

---

## 🧪 **TESTING DEL KNOWLEDGE TRANSFER**

### **🎯 PRUEBA PRÁCTICA**
```
Tarea: "Implementa un componente Button reutilizable"

Resultado esperado:
- Interface ButtonProps con readonly
- component$<ButtonProps> syntax
- onClick$ con QRL typing
- Variants y sizes con union types
- Export en shared/components/ui/
- Agregado a index.ts para export centralizado
```

### **✅ INDICADORES DE ÉXITO**
- Código generado sigue 100% los patterns
- No necesita correcciones de syntax básico
- Aplica arquitectura limpia automáticamente
- Entiende context y server-side patterns
- Genera TypeScript strict correctamente

---

## 🔄 **CONTINUOUS IMPROVEMENT**

### **📝 CUANDO ACTUALIZAR DOCUMENTACIÓN**
- Nuevos patterns probados en producción
- Cambios en arquitectura significativos
- Mejores prácticas descubiertas
- Errores recurrentes identificados

### **🎯 FEEDBACK LOOP**
Si el modelo AI genera código que no funciona:
1. Identificar el pattern que faltó
2. Actualizar templates en esta documentación
3. Mejorar frases de corrección
4. Re-testing con casos similares

---

## ✅ **RESUMEN EJECUTIVO**

### **🎯 ESTA DOCUMENTACIÓN PERMITE:**
- **Transfer completo** de conocimiento técnico Qwik
- **Consistency** entre diferentes modelos AI
- **Quality assurance** automática via patterns
- **Rapid onboarding** para nuevos asistentes

### **📊 RESULTADO ESPERADO:**
- 85-90% de efectividad mínima
- Código que funciona sin correcciones mayores
- Mantenimiento de calidad arquitectónica
- Desarrollo continuo sin knowledge gaps

---

**Esta documentación es la clave para mantener consistencia técnica y transferir efectivamente todo el conocimiento especializado de Qwik entre diferentes sesiones y modelos AI.**
