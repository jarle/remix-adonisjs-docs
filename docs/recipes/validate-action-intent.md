# Validating intent in action functions

You might use the action in a route for multiple types of actions (intents).

One trick for handling this is to add a hidden `<input>` field to your form with `intent` as its name and a descriptive action as its `value`.

For example we could add a delete button like so:

```tsx
<Form method="post">
  <input type="hidden" name="intent" value="delete" />
  <button type="submit">Delete</button>
</Form>
```

Deletion is a destructive action, so we want to make sure that it is the correct intent for the POST request.

In the action function we could check the intent like this:

```tsx
export const action = async ({ context }: ActionFunctionArgs) => {
  const { http, make } = context
  const { intent } = http.request.only(["intent"])

  if (intent === "delete") {
    // delete logic
  } else {
    throw new Response(`Unsupported intent ${intent}`, { status: 400 })
  }
  return null
}
```

This works, but doesn't provide much type safety or validation of the incoming payload.
Let's add some more type safety to our application using VineJS!

### Using VineJS for request validation

We want to be able to handle different intents with different payloads on the same endpoint, and that can be achieved by using the [VineJS validation library](https://vinejs.dev/docs/introduction).

We can use the field `intent` to find out what validation we should use: our `delete` schema might be different from other intent schemas, so we keep them separate.

The code for combining multiple intents look like the following:

```tsx
const searchValidation = {
  intent: vine.literal("search"),
  searchQuery: vine.string().trim().minLength(1),
}

const addValidation = {
  intent: vine.literal("add"),
  guid: vine.string().trim().minLength(1),
}

const intent = vine.group([
  vine.group.if((data) => data.intent === "search", searchValidation),
  vine.group.if((data) => data.intent === "add", addValidation),
])

const actionValidation = vine.compile(
  vine
    .object({
      intent: vine.enum(["search", "add"]),
    })
    .merge(intent)
)
```

Here we have two intents: `search` and `add` for the same endpoint.
The `search` intent expects a `searchQuery` field to be present, while the `add` intent expects a `guid` field to be present.

We use the validation in our action like so:

```tsx
export const action = async ({ context }: ActionFunctionArgs) => {
  const { http, make } = context
  const r = await http.request.validateUsing(actionValidation)

  if (r.intent === "search") {
    const service = await make("search_service")

    const searchResults = await service.search(r.searchQuery)
    return json({ searchResults })
  } else if (r.intent === "add") {
    const service = await make("episode_service")
    const episode = await service.addByGuid({
      guid: r.guid,
    })
    return redirect(`/episode/${episode.endpoint}`)
  } else {
    // @ts-expect-error
    throw new Response(`Invalid intent ${r.intent}`, { status: 400 })
  }
}
```

When we switch on the `intent` field, we get strongly typed scopes to work in.
This is called a discriminatory union, which basically means that we are using the `intent` field as a "discriminator" to understand which of the payloads we have received, and Typescript has full support for this.

### Extracting a helper function for intent validation

We had to write a lot of validation code that could become repetitive if we have many actions.
Luckily this is a repeating pattern when we have a standard `intent` field.

Here is a helper function that could be useful if you want to use this pattern:

```ts
// resources/react_app/utils/intent_validation.ts
import vine, { VineLiteral } from "@vinejs/vine"
import type { SchemaTypes } from "@vinejs/vine/types"

type FieldValidation = Record<string, SchemaTypes>
type ValidationObject = Record<string, FieldValidation | {}>

type ConstrainedObject<T extends FieldValidation | {}> =
  T extends FieldValidation ? T : {}

type ConstrainedValidation<T extends ValidationObject> = {
  [Key in keyof T]: ConstrainedObject<T[Key]>
}

export function intentValidation<T extends ValidationObject>(
  validations2: ConstrainedValidation<T>
) {
  type ValidationWithIntent = {
    [Key in keyof T]: ConstrainedObject<T[Key]> & { intent: VineLiteral<Key> }
  }
  const validations = validations2 as ValidationWithIntent
  Object.keys(validations).forEach((key) => {
    validations[key].intent = vine.literal(key)
  })

  const validationGroup = vine.group(
    (
      Object.entries(validations) as [
        keyof ValidationWithIntent,
        ValidationWithIntent[keyof ValidationWithIntent]
      ][]
    ).map(([key, entry]) => vine.group.if((data) => data.intent === key, entry))
  )

  return vine.compile(
    vine
      .object({
        intent: vine.enum(Object.keys(validations)),
      })
      .merge(validationGroup)
  )
}
```

With this helper we can rewrite our search action validator like so:

```ts
const actionValidation = intentValidation({
  search: {
    searchQuery: vine.string().trim().minLength(1),
  },
  add: {
    guid: vine.string().trim().minLength(1),
  },
})
```
