
import React from 'react';
import { ArrowLeft, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const MinimumWage = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  const getCurrentWageDesc = () => {
    if (language === 'de') {
      return 'Seit dem 1. Januar 2024 beträgt der Mindestlohn in Deutschland 12,41 € pro Stunde für alle Arbeitnehmer über 18 Jahre.';
    } else if (language === 'pl') {
      return 'Od 1 stycznia 2024 roku płaca minimalna w Niemczech wynosi 12,41 € za godzinę dla wszystkich pracowników powyżej 18 roku życia.';
    } else {
      return 'Od 1. ledna 2024 činí minimální mzda v Německu 12,41 € za hodinu pro všechny zaměstnance starší 18 let.';
    }
  };

  const getEntitledItems = () => {
    if (language === 'de') {
      return [
        'Alle Arbeitnehmer über 18 Jahre',
        'Teilzeitbeschäftigte',
        'Zeitarbeitnehmer',
        'Praktikanten (mit Ausnahmen)'
      ];
    } else if (language === 'pl') {
      return [
        'Wszyscy pracownicy powyżej 18 roku życia',
        'Pracownicy na część etatu',
        'Pracownicy tymczasowi',
        'Praktykanci (z wyjątkami)'
      ];
    } else {
      return [
        'Všichni zaměstnanci starší 18 let',
        'Pracovníci na částečný úvazek',
        'Dočasní pracovníci',
        'Praktikanti (s výjimkami)'
      ];
    }
  };

  const getExceptionItems = () => {
    if (language === 'de') {
      return [
        'Jugendliche unter 18 Jahren ohne abgeschlossene Ausbildung',
        'Freiwillige (FÖJ, FSJ, BFD)',
        'Pflichtpraktikanten aus der Schule',
        'Langzeitarbeitslose (erste 6 Monate)'
      ];
    } else if (language === 'pl') {
      return [
        'Młodzież poniżej 18 roku życia bez ukończonego wykształcenia',
        'Wolontariusze (FÖJ, FSJ, BFD)',
        'Praktykanci obowiązkowi ze szkoły',
        'Długotrwale bezrobotni (pierwsze 6 miesięcy)'
      ];
    } else {
      return [
        'Mladiství do 18 let bez dokončeného vzdělání',
        'Dobrovolníci (FÖJ, FSJ, BFD)',
        'Praktikanti při povinné praxi ze školy',
        'Dlouhodobě nezaměstnaní (první 6 měsíců)'
      ];
    }
  };

  const getControlContent = () => {
    if (language === 'de') {
      return 'Den Min

destlohn kontrolliert der Zoll. Verstöße können zu Bußgeldern bis 500.000 € führen.';
    } else if (language === 'pl') {
      return 'Płacę minimalną kontroluje Urząd Celny (Zoll). Naruszenia mogą prowadzić do kar grzywny do 500.000 €.';
    } else {
      return 'Minimální mzdu kontroluje Celní správa (Zoll). Porušení může vést k pokutám až 500 000 €.';
    }
  };

  const getReportContent = () => {
    if (language === 'de') {
      return 'Verstöße gegen den Mindestlohn können Sie über die Hotline melden: 0351 44834-523';
    } else if (language === 'pl') {
      return 'Naruszenia płacy minimalnej można zgłaszać na infolinię: 0351 44834-523';
    } else {
      return 'Porušení minimální mzdy můžete nahlásit na horkou linku: 0351 44834-523';
    }
  };

  const getHourlyText = () => {
    if (language === 'de') {
      return 'pro Stunde';
    } else if (language === 'pl') {
      return 'za godzinę';
    } else {
      return 'za hodinu';
    }
  };

  const currentWageDesc = getCurrentWageDesc();
  const entitledItems = getEntitledItems();
  const exceptionItems = getExceptionItems();
  const controlContent = getControlContent();
  const reportContent = getReportContent();
  const hourlyText = getHourlyText();

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-green-100">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('minimumWage')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: {formatDate('2025-05-15')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('currentMinimumWage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">12,41 € {hourlyText}</div>
            <p className="text-muted-foreground">
              {currentWageDesc}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('whoIsEntitled')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {entitledItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('exceptions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {exceptionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('practicalInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t('complianceControl')}</h4>
                <p className="text-sm text-muted-foreground">
                  {controlContent}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('reportViolations')}</h4>
                <p className="text-sm text-muted-foreground">
                  {reportContent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinimumWage;
