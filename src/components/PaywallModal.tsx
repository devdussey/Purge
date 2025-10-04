import {useState} from 'react';
import { Shield, X, Check, CreditCard, Clock, Star, Users } from 'lucide-react';
import { LicenseInfo } from './LicenseManager';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: LicenseInfo;
  featureBlocked: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
}

export function PaywallModal({ isOpen, onClose, license, featureBlocked }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic Protection',
      price: 9.99,
      period: 'year',
      description: 'Essential antivirus protection for personal use',
      icon: Shield,
      features: [
        'Real-time Protection',
        'Full System Scans',
        'Ransomware Shield',
        'Email Support',
        '1 Device License'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Security',
      price: 19.99,
      period: 'year',
      description: 'Advanced protection with AI-powered detection',
      icon: Star,
      popular: true,
      features: [
        'Everything in Basic',
        'AI-Powered Detection',
        'EDR Timeline Analysis',
        'Priority Support',
        'Up to 5 Devices',
        'Advanced Threat Intelligence'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Suite',
      price: 39.99,
      period: 'year',
      description: 'Complete security solution for businesses',
      icon: Users,
      features: [
        'Everything in Premium',
        'Centralized Management',
        'Custom Detection Rules',
        'API Access',
        'Unlimited Devices',
        '24/7 Phone Support',
        'Compliance Reporting'
      ]
    }
  ];

  const handlePurchase = (planId: string) => {
    // In a real implementation, this would integrate with Stripe or another payment processor
    const plan = pricingPlans.find(p => p.id === planId);
    if (plan) {
      // Redirect to payment page with plan details
      const purchaseUrl = `https://purgeantivirus.com/checkout?plan=${planId}&price=${plan.price}`;
      window.open(purchaseUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-red-500/30">
        {/* Header */}
        <div className="p-6 border-b border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-900/30 rounded-xl">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Upgrade Required</h2>
                <p className="text-sm text-gray-400">
                  {featureBlocked} requires a premium license
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Trial Status */}
        {license.isTrialActive && (
          <div className="p-4 bg-yellow-900/20 border-b border-yellow-500/20">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">
                  Trial Active: {license.trialDaysRemaining} days remaining
                </p>
                <p className="text-yellow-300 text-sm">
                  Upgrade now to unlock all features and continue protection after trial expires
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Choose Your Protection Level</h3>
            <p className="text-gray-400">
              Secure your digital life with enterprise-grade antivirus protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    plan.popular
                      ? 'border-red-500 bg-gradient-to-br from-red-900/20 to-red-800/20'
                      : isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-blue-800/20'
                      : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-black/30 rounded-xl mb-4">
                      <IconComponent className="h-8 w-8 text-red-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    <div className="text-3xl font-bold text-white">
                      ${plan.price}
                      <span className="text-lg text-gray-400 font-normal">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Purchase Now</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-green-900/20 border border-green-500/30 rounded-full px-4 py-2">
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                30-Day Money Back Guarantee
              </span>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">Secure Payment</p>
              <p className="text-gray-400 text-sm">256-bit SSL encryption</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">Instant Activation</p>
              <p className="text-gray-400 text-sm">License key via email</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium">24/7 Support</p>
              <p className="text-gray-400 text-sm">Expert assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}