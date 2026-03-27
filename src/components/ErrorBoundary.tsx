import { Component, type ComponentChildren } from "preact";
import { logError } from "@/utils/logger";

interface Props {
  children: ComponentChildren;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logError("Uncaught error", error);
  }

  render() {
    if (this.state.hasError) {
      // Do not show anything on error
      return null;
    }

    return this.props.children;
  }
}
