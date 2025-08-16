import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export type ErrorType = 'validation' | 'network' | 'submit' | 'generic' | 'auth' | 'save' | 'delete' | 'load';

export const useErrorNotifications = () => {
  const { t } = useTranslation(['notifications', 'contact']);
  const { toast } = useToast();

  const showError = useCallback((type: ErrorType, customMessage?: string) => {
    let title: string;
    let description: string;

    switch (type) {
      case 'validation':
        title = t('notifications:forms.validationErrorTitle');
        description = customMessage || t('notifications:forms.requiredField');
        break;
      case 'network':
        title = t('notifications:forms.submitErrorTitle');
        description = customMessage || t('notifications:forms.networkErrorMessage');
        break;
      case 'submit':
        title = t('notifications:forms.submitErrorTitle');
        description = customMessage || t('notifications:forms.submitErrorMessage');
        break;
      case 'auth':
        title = t('notifications:auth.requiredTitle');
        description = customMessage || t('notifications:auth.requiredMessage');
        break;
      case 'save':
        title = t('notifications:errors.saveTitle');
        description = customMessage || t('notifications:errors.saveMessage');
        break;
      case 'delete':
        title = t('notifications:errors.deleteTitle');
        description = customMessage || t('notifications:errors.deleteMessage');
        break;
      case 'load':
        title = t('notifications:errors.loadTitle');
        description = customMessage || t('notifications:errors.loadMessage');
        break;
      default:
        title = t('notifications:generic.errorTitle');
        description = customMessage || t('notifications:generic.errorMessage');
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
        title = t('notifications:operations.saveSuccessTitle');
        description = customMessage || t('notifications:operations.saveSuccessMessage');
        break;
      case 'delete':
        title = t('notifications:operations.deleteSuccessTitle');
        description = customMessage || t('notifications:operations.deleteSuccessMessage');
        break;
      case 'update':
        title = t('notifications:operations.updateSuccessTitle');
        description = customMessage || t('notifications:operations.updateSuccessMessage');
        break;
      case 'submit':
        title = t('contact:successTitle');
        description = customMessage || t('contact:successMessage');
        break;
      default:
        title = t('notifications:operations.saveSuccessTitle');
        description = customMessage || t('notifications:operations.saveSuccessMessage');
    }

    toast({
      title,
      description,
      variant: 'default',
    });
  }, [t, toast]);

  const showValidationError = useCallback((field: string) => {
    const fieldName = t(`contact:${field}`);
    showError('validation', t('notifications:forms.requiredField') + ': ' + fieldName);
  }, [showError, t]);

  const showEmailValidationError = useCallback(() => {
    showError('validation', t('notifications:forms.invalidEmail'));
  }, [showError, t]);

  return {
    showError,
    showSuccess,
    showValidationError,
    showEmailValidationError,
  };
};