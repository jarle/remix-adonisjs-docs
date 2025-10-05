# Cross-Site Request Forgery (CSRF) Protection

First enable [CSRF](https://docs.adonisjs.com/guides/security/securing-ssr-applications#csrf-protection) in `@adonisjs/shield`.

## Method 1: Include X-XSRF-TOKEN in requests

First set `enableXsrfCookie: true` in `config/shield.ts`.

Enabling this option will ensure that the XSRF-TOKEN cookie is set on the client side.

Next we need to override `fetch` globally on our window object to include the header on every client request.

You can do so with this hook:

```tsx
// useFetchWithXSRF.tsx
import { useEffect } from 'react';

export const useFetchWithXSRF = (): void => {
  useEffect(() => {
    const originalFetch: typeof fetch = window.fetch;

    const fetchWithXSRF: typeof fetch = async (url, options = {}) => {
      options.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);

      const requestUrl = new URL(url.toString(), window.location.origin);

      if (requestUrl.origin === window.location.origin) {
        if (options.method && options.method.toUpperCase() === 'POST') {
          const cookies = document.cookie.split(';');
          const xsrfToken = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
          if (xsrfToken) {
            options.headers.append('X-XSRF-TOKEN', xsrfToken.split('=')[1]);
          }
        }
      }

      return originalFetch(url, options);
    };

    window.fetch = fetchWithXSRF;

    return () => {
      window.fetch = originalFetch;
    };
  }, []);
};

```

Use this hook somewhere in your `root.tsx` component and CSRF should be enabled for all POST requests.

If you need to exclude some endpoints (for example API), see the [AdonisJS docs for exceptRoutes.](https://docs.adonisjs.com/guides/security/securing-ssr-applications#config-reference)


## Method 2: Hidden input field

You can also add CSRF protection with AdonisJS Shield by adding a hidden input field `_csrf` with a CSRF token.
This might be a bit more cumbersome, since every form in your application needs to include the hidden field.

To get it working with React Router, we can do the following:

1. Get the CSRF token value from the AdonisJS HTTP context
1. Pass the CSRF value to our Page component through a React Router loader
1. Include the CSRF value in a hidden field in our forms

Here is a very small example of this setup, with the `action` function omitted:

``` tsx
export const loader = ({ context }: Route.LoaderArgs) => {
  return {
    csrf: context.http.request.csrfToken
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { csrf } = loaderData

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