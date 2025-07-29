import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import OvertimeWidget from '@/components/overtime/OvertimeWidget';

const Overtime: React.FC = () => {
  const { t } = useTranslation('overtime');

  // Static test data - will be replaced with real backend data later
  const overtimeData = {
    morning: 12,
    afternoon: 8, 
    night: 16,
    total: 36
  };

  return (
    <Layout>
      <Helmet>
        <title>{t('title')} - PendlerApp</title>
        <meta name="description" content={`${t('title')} - ${t('thisMonth')}`} />
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">{t('thisMonth')}</p>
        </div>

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

        {overtimeData.total === 0 && (
          <div className="text-center text-muted-foreground py-8">
            {t('noOvertimeRecorded')}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Overtime;