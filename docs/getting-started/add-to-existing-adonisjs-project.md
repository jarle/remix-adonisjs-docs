# Adding React Router to an existing AdonisJS 6 project

Requirements:

- AdonisJS 6
- The [@adonisjs/vite](https://github.com/adonisjs/vite) plugin

Install and configure `@adonisjs/vite` using the [official documentation](https://docs.adonisjs.com/guides/experimental-vite#installation)

Install react-adonisjs:

```bash
npm install @matstack/react-adonisjs
node ace configure @matstack/react-adonisjs
```

::: info
Make sure that the `vite_provider` is placed above the `remix_provider` in `adonisrc.ts`
:::

Add this to your `adonisrc.ts` file:

```typescript
  assetsBundler: false,
  hooks: {
    onBuildStarting: [() => import('@matstack/react-adonisjs/build_hook')],
  },
```

Update your `tsconfig.json` compiler options to include these lines:

```json
  "compilerOptions": {
    "outDir": "./build/",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2019", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    [...]
  }
```

Add a route handler to `start/routes.ts` that invokes the React Router request handler for all HTTP verbs:

```typescript
router.any("*", async ({ remixHandler }) => {
  return remixHandler()
})
```

You should now have a working react-adonisjs application!
