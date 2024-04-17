## From CDN

Import `alpine-zag` from CDN like [jsdelivr](https://www.jsdelivr.com/) or [unpkg](https://www.unpkg.com/).

Be **aware** that the plugin should be imported before the Alpine itself.

```html
<head>
  <script
    defer
    src="https://cdn.jsdelivr.net/npm/@tunkshif/alpine-zag@0.1.x/dist/cdn.min.js"
  ></script>
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

Then apply the plugin with Alpine.

```js
import { zag } from "@tunkshif/alpine-zag"

Alpine.plugin(zag)

Alpine.start()
```

# Usage

## Create Component

Use `createComponent` function to create a Zag component for Alpine.

```js
import { createComponent } from "@tunkshif/alpine-zag"
import * as collapsible from "@zag-js/collapsible"

Alpine.data("collapsible", createComponent(collapsible.connect, collapsible.machine))
```

If you're using `alpine-zag` form CDN, you can access `createComponent` from a global export `Zag` like this:

```js
Alpine.data("collapsible", Zag.createComponent(collapsible.connect, collapsible.machine))
```

## Use Component

Use `x-data` directive to initialize your previously created zag component.

```html
<div x-data="collapsible"></div>
```

Or you can optionally pass in a initial machine context.

```html
<div x-data="collapsible({ disabled: true })"></div>
```

And now you have access to the machine API as `api` and the machine context setter as `setContext`.

Use `x-props` directive to bind props from the machine api to a DOM element.

```html
<div x-data="collapsible" x-props="api.rootProps">
  <button x-props="api.triggerProps">Toggle Content</button>
  <div x-props="api.contentProps">Collapsible Content</div>
</div>
```

You can check the full code example [here](https://github.com/TunkShif/alpine-zag/blob/main/examples/index.html).
