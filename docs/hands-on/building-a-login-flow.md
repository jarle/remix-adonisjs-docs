# Building a login flow with react-adonisjs

Building an application often requires that you let users create accounts and log in.
This guide will show you how to:

- Create database tables for storing users and hashed passwords
- Protect routes in your application
- Register new users
- Log in existing users
- Log out users

## Initial setup

Let's start by initiating our project with the following commands:

```sh
npm init adonisjs@latest -- -K="github:jarle/react-router-starter-kit" --auth-guard=session --db=sqlite login-page-tutorial
cd login-page-tutorial
npx react-router typegen
node ace configure @adonisjs/lucid
```

Select `sqlite` from the menu, and press `y` to install dependencies using npm.

Before we do anything else, let's add some css to `resources/react_app/root.tsx` so our application looks nice.
Add this snippet anywhere in the `<head>` tag of your `root.tsx` component:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
/>
```

Now you can start the application by running `npm run dev`.
It should become available on http://localhost:5173

## Setting up the database and @adonisjs/auth package

We'll protect our application with the [adonisjs/auth](https://docs.adonisjs.com/guides/auth) package.

You can add it with this command:

```sh
node ace add @adonisjs/auth --guard=session
```

This created some new files for us as you can see in the output:

```
DONE:    create config/auth.ts
DONE:    update adonisrc.ts file
DONE:    create database/migrations/create_users_table.ts
DONE:    create app/models/user.ts
DONE:    create app/middleware/auth_middleware.ts
DONE:    create app/middleware/guest_middleware.ts
DONE:    update start/kernel.ts file
DONE:    update start/kernel.ts file
[ success ] Installed and configured @adonisjs/auth
```

The most important files are:

A table migration that sets up our users table:

```ts
// database/migrations/<timestamp>_create_users_table.ts
export default class extends BaseSchema {
  protected tableName = "users"

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable()
      table.string("full_name").nullable()
      table.string("email", 254).notNullable().unique()
      table.string("password").notNullable()

