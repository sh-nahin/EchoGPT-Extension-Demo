import { Component, type ErrorInfo, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('EchoGPT interface error', error, info.componentStack);
  }
  render() {
    return this.state.error ? (
      <main className="error-screen">
        <h1>Something didn’t load.</h1>
        <p>Your saved workspace is still in this browser.</p>
        <button className="button button-primary" onClick={() => location.reload()}>
          Reload EchoGPT
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
