// Payment integration utilities (Stripe example)
export interface PaymentConfig {
  stripePublishableKey: string;
  baseUrl: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId: string; // Stripe Price ID
  features: string[];
  popular?: boolean;
}

export class PaymentManager {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async createCheckoutSession(planId: string, customerEmail?: string): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          customerEmail,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancelled`
        })
      });

      const { sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw new Error('Payment initialization failed');
    }
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    // In a real implementation, this would use Stripe.js
    const stripe = (window as any).Stripe?.(this.config.stripePublishableKey);
    
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } else {
      // Fallback: redirect to hosted checkout page
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    }
  }

  async handlePaymentSuccess(sessionId: string): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/payment-success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      const { licenseKey } = await response.json();
      return licenseKey;
    } catch (error) {
      console.error('Failed to process payment success:', error);
      throw new Error('License generation failed');
    }
  }

  static getPricingPlans(): PricingPlan[] {
    return [
      {
        id: 'basic',
        name: 'Basic Protection',
        price: 29.99,
        priceId: 'price_basic_annual',
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
        price: 49.99,
        priceId: 'price_premium_annual',
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
        price: 99.99,
        priceId: 'price_enterprise_annual',
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
  }
}