# Why remix-adonisjs is not a hack

When people first hear about embedding React Router into AdonisJS, they sometimes wonder if it's a "hack" or an unsupported workaround. This is a valid concern - you want to build on solid foundations, not fragile workarounds that will break with every update.

The good news is that **remix-adonisjs is built on official, documented React Router APIs**. It's not a hack - it's React Router framework mode with a custom server, which is exactly what React Router was designed to support.

## What is React Router Framework Mode?

React Router offers different "modes" that provide progressively more features:

1. **Declarative Mode** - Client-side routing only
2. **Data Mode** - Adds loaders and actions with your own bundler
3. **Framework Mode** - Full framework features with official dev server

Framework mode is what most people think of when they use React Router - it includes file-based routing, loaders, actions, server-side rendering, and more. But here's the key insight: **framework mode doesn't require using the default React Router server**.

## Custom Servers are First-Class Citizens

React Router explicitly supports custom server implementations. The official documentation provides [custom server examples](https://github.com/remix-run/react-router-templates/tree/main/node-custom-server), and the framework exposes all the necessary APIs:

- `createRequestHandler()` - Process requests through React Router
- Server-side rendering APIs
- Static handler for SSR data loading
- Build output that can be imported into any Node.js server

This is exactly what remix-adonisjs uses. We import the compiled React Router application and handle requests through AdonisJS's HTTP layer:

```typescript
router.any('*', async ({ remixHandler }) => {
  return remixHandler()
})
```

The `remixHandler` is a thin wrapper around React Router's `createRequestHandler()` that bridges AdonisJS's HTTP context with React Router's request/response handling.

## Why Use a Custom Server?

React Router's default server is intentionally minimal - it focuses on routing, data loading, and rendering. This is great for many applications, but production apps often need:

- **Authentication & Authorization** - Session management, JWT handling, role-based access control
- **Database Integration** - Migrations, ORM, connection pooling
- **Email Services** - Transactional emails, queued sending
- **Background Jobs** - Scheduled tasks, queue processing
- **File Storage** - Upload handling, cloud storage integration
- **Logging & Monitoring** - Structured logging, error tracking
- **Rate Limiting & Security** - CORS, CSRF protection, request throttling

Instead of piecing together disparate libraries, AdonisJS provides all of these as integrated, well-documented modules. The custom server approach lets you use the best tool for each job: React Router for the frontend framework, AdonisJS for the backend framework.

## This Pattern is Proven

Using React Router with a custom server isn't new or experimental:

- **Express** - Many teams run React Router on Express servers
- **Fastify** - The official templates include Fastify integration
- **Cloudflare Workers** - Popular deployment target with custom adapter
- **Deno** - Custom server implementation for Deno runtime

remix-adonisjs follows the exact same pattern, just with AdonisJS as the underlying server. The only difference is that AdonisJS brings more batteries included than a minimal Express setup.

## The Integration Points

The integration between React Router and AdonisJS happens at three clear boundaries:

1. **Build Process** - React Router compiles to `build/remix/server.js`, which AdonisJS imports
2. **Request Handling** - AdonisJS forwards requests to React Router's request handler
3. **Context Injection** - AdonisJS HTTP context is passed to loaders/actions via the `context` parameter

These are all using public, stable APIs. There's no patching, monkey-patching, or relying on undocumented behavior.

## Stability and Support

Because remix-adonisjs uses official APIs:

- **Updates are straightforward** - React Router updates work as long as the public APIs remain stable
- **No lock-in** - You can eject to a plain React Router + Node.js server if needed
- **Community support** - Questions about React Router features can be answered by the React Router community
- **Clear separation** - React Router handles frontend concerns, AdonisJS handles backend concerns

## Conclusion

remix-adonisjs isn't a hack - it's a thoughtful integration of two mature frameworks using their official extension points. React Router was designed to support custom servers, and AdonisJS was designed to be a comprehensive backend framework. Bringing them together gives you the best of both worlds without compromises.

If you're building a full-stack application and want both a great frontend framework and a complete backend framework, this is a legitimate, supported approach.
