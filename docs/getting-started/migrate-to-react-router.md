# Migrate to React Router

[Remix is merging into React Router 7](https://remix.run/blog/react-router-v7), and we are following along.

The first step is to [migrate your Remix project to React Router](https://reactrouter.com/upgrading/remix) if you haven't already.

The most important part is moving the configuration of React Router out to the `react-router.config.ts` file:

```ts
import type { Config } from '@react-router/dev/config'
export default {
  ssr: true,
  appDirectory: 'resources/remix_app',
  buildDirectory: 'build/remix',
  serverBuildFile: 'server.js',
} satisfies Config
```

Also include the file `env.d.ts` to get type safety with AdonisJS:

```ts
import type { AdonisApplicationContext } from '@matstack/remix-adonisjs/types';

declare module 'react-router' {
  interface AppLoadContext extends AdonisApplicationContext { }

  // TODO: remove this once we've migrated to `Route.LoaderArgs` instead for our loaders
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // TODO: remove this once we've migrated to `Route.ActionArgs` instead for our actions
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }
}
```

If you get stuck you can look at the [reference app files](https://github.com/jarle/remix-adonisjs/tree/main/packages/reference-app) for how to properly configure your project, or post in the [discussion section](https://github.com/jarle/remix-adonisjs/discussions).