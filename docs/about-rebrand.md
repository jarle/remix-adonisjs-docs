# Introducing react-adonisjs

## Why We're Rebranding from remix-adonisjs

When we launched this project, Remix was the name of both the framework and the company behind it.
But the web development landscape has evolved.
With [Remix merging into React Router 7](https://remix.run/blog/react-router-v7), the framework we've built on has a new identity - and we're updating ours to match.

**The package formerly known as `@matstack/remix-adonisjs` is now `@matstack/react-adonisjs`.**

This isn't just a cosmetic change.
It's a more accurate reflection of what this framework is and where it fits in the React ecosystem.

## React Router: The Foundation of Modern React

React Router has become the de facto standard for building React applications.
The [official React documentation](https://react.dev/learn/start-a-new-react-project) explicitly recommends using a framework when building with modern React, and React Router is one of the recommended options.

This is significant.
React Router isn't a third-party abstraction or a community experiment - it's recommended by the React core team as a production-ready way to build React applications.
It provides the foundation you need for modern React development:

- **Server-side rendering** - Fast initial page loads and SEO benefits
- **Data loading** - Loaders and actions for fetching and mutating data
- **Nested routing** - Compose your UI with route hierarchies
- **Type safety** - Full TypeScript support throughout
- **Progressive enhancement** - Forms work without JavaScript
- **Code splitting** - Automatic bundle optimization

When you build with `react-adonisjs`, you're building on React Router - a foundation that's stable, well-documented, and endorsed by the React team itself.

## Why "react-adonisjs" Makes Sense

The name `react-adonisjs` better communicates what this framework provides:

### 1. It's About React, Not Just Routing

While React Router handles routing, data loading, and rendering, what we've built is a complete React framework.
The name "react-adonisjs" reflects that this is a full-stack React solution, not just a routing library integration.

### 2. It Aligns With React's Direction

The React team's guidance is clear: use a framework for modern React development.
React Router is their recommended path for this.
By naming our project `react-adonisjs`, we're aligning with the React ecosystem's direction and making it clear that this is a React framework.

### 3. It's More Discoverable

Developers searching for "React + AdonisJS" or "React framework with AdonisJS" will find us more easily.
The name describes what the framework does without requiring knowledge of React Router's evolution from Remix.

### 4. It's Future-Proof

React Router is actively maintained by Shopify and has a clear, long-term roadmap.
The merger with Remix wasn't a sunset - it was a consolidation that made React Router stronger.
The name `react-adonisjs` will remain accurate as React Router continues to evolve.

## A Solid and Stable Foundation

React Router's merge with Remix brought together the best of both projects.
What resulted is a framework that has:

- **Battle-tested code** - Used by thousands of production applications
- **Corporate backing** - Maintained by Shopify with full-time engineers
- **Clear vision** - Focused on web standards and progressive enhancement
- **Strong ecosystem** - Extensive documentation, tooling, and community

Building on this foundation means you're not taking a risk on an experimental framework.
You're building on proven technology that major companies trust for production applications.

AdonisJS provides an equally solid foundation on the backend:

- **Mature framework** - In development since 2016
- **Laravel-inspired** - Familiar patterns for rapid development
- **Integrated ecosystem** - Authentication, ORM, validation, mail, and more
- **TypeScript-first** - Built for type safety from the ground up

Together, React Router and AdonisJS give you a stable, production-ready stack that won't require constant rewrites as frameworks come and go.

## What About Other Options?

We're sometimes asked about alternatives, so let's address them:

### Inertia.js

[Inertia.js](https://inertiajs.com/) is an excellent choice for building React applications with AdonisJS, and it has [official support from the AdonisJS core team](https://docs.adonisjs.com/guides/inertia).
If you're looking for a more traditional server-rendered approach where AdonisJS is clearly the primary framework, Inertia is a great option.

The key difference is architectural:

- **Inertia.js** - AdonisJS-first with React as the view layer (server-driven)
- **react-adonisjs** - React Router-first with AdonisJS as the backend (client-driven)

With Inertia, your application logic lives primarily in AdonisJS controllers, and React components are views that receive props.
With react-adonisjs, your application logic is distributed between React Router loaders/actions (frontend) and AdonisJS services (backend).

Choose Inertia if you want a traditional MVC architecture with React views.
Choose react-adonisjs if you want a full-stack React application with an AdonisJS backend.

Both are valid approaches.
We built react-adonisjs because we wanted the full power of React Router's data loading, nested routing, and client-side navigation while having access to AdonisJS's comprehensive backend features.

## What's Changing (And What's Not)

### Changing:

- ✅ Package name: `@matstack/remix-adonisjs` → `@matstack/react-adonisjs`
- ✅ Repository name: `jarle/remix-adonisjs` → `jarle/react-adonisjs`
- ✅ Documentation URL: `matstack.dev/remix-adonisjs` → `matstack.dev/react-adonisjs`
- ✅ Branding and messaging

### Not Changing:

- ✅ The code (same APIs, same integration)
- ✅ How you use it (same patterns and practices)
- ✅ The technical foundation (still React Router + AdonisJS)
- ✅ The maintainer (still [Jarle Mathiesen](https://mathiesen.dev))
- ✅ Your existing projects (they'll keep working)

## Migration Guide

Updating is straightforward:

### 1. Update your package.json

```bash
npm uninstall @matstack/remix-adonisjs
npm install @matstack/react-adonisjs
```

### 2. Update your imports

If you have any direct imports from the package (most projects don't), update them:

```typescript
// Before
import { something } from "@matstack/remix-adonisjs"

// After
import { something } from "@matstack/react-adonisjs"
```

### 3. Update your configuration

In `adonisrc.ts`, update the provider reference:

```typescript
// Before
providers: [
  // ...
  () => import("@matstack/remix-adonisjs/remix_provider"),
]

// After
providers: [
  // ...
  () => import("@matstack/react-adonisjs/remix_provider"),
]
```

### 4. Update build hooks (if applicable)

In `adonisrc.ts`, update the build hook:

```typescript
// Before
hooks: {
  onBuildStarting: [() => import('@matstack/remix-adonisjs/build_hook')],
}

// After
hooks: {
  onBuildStarting: [() => import('@matstack/react-adonisjs/build_hook')],
}
```

That's it! Your application will work exactly as before.

## Looking Forward

This rebrand represents our commitment to building on stable, recommended foundations.
React Router's evolution from Remix has only made it stronger, and AdonisJS continues to mature with each release.

Together, they provide a stack that lets you build ambitious web applications without constantly chasing the latest framework trend.
You get modern React development practices backed by a comprehensive backend framework - all with the confidence that comes from building on established, actively-maintained technology.

We're excited about this new chapter and the clarity it brings to what we're building.
Thank you for being part of this journey.

---

**Questions or feedback?**
Join the discussion on [GitHub](https://github.com/jarle/react-adonisjs/discussions) or reach out on [X/Twitter](https://x.com/jarlemathiesen).
