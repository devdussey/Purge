import React from 'react';
import { Settings, Info, Download } from 'lucide-react';

export function Header() {
  const handleDownload = () => {
    // In a real implementation, this would link to your GitHub releases or download page
    const downloadUrl = 'https://github.com/DevDussey/purge-antivirus/releases/latest';
    window.open(downloadUrl, '_blank');
  };

  return (
    <header className="bg-black shadow-lg border-b border-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/Dusscord Glow.png" 
              alt="Dusscord Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Purge</h1>
              <p className="text-sm text-gray-400">by DevDussey</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <Download className="h-4 w-4" />
              <span>Download Desktop App</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}