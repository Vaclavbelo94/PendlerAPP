import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export class RideshareToastService {
  private static instance: RideshareToastService;
  
  static getInstance(): RideshareToastService {
    if (!RideshareToastService.instance) {
      RideshareToastService.instance = new RideshareToastService();
    }
    return RideshareToastService.instance;
  }

  private getTranslation(key: string, language?: string) {
    const { t } = useTranslation('toast');
    return t(key, { lng: language });
  }

  showContactRequestSent(language?: string) {
    toast.success(this.getTranslation('rideshare.contactRequestSent', language), {
      duration: 4000,
    });
  }

  showContactError(language?: string) {
    toast.error(this.getTranslation('rideshare.contactError', language), {
      duration: 5000,
    });
  }

  showPhoneRequired(language?: string) {
    toast.error(this.getTranslation('rideshare.phoneRequired', language), {
      duration: 4000,
    });
  }

  showInvalidPhone(language?: string) {
    toast.error(this.getTranslation('rideshare.invalidPhone', language), {
      duration: 4000,
    });
  }

  showOfferCreated(language?: string) {
    toast.success(this.getTranslation('rideshare.offerCreated', language), {
      duration: 4000,
    });
  }

  showOfferDeleted(language?: string) {
    toast.success(this.getTranslation('rideshare.offerDeleted', language), {
      duration: 3000,
    });
  }

  showOfferUpdated(language?: string) {
    toast.success(this.getTranslation('rideshare.offerUpdated', language), {
      duration: 4000,
    });
  }
}

export const rideshareToastService = RideshareToastService.getInstance();