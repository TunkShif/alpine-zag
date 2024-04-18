> Zag is a framework agnostic toolkit for implementing complex, interactive, and accessible UI components in your design system and web applications. (It provides) a collection of framework-agnostic UI component patterns like accordion, menu, and dialog that can be used to build design systems for React, Vue and Solid.js

And now with `alpine-zag` plugin, you can use zag components with Alpine.

# Installation

## From CDN

Import `alpine-zag` from CDN like [jsdelivr](https://www.jsdelivr.com/) or [unpkg](https://www.unpkg.com/).

Be **aware** that the plugin should be imported before the Alpine itself.

<!-- prettier-ignore -->
```html
<head>
  <script defer src="https://cdn.jsdelivr.net/npm/@tunkshif/alpine-zag@0.2.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
```

## From NPM

Use your favorite package manager to install `alpine-zag` and import it to your project.

```bash
npm install alpine-zag
yarn add alpine-zag
pnpm add alpine-zag
bun add alpine-zag
```

# Usage

## Register Components

Use `zag.register` function to register a list of Zag components for Alpine. Each component registration item is composed of the name of the component, the `connect` function, the `machine` function, and an optional `collection` function.

```js
import { zag } from "@tunkshif/alpine-zag"
import * as collapsible from "@zag-js/collapsible"
import * as combobox from "@zag-js/combobox"

Alpine.plugin(
  zag.register([
    ["Collapsible", collapsible.connect, collapsible.machine],
    ["Combobox", combobox.connect, combobox.machine, combobox.collection]
  ])
)
```

If you're using `alpine-zag` form CDN, you can access the register function from a global export name `Zag` like this:

```js
Zag.plugin.register(components)
```

## Use Components

Use `x-data` directive to initialize your previously created zag component.

```html
<div x-data="Collapsible"></div>
```

Or you can optionally pass in an initial machine context.

```html
<div x-data="Collapsible({ disabled: true })"></div>
```

And now you have access to the machine API via `api` and the machine context setter via `setContext`.

Use `x-props` directive to bind props from the machine api to a DOM element.

```html
<div x-data="Collapsible" x-props="api.rootProps">
  <button x-props="api.triggerProps">Toggle Content</button>
  <div x-props="api.contentProps">Collapsible Content</div>
</div>
```

Some components like `combobox` or `select` requires a `collection` context value to be set. You can create the collection using `$collection` magic property.

```html
<div x-data="Select({ collection: $collection.Select({ items }) })"></div>
```

You can check the full code example [here](https://github.com/TunkShif/alpine-zag/blob/main/lib/examples/index.html).
