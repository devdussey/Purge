import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, Clock, CheckCircle, AlertTriangle, X, Key } from 'lucide-react';

export interface LicenseInfo {
  isValid: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  licenseType: 'trial' | 'basic' | 'premium' | 'enterprise' | 'expired';
  expirationDate?: Date;
  features: {
    realTimeProtection: boolean;
    fullSystemScan: boolean;
    aiDetection: boolean;
    ransomwareShield: boolean;
    edrTimeline: boolean;
    prioritySupport: boolean;
    multiDevice: boolean;
  };
}

interface LicenseManagerProps {
  onLicenseUpdate: (license: LicenseInfo) => void;
}

export function LicenseManager({ onLicenseUpdate }: LicenseManagerProps) {
  const [license, setLicense] = useState<LicenseInfo>({
    isValid: false,
    isTrialActive: true,
    trialDaysRemaining: 7,
    licenseType: 'trial',
    features: {
      realTimeProtection: true,
      fullSystemScan: false,
      aiDetection: false,
      ransomwareShield: false,
      edrTimeline: false,
      prioritySupport: false,
      multiDevice: false
    }
  });

  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Load license from storage
    loadLicenseFromStorage();
    
    // Check license validity periodically
    const interval = setInterval(validateLicense, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onLicenseUpdate(license);
  }, [license, onLicenseUpdate]);

  const loadLicenseFromStorage = () => {
    try {
      const storedLicense = localStorage.getItem('purge_license');
      if (storedLicense) {
        const parsed = JSON.parse(storedLicense);
        setLicense(parsed);
        validateLicense(parsed);
      } else {
        // First time user - start trial
        startTrial();
      }
    } catch (error) {
      console.error('Failed to load license:', error);
      startTrial();
    }
  };

  const startTrial = () => {
    const trialLicense: LicenseInfo = {
      isValid: true,
      isTrialActive: true,
      trialDaysRemaining: 7,
      licenseType: 'trial',
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      features: {
        realTimeProtection: true,
        fullSystemScan: true,
        aiDetection: false,
        ransomwareShield: false,
        edrTimeline: false,
        prioritySupport: false,
        multiDevice: false
      }
    };
    
    setLicense(trialLicense);
    localStorage.setItem('purge_license', JSON.stringify(trialLicense));
  };

  const validateLicense = async (licenseToValidate?: LicenseInfo) => {
    const currentLicense = licenseToValidate || license;
    
    if (currentLicense.isTrialActive && currentLicense.expirationDate) {
      const now = new Date();
      const expiration = new Date(currentLicense.expirationDate);
      const daysRemaining = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining <= 0) {
        // Trial expired
        const expiredLicense: LicenseInfo = {
          ...currentLicense,
          isValid: false,
          isTrialActive: false,
          trialDaysRemaining: 0,
          licenseType: 'expired',
          features: {
            realTimeProtection: false,
            fullSystemScan: false,
            aiDetection: false,
            ransomwareShield: false,
            edrTimeline: false,
            prioritySupport: false,
            multiDevice: false
          }
        };
        
        setLicense(expiredLicense);
        localStorage.setItem('purge_license', JSON.stringify(expiredLicense));
      } else {
        // Update remaining days
        const updatedLicense = {
          ...currentLicense,
          trialDaysRemaining: daysRemaining
        };
        setLicense(updatedLicense);
        localStorage.setItem('purge_license', JSON.stringify(updatedLicense));
      }
    }
  };

  const validateLicenseKey = async (key: string): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      // Simulate license validation API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation logic
      const validKeys = {
        'PURGE-BASIC-2024': 'basic',
        'PURGE-PREMIUM-2024': 'premium',
        'PURGE-ENTERPRISE-2024': 'enterprise'
      };
      
      const licenseType = validKeys[key as keyof typeof validKeys];
      
      if (licenseType) {
        const newLicense: LicenseInfo = {
          isValid: true,
          isTrialActive: false,
          trialDaysRemaining: 0,
          licenseType: licenseType as any,
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          features: getLicenseFeatures(licenseType)
        };
        
        setLicense(newLicense);
        localStorage.setItem('purge_license', JSON.stringify(newLicense));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('License validation failed:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const getLicenseFeatures = (licenseType: string) => {
    switch (licenseType) {
      case 'basic':
        return {
          realTimeProtection: true,
          fullSystemScan: true,
          aiDetection: false,
          ransomwareShield: true,
          edrTimeline: false,
          prioritySupport: false,
          multiDevice: false
        };
      case 'premium':
        return {
          realTimeProtection: true,
          fullSystemScan: true,
          aiDetection: true,
          ransomwareShield: true,
          edrTimeline: true,
          prioritySupport: true,
          multiDevice: true
        };
      case 'enterprise':
        return {
          realTimeProtection: true,
          fullSystemScan: true,
          aiDetection: true,
          ransomwareShield: true,
          edrTimeline: true,
          prioritySupport: true,
          multiDevice: true
        };
      default:
        return {
          realTimeProtection: false,
          fullSystemScan: false,
          aiDetection: false,
          ransomwareShield: false,
          edrTimeline: false,
          prioritySupport: false,
          multiDevice: false
        };
    }
  };

  const handleLicenseSubmit = async () => {
    if (!licenseKey.trim()) return;
    
    const isValid = await validateLicenseKey(licenseKey.trim());
    
    if (isValid) {
      setShowLicenseDialog(false);
      setLicenseKey('');
    } else {
      alert('Invalid license key. Please check your key and try again.');
    }
  };

  const openPurchaseDialog = () => {
    // In a real implementation, this would open a payment dialog or redirect to payment page
    window.open('https://purgeantivirus.com/purchase', '_blank');
  };

  const getLicenseStatusColor = () => {
    if (!license.isValid) return 'text-red-400 bg-red-900/20 border-red-500/30';
    if (license.isTrialActive) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
    return 'text-green-400 bg-green-900/20 border-green-500/30';
  };

  const getLicenseStatusText = () => {
    if (!license.isValid) return 'License Expired';
    if (license.isTrialActive) return `Trial: ${license.trialDaysRemaining} days left`;
    return `Licensed: ${license.licenseType.charAt(0).toUpperCase() + license.licenseType.slice(1)}`;
  };

  return (
    <>
      {/* License Status Bar */}
      <div className={`p-4 rounded-xl border backdrop-blur-sm ${getLicenseStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5" />
            <div>
              <p className="font-semibold">{getLicenseStatusText()}</p>
              {license.isTrialActive && license.trialDaysRemaining <= 3 && (
                <p className="text-sm opacity-80">Trial ending soon - upgrade to continue protection</p>
              )}
              {!license.isValid && (
                <p className="text-sm opacity-80">Purchase a license to restore full protection</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLicenseDialog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Key className="h-4 w-4" />
              <span>Enter License</span>
            </button>
            
            {(license.isTrialActive || !license.isValid) && (
              <button
                onClick={openPurchaseDialog}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Upgrade Now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* License Key Dialog */}
      {showLicenseDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Enter License Key</h3>
                <button
                  onClick={() => setShowLicenseDialog(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  License Key
                </label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="PURGE-XXXX-XXXX-XXXX"
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleLicenseSubmit}
                  disabled={!licenseKey.trim() || isValidating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isValidating ? 'Validating...' : 'Activate License'}
                </button>
                <button
                  onClick={() => setShowLicenseDialog(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={openPurchaseDialog}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Don't have a license? Purchase one here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}