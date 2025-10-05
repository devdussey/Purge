import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Image - Replace with your custom background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/auth-background.png')",
          backgroundColor: '#0a0e27' // Fallback color if image not found
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Auth Form Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/purge-logo-512.svg"
            alt="Purge Logo"
            className="h-24 w-auto mx-auto mb-4"
          />
        </div>

        {/* Auth Forms */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-xl">
          {mode === 'login' ? (
            <LoginForm
              onSwitchToSignup={() => setMode('signup')}
              onSuccess={onAuthSuccess}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setMode('login')}
              onSuccess={onAuthSuccess}
            />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 DevDussey. Purge™ is a trademark of DevDussey.
        </p>
      </div>
    </div>
  );
}
