
import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const WorkingHours = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('laws.backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('laws.workingHoursTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('laws.updated')}: {formatDate('2025-01-01')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('laws.workingTimeAct')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-600">{t('laws.maxDailyHours')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.maxDailyHoursDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600">{t('laws.weeklyLimit')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.weeklyLimitDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600">{t('laws.dailyRest')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.dailyRestDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.breaksAndPauses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{t('laws.work6to9Hours')}</span>
                <span className="font-semibold">{t('laws.break30min')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('laws.workOver9Hours')}</span>
                <span className="font-semibold">{t('laws.break45min')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('laws.maxContinuous')}</span>
                <span className="font-semibold">{t('laws.maxContinuous6h')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.nightWork')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('laws.nightTime')}</strong></li>
              <li><strong>{t('laws.nightShift')}</strong></li>
              <li><strong>{t('laws.nightWorkLimit')}</strong></li>
              <li><strong>{t('laws.healthExams')}</strong></li>
              <li><strong>{t('laws.dayWorkTransfer')}</strong></li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.sundayHolidayWork')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{t('laws.sundayWorkDesc')}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>{t('laws.healthcare')}</li>
                <li>{t('laws.transport')}</li>
                <li>{t('laws.hospitality')}</li>
                <li>{t('laws.energy')}</li>
                <li>{t('laws.agriculture')}</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded-md mt-4">
                <p className="text-sm"><strong>{t('laws.compensation')}</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.flexibleWork')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">{t('laws.gleitzeit')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.gleitzeitDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('laws.homeoffice')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.homeofficeDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('laws.teilzeit')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.teilzeitDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkingHours;
