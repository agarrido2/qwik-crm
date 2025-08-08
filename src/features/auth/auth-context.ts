import { createContextId, type QRL, type Signal } from "@builder.io/qwik"
import type { User } from "@supabase/supabase-js"

/**
 * 🎯 AuthContextValue Interface
 * 
 * Diseñado para máxima eficiencia y type safety:
 * - user: Datos del usuario verificados server-side
 * - isAuthenticated: Computed boolean para mejor DX
 * - logout: QRL function para lazy loading óptimo
 */
export interface AuthContextValue {
  /** Usuario actual verificado server-side con getUser() */
  user: User | null
  /** Estado computed de autenticación para mejor legibilidad */
  isAuthenticated: boolean
  /** Señales reactivas para fine-grained updates (opcional) */
  userSignal?: Signal<User | null>
  isAuthenticatedSignal?: Signal<boolean>
  /** Función de logout lazy-loaded con QRL para performance óptima */
  logout: QRL<() => Promise<void>>
}

/**
 * 🔑 AuthContext ID
 * 
 * Naming convention: domain.feature.context
 * - Evita colisiones entre contextos
 * - Identificador único global
 * - Serializable y inmutable
 */
export const AuthContext = createContextId<AuthContextValue>('qwik-crm.auth.user-context')
