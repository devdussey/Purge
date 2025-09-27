import React from 'react';
import { Settings, Info } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/Dusscord.png" 
              alt="Dusscord Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Purge - Antivirus</h1>
              <p className="text-sm text-gray-400">by DevDussey</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}