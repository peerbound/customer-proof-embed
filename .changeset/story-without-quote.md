---
"customer-proof-embed": patch
---

Render customer story cards that have no quote. Previously a story returned without a quote failed schema validation and was dropped from the widget entirely; now the card renders with its title and footer, omitting the quote text and attribution.
