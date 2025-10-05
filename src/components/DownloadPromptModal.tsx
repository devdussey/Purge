import React from 'react';
import { Download, X, Shield, Zap, Lock } from 'lucide-react';

interface DownloadPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export function DownloadPromptModal({ isOpen, onClose, featureName }: DownloadPromptModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    window.open('https://github.com/devdussey/Purge/releases/latest', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Download Required</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-300 text-center">
            <span className="font-semibold text-cyan-400">{featureName}</span> requires the desktop app for real-time protection.
          </p>

          {/* Features */}
          <div className="space-y-3 bg-black/30 rounded-lg p-4 border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Real-time Monitoring</p>
                <p className="text-gray-400 text-sm">24/7 clipboard & file system protection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Background Protection</p>
                <p className="text-gray-400 text-sm">Runs silently in system tray</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Advanced Features</p>
                <p className="text-gray-400 text-sm">Full scan, quarantine, & auto-updates</p>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
            <p className="text-sm text-cyan-300 text-center">
              <span className="font-semibold">Windows 10/11</span> • Free Beta • 25MB Download
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download for Windows
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center">
            Mac & Linux versions coming soon based on demand
          </p>
        </div>
      </div>
    </div>
  );
}
