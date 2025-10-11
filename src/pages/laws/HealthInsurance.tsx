
import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const HealthInsurance = () => {
  const { t, i18n } = useTranslation('laws');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'cs' ? 'cs-CZ' : i18n.language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  const getStatutoryInsurance = () => {
    if (i18n.language === 'de') {
      return {
        title: 'Gesetzliche Versicherung (GKV)',
        desc: 'Pflicht für Arbeitnehmer mit Einkommen bis 73.800 € jährlich (2025)'
      };
    } else if (i18n.language === 'pl') {
      return {
        title: 'Ubezpieczenie ustawowe (GKV)',
        desc: 'Obowiązkowe dla pracowników z dochodem do 73.800 € rocznie (2025)'
      };
    } else {
      return {
        title: 'Zákonné pojištění (GKV)',
        desc: 'Povinné pro zaměstnance s příjmem do 73 800 € ročně (2025)'
      };
    }
  };

  const getPrivateInsurance = () => {
    if (i18n.language === 'de') {
      return {
        title: 'Private Versicherung (PKV)',
        desc: 'Wahlweise für Gutverdiener und Selbständige'
      };
    } else if (i18n.language === 'pl') {
      return {
        title: 'Ubezpieczenie prywatne (PKV)',
        desc: 'Opcjonalne dla osób o wysokich dochodach i samozatrudnionych'
      };
    } else {
      return {
        title: 'Soukromé pojištění (PKV)', 
        desc: 'Volitelné pro vysoce příjmové skupiny a samostatně výdělečné'
      };
    }
  };

  const getContributionRates = () => {
    if (i18n.language === 'de') {
      return [
        { label: 'Grundsatz', value: '14,6%' },
        { label: 'Arbeitnehmer zahlt', value: '7,3%' },
        { label: 'Arbeitgeber zahlt', value: '7,3%' },
        { label: 'Zusatzbeitrag (Durchschnitt)', value: '1,7%' }
      ];
    } else if (i18n.language === 'pl') {
      return [
        { label: 'Stawka podstawowa', value: '14,6%' },
        { label: 'Pracownik płaci', value: '7,3%' },
        { label: 'Pracodawca płaci', value: '7,3%' },
        { label: 'Składka dodatkowa (średnia)', value: '1,7%' }
      ];
    } else {
      return [
        { label: 'Základní sazba', value: '14,6%' },
        { label: 'Zaměstnanec platí', value: '7,3%' },
        { label: 'Zaměstnavatel platí', value: '7,3%' },
        { label: 'Dodatečný příspěvek (průměr)', value: '1,7%' }
      ];
    }
  };

  const getCoverageItems = () => {
    if (i18n.language === 'de') {
      return [
        'Grundlegende ärztliche Versorgung',
        'Krankenhausbehandlung',
        'Medikamente nach Liste',
        'Vorsorgeuntersuchungen',
        'Zahnbehandlung (Grundversorgung)',
        'Krankengeld (ab 7. Tag)'
      ];
    } else if (i18n.language === 'pl') {
      return [
        'Podstawowa opieka lekarska',
        'Leczenie szpitalne',
        'Leki według listy',
        'Badania profilaktyczne',
        'Leczenie stomatologiczne (podstawowe)',
        'Zasiłek chorobowy (od 7. dnia)'
      ];
    } else {
      return [
        'Základní lékařská péče',
        'Hospitalizace',
        'Léky podle seznamu',
        'Preventivní prohlídky',
        'Zubní péče (základní)',
        'Nemocenská (od 7. dne)'
      ];
    }
  };

  const statutoryInsurance = getStatutoryInsurance();
  const privateInsurance = getPrivateInsurance();
  const contributionRates = getContributionRates();
  const coverageItems = getCoverageItems();

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('laws.backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-red-100">
          <Heart className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('laws.healthInsuranceSystem')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('laws.updated')}: {formatDate('2025-01-01')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('laws.typesOfInsurance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600">{statutoryInsurance.title}</h4>
                <p className="text-sm text-muted-foreground">{statutoryInsurance.desc}</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600">{privateInsurance.title}</h4>
                <p className="text-sm text-muted-foreground">{privateInsurance.desc}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.insuranceContributions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contributionRates.map((rate, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{rate.label}</span>
                  <span className="font-semibold">{rate.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.whatIsCovered')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {coverageItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthInsurance;
