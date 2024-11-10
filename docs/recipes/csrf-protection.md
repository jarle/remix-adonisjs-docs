# Cross-Site Request Forgery (CSRF) Protection

You can add CSRF protection with AdonisJS Shield by adding a hidden input field `_csrf` with a CSRF token.

To get it working with Remix, we can do the following:

1. Get the CSRF token value from the AdonisJS HTTP context
1. Pass the CSRF value to our Page component through a Remix loader
1. Include the CSRF value in a hidden field in our forms

Here is a very small example of this setup, with the `action` function omitted:

``` tsx
export const loader = ({ context }: LoaderFunctionArgs) => {
  return {
    csrf: context.http.request.csrfToken
  }
}

export default function Page() {
  const { csrf } = useLoaderData<typeof loader>()

  return (
    <div className="container">
      <h1>Log in</h1>
      <Form method="post">
        <input type='hidden' name='_csrf' value={csrf} />
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </Form>
    </div>
  )
}
```