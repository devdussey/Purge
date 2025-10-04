import { Lock, Shield } from 'lucide-react';
import { LicenseInfo } from './LicenseManager';

interface FeatureGateProps {
  children: React.ReactNode;
  feature: keyof LicenseInfo['features'];
  license: LicenseInfo;
  onUpgradeClick: (feature: string) => void;
  featureName: string;
  description?: string;
}

export function FeatureGate({ 
  children, 
  feature, 
  license, 
  onUpgradeClick, 
  featureName,
  description 
}: FeatureGateProps) {
  const hasAccess = license.isValid && license.features[feature];

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred/Disabled Content */}
      <div className="filter blur-sm opacity-50 pointer-events-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <div className="text-center p-8">
          <div className="inline-flex p-4 bg-red-900/30 rounded-full mb-4">
            <Lock className="h-8 w-8 text-red-400" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{featureName} Locked</h3>
          
          {description && (
            <p className="text-gray-400 mb-4 max-w-sm">{description}</p>
          )}
          
          <div className="space-y-2 mb-6">
            {license.isTrialActive ? (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  Trial: {license.trialDaysRemaining} days remaining
                </p>
                <p className="text-yellow-300 text-xs">
                  This feature requires a premium license
                </p>
              </div>
            ) : (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">
                  {license.licenseType === 'expired' ? 'License Expired' : 'Premium Feature'}
                </p>
                <p className="text-red-300 text-xs">
                  Upgrade to unlock advanced protection
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => onUpgradeClick(featureName)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Shield className="h-4 w-4" />
            <span>Upgrade Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}