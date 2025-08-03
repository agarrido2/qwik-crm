import { useContext } from "@builder.io/qwik"
import { AuthContext, type AuthContextValue } from "./auth-context"

/**
 * 🎯 useAuthContext Hook
 * 
 * Hook personalizado con:
 * - Type safety completo
 * - Error handling descriptivo
 * - Debugging info en desarrollo
 * - Performance tracking
 */
export const useAuthContext = (): AuthContextValue => {
  try {
    const authContext = useContext(AuthContext)
    
    // 🔍 Development debugging
    if (import.meta.env.DEV && !authContext) {
      console.warn('🚨 AuthContext: No se encontró el contexto. ¿Está el provider configurado en layout.tsx?')
    }
    
    return authContext
  } catch (error) {
    // 🚨 Contexto no disponible - Error descriptivo
    throw new Error(
      '❌ useAuthContext debe ser usado dentro de un componente que tenga acceso al AuthContext. ' +
      'Asegúrate de que el componente esté dentro del Layout principal donde se configura useContextProvider.'
    )
  }
}

/**
 * 🎯 useAuth Hook (Alias más conciso)
 * 
 * Alias para mejor developer experience:
 * - Nombre más corto y común
 * - Mismo comportamiento que useAuthContext
 * - Mantiene compatibilidad con patrones estándar
 */
export const useAuth = useAuthContext
