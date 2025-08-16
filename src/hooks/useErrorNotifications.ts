import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export type ErrorType = 'validation' | 'network' | 'submit' | 'generic' | 'auth' | 'save' | 'delete' | 'load';

export const useErrorNotifications = () => {
  const { t } = useTranslation('notifications');
  const { toast } = useToast();

  const showError = useCallback((type: ErrorType, customMessage?: string) => {
    let title: string;
    let description: string;

    switch (type) {
      case 'validation':
        title = t('forms.validationErrorTitle');
        description = customMessage || t('forms.requiredField');
        break;
      case 'network':
        title = t('forms.submitErrorTitle');
        description = customMessage || t('forms.networkErrorMessage');
        break;
      case 'submit':
        title = t('forms.submitErrorTitle');
        description = customMessage || t('forms.submitErrorMessage');
        break;
      case 'auth':
        title = t('auth.requiredTitle');
        description = customMessage || t('auth.requiredMessage');
        break;
      case 'save':
        title = t('errors.saveTitle');
        description = customMessage || t('errors.saveMessage');
        break;
      case 'delete':
        title = t('errors.deleteTitle');
        description = customMessage || t('errors.deleteMessage');
        break;
      case 'load':
        title = t('errors.loadTitle');
        description = customMessage || t('errors.loadMessage');
        break;
      default:
        title = t('generic.errorTitle');
        description = customMessage || t('generic.errorMessage');
    }

    toast({
      title,
      description,
      variant: 'destructive',
    });
  }, [t, toast]);

  const showSuccess = useCallback((type: 'save' | 'delete' | 'update' | 'submit', customMessage?: string) => {
    let title: string;
    let description: string;

    switch (type) {
      case 'save':
        title = t('operations.saveSuccessTitle');
        description = customMessage || t('operations.saveSuccessMessage');
        break;
      case 'delete':
        title = t('operations.deleteSuccessTitle');
        description = customMessage || t('operations.deleteSuccessMessage');
        break;
      case 'update':
        title = t('operations.updateSuccessTitle');
        description = customMessage || t('operations.updateSuccessMessage');
        break;
      case 'submit':
        title = t('contact:successTitle', { ns: 'contact' });
        description = customMessage || t('contact:successMessage', { ns: 'contact' });
        break;
      default:
        title = t('operations.saveSuccessTitle');
        description = customMessage || t('operations.saveSuccessMessage');
    }

    toast({
      title,
      description,
      variant: 'default',
    });
  }, [t, toast]);

  const showValidationError = useCallback((field: string) => {
    const fieldName = t(`contact:${field}`, { ns: 'contact' });
    showError('validation', t('forms.requiredField') + ': ' + fieldName);
  }, [showError, t]);

  const showEmailValidationError = useCallback(() => {
    showError('validation', t('forms.invalidEmail'));
  }, [showError, t]);

  return {
    showError,
    showSuccess,
    showValidationError,
    showEmailValidationError,
  };
};