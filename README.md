# Peerbound for Web

Your customers are already saying great things about you. Peerbound for Web lets you showcase that customer proof directly on your website—moments, reviews, and stories that build trust and drive conversions.

The widget pulls content from Peerbound and displays it in a responsive, customizable grid that matches your brand. No manual updates needed; when you add new proof to Peerbound, it automatically appears on your site.

## Quick Start

Add the widget script to your page and place the `<pb-embed>` element where you want customer proof to appear:

```html
<pb-embed embed-id="your-embed-id"></pb-embed>
<script async src="https://embed.peerbound.com/v1/widget.js"></script>
```

Replace `your-embed-id` with the embed ID from the Peerbound [Embed Settings](https://app.peerbound.com/settings/embed) page.

### Content Security Policy

If your site uses a Content Security Policy (CSP), add `embed.peerbound.com` to the following directives:

- `script-src`: To load the widget script
- `connect-src`: For API requests to Peerbound
- `img-src`: For images served by Peerbound (also add `media.brand.dev` for customer logos)

## Configuration

Configure the widget using attributes on the `<pb-embed>` element.

| Attribute              | Required | Description                                                           |
| ---------------------- | -------- | --------------------------------------------------------------------- |
| `embed-id`             | Yes      | Your unique embed ID (UUID) from the Peerbound dashboard              |
| `count`                | No       | Maximum number of items to display initially                          |
| `hide-photos`          | No       | Set to `"true"` to hide customer photos                               |
| `hide-peerbound-badge` | No       | Set to `"true"` to hide the "Verified by Peerbound" badge             |
| `filters`              | No       | JSON string to filter displayed content (see [Filtering](#filtering)) |

### Example with Options

```html
<pb-embed embed-id="your-embed-id" count="10" hide-photos="true"></pb-embed>
```

### Filtering

Use `filters` to display content filtered by CRM field values. Contact your Peerbound representative to enable embed filter fields.

The attribute accepts a JSON string where keys follow the format `object_name:field_name` and values can be a single string or an array of strings.

| CRM        | Supported Objects    | Supported Field Types                             |
| ---------- | -------------------- | ------------------------------------------------- |
| Salesforce | `Account`, `Contact` | `multipicklist`, `picklist`, `string`, `textarea` |
| HubSpot    | `company`, `contact` | `checkbox`, `select`, `radio`, `text`, `textarea` |

Note that `field_name` must be the CRM's internal name, not the display name shown in the Peerbound UI. For Salesforce custom fields, this name ends with `__c` (e.g., `Custom_Field__c`).

```html
<pb-embed
  embed-id="your-embed-id"
  filters='{"Account:Industry": "Technology", "Account:Size": ["Enterprise", "SMB"]}'
></pb-embed>
```

## Styling

The widget uses Shadow DOM for style isolation, ensuring your page styles won't affect the widget and vice versa. You can customize the widget appearance using CSS custom properties or the `::part()` selector.

### CSS Custom Properties

Apply these CSS variables to the `pb-embed` element to customize colors, spacing, and border radius:

| Variable                     | Description                         |
| ---------------------------- | ----------------------------------- |
| `--pb-card-background-color` | Background color of cards           |
| `--pb-card-border-color`     | Border color for cards and dividers |
| `--pb-text-primary-color`    | Primary text color                  |
| `--pb-text-secondary-color`  | Secondary/muted text color          |
| `--pb-review-star-color`     | Star rating color                   |
| `--pb-review-star-size`      | Star rating size                    |
| `--pb-card-grid-gap`         | Spacing between cards in the grid   |
| `--pb-card-padding`          | Internal padding of cards           |
| `--pb-card-radius`           | Border radius of cards              |

#### Dark Mode Example

```css
pb-embed {
  --pb-card-background-color: #1f2937;
  --pb-card-border-color: #374151;
  --pb-text-primary-color: #f9fafb;
  --pb-text-secondary-color: #9ca3af;
  --pb-review-star-color: #fbbf24;
}
```

### Advanced Styling with `::part()`

For granular control over specific elements, use the CSS `::part()` selector. This allows you to style individual components within the widget.

#### Card Components

| Part                 | Description                           |
| -------------------- | ------------------------------------- |
| `card`               | Individual card wrapper               |
| `card-title`         | Card title/headline                   |
| `card-text`          | Card body text                        |
| `card-question`      | Question text (for review Q&A format) |
| `card-footer`        | Card footer section                   |
| `card-expand-button` | Show more button                      |
| `card-source-link`   | Link to original source               |

#### Attribution

| Part                       | Description                 |
| -------------------------- | --------------------------- |
| `attribution`              | Attribution section wrapper |
| `attribution-name`         | Person's name               |
| `attribution-title`        | Job title                   |
| `attribution-company`      | Company name                |
| `attribution-avatar`       | Avatar container            |
| `attribution-avatar-image` | Avatar image                |
| `attribution-account-logo` | Company/account logo        |

#### Miscellaneous

| Part                | Description                   |
| ------------------- | ----------------------------- |
| `peerbound-badge`   | "Verified by Peerbound" badge |
| `load-more-button`  | Load more pagination button   |
| `spinner`           | Loading spinner               |
| `empty`             | Empty state container         |
| `empty-title`       | Empty state title text        |
| `empty-description` | Empty state description text  |

#### Part Styling Example

```css
pb-embed::part(card) {
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

pb-embed::part(card-title) {
  font-family: "Georgia", serif;
  font-size: 1.5rem;
}

pb-embed::part(attribution-name) {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

pb-embed::part(source-link) {
  display: none;
}
```
