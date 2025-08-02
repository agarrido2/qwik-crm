import { z } from "@builder.io/qwik-city";

/**
 * authSchemas = Schemas de validación centralizados para autenticación
 * - Reutilizables en múltiples componentes
 * - Validaciones consistentes
 * - Fácil mantenimiento
 */
export const authSchemas = {
  /**
   * Login Schema = Email + Password
   */
  login: {
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
  },

  /**
   * Register Schema = Email + Password + Confirmación
   */
  register: {
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
  },

  /**
   * Forgot Password Schema = Solo email
   */
  forgotPassword: {
    email: z.string().email("Email inválido"),
  },

  /**
   * Reset Password Schema = Password + Confirmación
   */
  resetPassword: {
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
  },
};

/**
 * validatePasswordMatch = Helper para validar que las contraseñas coincidan
 * - Reutilizable en register y reset password
 * - Validación consistente
 */
export const validatePasswordMatch = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden");
  }
};
