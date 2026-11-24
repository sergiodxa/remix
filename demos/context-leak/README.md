# Context Leak Demo

A component's context lookup starts from the parent it mounted under, so each mounted component
keeps the whole vnode tree of the render it mounted in reachable. Mixin runtimes do the same. A
page that mounts components as it updates keeps every earlier tree, and its heap grows without
bound.

`app/main.tsx` renders a list that always holds the last 50 entries, one `Entry` component each,
and adds one per click. The DOM never holds more than 50 `<li>`, but every click leaves another
tree reachable.

## Run it

From the repository root:

```sh
pnpm install
pnpm --filter context-leak-demo exec playwright install chromium
pnpm --filter context-leak-demo run measure
```

`measure.ts` clicks "Add entry" 2000 times in Chromium and prints the heap after a forced garbage
collection every 250 clicks. On `main` at `03f55a044`:

```text
clicks  heap (MB)  <li> in DOM
     0        3.2  0
   250        9.1  50
   500       15.1  50
   750       21.1  50
  1000       27.1  50
  1250       33.0  50
  1500       39.0  50
  1750       45.0  50
  2000       51.0  50
```

`remix@3.3.0` from npm grows the same way, from 2.2 MB to 50.1 MB.

`pnpm --filter context-leak-demo run dev` serves the same page for a look in DevTools' Memory
panel.
