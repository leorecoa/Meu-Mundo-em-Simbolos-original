import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error | unknown): State {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    return { hasError: true, error: errorObj };
  }

  public componentDidCatch(error: Error | unknown, errorInfo: ErrorInfo) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    console.error('ErrorBoundary caught error:', errorObj, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-background-dark text-text-light p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Ops! Algo deu errado</h1>
            <p className="text-subtle mb-6">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Recarregar Página
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-subtle">Detalhes do erro</summary>
                <pre className="mt-2 p-4 bg-background-dark rounded text-xs overflow-auto">
                  {this.state.error?.toString() || 'Erro desconhecido'}
                  {this.state.error?.stack || ''}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children || null;
  }
}

export default ErrorBoundary;

