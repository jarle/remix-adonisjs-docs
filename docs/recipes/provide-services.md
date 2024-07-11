# Using services in remix

Services that should be from from Remix are registered in `#services/_index.ts`:

```ts
export const ServiceProviders = {
  env: () => import('#start/env'),
  hello_service: () => import('./hello_service.js'),
} satisfies Record<string, LazyService>
```

Any services declared here will be [a singleton](https://docs.adonisjs.com/guides/concepts/dependency-injection#singletons) accessible in the container with the provided key.
This makes the services available in our remix application, as it will use the container for accessing backend services.

You can register anything as a service: the return value of your lambda will decide what is resolved when we look up the key.

Here is an example of instantiating a service that requires some async setup:

```ts
export const ServiceProviders = {
  hello_service: async () => {
	  const { default: HelloService } = await import('./hello_service.js')
	  return await HelloService.create()
  },
} satisfies Record<string, LazyService>
```

We use dynamic imports so that services are lazily instantiated - this gives us faster application startup when we have many services.

## Accessing services

The application container is injected into the Remix context, making it available in loaders and actions.

The [remix-starter-kit](https://github.com/jarle/remix-starter-kit) includes a simple loader that shows how we access the service from the container:

```ts
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const service = await context.make('hello_service')

  return json({
    message: service.getMessage(),
  })
}
```

The function `make` is bound to the application container and contains all our services.