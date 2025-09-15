import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useRideshareToast = () => {
  const { t } = useTranslation('toast');

  const showContactRequestSent = () => {
    console.log('Toast: Contact request sent', t('rideshare.contactRequestSent'));
    toast.success(t('rideshare.contactRequestSent') || 'Žádost o kontakt byla odeslána', {
      duration: 4000,
    });
  };

  const showContactError = () => {
    console.log('Toast: Contact error', t('rideshare.contactError'));
    toast.error(t('rideshare.contactError') || 'Chyba při kontaktování řidiče', {
      duration: 5000,
    });
  };

  const showPhoneRequired = () => {
    console.log('Toast: Phone required', t('rideshare.phoneRequired'));
    toast.error(t('rideshare.phoneRequired') || 'Telefonní číslo je povinné', {
      duration: 4000,
    });
  };

  const showInvalidPhone = () => {
    console.log('Toast: Invalid phone', t('rideshare.invalidPhone'));
    toast.error(t('rideshare.invalidPhone') || 'Neplatné telefonní číslo', {
      duration: 4000,
    });
  };

  const showOfferCreated = () => {
    console.log('Toast: Offer created', t('rideshare.offerCreated'));
    toast.success(t('rideshare.offerCreated') || 'Nabídka spolujízdy byla vytvořena', {
      duration: 4000,
    });
  };

  const showOfferDeleted = () => {
    console.log('Toast: Offer deleted', t('rideshare.offerDeleted'));
    toast.success(t('rideshare.offerDeleted') || 'Nabídka spolujízdy byla odstraněna', {
      duration: 3000,
    });
  };

  const showOfferUpdated = () => {
    console.log('Toast: Offer updated', t('rideshare.offerUpdated'));
    toast.success(t('rideshare.offerUpdated') || 'Nabídka spolujízdy byla aktualizována', {
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