> Zag is a framework agnostic toolkit for implementing complex, interactive, and accessible UI components in your design system and web applications. (It provides) a collection of framework-agnostic UI component patterns like accordion, menu, and dialog that can be used to build design systems for React, Vue and Solid.js

And now with `alpine-zag` plugin, you can use zag components with Alpine.

# Installation

## From CDN

Import `alpine-zag` from CDN like [jsdelivr](https://www.jsdelivr.com/) or [unpkg](https://www.unpkg.com/).

Be **aware** that the plugin should be imported before the Alpine itself.

<!-- prettier-ignore -->
```html
<head>
  <script defer src="https://cdn.jsdelivr.net/npm/@tunkshif/alpine-zag@0.3.x/dist/cdn.min.js"></script>
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

Currently, `alpine-zag` provides a set of low-level API and it is similar to other framework's integration with Zag.

## Apply Plugin

```js
import { plugin as zag } from "@tunkshif/alpine-zag"

Alpine.plugin(zag)
```

## Define Component

`alpine-zag` provides `useMachine` and `useActor` to consume a machine or an actor, and then you can use `useAPI` to connect to your machine.

The main difference in usage from other frameworks' integration is that you'll have to pass an extra `Alpine` instance as the first argument and you have to manage the lifecycle of the machine manually.

At least for now, I haven't found a better way to automatically manage effects and cleanup outside the scope of Alpine, but you could make your own directives to make it less verbose.

```js
import { useAPI, useMachine } from "@tunkshif/alpine-zag"

Alpine.data("Tooltip", () => {
  const service = useMachine(Alpine, tooltip.machine({ id: id(), openDelay: 500, closeDelay: 200 }))
  const api = useAPI(Alpine, () =>
    tooltip.connect(service.state.value, service.send, normalizeProps)
  )
  return {
    init() {
      service.start()
      api.start()
    },
    destroy() {
      api.stop()
      service.stop()
    },
    get api() {
      return api.value
    }
  }
})
```

## Use Components

Use `x-data` directive to initialize your previously created zag component. And now you have access to the machine API via `api`.

Use `x-props` directive to bind props from the machine api to a DOM element.

```html
<div x-data="Tooltip">
  <div x-props="api.triggerProps" class="flex">
    <slot name="trigger" data-test />
  </div>
  <div x-cloak x-show="api.isOpen" x-props="api.positionerProps">
    <div x-props="api.contentProps">
      <slot name="content" />
    </div>
  </div>
</div>
```
