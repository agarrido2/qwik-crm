import { component$, isDev, useSignal } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { FlowbiteProvider, FlowbiteProviderHeader } from "flowbite-qwik";

import "./assets/css/global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Flowbite Qwik Provider configurado con:
   * - Theme: 'blue' (coincide con nuestros colores primary)
   * - Toast Position: 'top-right' (mejor UX para CRM)
   */

  // Signal para controlar la posición de los toasts
  const toastPosition = useSignal<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
        {/* FlowbiteProviderHeader necesario para dark mode */}
        <FlowbiteProviderHeader />
      </head>
      <body lang="en">
        {/* FlowbiteProvider envuelve toda la aplicación */}
        <FlowbiteProvider 
          toastPosition={toastPosition.value} 
          theme="blue"
        >
          <RouterOutlet />
        </FlowbiteProvider>
      </body>
    </QwikCityProvider>
  );
});
