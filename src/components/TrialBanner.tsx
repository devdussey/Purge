import { Clock, CreditCard, X } from 'lucide-react';
import { LicenseInfo } from './LicenseManager';

interface TrialBannerProps {
  license: LicenseInfo;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export function TrialBanner({ license, onUpgrade, onDismiss }: TrialBannerProps) {
  if (!license.isTrialActive || license.trialDaysRemaining > 2) {
    return null;
  }

  const isUrgent = license.trialDaysRemaining <= 1;

  return (
    <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
      isUrgent 
        ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-500/50' 
        : 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-yellow-500/50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className={`h-5 w-5 ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`} />
          <div>
            <p className={`font-semibold ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`}>
              {license.trialDaysRemaining === 0 
                ? 'Trial Expires Today!' 
                : `Trial Expires in ${license.trialDaysRemaining} Day${license.trialDaysRemaining === 1 ? '' : 's'}`
              }
            </p>
            <p className={`text-sm ${isUrgent ? 'text-red-300' : 'text-yellow-300'}`}>
              Upgrade now to maintain full protection and access to all features
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onUpgrade}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
              isUrgent
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Upgrade Now</span>
          </button>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}