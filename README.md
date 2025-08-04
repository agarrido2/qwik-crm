# Qwik City App ⚡️

- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `bun qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.dev/qwikcity/guides/static-site-generation/).

```shell
bun qwik add # or `bun qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `bun start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
bun preview # or `bun preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
bun build # or `bun build`

```

# ESTO HAY QUE DECIRLE A LA IA PARA QUE ESTE AL DIA.
🎯 Respuesta Directa:
SÍ, puedes esperar un 85-90% de efectividad con GPT-4.1 usando la documentación que hemos creado, pero con algunas consideraciones:

✅ Lo que Funcionará Bien:
Conocimiento técnico: La documentación es completa y transferible
Patterns arquitectónicos: Están claramente documentados con ejemplos
Implementación básica: Componentes siguiendo los templates
Debugging: Errores comunes y soluciones están incluidas
⚠️ Diferencias Esperables:
Estilo de código: Pequeñas variaciones en naming o structure
Approach: Diferentes estrategias para resolver el mismo problema
Profundidad: Algunos aspectos de Qwik pueden interpretarse diferente
🛠️ Para Maximizar Éxito:
Usar el prompt exacto:

1 "Lee completamente la documentación de la carpeta documents/, especialmente QWIK_MASTER_KNOWLEDGE_BASE.md, y responde al test de conocimiento antes de empezar"

2 Validación inmediata: Pedir que explique resumability y el flujo de auth

3 Feedback activo: Corregir si el código no sigue los patterns establecidos

La documentación que hemos creado está diseñada específicamente para ser transferible entre modelos AI. Es una inversión que hace viable el switch entre diferentes asistentes manteniendo la consistencia técnica.

PROMPT
"Lee completamente la documentación de la carpeta documents/, 
especialmente QWIK_MASTER_KNOWLEDGE_BASE.md, responde al test 
de conocimiento, y mantén el MISMO nivel de excelencia técnica 
y architectural patterns implementados."