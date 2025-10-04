# Deployment

Deployment should be similar to an [ordinary AdonisJS deployment](https://docs.adonisjs.com/guides/getting-started/deployment)

Make sure that you set `NODE_ENV=production`, otherwise React Router won't be loaded properly.

If you haven't set the `NODE_ENV` property you might get Rollup errors like this when trying to run your deployment:

```
RollupError
Expected ';', '}' or <eof>
```
