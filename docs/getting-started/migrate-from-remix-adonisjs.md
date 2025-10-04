# Migration Guide: From remix-adonisjs to react-adonisjs

This guide walks you through migrating from `@matstack/remix-adonisjs` to `@matstack/react-adonisjs`. The migration involves updating package dependencies, configuration files, and a few naming changes.

## Step 1: Update Package Dependencies

Open your `package.json` and update the following packages:

Replace the old `@matstack/remix-adonisjs` package with the new one:
- Remove: `@matstack/remix-adonisjs`
- Add: `@matstack/react-adonisjs` at version `^1.0.3`

Update React Router packages to version `^7.9.3`:
- `@react-router/dev`
- `@react-router/node`
- `@react-router/serve`
- `@react-router/remix-routes-option-adapter`
- `react-router`
- `react-router-dom`

After making these changes, run `npm install` to install the updated packages.

## Step 2: Update AdonisJS Configuration

Open your `adonisrc.ts` file and make the following changes:

**In the commands array**, replace the remix-adonisjs import with react-adonisjs:
```typescript
() => import('@matstack/react-adonisjs/commands')
```

**In the providers array**, replace the remix provider with the react router provider:
```typescript
() => import('@matstack/react-adonisjs/react_router_provider')
```

**In the hooks section**, update the build hook import:
```typescript
hooks: {
  onBuildStarting: [() => import('@matstack/react-adonisjs/build_hook')],
}
```

## Step 3: Update Type Definitions

Open your `env.d.ts` file and update the import and interface:

Change the import statement to reference the new package:
```typescript
import type { AdonisApplicationContext } from '@matstack/react-adonisjs/types'
```

Update the React Router module declaration by renaming `AppLoadContext` to `RouterContextProvider`:
```typescript
declare module 'react-router' {
  interface RouterContextProvider extends AdonisApplicationContext { }

  // ... rest of your declarations
}
```

## Step 4: Update Route Handler

Open your `start/routes/react_router.ts` file and rename the handler:

Change `remixHandler` to `reactRouterHandler` in your route definition:
```typescript
router.any('*', async ({ reactRouterHandler, logger }) => {
  return reactRouterHandler().catch((e) => {
    logger.error(e)
  })
})
```

## Step 5: Enable React Router v8 Middleware

Open your `react-router.config.ts` file and add the future flag for v8 middleware:

```typescript
export default {
  appDirectory: 'resources/remix_app',
  buildDirectory: 'build/remix',
  serverBuildFile: 'server.js',
  future: {
    v8_middleware: true,
  }
} satisfies Config
```

## Step 6: Install Dependencies

Run the package manager to install all updated dependencies:

```bash
npm install
```

## Summary of Changes

The migration primarily involves:
1. Replacing the `remix-adonisjs` package with `react-adonisjs`
2. Updating React Router packages to version 7.9.3
3. Renaming `AppLoadContext` to `RouterContextProvider` in type definitions
4. Renaming the route handler from `remixHandler` to `reactRouterHandler`
5. Updating all import paths from `remix-adonisjs` to `react-adonisjs`
6. Enabling the v8 middleware future flag

Your application should now be successfully migrated to use `@matstack/react-adonisjs`!
