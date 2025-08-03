import { useContext } from "@builder.io/qwik"
import { AuthContext } from "../auth-context"

/**
 * 🎯 useAuthContext Hook
 * 
 * Simple wrapper para useContext(AuthContext)
 * Se usa directamente en componentes como cualquier hook de Qwik
 */
export const useAuthContext = () => useContext(AuthContext)

/**
 * 🚀 useAuth (Alias)
 * 
 * Alias para useAuthContext para mejor DX
 * - Mismo comportamiento que useAuthContext
 * - Naming más corto y familiar
 */
export const useAuth = useAuthContext
