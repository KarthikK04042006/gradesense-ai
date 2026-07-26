import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Cpu } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GradeSense AI Control Room Uncaught Error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-mono flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-6 border-red-800/80 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                CONTROL ROOM RECOVERABLE FAULT
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                An isolated client rendering exception was intercepted by GradeSense Experion® Guardian.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-red-300 text-left overflow-x-auto font-mono">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-950/50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RE-INITIALIZE DCS CONTROL ROOM</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
