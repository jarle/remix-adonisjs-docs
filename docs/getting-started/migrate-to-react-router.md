# Migrate to React Router

[Remix is becoming React Router 7](https://remix.run/blog/react-router-v7), and we are following along.

[Migrate your project to React Router](https://reactrouter.com/upgrading/remix) if you haven't already.

The most important part is moving the configuration of remix out to the `react-router.config.ts` file:

```ts
import type { Config } from '@react-router/dev/config'
export default {
  ssr: true,
  appDirectory: 'resources/remix_app',
  buildDirectory: 'build/remix',
  serverBuildFile: 'server.js',
} satisfies Config
```

If you get stuck you can look at the [reference app files](https://github.com/jarle/remix-adonisjs/tree/main/packages/reference-app) for how to properly configure your project.