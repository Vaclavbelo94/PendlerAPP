
import React from 'react';
import { ArrowLeft, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const MinimumWage = () => {
  const { t } = useLanguage();

  const getLocalizedContent = () => {
    return {
      title: t('minimumWage'),
      currentWage: '12,41 €',
      updateDate: '15. května 2025',
      sections: {
        current: {
          title: t('currentMinimumWage'),
          content: t('language') === 'de' 
            ? 'Seit dem 1. Januar 2024 beträgt der Mindestlohn in Deutschland 12,41 € pro Stunde für alle Arbeitnehmer über 18 Jahre.'
            : t('language') === 'pl'
            ? 'Od 1 stycznia 2024 roku płaca minimalna w Niemczech wynosi 12,41 € za godzinę dla wszystkich pracowników powyżej 18 roku życia.'
            : 'Od 1. ledna 2024 činí minimální mzda v Německu 12,41 € za hodinu pro všechny zaměstnance starší 18 let.'
        },
        entitled: {
          title: t('whoIsEntitled'),
          items: t('language') === 'de' 
            ? [
                'Alle Arbeitnehmer über 18 Jahre',
                'Teilzeitbeschäftigte',
                'Zeitarbeitnehmer',
                'Praktikanten (mit Ausnahmen)'
              ]
            : t('language') === 'pl'
            ? [
                'Wszyscy pracownicy powyżej 18 roku życia',
                'Pracownicy na część etatu',
                'Pracownicy tymczasowi',
                'Praktykanci (z wyjątkami)'
              ]
            : [
                'Všichni zaměstnanci starší 18 let',
                'Pracovníci na částečný úvazek',
                'Dočasní pracovníci',
                'Praktikanti (s výjimkami)'
              ]
        },
        exceptions: {
          title: t('exceptions'),
          items: t('language') === 'de' 
            ? [
                'Jugendliche unter 18 Jahren ohne abgeschlossene Ausbildung',
                'Freiwillige (FÖJ, FSJ, BFD)',
                'Pflichtpraktikanten aus der Schule',
                'Langzeitarbeitslose (erste 6 Monate)'
              ]
            : t('language') === 'pl'
            ? [
                'Młodzież poniżej 18 roku życia bez ukończonego wykształcenia',
                'Wolontariusze (FÖJ, FSJ, BFD)',
                'Praktykanci obowiązkowi ze szkoły',
                'Długotrwale bezrobotni (pierwsze 6 miesięcy)'
              ]
            : [
                'Mladiství do 18 let bez dokončeného vzdělání',
                'Dobrovolníci (FÖJ, FSJ, BFD)',
                'Praktikanti při povinné praxi ze školy',
                'Dlouhodobě nezaměstnaní (první 6 měsíců)'
              ]
        },
        practical: {
          title: t('practicalInfo'),
          control: {
            title: t('complianceControl'),
            content: t('language') === 'de' 
              ? 'Den Mindestlohn kontrolliert der Zoll. Verstöße können zu Bußgeldern bis 500.000 € führen.'
              : t('language') === 'pl'
              ? 'Płacę minimalną kontroluje Urząd Celny (Zoll). Naruszenia mogą prowadzić do kar grzywny do 500.000 €.'
              : 'Minimální mzdu kontroluje Celní správa (Zoll). Porušení může vést k pokutám až 500 000 €.'
          },
          report: {
            title: t('reportViolations'),
            content: t('language') === 'de' 
              ? 'Verstöße gegen den Mindestlohn können Sie über die Hotline melden: 0351 44834-523'
              : t('language') === 'pl'
              ? 'Naruszenia płacy minimalnej można zgłaszać na infolinię: 0351 44834-523'
              : 'Porušení minimální mzdy můžete nahlásit na horkou linku: 0351 44834-523'
          }
        }
      }
    };
  };

  const content = getLocalizedContent();

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
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: {content.updateDate}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.current.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">{content.currentWage} {t('language') === 'de' ? 'pro Stunde' : t('language') === 'pl' ? 'za godzinę' : 'za hodinu'}</div>
            <p className="text-muted-foreground">
              {content.sections.current.content}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{content.sections.entitled.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {content.sections.entitled.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{content.sections.exceptions.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {content.sections.exceptions.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{content.sections.practical.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{content.sections.practical.control.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {content.sections.practical.control.content}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{content.sections.practical.report.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {content.sections.practical.report.content}
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
