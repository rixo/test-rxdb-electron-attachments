Test case for rxdb + idb + electron.

```bash
npm ci

# run test in electron (idb + memory) => idb fails
npm start

# run test in node (only memory) => OK
node node.js

# run test in browser (idb + memory) => OK
npx browserify renderer.js -o browser.js
open browser.html
```
