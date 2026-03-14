'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[400px] items-center justify-center p-8"
        >
          <div className="glass-dark rounded-[1.8rem] p-8 text-center max-w-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/14"
            >
              <AlertTriangle className="h-7 w-7 text-rose-600" />
            </motion.div>
            
            <h2 className="text-xl font-semibold text-slate-950">
              Something went wrong
            </h2>
            
            <p className="mt-2 text-sm text-slate-600">
              Don&apos;t worry, this happens sometimes. Please try refreshing the page.
            </p>

            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
                  Error details
                </summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-slate-900/5 p-3 text-xs text-slate-600">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <button
              onClick={this.handleRefresh}
              className="primary-button mt-6 inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
