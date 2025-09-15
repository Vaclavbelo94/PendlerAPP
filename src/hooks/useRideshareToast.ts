import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useRideshareToast = () => {
  const { t } = useTranslation('toast');

  const showContactRequestSent = () => {
    toast.success(t('rideshare.contactRequestSent'), {
      duration: 4000,
    });
  };

  const showContactError = () => {
    toast.error(t('rideshare.contactError'), {
      duration: 5000,
    });
  };

  const showPhoneRequired = () => {
    toast.error(t('rideshare.phoneRequired'), {
      duration: 4000,
    });
  };

  const showInvalidPhone = () => {
    toast.error(t('rideshare.invalidPhone'), {
      duration: 4000,
    });
  };

  const showOfferCreated = () => {
    toast.success(t('rideshare.offerCreated'), {
      duration: 4000,
    });
  };

  const showOfferDeleted = () => {
    toast.success(t('rideshare.offerDeleted'), {
      duration: 3000,
    });
  };

  const showOfferUpdated = () => {
    toast.success(t('rideshare.offerUpdated'), {
      duration: 4000,
    });
  };

  return {
    showContactRequestSent,
    showContactError,
    showPhoneRequired,
    showInvalidPhone,
    showOfferCreated,
    showOfferDeleted,
    showOfferUpdated,
  };
};