---
"customer-proof-embed": patch
---

Apply Zod's `jitless` setting before any schema is constructed so it actually takes effect. The setting was previously run after the entry module's imports, by which point the schemas were already built with the JIT (`new Function`) path active. The widget no longer triggers `script-src 'unsafe-eval'` Content-Security-Policy violations on sites with a strict CSP.
