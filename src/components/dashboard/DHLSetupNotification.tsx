
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Settings, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const DHLSetupNotification = () => {
  const { user, unifiedUser } = useAuth();
  const { userAssignment } = useDHLData(user?.id);
  const { isNewUser } = useOnboarding();
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
  // - User is in onboarding process (handled by onboarding component)
  const shouldShow = unifiedUser?.isDHLEmployee && !userAssignment && !isDismissed && !isNewUser;

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

  // Kompaktnější verze pro uživatele po onboardingu
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50/50 to-yellow-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-amber-800">
                  {t('dhl:setupNotification.title')}
                </h4>
                <p className="text-sm text-amber-700">
                  Dokončete nastavení pro plné využití DHL funkcí
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSetupNow}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Nastavit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-amber-600 hover:bg-amber-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DHLSetupNotification;