      table.timestamp("created_at").notNullable()
      table.timestamp("updated_at").nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

A user model that we use to interact with the table:

```ts
// #app/models/User.ts
const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
  uids: ["email"],
  passwordColumnName: "password",
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
```

We should create the user table in our database by running our new migration file:

```sh
node ace migration:run
```

::: info
You can always re-generate your database if you want to clear it of any data.
The command for clearing your database is:

```sh
node ace migration:fresh
```

:::

## Applying auth middleware

Time to add [React Router middleware](https://reactrouter.com/how-to/middleware) and protect our routes.

Update `_index.tsx` and add the following authentication middleware function:

```tsx
export const middleware: Route.MiddlewareFunction[] = [
  async ({ context }) => {
    const { http } = context
    const authenticated = await http.auth.checkUsing(['web'])
    if (!authenticated) {
      throw redirect("/login")
    }
  }
];
```

If you try to access your app on http://localhost:3333 now, you should be redirected to the `/login` page.

This redirect will give you a `404 Not Found` error because we haven't made a login route yet.
Let's create the login route in React Router with this command:

```sh
node ace react:route --action --error-boundary login
```

:::note
We're applying middleware to a single route in this tutorial for simplicity.
In production applications, you can use [pathless routes](https://reactrouter.com/how-to/file-route-conventions#nested-layouts-without-nested-urls) to apply middleware to entire route hierarchies, protecting multiple pages with a single middleware definition.
:::

## Building the auth pages

Let's create a login form in `#resources/react_app/routes/login.tsx` to get started with our routes.
Replace your `Page()` function with this code and leave everything else in the file as-is for now:

```tsx
import { Form, Link } from 'react-router'
export default function Page() {
  return (
    <div className="container">
      <article>
        <h1>Log in</h1>
        <Form method="post">
          <label>
            Email
            <input type="email" name="email" />
          </label>
          <label>
            Password
            <input type="password" name="password" />
          </label>
          <button type="submit">Login</button>
          <p>
            Don't have an account yet?{" "}
            <Link to={"/register"}>Click here to sign up</Link>
          </p>
        </Form>
      </article>
    </div>
  )
}
```

We don't have a way to register users, so the login page isn't very useful yet.
Let's create a new route using React Router so users can register, using a similar command as before:

```sh
node ace react:route -a -e register
```

:::info
The `-a` and `-e` flags are shorthand for `--action` and `--error-boundary`.
:::

Add this simple form by replacing the `Page()` function in `#resources/react_app/routes/login.tsx` and adding `Form` to the import line as above:

```tsx
import { Form } from 'react-router'
export default function Page() {
  return (
    <div className="container">
      <h1>Register</h1>
      <article>
        <Form method="post">
          <label>
            Email
            <input type="email" name="email" />
          </label>
          <label>
            Password
            <input type="password" name="password" />
          </label>
          <button type="submit">Register</button>
        </Form>
      </article>
    </div>
  )
}
```

This is starting to look good!
But wait, clicking the `Register` button doesn't do anything yet 🤔

That means it's time to implement the logic for user registration.

## Creating and registering a user service

To keep things tidy, we create a new service for handling users.

```
node ace make:service user_service
```

Replace the code in `app/services/user_service.ts` with this:

```ts
import User from "#models/user"
import hash from "@adonisjs/core/services/hash"

export default class UserService {
  async createUser(props: { email: string; password: string }) {
    return await User.create({
      email: props.email,
      password: props.password,
    })
  }

  async getUser(email: string) {
    return await User.findByOrFail("email", email)
  }

  async verifyPassword(user: User, password: string) {
    return hash.verify(user.password, password)
  }
}
```

Now we need to make the service available to our `/register` route.
The cleanest way to do that is to add the service to the application container.

Update the `#services/_index.ts` file to create a new instance of our service:

```ts
import type { LazyService } from '#providers/service_provider';

// Register services that should be available in the container here
export const ServiceProviders = {
  env: () => import('#start/env'),
  hello_service: () => import('./hello_service.js'),
  user_service: () => import("./user_service.js"),
} satisfies Record<string, LazyService>

```

Now we have one instance of the `UserService` that can be accessed anywhere in our app.

Let's use the service in our `/register` route by replacing the `action` function and adding `redirect` to the import line as we did with `Form`:

```ts
// resources/react_app/routes/register.tsx
import { redirect } from "react-router"

export const action = async ({ context }: Route.ActionArgs) => {
  const { http, make } = context
  // get email and password from form data
  const { email, password } = http.request.only(["email", "password"])

  // get the UserService from the app container and create user
  const userService = await make("user_service")
  const user = await userService.createUser({
    email,
    password,
  })

  // log in the user after successful registration
  await http.auth.use("web").login(user)

  return redirect("/")
}
```

:::warning
Do not import the service directly in your route files (e.g., `import UserService from '#services/user_service'`).
This would cause the React Router bundler to include backend code in your client bundle, which can lead to unexpected side effects and errors.
Always access services through the container using `make()`.
:::

## Registering a user

You can now try to run your app and register a new user from http://localhost:3333/register.
If you have followed all the steps, you should be redirected to the index page after registering.

Let's make an indicator so that we can see we are actually logged in.

Let's update `_index.tsx` to have this loader, where we get the email of the currently authenticated user:

```tsx
// resources/react_app/routes/_index.tsx
export const loader = async ({ context }: Route.LoaderArgs) => {
  const email = context.http.auth.user?.email

  return {
    email,
  }
}
```

And update the `_index.tsx` components to display the email by replacing the default export `Home()`:

```tsx
// resources/react_app/routes/_index.tsx
export default function Home({ loaderData }: Route.ComponentProps) {
  return <p>Logged in as {loaderData.email}</p>
}
```

Open your app in your application and you should see something like this displayed with the email you registered with:

> Logged in as yourname@example.com

How cool is that!

We have some momentum now, so let's keep going.

## Logging out

A natural next step is to be able to log out.
Let's add support for that to our index page:


```tsx
// resources/react_app/routes/_index.tsx
export const action = async ({ context }: Route.ActionArgs) => {
  const { http } = context
  const { intent } = http.request.only(["intent"])

  if (intent === "log_out") {
    await http.auth.use("web").logout()
    throw redirect("/login")
  }
  return null
}
```

And add a button that triggers the action by using a React Router Form with intent `log_out`:

```tsx
// resources/react_app/routes/_index.tsx
import { Form } from "react-router"

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container">
      <p>Logged in as {loaderData.email}</p>
      <Form method="POST">
        <input type="hidden" name="intent" value={"log_out"} />
        <button type={"submit"}>Log out</button>
      </Form>
    </div>
  )
}
```

Now it should be possible to log out clicking the `Log out` button on the front page.
We are redirected to the login page after logging out, but we haven't finished that page yet: **we need to add login functionality.**

## Logging in

Let's add the following action to the login page, and add redirect to our imports:

```tsx
// resources/react_app/routes/login.tsx
import { redirect } from 'react-router'

export const action = async ({ context }: Route.ActionArgs) => {
  const { http, make } = context
  const { email, password } = http.request.only(["email", "password"])

  const userService = await make("user_service")
  const user = await userService.getUser(email)

  await userService.verifyPassword(user, password)
  await http.auth.use("web").login(user)

  return redirect("/")
}
```

Now we should have a complete flow for registering new users and for logging users in and out!

## Conclusion

We have covered a lot of the parts that makes `react-router-adonisjs` great, and we have only scratched the surface.
There is a lot to learn, and I will continue making these guides to make the meta framework more accessible and familiar to work with.

Here are some challenges you could try implementing on your own in the meantime:

- Error handling when wrong credentials are supplied
- Error handling when registering duplicate users
- Enforcing password security rules
- Add a "remember me" option that keeps the user signed in when the session expires
- Support signing up with OAuth (Google etc)
- Detecting what page the user was trying to access, and redirect them back there after login
- Automatically send welcome emails to users when they sign up
- Implementing a password reset flow that the user can initiate

### Further reading

- [Documentation for the @adonisjs/auth package](https://docs.adonisjs.com/guides/auth)
- [Adocast's videos on authentication in AdonisJS 6](https://adocasts.com/series/lets-learn-adonisjs-6#module7)
