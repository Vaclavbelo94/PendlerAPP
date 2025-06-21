
import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const HealthInsurance = () => {
  const { t } = useLanguage();

  const getLocalizedContent = () => {
    return {
      title: t('healthInsuranceSystem'),
      updateDate: '2. dubna 2025',
      sections: {
        types: {
          title: t('typesOfInsurance'),
          statutory: {
            title: t('language') === 'de' ? 'Gesetzliche Versicherung (GKV)' : t('language') === 'pl' ? 'Ubezpieczenie ustawowe (GKV)' : 'Zákonné pojištění (GKV)',
            desc: t('language') === 'de' 
              ? 'Pflicht für Arbeitnehmer mit Einkommen bis 69.300 € jährlich (2024)'
              : t('language') === 'pl'
              ? 'Obowiązkowe dla pracowników z dochodem do 69.300 € rocznie (2024)'
              : 'Povinné pro zaměstnance s příjmem do 69 300 € ročně (2024)'
          },
          private: {
            title: t('language') === 'de' ? 'Private Versicherung (PKV)' : t('language') === 'pl' ? 'Ubezpieczenie prywatne (PKV)' : 'Soukromé pojištění (PKV)',
            desc: t('language') === 'de' 
              ? 'Wahlweise für Gutverdiener und Selbständige'
              : t('language') === 'pl'
              ? 'Opcjonalne dla osób o wysokich dochodach i samozatrudnionych'
              : 'Volitelné pro vysoce příjmové skupiny a samostatně výdělečné'
          }
        },
        contributions: {
          title: t('insuranceContributions'),
          rates: [
            { label: t('language') === 'de' ? 'Grundsatz' : t('language') === 'pl' ? 'Stawka podstawowa' : 'Základní sazba', value: '14,6%' },
            { label: t('language') === 'de' ? 'Arbeitnehmer zahlt' : t('language') === 'pl' ? 'Pracownik płaci' : 'Zaměstnanec platí', value: '7,3%' },
            { label: t('language') === 'de' ? 'Arbeitgeber zahlt' : t('language') === 'pl' ? 'Pracodawca płaci' : 'Zaměstnavatel platí', value: '7,3%' },
            { label: t('language') === 'de' ? 'Zusatzbeitrag (Durchschnitt)' : t('language') === 'pl' ? 'Składka dodatkowa (średnia)' : 'Dodatečný příspěvek (průměr)', value: '1,7%' }
          ]
        },
        coverage: {
          title: t('whatIsCovered'),
          items: t('language') === 'de' 
            ? [
                'Grundlegende ärztliche Versorgung',
                'Krankenhausbehandlung',
                'Medikamente nach Liste',
                'Vorsorgeuntersuchungen',
                'Zahnbehandlung (Grundversorgung)',
                'Krankengeld (ab 7. Tag)'
              ]
            : t('language') === 'pl'
            ? [
                'Podstawowa opieka lekarska',
                'Leczenie szpitalne',
                'Leki według listy',
                'Badania profilaktyczne',
                'Leczenie stomatologiczne (podstawowe)',
                'Zasiłek chorobowy (od 7. dnia)'
              ]
            : [
                'Základní lékařská péče',
                'Hospitalizace',
                'Léky podle seznamu',
                'Preventivní prohlídky',
                'Zubní péče (základní)',
                'Nemocenská (od 7. dne)'
              ]
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
        <div className="p-3 rounded-full bg-red-100">
          <Heart className="h-6 w-6 text-red-600" />
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
            <CardTitle>{content.sections.types.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600">{content.sections.types.statutory.title}</h4>
                <p className="text-sm text-muted-foreground">{content.sections.types.statutory.desc}</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600">{content.sections.types.private.title}</h4>
                <p className="text-sm text-muted-foreground">{content.sections.types.private.desc}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{content.sections.contributions.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.sections.contributions.rates.map((rate, index) => (
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
            <CardTitle>{content.sections.coverage.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {content.sections.coverage.items.map((item, index) => (
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
