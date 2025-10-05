import { useState } from 'react';
import React from 'react';
import { AlertTriangle, Send, X, FileText } from 'lucide-react';

interface CrashReport {
  error: Error;
  errorInfo?: React.ErrorInfo;
  context?: any;
  timestamp: Date;
}

interface CrashReporterProps {
  crash: CrashReport | null;
  onClose: () => void;
  onSend: (report: CrashReport, includeSystemInfo: boolean, userComments: string) => void;
}

export function CrashReporter({ crash, onClose, onSend }: CrashReporterProps) {
  const [userComments, setUserComments] = useState('');
  const [includeSystemInfo, setIncludeSystemInfo] = useState(true);
  const [sending, setSending] = useState(false);

  if (!crash) return null;

  const handleSend = async () => {
    setSending(true);
    try {
      // Send to Firebase
      const { firebaseTelemetry } = await import('../services/FirebaseTelemetry');

      await firebaseTelemetry.reportCrash({
        error: {
          message: crash.error.message,
          stack: crash.error.stack
        },
        userComments,
        includeSystemInfo,
        sessionId: crash.context?.sessionId || 'unknown'
      });

      // Also call parent handler if provided
      await onSend(crash, includeSystemInfo, userComments);

      onClose();
    } catch (error) {
      console.error('Failed to send crash report:', error);
      onClose(); // Close anyway
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-900/30 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Application Crash Detected</h2>
              <p className="text-gray-400 text-sm">Help us improve Purge by sending a crash report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Error Details */}
        <div className="mb-6">
          <div className="bg-black/40 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Error Message:</span>
            </div>
            <p className="text-white font-mono text-sm">{crash.error.message}</p>
            {crash.error.stack && (
              <details className="mt-3">
                <summary className="text-gray-400 text-sm cursor-pointer hover:text-white transition-colors">
                  View Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-gray-400 overflow-x-auto bg-black/40 p-3 rounded-lg">
                  {crash.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>

        {/* User Comments */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            What were you doing when this happened? (Optional)
          </label>
          <textarea
            value={userComments}
            onChange={(e) => setUserComments(e.target.value)}
            placeholder="e.g., I was scanning a file when the app crashed..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            rows={4}
          />
        </div>

        {/* Privacy Options */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSystemInfo}
              onChange={(e) => setIncludeSystemInfo(e.target.checked)}
              className="w-5 h-5 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-cyan-500"
            />
            <div>
              <span className="text-white font-medium">Include system information</span>
              <p className="text-gray-400 text-sm">
                OS version, CPU, RAM (sanitized for privacy)
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Crash reports help us fix bugs and improve stability
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-all"
            >
              Skip
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Boundary Component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error, errorInfo: React.ErrorInfo) => void },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-red-900/30 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Something Went Wrong</h1>
                <p className="text-gray-400">Purge encountered an unexpected error</p>
              </div>
            </div>

            <div className="bg-black/40 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-white font-mono text-sm">{this.state.error?.message}</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all"
              >
                Reload Application
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
