# Building a login flow with remix-adonisjs

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
npm init adonisjs@latest -- -K="github:jarle/remix-starter-kit" --auth-guard=access_tokens --db=sqlite login-page-tutorial
node ace configure @adonisjs/lucid
```

Before we do anything else, let's add some css to `resources/remix_app/root.tsx` so our application looks nice.
Add this snippet anywhere in the `<head>` tag of your `root.tsx` component:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
/>
```


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
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```


A user model that we use to interact with the table:
```ts
// #models/User.ts
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
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


A middleware that authenticate incoming requests for the endpoints we specify:
```tsx
// #middleware/auth_middleware.ts
export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    return next()
  }
}
```


Here `redirectTo` is the route that the user will be sent to if they are not logged in when accessing a protected route.

We need to modify this middleware so it doesn't do any checks for the `/login` page, by defining some open routes and skipping the check for those routes:
```ts
if (this.openRoutes.includes(ctx.request.parsedUrl.pathname ?? '')) {
  return next()
}
```

The middleware file should look like this:
```ts
// #middleware/auth_middleware.ts
export default class AuthMiddleware {
  redirectTo = '/login'

  openRoutes = [this.redirectTo, '/register']

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    if (this.openRoutes.includes(ctx.request.parsedUrl.pathname ?? '')) {
      return next()
    }
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    return next()
  }
}
```

We should also create the user table in our database by running our new migration file:
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

Time to apply the middleware and protect our routes! 

Update `#start/routes.ts` and add the `auth_middleware` to the remix route handler.
This will run the authentication on every remix route.

```ts
router
  .any('*', async ({ remixHandler }) => {
    return remixHandler()
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
```

If you try to access your app now, you should be redirected to the `/login` endpoint.

This redirect will give you a `404 Not Found` error because we haven't made a login route yet.
Let's create the login route in Remix with this command:

```sh
node ace remix:route --action --error-boundary login
```


## Building the auth pages

Let's create a login form to get started with our routes.
Replace your `Page()` function with this code and leave everything else in the file as-is for now:
```tsx
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
            Don't have an account yet? <Link to={'/register'}>Click here to sign up</Link>
          </p>
        </Form>
      </article>
    </div>
  )
}
```


We don't have a way to register users, so the login page isn't very useful yet.
Let's create a new route using Remix so users can register, using a similar command as before:

```sh
node ace remix:route --action --error-boundary register
```


Add this simple form to the `Page()` function:

```tsx
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

## Creating  and registering a user service
To keep things tidy, we create a new service for handling users.

```
node ace make:service user_service
```

Add this code to the service:
```ts
import User from '#models/user';
import hash from '@adonisjs/core/services/hash';

export default class UserService {
  async createUser(props: { email: string; password: string }) {
    return await User.create({
      email: props.email,
      password: props.password,
    })
  }

  async getUser(email: string) {
    return await User.findByOrFail('email', email)
  }

  async verifyPassword(user: User, password: string) {
    return hash.verify(user.password, password)
  }
}
```


Now we need to make the service available to our `/register` route.
The proper way to do that is to add the service to the application container.

Update the `#services/service_providers.ts` file to create a new instance of our service:

```ts
import HelloService from './hello_service.js'
import UserService from './user_service.js'

// Register services that should be available in the container here
export const ServiceProviders = {
  hello_service: () => new HelloService(),
  user_service: () => new UserService(),
} as const
```

Now we have one instance of the `UserService` that can be accessed anywhere in our app.

Let's use the service in our `/register` route `action` function:

```ts
export const action = async ({ context }: ActionFunctionArgs) => {
  const { http, make } = context
  // get email and password from form data
  const { email, password } = http.request.only(['email', 'password'])

  // get the UserService from the app container and create user
  const userService = await make('user_service')
  const user = await userService.createUser({
    email,
    password,
  })

  // log in the user after successful registration
  await http.auth.use('web').login(user)

  return redirect('/')
}
```


## Registering a user

You can now try to run your app and register a new user.
If you have followed all the steps, you should be redirected to the index page after registering.

Let's make an indicator so that we can see we are actually logged in.

Let's update `_index.tsx` to have this loader, where we get the email of the currently authenticated user:
```tsx
// resources/remix_app/routes/_index.tsx
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const email = context.http.auth.user?.email

  return json({
    email,
  })
}
```

And update the `Index.tsx` components to display the email:
```tsx
// resources/remix_app/routes/_index.tsx
export default function Index() {
  const { email } = useLoaderData<typeof loader>()

  return <p>Logged in as {email}</p>
}
```

Open your app in your application and you should see something like this displayed with the email you registered with:

> Logged in as yourname@example.com

How cool is that!

We have some momentum now, so let's keep going.

## Logging out

A natural next step is to be able to log out.
Let's add support for that to our index page:

Add an action to your index route to make it possible to log out:

```tsx
// resources/remix_app/routes/_index.tsx
export const action = async ({ context }: ActionFunctionArgs) => {
  const { http } = context
  const { intent } = http.request.only(['intent'])

  if (intent === 'log_out') {
    await http.auth.use('web').logout()
    return redirect('/login')
  }
  return null
}
```

And add a button that triggers the action:

```tsx
// resources/remix_app/routes/_index.tsx
export default function Index() {
  const { email } = useLoaderData<typeof loader>()

  return (
    <div className="container">
      <p>Logged in as {email}</p>
      <Form method="POST">
        <input type="hidden" name="intent" value={'log_out'} />
        <button type={'submit'}>Log out</button>
      </Form>
    </div>
  )
}
```

Now it should be possible to log out clicking the `Log out` button on the front page.
We are redirected to the login page after logging out, but we haven't finished that page yet: we need to add login functionality.

## Logging in

Let's add the following action to the login page:

```tsx
import { ActionFunctionArgs, redirect } from '@remix-run/node'

export const action = async ({ context }: ActionFunctionArgs) => {
  const { http, make } = context
  // get the form email and password
  const { email, password } = http.request.only(['email', 'password'])

  const userService = await make('user_service')
  // look up the user by email
  const user = await userService.getUser(email)

  // check if the password is correct
  await userService.verifyPassword(user, password)

  // log in user since they passed the check
  await http.auth.use('web').login(user)

  return redirect('/')
}
```


Now we should have a complete flow for registering new users and for logging users in and out!

## Conclusion

We have covered a lot of the parts that makes `remix-adonisjs` great, and we have only scratched the surface.
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