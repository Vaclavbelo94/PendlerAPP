
import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const WorkingHours = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('workingHoursTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: 10. května 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('workingTimeAct')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-600">{t('maxDailyHours')}</h4>
                <p className="text-sm text-muted-foreground">{t('maxDailyHoursDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600">{t('weeklyLimit')}</h4>
                <p className="text-sm text-muted-foreground">{t('weeklyLimitDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600">{t('dailyRest')}</h4>
                <p className="text-sm text-muted-foreground">{t('dailyRestDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('breaksAndPauses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{t('work6to9Hours')}</span>
                <span className="font-semibold">{t('break30min')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('workOver9Hours')}</span>
                <span className="font-semibold">{t('break45min')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('maxContinuous')}</span>
                <span className="font-semibold">{t('maxContinuous6h')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('nightWork')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('nightTime')}</strong></li>
              <li><strong>{t('nightShift')}</strong></li>
              <li><strong>{t('nightWorkLimit')}</strong></li>
              <li><strong>{t('healthExams')}</strong></li>
              <li><strong>{t('dayWorkTransfer')}</strong></li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('sundayHolidayWork')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{t('sundayWorkDesc')}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>{t('healthcare')}</li>
                <li>{t('transport')}</li>
                <li>{t('hospitality')}</li>
                <li>{t('energy')}</li>
                <li>{t('agriculture')}</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded-md mt-4">
                <p className="text-sm"><strong>{t('compensation')}</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('flexibleWork')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">{t('gleitzeit')}</h4>
                <p className="text-sm text-muted-foreground">{t('gleitzeitDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('homeoffice')}</h4>
                <p className="text-sm text-muted-foreground">{t('homeofficeDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('teilzeit')}</h4>
                <p className="text-sm text-muted-foreground">{t('teilzeitDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkingHours;
