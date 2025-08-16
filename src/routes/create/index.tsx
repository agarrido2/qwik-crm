/**
 * RUTA DE DESARROLLO - Crear Usuario de Prueba
 * 
 * Esta ruta es únicamente para testing y desarrollo.
 * 
 * PROPÓSITO:
 * - Probar la inserción de usuarios en la base de datos
 * - Verificar la conexión con Drizzle ORM
 * - Validar el schema de usuarios
 * 
 * CÓMO USAR:
 * 1. Navegar a /create en el navegador
 * 2. Rellenar el formulario con nombre y email
 * 3. Enviar para crear un usuario de prueba
 * 
 * IMPORTANTE:
 * - Solo para desarrollo, NO usar en producción
 * - Los usuarios creados aquí no tienen autenticación
 * - Requiere ID UUID válido para el schema
 * 
 * TODO: Eliminar o mover a /dev cuando el sistema esté completo
 */

import { component$ } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form } from "@builder.io/qwik-city";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { schema } from "../../../drizzle/schema";
import { randomUUID } from "crypto";

export const useCreateUser = routeAction$(
  async (data) => {
    const sqlite = new Database("./drizzle/db/db.sqlite");
    const db = drizzle(sqlite, { schema });
    
    // Generar UUID para el campo id requerido por el schema
    const userData = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
    };
    
    const user = await db.insert(schema.users).values(userData);
    return user;
  },
  zod$({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("Email inválido"),
  }),
);

export default component$(() => {
  const createUserAction = useCreateUser();
  
  return (
    <section class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">🧪 Crear Usuario de Prueba</h1>
        <p class="text-sm text-gray-600">
          Ruta de desarrollo para testing. Solo usar en desarrollo.
        </p>
      </div>
      
      <Form action={createUserAction} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input 
            name="name" 
            value={createUserAction.formData?.get("name")} 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input 
            name="email" 
            type="email"
            value={createUserAction.formData?.get("email")} 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: juan@ejemplo.com"
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={createUserAction.isRunning}
        >
          {createUserAction.isRunning ? "Creando..." : "Crear Usuario"}
        </button>
      </Form>
      
      {createUserAction.value && (
        <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 class="text-lg font-semibold text-green-800 mb-2">✅ Usuario creado exitosamente!</h2>
          <p class="text-sm text-green-600">
            El usuario ha sido insertado en la base de datos con UUID generado automáticamente.
          </p>
        </div>
      )}
      
      {createUserAction.value?.failed && createUserAction.value.fieldErrors && (
        <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 class="text-sm font-medium text-red-800 mb-2">Errores de validación:</h3>
          <ul class="text-sm text-red-600 space-y-1">
            {Object.entries(createUserAction.value.fieldErrors).map(([field, errors]) => (
              <li key={field}>• {field}: {Array.isArray(errors) ? errors[0] : errors}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
});
