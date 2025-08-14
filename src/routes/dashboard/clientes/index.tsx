import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { 
  Button, 
  Card,
  Alert,
  Input,
  Textarea,
  Select
} from "flowbite-qwik";

export default component$(() => {
  // Signals para los valores del formulario
  const nombre = useSignal('');
  const empresa = useSignal('');
  const email = useSignal('');
  const telefono = useSignal('');
  const estado = useSignal('');
  const tipo = useSignal('');
  const notas = useSignal('');

  return (
    <div class="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-primary">Clientes</h1>
        <p class="text-gray-600 dark:text-gray-400 font-secondary">Formulario de prueba - Flowbite Qwik + Fuentes Personalizadas</p>
      </div>

      {/* Alert de prueba */}
      <Alert color="info" class="mb-6">
        <span class="font-medium font-secondary">🧪 Modo Prueba:</span> Este formulario es para verificar Flowbite Qwik + Fuentes Personalizadas.
      </Alert>

      {/* Demostración de Fuentes */}
      <Card class="mb-6">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-primary">🎨 Demostración de Fuentes Disponibles</h2>
          
          {/* Optimized Font Demo Section - Only Roboto + Lufga */}
          <div class="mt-8">
            <div class="mb-6">
              <h2 class="font-primary font-bold text-xl text-gray-900 dark:text-white mb-2">
                Sistema Tipográfico Optimizado
              </h2>
              <p class="font-primary font-normal text-sm text-gray-600 dark:text-gray-400">
                Solo 2 fuentes para máximo rendimiento y consistencia visual
              </p>
            </div>
            
            {/* Roboto Demo - Application UI */}
            <div class="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 class="font-primary font-bold text-lg text-gray-900 dark:text-white">
                  Roboto - Application UI
                </h3>
                <span class="font-primary font-medium text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                  font-primary
                </span>
              </div>
              
              <p class="font-primary font-normal text-sm text-gray-500 dark:text-gray-400 mb-4">
                Para formularios, mensajes y texto general del CRM
              </p>
              
              <div class="space-y-3">
                <div class="font-primary font-light text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Light (300):</span>
                  Texto secundario y descripciones sutiles
                </div>
                <div class="font-primary font-normal text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Regular (400):</span>
                  Texto del cuerpo principal y contenido general del CRM
                </div>
                <div class="font-primary font-medium text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Medium (500):</span>
                  Labels, navegación y elementos de interfaz
                </div>
                <div class="font-primary font-bold text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Bold (700):</span>
                  Énfasis y títulos internos del dashboard
                </div>
              </div>
              
              {/* Ejemplos prácticos Roboto */}
              <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 class="font-primary font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                  ✅ Ejemplos de uso correcto:
                </h4>
                <div class="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded">
                  <div class="font-primary font-normal text-base text-gray-700 dark:text-gray-300">
                    Formulario: "Ingrese el nombre del cliente"
                  </div>
                  <div class="font-primary font-medium text-sm text-gray-600 dark:text-gray-400">
                    Navegación: Dashboard • Clientes • Oportunidades
                  </div>
                  <div class="font-primary font-bold text-lg text-gray-900 dark:text-white">
                    Título de sección: Lista de Clientes
                  </div>
                </div>
              </div>
            </div>

            {/* Lufga Demo - Landing & Branding */}
            <div class="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 class="font-secondary font-bold text-lg text-gray-900 dark:text-white">
                  Lufga - Landing & Branding
                </h3>
                <span class="font-primary font-medium text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                  font-secondary
                </span>
              </div>
              
              <p class="font-primary font-normal text-sm text-gray-500 dark:text-gray-400 mb-4">
                Para landing page, H1, H2, CTAs y elementos de branding
              </p>
              
              <div class="space-y-3">
                <div class="font-secondary font-light text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Light (300):</span>
                  Subtítulos suaves y texto de apoyo
                </div>
                <div class="font-secondary font-normal text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Regular (400):</span>
                  Texto destacado con personalidad
                </div>
                <div class="font-secondary font-medium text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Medium (500):</span>
                  Títulos secundarios importantes
                </div>
                <div class="font-secondary font-semibold text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">SemiBold (600):</span>
                  Títulos principales con impacto
                </div>
                <div class="font-secondary font-bold text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Bold (700):</span>
                  Encabezados de landing page
                </div>
                <div class="font-secondary font-extrabold text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">ExtraBold (800):</span>
                  CTAs y botones de máximo impacto
                </div>
                <div class="font-secondary font-black text-gray-700 dark:text-gray-300">
                  <span class="text-xs text-gray-400 mr-4 w-20 inline-block">Black (900):</span>
                  Branding y elementos de máxima presencia
                </div>
              </div>
              
              {/* Ejemplos prácticos Lufga */}
              <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 class="font-primary font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                  ✅ Ejemplos de uso correcto:
                </h4>
                <div class="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded">
                  <h1 class="font-secondary font-black text-3xl text-gray-900 dark:text-white">
                    El CRM que necesitas
                  </h1>
                  <h2 class="font-secondary font-semibold text-xl text-gray-800 dark:text-gray-200">
                    Aumenta tus ventas un 40%
                  </h2>
                  <button class="font-secondary font-bold text-lg bg-blue-600 text-white px-6 py-2 rounded">
                    Prueba Gratis
                  </button>
                </div>
              </div>
            </div>

            {/* Performance & Usage Guide */}
            <div class="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 class="font-primary font-bold text-base text-green-800 dark:text-green-200 mb-3">
                ⚡ Optimizaciones Aplicadas
              </h4>
              <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                  <div class="font-primary font-medium text-green-700 dark:text-green-300">
                    ✅ Solo 2 familias de fuentes (vs 5 anteriores)
                  </div>
                  <div class="font-primary font-medium text-green-700 dark:text-green-300">
                    ✅ Pesos optimizados según uso real
                  </div>
                  <div class="font-primary font-medium text-green-700 dark:text-green-300">
                    ✅ font-display: swap para mejor UX
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="font-primary font-medium text-green-700 dark:text-green-300">
                    ✅ Fallbacks robustos del sistema
                  </div>
                  <div class="font-primary font-medium text-green-700 dark:text-green-300">
                    ✅ Rutas optimizadas desde assets/css/
                  </div>
                  <div class="font-primary font-medium text-green-700 dark:text-green-300">
                    ✅ Jerarquía tipográfica clara
                  </div>
                </div>
              </div>
              
              <div class="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
                <p class="font-primary font-normal text-xs text-gray-600 dark:text-gray-400">
                  📖 <strong>Guía completa:</strong> Consulta 
                  <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">docs/TYPOGRAPHY_GUIDE.md</code> 
                  para ejemplos detallados y mejores prácticas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Indicador de valores reactivos */}
      {(nombre.value || email.value || estado.value) && (
        <Card class="mb-6 bg-blue-50 dark:bg-blue-900/20">
          <div class="p-4">
            <h3 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              ✅ Reactividad Flowbite Qwik - Valores en tiempo real:
            </h3>
            <div class="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              {nombre.value && <div><strong>Nombre:</strong> {nombre.value}</div>}
              {email.value && <div><strong>Email:</strong> {email.value}</div>}
              {estado.value && <div><strong>Estado:</strong> {estado.value}</div>}
              {tipo.value && <div><strong>Tipo:</strong> {tipo.value}</div>}
            </div>
          </div>
        </Card>
      )}

      {/* Card principal con formulario */}
      <Card class="mb-6">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Agregar Nuevo Cliente</h2>
          
          <form class="space-y-6">
            {/* Información básica */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                bind:value={nombre}
                label="Nombre Completo *"
                placeholder="Ej: Juan Pérez García"
                required
              />
              
              <Input
                bind:value={empresa}
                label="Empresa"
                placeholder="Ej: Acme Corp"
              />
            </div>

            {/* Contacto */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                bind:value={email}
                label="Email *"
                type="email"
                placeholder="ejemplo@empresa.com"
                required
              />
              
              <Input
                bind:value={telefono}
                label="Teléfono"
                type="tel"
                placeholder="+34 600 123 456"
              />
            </div>

            {/* Estado y Tipo */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                bind:value={estado}
                label="Estado del Cliente"
                placeholder="Seleccionar estado..."
                options={[
                  { value: 'activo', name: 'Activo' },
                  { value: 'inactivo', name: 'Inactivo' },
                  { value: 'prospecto', name: 'Prospecto' }
                ]}
              />
              
              <Select
                bind:value={tipo}
                label="Tipo de Cliente"
                placeholder="Seleccionar tipo..."
                options={[
                  { value: 'individual', name: 'Individual' },
                  { value: 'empresa', name: 'Empresa' },
                  { value: 'gobierno', name: 'Gobierno' }
                ]}
              />
            </div>

            {/* Notas */}
            <Textarea
              bind:value={notas}
              label="Notas Adicionales"
              placeholder="Información adicional sobre el cliente..."
              rows={4}
            />

            {/* Botones */}
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <Button type="submit" color="blue" class="flex-1">
                Guardar Cliente
              </Button>
              <Button type="button" color="light" class="flex-1">
                Cancelar
              </Button>
              <Button type="button" color="red" outline class="flex-1">
                Limpiar Formulario
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Badges de prueba usando Tailwind */}
      <Card class="mb-6">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estados de Cliente (Badges)</h3>
          <div class="flex flex-wrap gap-2">
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Activo</span>
            <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Prospecto</span>
            <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Inactivo</span>
            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Premium</span>
            <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">VIP</span>
            <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Pendiente</span>
          </div>
        </div>
      </Card>

      {/* Botones de prueba adicionales */}
      <Card>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Botones de Prueba Flowbite</h3>
          <div class="flex flex-wrap gap-4">
            <Button color="blue">Primary</Button>
            <Button color="green">Success</Button>
            <Button color="yellow">Warning</Button>
            <Button color="red">Danger</Button>
            <Button color="purple">Purple</Button>
            <Button color="light">Light</Button>
            <Button color="dark">Dark</Button>
          </div>
          
          <div class="flex flex-wrap gap-4 mt-4">
            <Button color="blue" outline>Outline Blue</Button>
            <Button color="green" outline>Outline Green</Button>
            <Button color="red" outline>Outline Red</Button>
          </div>
        </div>
      </Card>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Clientes - Dashboard | Qwik CRM",
};
