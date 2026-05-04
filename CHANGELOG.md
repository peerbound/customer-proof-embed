# customer-proof-embed

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
