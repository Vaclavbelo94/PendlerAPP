import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Settings, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const DHLSetupNotification = () => {
  const { user, unifiedUser } = useAuth();
  const { userAssignment } = useDHLData(user?.id);
  const { t } = useTranslation(['dhl', 'common']);
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for previous dismissal
  useEffect(() => {
    const dismissed = localStorage.getItem('dhl-setup-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Don't show if:
  // - User is not DHL employee
  // - User already has assignment (setup complete)
  // - User has dismissed the notification
  const shouldShow = unifiedUser?.isDHLEmployee && !userAssignment && !isDismissed;

  if (!shouldShow) {
    return null;
  }

  const handleSetupNow = () => {
    navigate('/dhl-setup');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('dhl-setup-dismissed', 'true');
    toast.success(t('dhl:setupNotification.dismissToast'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-amber-800 dark:text-amber-200 text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t('dhl:setupNotification.title')}
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  {t('dhl:setupNotification.description')}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 text-sm text-amber-700 dark:text-amber-300">
              <p className="mb-2">
                <strong>{t('dhl:setupNotification.benefitsTitle')}</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>{t('dhl:setupNotification.benefit1')}</li>
                <li>{t('dhl:setupNotification.benefit2')}</li>
                <li>{t('dhl:setupNotification.benefit3')}</li>
                <li>{t('dhl:setupNotification.benefit4')}</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleSetupNow}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('dhl:setupNotification.setupButton')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/50"
              >
                {t('dhl:setupNotification.laterButton')}
              </Button>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              💡 <strong>{t('common:tip')}:</strong> {t('dhl:setupNotification.tip')}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DHLSetupNotification;