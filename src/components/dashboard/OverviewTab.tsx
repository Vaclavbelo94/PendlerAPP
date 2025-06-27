
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OverviewTab: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('profile');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="flex flex-col justify-between h-full p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('overview')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('viewEditProfile')}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/profile')}>
            {t('goToProfile')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="flex flex-col justify-between h-full p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('settings')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('manageAppPreferences')}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/settings')}>
            {t('openSettings')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="flex flex-col justify-between h-full p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('helpSupport')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('getAssistance')}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/help')}>
            {t('contactSupport')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
