import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  Button,
  Card,
  Icon,
} from './ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  confirmReset: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, confirmReset: false };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crashed:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  handleClearData = () => {
    localStorage.removeItem('dev-stack-tracker');
    window.location.reload();
  };

  setConfirmReset = (confirmReset: boolean) => {
    this.setState({ confirmReset });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
        <Card className="max-w-md p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-danger-subtle text-danger">
            <Icon name="alert-triangle" size={20} />
          </div>
          <h1 className="text-lg font-semibold text-fg">Something went wrong</h1>
          <p className="mt-1 text-sm text-fg-muted">
            The app encountered an unexpected error. Try reloading, or reset
            your data if the problem persists.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button onClick={this.handleReset}>Reload</Button>
            <Button
              variant="ghost"
              onClick={() => this.setConfirmReset(true)}
              className="text-danger hover:bg-danger-subtle hover:text-danger"
            >
              Reset data
            </Button>
          </div>
        </Card>

        <AlertDialog
          open={this.state.confirmReset}
          onOpenChange={this.setConfirmReset}
        >
          <AlertDialogContent
            title="Reset all data?"
            description="This clears every project, service, and setting stored locally. This cannot be undone."
            confirmLabel="Reset data"
            danger
            onConfirm={this.handleClearData}
          />
        </AlertDialog>
      </div>
    );
  }
}
