# Accessing services from React Router actions and loaders

Say for example that we want to add a UserService to our application.

```
node ace make:service user_service
```

We make it a very simple class for demonstration purposes:

```typescript
// #services/user_service.ts
import User from '#models/user';

export default class UserService {
  /**
   * Look up a user from the database
   * @param email Email of the user
   * @returns Instance of the given User model
   */
  async getUser(email: string) {
    return await User.findByOrFail('email', email)
  }
}
```

It is tempting to include this service directly in our loaders with `import`, but that would mean pulling AdonisJS code into our frontend code.
**As a general rule we should avoid including AdonisJS code directly in our frontend code to keep the separation clean.**

We will therefore register our services in the AdonisJS container and access them only at runtime from our React Router loaders.
If you are unfamiliar with the AdonisJS IoC container, you can think of it as a key-value map that is shared across the application at runtime.
This makes it possible to insert stuff such as singleton services and access them across your application.

In order to make it easy to add services, we will do a couple of steps:

1. Declare our services in one place
1. Instantiate and register all declared services in the AdonisJS container
1. Add typescript declarations that signals that our services are available in the container

### Setting up helper functions for service providers

Run this command to get started:

```
node ace make:service service_providers
```

Modify the new service file to include your services:

```typescript
// Register services that should be available in the container here
export const ServiceProviders = {
  user_service: () => import('#services/user_service'),
} satisfies Record<string, LazyService>
```


Then run the following command, and press `y` when prompted to register the provider in `.adonisrc.ts`:
```
node ace make:provider service_provider
```

Then add these files to your `#providers` folder:

```typescript
// #providers/service_provider.ts
import { ServiceProviders } from '#services/service_providers'
import { ApplicationService } from '@adonisjs/core/types'

export default class ServiceProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    Object.entries(ServiceProviders).forEach(([key, creator]) => {
      this.app.container.singleton(key as any, async (resolver) => {
        const constructor = await creator()
        return resolver.make(constructor.default)
      })
    })
  }
}

```

```typescript
// #providers/service_types.d.ts
import { ServiceProviders } from "#services/_index";

type ProvidedServices = {
  [K in keyof typeof ServiceProviders]: InstanceType<
    Awaited<ReturnType<(typeof ServiceProviders)[K]>>['default']
  >
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings extends ProvidedServices {}
}

```

This should give you type safe access to your services from the container in your React Router application.

Here is an example of how it is now possible to access the `user_service` instance:

```tsx
// resources/remix_app/routes/_index.tsx

import { ActionFunctionArgs, useLoaderData } from 'react-router'

export const loader = async ({ context }: ActionFunctionArgs) => {
  const userService = await context.make('user_service')
  const user = await userService.getUser('jarle@example.com')

  return {
    name: user.name,
  }
}

export default function Page() {
  const { name } = useLoaderData<typeof loader>()
  return <p>Hello, {name}</p>
}

```

### Bonus: Using `import` instead of `make`

We can add a simple wrapper for getting our service from the container:

```typescript
// #services/index.ts
import app from '@adonisjs/core/services/app'
import type UserService from './user_service'

let userService: UserService

await app.booted(async () => {
  userService = await app.container.make('user_service')
})

export { userService }
```


::: warning
Make sure that that you use `import type` for your service in this file, so that React Router doesn't bundle your service code when compiling.
:::

When using this wrapper, we can now access the `userService` with regular imports:

```tsx
import { userService } from '#services/index'
import { useLoaderData } from 'react-router'

export const loader = async () => {
  const user = await userService.getUser('jarle@example.com')

  return {
    name: user.name,
  }
}

export default function Page() {
  const { name } = useLoaderData<typeof loader>()
  return <div>Hello, {name}</div>
}

```


We can see the resulting compiled React Router `server.js` code:
```js
// build/remix/server/server.js
import app from "@adonisjs/core/services/app";

const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
let userService;
app.booted(async () => {
  userService = await app.container.make("user_service");
});
const loader = async () => {
  const user = await userService.getUser("jarle@example.com");
  return json({
    name: user.name
  });
};
function Page() {
  const { name } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    "Hello, ",
    name
  ] });
}

```

Notice how the `userService` is being instantiated from the container, with no code from the service itself being included in the bundle.