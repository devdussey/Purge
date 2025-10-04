import {useState} from 'react';
import { Settings, Bell, User, Shield } from 'lucide-react';

export function Header() {
  const [notifications] = useState(3);

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="/Dusscord Glow.png" 
                alt="Dusscord Logo" 
                className="h-12 w-12 rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-red-500/20 rounded-xl animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Purge
              </h1>
              <p className="text-sm text-gray-400 font-medium">by DevDussey</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-full border border-red-900/30">
            <Shield className="h-5 w-5 text-green-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Protected</span>
              <span className="text-xs text-green-400">Real-time active</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button className="relative p-3 text-gray-400 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-200">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>
              
              <button className="p-3 text-gray-400 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-200">
                <Settings className="h-5 w-5" />
              </button>
              
              <button className="p-3 text-gray-400 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-200">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}