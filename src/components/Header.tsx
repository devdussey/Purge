import {useState} from 'react';
import { Settings, Bell, User, Shield } from 'lucide-react';

interface HeaderProps {
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

export function Header({ onNotificationsClick, onSettingsClick, onProfileClick }: HeaderProps = {}) {
  const [notifications] = useState(3);

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="/purge-icon-64.png"
                alt="Purge Logo"
                className="h-12 w-12 rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl animate-pulse"></div>
            </div>
            <img
              src="/purge-logo-horizontal.svg"
              alt="Purge"
              className="h-8 w-auto"
            />
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
          <div className="flex items-center space-x-2">
              <button
                onClick={onNotificationsClick}
                className="relative p-3 text-gray-400 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>

              <button
                onClick={onSettingsClick}
                className="p-3 text-gray-400 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
              </button>

              <button
                onClick={onProfileClick}
                className="p-3 text-gray-400 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-200"
              >
                <User className="h-5 w-5" />
              </button>
          </div>
        </div>
      </div>
    </header>
  );
}