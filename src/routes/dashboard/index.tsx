import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { UserProfileCard, QuickUserInfo } from "~/features/auth/components/UserProfileDemo";

/**
 * 🏠 Dashboard Principal
 * 
 * Contenido principal del dashboard (sin layout, se maneja en layout.tsx)
 */
export default component$(() => {
  return (
    <div class="space-y-8">
      {/* 🎯 Hero Section */}
      <div class="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">
              ¡Bienvenido al CRM! 🚀
            </h1>
            <p class="text-blue-100 text-lg">
              Contexto global implementado con excelencia técnica
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <QuickUserInfo />
          </div>
        </div>
      </div>

      {/* 📊 Stats Grid */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100">
              <span class="text-2xl">👥</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Clientes</h3>
              <p class="text-gray-600">Gestiona tu cartera</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100">
              <span class="text-2xl">💼</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Oportunidades</h3>
              <p class="text-gray-600">Cierra más ventas</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100">
              <span class="text-2xl">📊</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Reportes</h3>
              <p class="text-gray-600">Analiza resultados</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 Demo del Contexto */}
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          🎯 Demo del Contexto Global
        </h2>
        <p class="text-gray-600 mb-6">
          Este componente accede al contexto de autenticación sin props:
        </p>
        <UserProfileCard />
      </div>

      {/* 📈 Quick Actions */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a 
          href="/dashboard/clientes" 
          class="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-4 transition-colors group"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">👥</span>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-blue-600">
                Ver Clientes
              </h3>
              <p class="text-sm text-gray-500">Gestionar cartera</p>
            </div>
          </div>
        </a>

        <a 
          href="/dashboard/oportunidades" 
          class="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-4 transition-colors group"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">💼</span>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-blue-600">
                Oportunidades
              </h3>
              <p class="text-sm text-gray-500">Cerrar ventas</p>
            </div>
          </div>
        </a>

        <a 
          href="/dashboard/actividades" 
          class="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-4 transition-colors group"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">📅</span>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-blue-600">
                Actividades
              </h3>
              <p class="text-sm text-gray-500">Programar tareas</p>
            </div>
          </div>
        </a>

        <a 
          href="/dashboard/reportes" 
          class="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-4 transition-colors group"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">📊</span>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-blue-600">
                Reportes
              </h3>
              <p class="text-sm text-gray-500">Analizar datos</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard - Qwik CRM",
  meta: [
    {
      name: "description",
      content: "Dashboard principal del sistema CRM construido con Qwik",
    },
  ],
};
