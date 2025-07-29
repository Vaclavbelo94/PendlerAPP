import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import OvertimeWidget from '@/components/overtime/OvertimeWidget';
import { useOvertimeData } from '@/hooks/useOvertimeData';
import { useAuth } from '@/hooks/auth';

const Overtime: React.FC = () => {
  const { t } = useTranslation('overtime');
  const { user } = useAuth();
  
  const { 
    overtimeData, 
    isLoading, 
    error, 
    company, 
    isDHL, 
    shiftsCount 
  } = useOvertimeData({ userId: user?.id });

  return (
    <Layout>
      <Helmet>
        <title>{t('title')} - PendlerApp</title>
        <meta name="description" content={`${t('title')} - ${t('thisMonth')}`} />
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('thisMonth')} {isDHL && '(DHL Wechselschicht 6h standard)'}
          </p>
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
            />
            
            <OvertimeWidget
              icon={Sunset}
              title={t('afternoonShift')}
              hours={overtimeData.afternoon}
              iconColor="text-orange-600"
              bgColor="bg-orange-50 dark:bg-orange-950/20"
            />
            
            <OvertimeWidget
              icon={Moon}
              title={t('nightShift')}
              hours={overtimeData.night}
              iconColor="text-blue-600"
              bgColor="bg-blue-50 dark:bg-blue-950/20"
            />
            
            <OvertimeWidget
              icon={Clock}
              title={t('totalHours')}
              hours={overtimeData.total}
              iconColor="text-primary"
              bgColor="bg-primary/5"
            />
          </div>
        )}

        {!isLoading && overtimeData.total === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>{t('noOvertimeRecorded')}</p>
            {shiftsCount > 0 && (
              <p className="text-sm mt-2">
                Analyzováno {shiftsCount} směn - žádné přesčasy nenalezeny
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Overtime;