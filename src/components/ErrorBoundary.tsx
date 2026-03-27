import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import type React from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} className="text-red-400" />
            </div>
            <h1 className="text-white font-bold text-xl mb-2">Something went wrong</h1>
            <p className="text-slate-400 text-sm mb-4">
              An unexpected error occurred. Please refresh the page or contact support if the problem persists.
            </p>
            {this.state.error && (
              <p className="text-red-400 text-xs font-mono bg-slate-800 p-3 rounded-lg mb-4 text-left overflow-auto">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
