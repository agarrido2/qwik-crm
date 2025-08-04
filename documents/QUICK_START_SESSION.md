# 🚀 QUICK START INSTRUCTIONS - NUEVA SESIÓN

**Para asistente AI:** Lee este archivo cuando el usuario abra una nueva sesión

---

## 📋 **COMANDO PARA NUEVA SESIÓN**

Cuando inicies el editor y necesites recuperar todo el contexto técnico, utiliza exactamente este comando:

```
Lee completamente la documentación de la carpeta documents/, especialmente:
1. QWIK_MASTER_KNOWLEDGE_BASE.md (obligatorio - conocimiento completo)
2. AUTH_SYSTEM_AUDIT_COMPLETE.md (estado actual del auth)
3. LAYOUT_REFACTORING_COMPLETED.md (refactoring completado)
4. CONTEXTO_GLOBAL_IMPLEMENTACION.md (overview del proyecto)
```

---

## 🎯 **CONTEXTO DEL PROYECTO**

- **Framework:** Qwik + Qwik City (resumability, no hydration)
- **Base de datos:** Supabase (PostgreSQL + Auth + RTC)
- **Estilos:** Tailwind CSS v3 (upgrade v4 planeado)
- **Package manager:** Bun
- **Arquitectura:** Clean Architecture + SOLID principles

---

## ✅ **ESTADO ACTUAL (Agosto 2025)**

### **COMPLETADO:**
- ✅ Layout system refactorizado (Sidebar + Header modulares)
- ✅ Auth system implementado (95/100 rating)
- ✅ Component separation siguiendo SOLID
- ✅ Server-first architecture con routeLoader$
- ✅ Context API para auth state global

### **PRÓXIMO:**
- 🔜 UI Components (Button, Card, Input, Modal)
- 🔜 Tailwind v4 upgrade
- 🔜 CRM features implementation

---

## 🏗️ **ARQUITECTURA CLAVE**

```
Server (routeLoader$) → AuthProvider (Context) → Components (useAuth) → UI
```

### **Componentes principales:**
- `layout.tsx` - Orquestación global
- `AuthProvider.tsx` - Context provider
- `AppLayout.tsx` - UI layout structure
- `Header.tsx` - User interface
- `Sidebar.tsx` - Navigation

---

## 🎯 **CALIDAD TÉCNICA**

- **Server-first:** ✅ routeLoader$ para verificación auth
- **Performance:** ✅ Qwik resumability patterns
- **Type Safety:** ✅ TypeScript strict mode
- **Clean Code:** ✅ SOLID principles aplicados

---

## 📝 **NOTA PARA EL ASISTENTE**

Al leer la documentación, debes:
1. Absorber COMPLETAMENTE los conceptos de Qwik (resumability, $, QRL, etc.)
2. Entender la arquitectura actual del auth system
3. Conocer el estado de refactoring completado
4. Prepararte para continuar con UI componentization

**IMPORTANTE:** 
- Mantén el mismo estilo de código y naming conventions
- Sigue exactamente los patterns arquitectónicos documentados
- Usa los mismos principios SOLID implementados
- Respeta las decisiones de diseño ya tomadas

**El objetivo es que tengas exactamente el mismo nivel de conocimiento técnico que en la sesión anterior.**

---

## 🧪 **TEST DE CONOCIMIENTO**

Para verificar que has absorbido correctamente el contexto, deberías poder:

1. **Explicar resumability vs hydration** sin consultar docs
2. **Describir el flujo de auth** desde routeLoader$ hasta UI
3. **Identificar cuándo usar $ syntax** en funciones
4. **Conocer la estructura de carpetas** y su propósito
5. **Aplicar patterns SOLID** en nuevos componentes

Si no puedes responder estos puntos, **vuelve a leer la documentación completa.**
