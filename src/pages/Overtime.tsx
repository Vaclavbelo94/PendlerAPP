import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import OvertimeWidget from '@/components/overtime/OvertimeWidget';
import { useOvertimeData } from '@/hooks/useOvertimeData';
import { useAuth } from '@/hooks/auth';
import LanguageToggle from '@/components/common/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Overtime: React.FC = () => {
  const { t } = useTranslation('overtime');
  const { user } = useAuth();
  
  // Load standard hours from localStorage or default to 6h for DHL, 8h for others
  const [standardHours, setStandardHours] = useState<number>(() => {
    const saved = localStorage.getItem('overtime-standard-hours');
    return saved ? parseInt(saved) : 6;
  });

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('overtime-standard-hours', standardHours.toString());
  }, [standardHours]);
  
  const { 
    overtimeData, 
    isLoading, 
    error, 
    company, 
    isDHL, 
    shiftsCount 
  } = useOvertimeData({ userId: user?.id, customStandardHours: standardHours });

  return (
    <Layout navbarRightContent={<LanguageToggle />}>
      <Helmet>
        <title>{t('title')} - PendlerApp</title>
        <meta name="description" content={`${t('title')} - ${t('thisMonth')}`} />
        <link rel="canonical" href={`${window.location.origin}/overtime`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `${t('title')} - PendlerApp`,
          description: `${t('title')} - ${t('thisMonth')}`,
          url: `${window.location.origin}/overtime`
        })}</script>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('thisMonth')}
          </p>
          
          {/* Standard Hours Toggle */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{t('standardHoursLabel')}</p>
                <div className="flex justify-center gap-2">
                  <Button
                    variant={standardHours === 6 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStandardHours(6)}
                    className="min-w-[60px]"
                  >
                    6h
                  </Button>
                  <Button
                    variant={standardHours === 8 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStandardHours(8)}
                    className="min-w-[60px]"
                  >
                    8h
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OvertimeWidget
              icon={Sun}
              title={t('morningShift')}
              hours={overtimeData.morning}
              iconColor="text-yellow-600"
              bgColor="bg-yellow-50 dark:bg-yellow-950/20"
              unitLabel={t('hours')}
            />
            
            <OvertimeWidget
              icon={Sunset}
              title={t('afternoonShift')}
              hours={overtimeData.afternoon}
              iconColor="text-orange-600"
              bgColor="bg-orange-50 dark:bg-orange-950/20"
              unitLabel={t('hours')}
            />
            
            <OvertimeWidget
              icon={Moon}
              title={t('nightShift')}
              hours={overtimeData.night}
              iconColor="text-blue-600"
              bgColor="bg-blue-50 dark:bg-blue-950/20"
              unitLabel={t('hours')}
            />
            
            <OvertimeWidget
              icon={Clock}
              title={t('totalHours')}
              hours={overtimeData.total}
              iconColor="text-primary"
              bgColor="bg-primary/5"
              unitLabel={t('hours')}
            />
          </div>
        )}

        {!isLoading && overtimeData.total === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>{t('noOvertimeRecorded')}</p>
            {shiftsCount > 0 && (
              <p className="text-sm mt-2">
                {t('analyzedShifts', { count: shiftsCount })}
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Overtime;