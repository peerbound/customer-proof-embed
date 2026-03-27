import { render } from "preact";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { optionsSchema } from "./lib/options";
import styles from "./index.css?inline";
import { logError } from "@/utils/logger";

// Create shared stylesheet once for all instances
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);

class PBEmbedElement extends HTMLElement {
  connectedCallback() {
    const result = optionsSchema.safeParse({
      id: this.getAttribute("embed-id") ?? undefined,
      token: this.getAttribute("token") ?? undefined,
      count: this.getAttribute("count") ?? undefined,
      hidePhotos: this.getAttribute("hide-photos") ?? undefined,
      hidePeerboundBadge:
        this.getAttribute("hide-peerbound-badge") ?? undefined,
      filters: this.getAttribute("filters") ?? undefined,
    });

    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [styleSheet];

    const root = document.createElement("div");
    shadow.appendChild(root);

    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `- ${issue.message}`)
        .join("\n");

      logError(`Invalid <pb-embed> attributes:\n${issues}`);
    }

    render(
      <ErrorBoundary>
        <App options={result.data} />
      </ErrorBoundary>,
      root,
    );
  }
}

// Register the custom element
customElements.define("pb-embed", PBEmbedElement);
