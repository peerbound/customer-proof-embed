import { z } from "zod";

// Disable Zod's JIT schema compilation, which relies on `new Function`. The
// widget runs on customer sites whose Content-Security-Policy may forbid
// `script-src 'unsafe-eval'`, so the JIT fast path would otherwise throw a CSP
// violation.
//
// This MUST run before any schema is *constructed* (not just parsed): Zod reads
// the `jitless` flag and runs its `new Function('')` eval feature-detection at
// construction time. Schemas in `./lib/schemas` and `./lib/options` are built at
// module top level, so this config is imported as the very first thing in
// `widget.tsx` — ahead of those modules — to guarantee the flag is set before
// any schema is constructed.
z.config({ jitless: true });
