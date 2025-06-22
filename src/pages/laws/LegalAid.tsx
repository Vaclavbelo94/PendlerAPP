
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/hooks/useLanguage';

const LegalAid = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  const getLocalizedContent = () => {
    return {
      title: t('legalAid'),
      subtitle: language === 'de' 
        ? 'Rechtshilfemöglichkeiten für ausländische Arbeitnehmer'
        : language === 'pl'
        ? 'Możliwości pomocy prawnej dla zagranicznych pracowników'
        : 'Možnosti právní pomoci pro zahraniční pracovníky',
      freeLegalAid: t('freeLegalAid'),
      description: language === 'de'
        ? 'In Deutschland haben ausländische Arbeitnehmer in bestimmten Situationen Anspruch auf kostenlose Rechtshilfe:'
        : language === 'pl'
        ? 'W Niemczech zagraniczni pracownicy mają prawo do bezpłatnej pomocy prawnej w określonych sytuacjach:'
        : 'V Německu mají zahraniční pracovníci nárok na bezplatnou právní pomoc v určitých situacích:',
      situations: language === 'de'
        ? [
            'Arbeitsrechtliche Streitigkeiten mit dem Arbeitgeber',
            'Probleme mit Unterkunft und Miete',
            'Diskriminierung am Arbeitsplatz',
            'Unbezahlte Löhne oder Verletzung des Arbeitsvertrags',
            'Sozialleistungen und Versicherung'
          ]
        : language === 'pl'
        ? [
            'Spory pracownicze z pracodawcą',
            'Problemy z zakwaterowaniem i najmem',
            'Dyskryminacja w miejscu pracy',
            'Nieopłacone wynagrodzenie lub naruszenie umowy o pracę',
            'Świadczenia socjalne i ubezpieczenie'
          ]
        : [
            'Pracovněprávní spory s zaměstnavatelem',
            'Problémy s ubytováním a nájmem',
            'Diskriminace na pracovišti',
            'Nezaplacená mzda nebo porušení pracovní smlouvy',
            'Sociální dávky a pojištění'
          ],
      whereToGetHelp: t('whereToGetHelp'),
      unionsTitle: language === 'de' ? 'Gewerkschaften' : language === 'pl' ? 'Związki zawodowe' : 'Odborové svazy (Gewerkschaften)',
      unionsDesc: language === 'de' 
        ? 'Gewerkschaftsmitglieder haben Anspruch auf kostenlose Rechtshilfe in arbeitsrechtlichen Angelegenheiten.'
        : language === 'pl'
        ? 'Członkowie związków zawodowych mają prawo do bezpłatnej pomocy prawnej w sprawach pracowniczych.'
        : 'Členové odborových svazů mají nárok na bezplatnou právní pomoc v pracovněprávních věcech.',
      migrantCentersTitle: language === 'de' ? 'Beratungsstellen für Migranten' : language === 'pl' ? 'Centra doradztwa dla migrantów' : 'Beratungsstellen für Migranten',
      migrantCentersDesc: language === 'de'
        ? 'Spezialisierte Beratungsstellen für Migranten bieten kostenlose Rechtsberatung.'
        : language === 'pl'
        ? 'Wyspecjalizowane centra doradztwa dla migrantów oferują bezpłatne porady prawne.'
        : 'Specializované poradny pro migranty poskytují bezplatné právní poradenství.',
      availableInCities: language === 'de' ? 'Verfügbar in allen größeren Städten' : language === 'pl' ? 'Dostępne we wszystkich większych miastach' : 'Dostupné ve všech větších městech',
      courtTitle: language === 'de' ? 'Rechtsantragsstelle (Gericht)' : language === 'pl' ? 'Rechtsantragsstelle (Sąd)' : 'Rechtsantragsstelle (Soud)',
      courtDesc: language === 'de'
        ? 'Für Personen mit geringem Einkommen - Antrag auf kostenlose Rechtshilfe beim Gericht.'
        : language === 'pl'
        ? 'Dla osób o niskich dochodach - wniosek o bezpłatną pomoc prawną w sądzie.'
        : 'Pro osoby s nízkými příjmy - žádost o bezplatnou právní pomoc u soudu.',
      incomeDependent: language === 'de' ? 'Einkommensabhängig' : language === 'pl' ? 'Zależne od dochodów' : 'Závisí na příjmech'
    };
  };

  const content = getLocalizedContent();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/laws" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-indigo-100">
          <Scale className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <p className="text-muted-foreground">{content.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              {content.freeLegalAid}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{content.description}</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {content.situations.map((situation, index) => (
                <li key={index}>{situation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{content.whereToGetHelp}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {content.unionsTitle}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {content.unionsDesc}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>DGB Rechtsschutz: 030 24060-0</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {content.migrantCentersTitle}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {content.migrantCentersDesc}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>info@migrationsberatung.de</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {content.availableInCities}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {content.courtTitle}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {content.courtDesc}
                </p>
                <Badge variant="secondary">
                  {content.incomeDependent}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-8">
          <Link to="/laws">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('backToLaws')}
            </Button>
          </Link>
          <Badge variant="outline">
            {t('updated')}: {formatDate('2025-05-08')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default LegalAid;
