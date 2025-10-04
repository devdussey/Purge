// License validation utilities
export interface LicenseValidationResult {
  isValid: boolean;
  licenseType: 'trial' | 'basic' | 'premium' | 'enterprise' | 'expired';
  expirationDate?: Date;
  features: string[];
  error?: string;
}

export class LicenseValidator {
  private static readonly LICENSE_SERVER_URL = 'https://api.purgeantivirus.com/v1/license';
  private static readonly PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----`;

  static async validateLicenseKey(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      // Format license key
      const formattedKey = licenseKey.replace(/[^A-Z0-9]/g, '');
      
      if (!this.isValidFormat(formattedKey)) {
        return {
          isValid: false,
          licenseType: 'expired',
          features: [],
          error: 'Invalid license key format'
        };
      }

      // In a real implementation, this would make an API call to validate the license
      const response = await this.callLicenseAPI(formattedKey);
      
      if (response.valid) {
        return {
          isValid: true,
          licenseType: response.type,
          expirationDate: new Date(response.expirationDate),
          features: response.features
        };
      } else {
        return {
          isValid: false,
          licenseType: 'expired',
          features: [],
          error: response.error || 'License validation failed'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        licenseType: 'expired',
        features: [],
        error: 'Network error during validation'
      };
    }
  }

  private static isValidFormat(licenseKey: string): boolean {
    // Check if license key matches expected format: PURGE-XXXX-XXXX-XXXX
    const pattern = /^PURGE[A-Z0-9]{12}$/;
    return pattern.test(licenseKey);
  }

  private static async callLicenseAPI(licenseKey: string): Promise<any> {
    // Mock API response for demo purposes
    void this.LICENSE_SERVER_URL;
    void this.PUBLIC_KEY;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLicenses = {
      'PURGEBASIC2024XX': {
        valid: true,
        type: 'basic',
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        features: ['realTimeProtection', 'fullSystemScan', 'ransomwareShield']
      },
      'PURGEPREMIUM2024': {
        valid: true,
        type: 'premium',
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        features: ['realTimeProtection', 'fullSystemScan', 'aiDetection', 'ransomwareShield', 'edrTimeline', 'prioritySupport']
      },
      'PURGEENTERPRISE2': {
        valid: true,
        type: 'enterprise',
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        features: ['realTimeProtection', 'fullSystemScan', 'aiDetection', 'ransomwareShield', 'edrTimeline', 'prioritySupport', 'multiDevice']
      }
    };

    return mockLicenses[licenseKey as keyof typeof mockLicenses] || {
      valid: false,
      error: 'Invalid license key'
    };
  }

  static generateTrialLicense(): LicenseValidationResult {
    return {
      isValid: true,
      licenseType: 'trial',
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      features: ['realTimeProtection', 'fullSystemScan']
    };
  }

  static isFeatureEnabled(license: LicenseValidationResult, feature: string): boolean {
    return license.isValid && license.features.includes(feature);
  }
}