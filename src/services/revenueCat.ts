import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL, PurchasesOfferings, CustomerInfo } from '@revenuecat/purchases-capacitor';

class RevenueCatService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      console.log('RevenueCat not available on web platform');
      return;
    }

    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      
      // Initialize with your RevenueCat API key
      // TODO: Replace with actual API key from RevenueCat dashboard
      const apiKey = platform === 'ios' 
        ? 'appl_YOUR_IOS_KEY' 
        : 'goog_YOUR_ANDROID_KEY';
      
      await Purchases.configure({ apiKey });
      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('RevenueCat initialization failed:', error);
    }
  }

  async getOfferings(): Promise<PurchasesOfferings | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  }

  async purchasePackage(packageIdentifier: string) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const offerings = await this.getOfferings();
      if (!offerings?.current) {
        throw new Error('No current offering available');
      }

      const packageToPurchase = offerings.current.availablePackages.find(
        pkg => pkg.identifier === packageIdentifier
      );

      if (!packageToPurchase) {
        throw new Error(`Package ${packageIdentifier} not found`);
      }

      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase
      });

      return purchaseResult;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo.customerInfo;
    } catch (error) {
      console.error('Restore purchases failed:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const info = await Purchases.getCustomerInfo();
      return info.customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  async checkPremiumEntitlement(): Promise<boolean> {
    const customerInfo = await this.getCustomerInfo();
    
    if (!customerInfo) return false;

    // Check if user has active "premium" entitlement
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    return !!premiumEntitlement;
  }

  async syncWithBackend(userId: string) {
    const customerInfo = await this.getCustomerInfo();
    
    if (!customerInfo) return;

    // This will be called by the webhook, but we can also manually sync
    const hasPremium = await this.checkPremiumEntitlement();
    
    return {
      hasPremium,
      customerInfo
    };
  }

  async loginUser(userId: string) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await Purchases.logIn({ appUserID: userId });
      console.log('User logged in to RevenueCat:', userId);
    } catch (error) {
      console.error('RevenueCat login failed:', error);
    }
  }

  async logoutUser() {
    if (!this.initialized) return;

    try {
      await Purchases.logOut();
      console.log('User logged out from RevenueCat');
    } catch (error) {
      console.error('RevenueCat logout failed:', error);
    }
  }
}

export const revenueCatService = new RevenueCatService();
