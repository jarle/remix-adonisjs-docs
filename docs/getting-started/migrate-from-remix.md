# Moving an existing Remix application

Moving an existing Remix application currently takes some manual work.
This is very dependent on how your existing application is set up, and might be a major migration if you have a big Remix project.
For that reason, only high-level instructions are provided here.

- [Migrate your remix project to React Router](https://reactrouter.com/upgrading/remix) if you haven't already
- Set up a fresh project using the instructions in [the quickstart section](./quickstart)
- Replace the contents of the quickstart `resources/remix_app/` folder with the contents of your Remix `app` folder
- Port over your `package.json`
- Fix any build/linting issues that comes up

Please [let me know](https://github.com/jarle/remix-adonisjs/discussions) about any issues you encounter when migrating so they can be documented here.