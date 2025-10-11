
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const TaxClasses = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  const getTaxClasses = () => {
    if (language === 'de') {
      return [
        { class: 'Klasse I', desc: 'Ledige, Geschiedene, Verwitwete' },
        { class: 'Klasse II', desc: 'Ledige mit Kind (erhöhter Satz)' },
        { class: 'Klasse III', desc: 'Verheiratete - günstigere Variante' },
        { class: 'Klasse IV', desc: 'Verheiratete - Standard' },
        { class: 'Klasse V', desc: 'Verheiratete - Partner hat Klasse III' },
        { class: 'Klasse VI', desc: 'Zweite Beschäftigung' }
      ];
    } else if (language === 'pl') {
      return [
        { class: 'Klasa I', desc: 'Osoby stanu wolnego, rozwiedzeni, owdowiali' },
        { class: 'Klasa II', desc: 'Osoby stanu wolnego z dzieckiem (stawka podwyższona)' },
        { class: 'Klasa III', desc: 'Małżonkowie - wariant korzystniejszy' },
        { class: 'Klasa IV', desc: 'Małżonkowie - standardowy' },
        { class: 'Klasa V', desc: 'Małżonkowie - partner ma klasę III' },
        { class: 'Klasa VI', desc: 'Drugie zatrudnienie' }
      ];
    } else {
      return [
        { class: 'Třída I', desc: 'Svobodní, rozvedení, ovdovělí' },
        { class: 'Třída II', desc: 'Svobodní s dítětem (zvýhodněný sazba)' },
        { class: 'Třída III', desc: 'Ženatí/vdané - výhodnější varianta' },
        { class: 'Třída IV', desc: 'Ženatí/vdané - standardní' },
        { class: 'Třída V', desc: 'Ženatí/vdané - partner má třídu III' },
        { class: 'Třída VI', desc: 'Druhé zaměstnání' }
      ];
    }
  };

  const getChoiceIntro = () => {
    if (language === 'de') {
      return 'Die Wahl der Steuerklasse beeinflusst die Höhe der monatlichen Abzüge. Die endgültige Steuerhöhe wird bei der jährlichen Steuererklärung ausgeglichen.';
    } else if (language === 'pl') {
      return 'Wybór klasy podatkowej wpływa na wysokość miesięcznych potrąceń. Ostateczna wysokość podatku zostanie wyrównana przy rocznym zeznaniu podatkowym.';
    } else {
      return 'Výběr daňové třídy ovlivňuje výši měsíčních srážek. Konečná výše daně se vyrovná při ročním daňovém přiznání.';
    }
  };

  const getChoiceItems = () => {
    if (language === 'de') {
      return [
        { title: 'Ledige:', desc: 'Automatisch Klasse I (oder II mit Kind)' },
        { title: 'Ehepartner mit ähnlichen Einkommen:', desc: 'Beide Klasse IV' },
        { title: 'Ehepartner mit unterschiedlichen Einkommen:', desc: 'Kombination III/V' },
        { title: 'Zweite Beschäftigung:', desc: 'Immer Klasse VI' }
      ];
    } else if (language === 'pl') {
      return [
        { title: 'Osoby stanu wolnego:', desc: 'Automatycznie klasa I (lub II z dzieckiem)' },
        { title: 'Małżonkowie z podobnymi dochodami:', desc: 'Obaj klasa IV' },
        { title: 'Małżonkowie z różnymi dochodami:', desc: 'Kombinacja III/V' },
        { title: 'Drugie zatrudnienie:', desc: 'Zawsze klasa VI' }
      ];
    } else {
      return [
        { title: 'Svobodní:', desc: 'Automaticky třída I (nebo II s dítětem)' },
        { title: 'Manželé s podobnými příjmy:', desc: 'Obě třída IV' },
        { title: 'Manželé s rozdílnými příjmy:', desc: 'Kombinace III/V' },
        { title: 'Druhé zaměstnání:', desc: 'Vždy třída VI' }
      ];
    }
  };

  const taxClasses = getTaxClasses();
  const choiceIntro = getChoiceIntro();
  const choiceItems = getChoiceItems();

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('laws.backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-yellow-100">
          <FileText className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('laws.taxClasses')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('laws.updated')}: {formatDate('2025-01-01')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('laws.taxClassesOverview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxClasses.map((item, index) => (
                <div key={index} className={`border-l-4 ${['border-blue-500', 'border-green-500', 'border-purple-500', 'border-red-500', 'border-orange-500', 'border-gray-500'][index]} pl-4`}>
                  <h4 className="font-semibold">{item.class}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.howToChoose')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {choiceIntro}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              {choiceItems.map((item, index) => (
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

export default TaxClasses;
