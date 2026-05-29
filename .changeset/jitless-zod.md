---
"customer-proof-embed": patch
---

Disable Zod's JIT schema compilation so the widget no longer triggers `eval`/`new Function`, which was blocked by strict `script-src` Content-Security-Policy directives on customer sites
