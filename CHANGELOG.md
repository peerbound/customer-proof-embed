# customer-proof-embed

## 1.1.2

### Patch Changes

- d343b99: Update the Peerbound logo shown in optional badge
- 34fc869: Apply Zod's `jitless` setting before any schema is constructed so it actually takes effect. The setting was previously run after the entry module's imports, by which point the schemas were already built with the JIT (`new Function`) path active. The widget no longer triggers `script-src 'unsafe-eval'` Content-Security-Policy violations on sites with a strict CSP.

## 1.1.1

### Patch Changes

- 567841d: Disable Zod's JIT schema compilation so the widget no longer triggers `eval`/`new Function`, which was blocked by strict `script-src` Content-Security-Policy directives on customer sites
- 08ebf23: Render customer story cards that have no quote. Previously a story returned without a quote failed schema validation and was dropped from the widget entirely; now the card renders with its title and footer, omitting the quote text and attribution.

## 1.1.0

### Minor Changes

- 1a8728f: Add `hide-dates` attribute to control date visibility on proof cards.

  By default, dates continue to appear on all card types. Set `hide-dates="true"` to hide dates across all cards, or pass a JSON array of card types to hide dates selectively:

  ```html
  <!-- Hide dates on all card types -->
  <pb-embed embed-id="your-embed-id" hide-dates="true"></pb-embed>

  <!-- Hide dates only on customer stories -->
  <pb-embed embed-id="your-embed-id" hide-dates='["story"]'></pb-embed>
  ```

  Valid types are `"moment"`, `"review"`, and `"story"`. When a card has no date and no source link, the card footer is omitted entirely rather than leaving empty space.

## 1.0.0

### Major Changes

- e7e55b7: Initial release
