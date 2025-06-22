
import React from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const WorkContract = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  const getContractRequirements = () => {
    if (language === 'de') {
      return [
        'Identifikation der Vertragsparteien',
        'Datum des Arbeitsbeginns',
        'Beschreibung der Arbeitstätigkeit',
        'Höhe des Lohns und Zahlungsweise',
        'Arbeitszeit',
        'Urlaub',
        'Kündigungsfristen'
      ];
    } else if (language === 'pl') {
      return [
        'Identyfikacja stron umowy',
        'Data rozpoczęcia stosunku pracy',
        'Opis czynności zawodowych',
        'Wysokość wynagrodzenia i sposób wypłaty',
        'Czas pracy',
        'Urlop',
        'Okresy wypowiedzenia'
      ];
    } else {
      return [
        'Identifikace smluvních stran',
        'Datum začátku pracovního poměru',
        'Popis pracovní činnosti',
        'Výše mzdy a způsob výplaty',
        'Pracovní doba',
        'Dovolená',
        'Výpovědní lhůty'
      ];
    }
  };

  const getProbationContent = () => {
    if (language === 'de') {
      return 'Die Probezeit kann maximal 6 Monate dauern. Während dieser Zeit ist es möglich, das Arbeitsverhältnis mit einer Kündigungsfrist von 2 Wochen zu jedem beliebigen Datum zu beenden.';
    } else if (language === 'pl') {
      return 'Okres próbny może trwać maksymalnie 6 miesięcy. W tym czasie możliwe jest zakończenie stosunku pracy z okresem wypowiedzenia 2 tygodni do dowolnej daty.';
    } else {
      return 'Zkušební doba může trvat maximálně 6 měsíců. Během této doby je možné ukončit pracovní poměr s výpovědní lhůtou 2 týdny k libovolnému datu.';
    }
  };

  const getEmploymentTypes = () => {
    if (language === 'de') {
      return [
        { title: 'Vollzeit:', desc: 'Standard 40-Stunden-Woche' },
        { title: 'Teilzeit:', desc: 'Weniger Stunden als Vollzeit' },
        { title: 'Minijob:', desc: 'Einkommen bis 450 € monatlich' },
        { title: 'Befristet:', desc: 'Zeitlich begrenzt' },
        { title: 'Unbefristet:', desc: 'Ohne zeitliche Begrenzung' }
      ];
    } else if (language === 'pl') {
      return [
        { title: 'Pełny etat:', desc: 'Standardowy 40-godzinny tydzień' },
        { title: 'Część etatu:', desc: 'Mniej godzin niż pełny etat' },
        { title: 'Minijob:', desc: 'Dochód do 450 € miesięcznie' },
        { title: 'Na czas określony:', desc: 'Ograniczony czasem' },
        { title: 'Na czas nieokreślony:', desc: 'Bez ograniczenia czasowego' }
      ];
    } else {
      return [
        { title: 'Plný úvazek:', desc: 'Standardní 40hodinový týden' },
        { title: 'Částečný úvazek:', desc: 'Méně hodin než plný úvazek' },
        { title: 'Minijob:', desc: 'Příjem do 450 € měsíčně' },
        { title: 'Na dobu určitou:', desc: 'Omezený časem' },
        { title: 'Na dobu neurčitou:', desc: 'Bez časového omezení' }
      ];
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <Briefcase className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('workContract')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: {formatDate('2025-03-18')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('contractRequirements')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {getContractRequirements().map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('probationPeriod')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {getProbationContent()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('typesOfEmployment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {getEmploymentTypes().map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> {item.desc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkContract;
