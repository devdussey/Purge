import { useAuth0 } from '@auth0/auth0-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-gradient-to-br from-gray-900 to-black">
      <div className="relative z-10 w-full max-w-md text-center">
        <img
          src="./purge-logo-512.svg"
          alt="Purge Logo"
          className="h-24 w-auto mx-auto mb-8"
        />

        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white mb-4">Welcome to Purge</h1>
          <p className="text-gray-400 mb-6">Advanced AI-powered antivirus with crypto protection</p>

          <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign In / Sign Up
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 DevDussey. Purge™ is a trademark of DevDussey.
        </p>
      </div>
    </div>
  );
}
