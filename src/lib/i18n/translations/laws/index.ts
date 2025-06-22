
import { workLawTranslations } from './workLaw';
import { taxesTranslations } from './taxes';
import { socialSecurityTranslations } from './socialSecurity';
import { healthInsuranceTranslations } from './healthInsurance';
import { legalAidTranslations } from './legalAid';

// Merge all law translations
export const lawsTranslations = {
  cs: {
    laws: {
      // Common translations
      backToLaws: 'Zpět na zákony',
      backToLawsList: 'Zpět na seznam zákonů',
      updated: 'Aktualizováno',
      importantNotice: 'Důležité upozornění',
      orientationGuide: 'Tento průvodce slouží pouze k orientaci. Pro konkrétní právní rady se obraťte na odborníka.',

      // Main navigation
      germanLaws: 'Německé zákony',
      lawsGuide: 'Průvodce německými zákony',
      lawsDescription: 'Kompletní průvodce německými zákony pro zahraniční pracovníky',
      lawsDescriptionMobile: 'Průvodce německými zákony',
      allLaws: 'Všechny zákony',
      allLawsDescription: 'Zobrazit všechny dostupné zákony a předpisy',

      // Categories
      workLaw: 'Pracovní právo',
      workLawDescription: 'Zákony týkající se pracovních smluv a práv zaměstnanců',
      taxes: 'Daně',
      taxesDescription: 'Daňové zákony a předpisy pro zaměstnance',
      socialSecurity: 'Sociální zabezpečení',
      socialSecurityDescription: 'Systém sociálního zabezpečení a dávky',
      healthInsurance: 'Zdravotní pojištění',
      healthInsuranceDescription: 'Systém zdravotního pojištění a pokrytí',

      // Merge all specific translations
      ...workLawTranslations.cs.laws,
      ...taxesTranslations.cs.laws,
      ...socialSecurityTranslations.cs.laws,
      ...healthInsuranceTranslations.cs.laws,
      ...legalAidTranslations.cs.laws,
    },
  },
  de: {
    laws: {
      // Common German translations
      backToLaws: 'Zurück zu Gesetzen',
      backToLawsList: 'Zurück zur Gesetzesliste',
      updated: 'Aktualisiert',
      importantNotice: 'Wichtiger Hinweis',
      orientationGuide: 'Diese Anleitung dient nur zur Orientierung. Für spezifische Rechtsberatung wenden Sie sich an einen Experten.',

      germanLaws: 'Deutsche Gesetze',
      lawsGuide: 'Leitfaden für deutsche Gesetze',
      lawsDescription: 'Vollständiger Leitfaden für deutsche Gesetze für ausländische Arbeitnehmer',
      workLaw: 'Arbeitsrecht',
      workLawDescription: 'Gesetze zu Arbeitsverträgen und Arbeitnehmerrechten',
      taxes: 'Steuern',
      taxesDescription: 'Steuergesetze und Vorschriften für Arbeitnehmer',
      socialSecurity: 'Sozialversicherung',
      socialSecurityDescription: 'Sozialversicherungssystem und Leistungen',
      healthInsurance: 'Krankenversicherung',
      healthInsuranceDescription: 'Krankenversicherungssystem und Abdeckung',

      // Merge specific German translations
      ...workLawTranslations.de.laws,
      ...taxesTranslations.de.laws,
      ...socialSecurityTranslations.de.laws,
      ...healthInsuranceTranslations.de.laws,
      ...legalAidTranslations.de.laws,
    },
  },
  pl: {
    laws: {
      // Common Polish translations
      backToLaws: 'Powrót do praw',
      backToLawsList: 'Powrót do listy praw',
      updated: 'Zaktualizowano',
      importantNotice: 'Ważna uwaga',
      orientationGuide: 'Ten przewodnik służy tylko do orientacji. W sprawie konkretnych porad prawnych skontaktuj się z ekspertem.',

      germanLaws: 'Niemieckie prawo',
      lawsGuide: 'Przewodnik po niemieckim prawie',
      lawsDescription: 'Kompletny przewodnik po niemieckim prawie dla zagranicznych pracowników',
      workLaw: 'Prawo pracy',
      workLawDescription: 'Przepisy dotyczące umów o pracę i praw pracowników',
      taxes: 'Podatki',
      taxesDescription: 'Przepisy podatkowe dla pracowników',
      socialSecurity: 'Ubezpieczenia społeczne',
      socialSecurityDescription: 'System ubezpieczeń społecznych i świadczenia',
      healthInsurance: 'Ubezpieczenie zdrowotne',
      healthInsuranceDescription: 'System ubezpieczenia zdrowotnego i pokrycie',

      // Merge specific Polish translations
      ...workLawTranslations.pl.laws,
      ...taxesTranslations.pl.laws,
      ...socialSecurityTranslations.pl.laws,
      ...healthInsuranceTranslations.pl.laws,
      ...legalAidTranslations.pl.laws,
    },
  },
};
