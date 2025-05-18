
export const getDocumentTitle = (documentType: string): string => {
  switch (documentType) {
    case 'steuererklaerung':
      return 'Daňové přiznání (Einkommensteuererklärung)';
    case 'pendlerbescheinigung':
      return 'Potvrzení o dojíždění (Pendlerbescheinigung)';
    case 'antrag-lohnsteuerermassigung':
      return 'Žádost o snížení daně ze mzdy';
    case 'arbeitsmittelnachweis':
      return 'Potvrzení o pracovních prostředcích';
    default:
      return 'Daňový dokument';
  }
};
