import { TaxWizardData, TaxCalculationResult } from '../../wizard/types';

interface ElsterFormData {
  personalInfo: TaxWizardData['personalInfo'];
  employmentInfo: TaxWizardData['employmentInfo'];
  reisepauschale: TaxWizardData['reisepauschale'];
  deductions: TaxWizardData['deductions'];
  calculations: TaxCalculationResult;
}

// ELSTER XML struktura pro ESt formulář
export const generateElsterXML = (data: ElsterFormData): string => {
  const currentYear = new Date().getFullYear() - 1; // Předchozí rok
  const currentDate = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Elster xmlns="http://www.elster.de/elsterxml/schema/v11" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.elster.de/elsterxml/schema/v11 elster_v11.xsd">
  
  <TransferHeader version="11">
    <Verfahren>ESt</Verfahren>
    <DatenArt>ESt${currentYear}</DatenArt>
    <Vorgang>send-NoSig</Vorgang>
    <TransferTicket>${generateTransferTicket()}</TransferTicket>
    <Testmerker>0</Testmerker>
    <SigUser />
    <Empfaenger id="F">
      <Bezeichnung>Finanzamt</Bezeichnung>
    </Empfaenger>
    <Hersteller>
      <ProduktName>PendlerTaxAdvisor</ProduktName>
      <ProduktVersion>1.0</ProduktVersion>
    </Hersteller>
    <DatenLieferant>${data.personalInfo.lastName}, ${data.personalInfo.firstName}</DatenLieferant>
    <VersionClient>1.0</VersionClient>
    <Zusatz>
      <Info>Erstellt durch Pendler.cz Daňový poradce</Info>
      <ElsterInfo>
        <GenerierungsProgramm>PendlerTaxAdvisor</GenerierungsProgramm>
      </ElsterInfo>
    </Zusatz>
  </TransferHeader>

  <DatenTeil>
    <Nutzdatenblock>
      <NutzdatenHeader version="11">
        <NutzdatenTicket>${generateNutzdatenTicket()}</NutzdatenTicket>
        <Empfaenger id="F">Finanzamt</Empfaenger>
        <Hersteller>
          <ProduktName>PendlerTaxAdvisor</ProduktName>
          <ProduktVersion>1.0</ProduktVersion>
        </Hersteller>
        <DatenLieferant>${data.personalInfo.lastName}, ${data.personalInfo.firstName}</DatenLieferant>
      </NutzdatenHeader>

      <Nutzdaten>
        <Anmeldungssteuern art="ESt${currentYear}">
          
          <!-- Mantelbogen - Persönliche Daten -->
          <Mantelbogen>
            <AllgemeineAngaben>
              <!-- Steuerpflichtiger -->
              <Steuerpflichtiger>
                <Name>${escapeXml(data.personalInfo.lastName)}</Name>
                <Vorname>${escapeXml(data.personalInfo.firstName)}</Vorname>
                <Geburtsdatum>${formatDateForElster(data.personalInfo.dateOfBirth)}</Geburtsdatum>
                <Steuernummer>${escapeXml(data.personalInfo.taxId)}</Steuernummer>
                
                <!-- Adresse -->
                <Anschrift>
                  <Strasse>${escapeXml(extractStreet(data.personalInfo.address))}</Strasse>
                  <Hausnummer>${escapeXml(extractHouseNumber(data.personalInfo.address))}</Hausnummer>
                  <PLZ>${escapeXml(extractPostalCode(data.personalInfo.address))}</PLZ>
                  <Ort>${escapeXml(extractCity(data.personalInfo.address))}</Ort>
                  <Land>${escapeXml(extractCountry(data.personalInfo.address))}</Land>
                </Anschrift>
              </Steuerpflichtiger>

              <!-- Kontaktdaten -->
              <Kontakt>
                <EmailAdresse>${escapeXml(data.personalInfo.email)}</EmailAdresse>
              </Kontakt>

              <!-- Angaben zur Steuererklärung -->
              <Steuererklaerung>
                <Jahr>${currentYear}</Jahr>
                <Erstellungsdatum>${currentDate}</Erstellungsdatum>
                <Verfahrensstand>Erstmalige Abgabe</Verfahrensstand>
              </Steuererklaerung>
            </AllgemeineAngaben>
          </Mantelbogen>

          <!-- Anlage N - Einkünfte aus nichtselbstständiger Arbeit -->
          <AnlageN>
            <AllgemeineAngaben>
              <Arbeitgeber>
                <Name>${escapeXml(data.employmentInfo.employerName)}</Name>
                <Land>Deutschland</Land>
              </Arbeitgeber>
              
              <!-- Bruttoarbeitslohn -->
              <Arbeitslohn>
                <Bruttolohn>${Math.round(data.employmentInfo.annualIncome * 100)}</Bruttolohn>
                <Steuerklasse>${data.employmentInfo.taxClass}</Steuerklasse>
              </Arbeitslohn>
            </AllgemeineAngaben>

            <!-- Werbungskosten -->
            <Werbungskosten>
              
              <!-- Fahrten zwischen Wohnung und Arbeitsstätte -->
              ${data.calculations.reisepausaleBenefit > 0 ? `
              <FahrtenWohnungArbeit>
                <EntfernungKilometer>${data.reisepauschale.commuteDistance}</EntfernungKilometer>
                <ArbeitstageImJahr>${data.reisepauschale.workDaysPerYear}</ArbeitstageImJahr>
                <Verkehrsmittel>${data.reisepauschale.transportType === 'car' ? 'PKW' : 'OeffentlicheVerkehrsmittel'}</Verkehrsmittel>
                <GesamtbetragPauschale>${Math.round(data.calculations.reisepausaleBenefit * 100)}</GesamtbetragPauschale>
              </FahrtenWohnungArbeit>
              ` : ''}

              <!-- Doppelte Haushaltsführung -->
              ${data.calculations.secondHomeBenefit > 0 ? `
              <DoppelteHaushaltsfuehrung>
                <ZweitwohnungInDeutschland>true</ZweitwohnungInDeutschland>
                <KostenZweitwohnung>${Math.round(data.reisepauschale.secondHomeCost * 100)}</KostenZweitwohnung>
                <WoechentlicheFahrten>1</WoechentlicheFahrten>
                <JaehrlicheFahrten>46</JaehrlicheFahrten>
                <GesamtbetragDoppelteHF>${Math.round(data.calculations.secondHomeBenefit * 100)}</GesamtbetragDoppelteHF>
              </DoppelteHaushaltsfuehrung>
              ` : ''}

              <!-- Arbeitskleidung -->
              ${data.calculations.workClothesBenefit > 0 ? `
              <Arbeitskleidung>
                <KostenArbeitskleidung>${Math.round(data.calculations.workClothesBenefit * 100)}</KostenArbeitskleidung>
              </Arbeitskleidung>
              ` : ''}

              <!-- Fortbildungskosten -->
              ${data.calculations.educationBenefit > 0 ? `
              <Fortbildungskosten>
                <KostenFortbildung>${Math.round(data.calculations.educationBenefit * 100)}</KostenFortbildung>
              </Fortbildungskosten>
              ` : ''}

              <!-- Fachliteratur -->
              ${data.calculations.professionalLiteratureBenefit > 0 ? `
              <Fachliteratur>
                <KostenFachliteratur>${Math.round(data.calculations.professionalLiteratureBenefit * 100)}</KostenFachliteratur>
              </Fachliteratur>
              ` : ''}

              <!-- Arbeitsmittel -->
              ${data.calculations.toolsBenefit > 0 ? `
              <Arbeitsmittel>
                <KostenArbeitsmittel>${Math.round(data.calculations.toolsBenefit * 100)}</KostenArbeitsmittel>
              </Arbeitsmittel>
              ` : ''}

              <!-- Häusliches Arbeitszimmer -->
              ${data.calculations.homeOfficeBenefit > 0 ? `
              <HaeuslichesArbeitszimmer>
                <HomeOfficePauschale>${Math.round(data.calculations.homeOfficeBenefit * 100)}</HomeOfficePauschale>
              </HaeuslichesArbeitszimmer>
              ` : ''}

              <!-- Gesamtsumme Werbungskosten -->
              <GesamtWerbungskosten>${Math.round(data.calculations.totalDeductions * 100)}</GesamtWerbungskosten>
            </Werbungskosten>
          </AnlageN>

          <!-- Ausländische Einkünfte falls relevant -->
          ${isNonGermanResident(data.personalInfo.address) ? `
          <AnlageAUS>
            <Wohnsitz>
              <AuslaendischerWohnsitz>true</AuslaendischerWohnsitz>
              <Land>${escapeXml(extractCountry(data.personalInfo.address))}</Land>
              <Adresse>${escapeXml(data.personalInfo.address)}</Adresse>
            </Wohnsitz>
          </AnlageAUS>
          ` : ''}

        </Anmeldungssteuern>
      </Nutzdaten>
    </Nutzdatenblock>
  </DatenTeil>
</Elster>`;

  return xml;
};

// Pomocné funkce
const generateTransferTicket = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const generateNutzdatenTicket = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const formatDateForElster = (dateString: string): string => {
  if (!dateString) return '';
  // Převod do formátu DDMMYYYY
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

// Extrakce částí adresy (zjednodušená verze)
const extractStreet = (address: string): string => {
  const parts = address.split(',')[0]?.trim() || '';
  return parts.replace(/\d+.*$/, '').trim();
};

const extractHouseNumber = (address: string): string => {
  const parts = address.split(',')[0]?.trim() || '';
  const match = parts.match(/\d+[a-zA-Z]*$/);
  return match ? match[0] : '';
};

const extractPostalCode = (address: string): string => {
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : '';
};

const extractCity = (address: string): string => {
  const parts = address.split(',');
  if (parts.length >= 2) {
    return parts[1].replace(/\d{5}/, '').trim();
  }
  return '';
};

const extractCountry = (address: string): string => {
  const parts = address.split(',');
  if (parts.length >= 3) {
    return parts[parts.length - 1].trim();
  }
  // Detekce země podle PSČ nebo jiných indicií
  if (address.match(/\b\d{5}\b/)) return 'Deutschland';
  if (address.match(/\b\d{3}\s?\d{2}\b/)) return 'Tschechische Republik';
  if (address.match(/\b\d{2}-\d{3}\b/)) return 'Polen';
  return 'Deutschland';
};

const isNonGermanResident = (address: string): boolean => {
  const country = extractCountry(address);
  return country !== 'Deutschland';
};

// Export XML souboru
export const downloadElsterXML = (data: ElsterFormData, filename?: string): void => {
  const xml = generateElsterXML(data);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `elster_declaration_${new Date().getFullYear()}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Validace dat pro ELSTER
export const validateElsterData = (data: TaxWizardData): string[] => {
  const errors: string[] = [];
  
  // Povinná pole
  if (!data.personalInfo.firstName.trim()) {
    errors.push('Jméno je povinné');
  }
  
  if (!data.personalInfo.lastName.trim()) {
    errors.push('Příjmení je povinné');
  }
  
  if (!data.personalInfo.taxId.trim()) {
    errors.push('Daňové identifikační číslo je povinné');
  }
  
  if (!data.personalInfo.dateOfBirth) {
    errors.push('Datum narození je povinné');
  }
  
  if (!data.personalInfo.address.trim()) {
    errors.push('Adresa je povinná');
  }
  
  if (!data.employmentInfo.employerName.trim()) {
    errors.push('Název zaměstnavatele je povinný');
  }
  
  if (data.employmentInfo.annualIncome <= 0) {
    errors.push('Roční příjem musí být větší než 0');
  }
  
  if (!data.employmentInfo.taxClass) {
    errors.push('Daňová třída je povinná');
  }
  
  // Validace formátů
  if (data.personalInfo.taxId && !/^\d{11}$/.test(data.personalInfo.taxId.replace(/\s/g, ''))) {
    errors.push('Daňové ID musí mít 11 číslic');
  }
  
  if (data.personalInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
    errors.push('Neplatný formát e-mailu');
  }
  
  return errors;
};