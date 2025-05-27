
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ModernPDFTemplate } from './ModernPDFTemplate';
import { ModernSection, ModernTable, ModernInfoBox, ModernStatsGrid } from './ModernPDFComponents';
import { DocumentData } from '../../tax/types';
import { getDocumentTitle } from '../../tax/documentUtils';

interface ModernTaxDocumentProps {
  data: DocumentData;
}

const ModernTaxDocument: React.FC<ModernTaxDocumentProps> = ({ data }) => {
  const documentTitle = getDocumentTitle(data.documentType);
  const subtitle = `Zdaňovací období: ${data.yearOfTax}`;

  // Calculate deductions
  const deductions = [];
  let totalDeductions = 0;

  if (data.includeCommuteExpenses) {
    const commuteCostPerKm = 0.30;
    const totalCommuteDays = parseInt(data.commuteWorkDays || '220');
    const commuteDistance = parseInt(data.commuteDistance || '0');
    const totalCommuteCost = commuteCostPerKm * commuteDistance * totalCommuteDays;
    totalDeductions += totalCommuteCost;
    
    deductions.push([
      'Náklady na dojíždění',
      `${commuteDistance} km × ${totalCommuteDays} dní × 0.30€`,
      `${totalCommuteCost.toFixed(2)} €`
    ]);
  }

  if (data.includeSecondHome) {
    const secondHomeCost = 1200;
    totalDeductions += secondHomeCost;
    deductions.push(['Druhé bydlení v Německu', 'Paušální roční náklad', `${secondHomeCost} €`]);
  }

  if (data.includeWorkClothes) {
    const workClothesCost = 400;
    totalDeductions += workClothesCost;
    deductions.push(['Pracovní oděvy a pomůcky', 'Paušální roční náklad', `${workClothesCost} €`]);
  }

  const estimatedSaving = totalDeductions * 0.25;

  const statsData = [
    { label: 'Celkem odpočet', value: `${totalDeductions.toFixed(0)} €` },
    { label: 'Odhadovaná úspora', value: `${estimatedSaving.toFixed(0)} €` },
    { label: 'Daňová sazba', value: '25%' },
    { label: 'Roční benefit', value: `${estimatedSaving.toFixed(0)} €` }
  ];

  return (
    <ModernPDFTemplate title={documentTitle} subtitle={subtitle}>
      {/* Personal Information */}
      <ModernSection title="Osobní údaje">
        <ModernTable
          headers={['Položka', 'Hodnota']}
          data={[
            ['Jméno a příjmení', data.name || 'Neuvedeno'],
            ['Daňové identifikační číslo', data.taxId || 'Neuvedeno'],
            ['Adresa trvalého bydliště', data.address || 'Neuvedeno'],
            ['Datum narození', data.dateOfBirth || 'Neuvedeno'],
            ['Email', data.email || 'Neuvedeno']
          ]}
        />
      </ModernSection>

      {/* Employment Information */}
      {(data.employerName || data.incomeAmount) && (
        <ModernSection title="Údaje o zaměstnání">
          <ModernTable
            headers={['Položka', 'Hodnota']}
            data={[
              ['Zaměstnavatel', data.employerName || 'Neuvedeno'],
              ['Roční příjem (€)', data.incomeAmount ? `${data.incomeAmount} €` : 'Neuvedeno']
            ]}
          />
        </ModernSection>
      )}

      {/* Deductible Items */}
      <ModernSection title="Odpočitatelné položky">
        {deductions.length > 0 ? (
          <>
            <ModernTable
              headers={['Položka', 'Výpočet', 'Částka (€)']}
              data={[...deductions, ['CELKEM ODPOČET', '', `${totalDeductions.toFixed(2)} €`]]}
            />
            
            <ModernStatsGrid stats={statsData} />
            
            <ModernInfoBox type="success">
              S těmito odpočty můžete ušetřit až {estimatedSaving.toFixed(2)} € ročně na dani. 
              Nezapomeňte si připravit všechny potřebné doklady před podáním daňového přiznání.
            </ModernInfoBox>
          </>
        ) : (
          <ModernInfoBox type="warning">
            Nebyly vybrány žádné odpočitatelné položky. Pro optimalizaci daní zvažte využití dostupných odpočtů.
          </ModernInfoBox>
        )}
      </ModernSection>

      {/* Additional Notes */}
      {data.additionalNotes && (
        <ModernSection title="Doplňující poznámky">
          <ModernTable
            headers={['Poznámky a dodatečné informace']}
            data={[[data.additionalNotes]]}
          />
        </ModernSection>
      )}
    </ModernPDFTemplate>
  );
};

export const generateModernTaxDocument = async (data: DocumentData): Promise<Blob> => {
  try {
    console.log('Generování PDF dokumentu...', data);
    const blob = await pdf(<ModernTaxDocument data={data} />).toBlob();
    console.log('PDF dokument úspěšně vygenerován');
    return blob;
  } catch (error) {
    console.error('Chyba při generování PDF:', error);
    throw new Error('Nepodařilo se vygenerovat PDF dokument: ' + (error as Error).message);
  }
};

export const downloadModernTaxDocument = async (data: DocumentData): Promise<void> => {
  try {
    console.log('Zahajování stahování PDF dokumentu...');
    const blob = await generateModernTaxDocument(data);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const filename = `PendlerApp_${getDocumentTitle(data.documentType).replace(/\s+/g, '_').toLowerCase()}_${data.yearOfTax}_modern.pdf`;
    link.download = filename;
    
    console.log('Stahování souboru:', filename);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('PDF dokument úspěšně stažen');
  } catch (error) {
    console.error('Chyba při stahování PDF:', error);
    throw error;
  }
};
