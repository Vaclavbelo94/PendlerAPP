
import React from 'react';
import { Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import { PdfData, SupportedLanguage, TranslationKeys } from './types';

// Modern color palette according to specifications
const PDF_COLORS = {
  primary: '#2563EB',      // Blue for headings
  success: '#16A34A',      // Green for savings highlight
  neutral: {
    50: '#F1F5F9',         // Light grey backgrounds
    200: '#E2E8F0',        // Borders
    600: '#475569',        // Secondary text
    700: '#334155',        // Main text color
    900: '#0F172A'         // Darkest text
  },
  white: '#ffffff'
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: PDF_COLORS.white,
    color: PDF_COLORS.neutral[700],
    lineHeight: 1.4
  },
  header: {
    backgroundColor: PDF_COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginHorizontal: -30,
    marginTop: -30,
    marginBottom: 30,
    color: PDF_COLORS.white
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9
  },
  section: {
    marginBottom: 25,
    backgroundColor: PDF_COLORS.neutral[50],
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PDF_COLORS.neutral[200]
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PDF_COLORS.primary,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: PDF_COLORS.primary
  },
  table: {
    marginBottom: 15
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.neutral[200]
  },
  tableRowHeader: {
    backgroundColor: PDF_COLORS.primary,
    color: PDF_COLORS.white,
    fontWeight: 'bold'
  },
  tableRowEven: {
    backgroundColor: PDF_COLORS.neutral[50]
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    paddingRight: 10
  },
  tableCellLabel: {
    flex: 2,
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableCellValue: {
    flex: 1,
    fontSize: 10,
    textAlign: 'right'
  },
  savingsHighlight: {
    backgroundColor: PDF_COLORS.success,
    color: PDF_COLORS.white,
    padding: 20,
    borderRadius: 8,
    textAlign: 'center',
    marginVertical: 20
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  savingsText: {
    fontSize: 12,
    opacity: 0.9
  },
  noteBox: {
    backgroundColor: PDF_COLORS.neutral[50],
    borderLeftWidth: 4,
    borderLeftColor: PDF_COLORS.primary,
    padding: 15,
    marginVertical: 15
  },
  noteText: {
    fontSize: 10,
    fontStyle: 'italic',
    lineHeight: 1.5
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: PDF_COLORS.neutral[200],
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    color: PDF_COLORS.neutral[600]
  },
  footerBrand: {
    fontSize: 9,
    fontWeight: 'bold',
    color: PDF_COLORS.primary
  }
});

// Translation mappings
const getTranslations = (lang: SupportedLanguage): TranslationKeys => {
  const translations = {
    cz: {
      title: "Daňový dokument – Zdaňovací období 2025",
      sections: {
        personalData: "Osobní údaje",
        employmentData: "Údaje o zaměstnání",
        deductibleItems: "Odpočitatelné položky",
        taxSavings: "Daňová úspora",
        additionalNotes: "Doplňující poznámky"
      },
      fields: {
        fullName: "Jméno a příjmení",
        taxId: "DIČ",
        address: "Adresa",
        dateOfBirth: "Datum narození",
        email: "E-mail",
        employer: "Zaměstnavatel",
        annualIncome: "Roční příjem",
        commuteExpenses: "Náklady na dojíždění",
        secondHomeExpenses: "Náklady na druhé bydliště",
        workClothesExpenses: "Náklady na pracovní oblečení",
        educationExpenses: "Náklady na vzdělávání",
        insuranceExpenses: "Náklady na pojištění"
      },
      calculations: {
        commuteFormula: "Dojíždění: {distance} km × {days} dní × 0,30 € = {total} €",
        savingsNote: "S těmito odpočty můžete ušetřit až {amount} € ročně na dani."
      },
      footer: {
        generatedBy: "Vygenerováno systémem PendlerApp",
        contact: "www.pendlerapp.cz | info@pendlerapp.cz",
        date: "Datum vygenerování"
      }
    },
    de: {
      title: "Steuerdokument – Steuerzeitraum 2025",
      sections: {
        personalData: "Persönliche Daten",
        employmentData: "Beschäftigungsdaten",
        deductibleItems: "Abzugsfähige Posten",
        taxSavings: "Steuerersparnis",
        additionalNotes: "Zusätzliche Hinweise"
      },
      fields: {
        fullName: "Vor- und Nachname",
        taxId: "Steuer-ID",
        address: "Adresse",
        dateOfBirth: "Geburtsdatum",
        email: "E-Mail",
        employer: "Arbeitgeber",
        annualIncome: "Jahreseinkommen",
        commuteExpenses: "Fahrtkosten",
        secondHomeExpenses: "Kosten zweiter Wohnsitz",
        workClothesExpenses: "Kosten Berufskleidung",
        educationExpenses: "Bildungskosten",
        insuranceExpenses: "Versicherungskosten"
      },
      calculations: {
        commuteFormula: "Fahrtkosten: {distance} km × {days} Tage × 0,30 € = {total} €",
        savingsNote: "Mit diesen Abzügen können Sie bis zu {amount} € jährlich an Steuern sparen."
      },
      footer: {
        generatedBy: "Erstellt mit PendlerApp",
        contact: "www.pendlerapp.cz | info@pendlerapp.cz",
        date: "Erstellungsdatum"
      }
    },
    pl: {
      title: "Dokument podatkowy – Okres rozliczeniowy 2025",
      sections: {
        personalData: "Dane osobowe",
        employmentData: "Dane o zatrudnieniu",
        deductibleItems: "Pozycje odliczalne",
        taxSavings: "Oszczędność podatkowa",
        additionalNotes: "Dodatkowe uwagi"
      },
      fields: {
        fullName: "Imię i nazwisko",
        taxId: "NIP",
        address: "Adres",
        dateOfBirth: "Data urodzenia",
        email: "E-mail",
        employer: "Pracodawca",
        annualIncome: "Roczny dochód",
        commuteExpenses: "Koszty dojazdu",
        secondHomeExpenses: "Koszty drugiego miejsca zamieszkania",
        workClothesExpenses: "Koszty odzieży roboczej",
        educationExpenses: "Koszty edukacji",
        insuranceExpenses: "Koszty ubezpieczenia"
      },
      calculations: {
        commuteFormula: "Dojazdy: {distance} km × {days} dni × 0,30 € = {total} €",
        savingsNote: "Dzięki tym odliczeniom możesz zaoszczędzić do {amount} € rocznie na podatkach."
      },
      footer: {
        generatedBy: "Wygenerowano przez PendlerApp",
        contact: "www.pendlerapp.cz | info@pendlerapp.cz",
        date: "Data wygenerowania"
      }
    }
  };

  return translations[lang];
};

interface TaxPDFDocumentProps {
  data: PdfData;
  translations: TranslationKeys;
}

const TaxPDFDocument: React.FC<TaxPDFDocumentProps> = ({ data, translations }) => {
  const currentDate = new Date().toLocaleDateString('cs-CZ');
  
  const formatCurrency = (amount: number) => `${amount.toLocaleString('cs-CZ')} €`;

  const interpolateString = (template: string, values: Record<string, string | number>) => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return values[key]?.toString() || match;
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{translations.title}</Text>
          <Text style={styles.headerSubtitle}>PendlerApp - Profesionální řešení pro pendlery</Text>
        </View>

        {/* Section 1: Personal Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.sections.personalData}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{translations.fields.fullName}:</Text>
              <Text style={styles.tableCellValue}>{data.personalData.fullName}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowEven]}>
              <Text style={styles.tableCellLabel}>{translations.fields.taxId}:</Text>
              <Text style={styles.tableCellValue}>{data.personalData.taxId}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{translations.fields.address}:</Text>
              <Text style={styles.tableCellValue}>{data.personalData.address}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowEven]}>
              <Text style={styles.tableCellLabel}>{translations.fields.dateOfBirth}:</Text>
              <Text style={styles.tableCellValue}>{data.personalData.dateOfBirth}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{translations.fields.email}:</Text>
              <Text style={styles.tableCellValue}>{data.personalData.email}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Employment Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.sections.employmentData}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{translations.fields.employer}:</Text>
              <Text style={styles.tableCellValue}>{data.employmentData.employer}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowEven]}>
              <Text style={styles.tableCellLabel}>{translations.fields.annualIncome}:</Text>
              <Text style={styles.tableCellValue}>{formatCurrency(data.employmentData.annualIncome)}</Text>
            </View>
          </View>
        </View>

        {/* Section 3: Deductible Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.sections.deductibleItems}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{translations.fields.commuteExpenses}:</Text>
              <Text style={styles.tableCellValue}>{formatCurrency(data.deductibleItems.commuteExpenses.total)}</Text>
            </View>
            <View style={[styles.tableRow, { backgroundColor: PDF_COLORS.neutral[50] }]}>
              <Text style={[styles.tableCell, { fontSize: 9, fontStyle: 'italic' }]}>
                {interpolateString(translations.calculations.commuteFormula, {
                  distance: data.deductibleItems.commuteExpenses.distance,
                  days: data.deductibleItems.commuteExpenses.days,
                  total: data.deductibleItems.commuteExpenses.total
                })}
              </Text>
            </View>
            
            {data.deductibleItems.secondHomeExpenses && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLabel}>{translations.fields.secondHomeExpenses}:</Text>
                <Text style={styles.tableCellValue}>{formatCurrency(data.deductibleItems.secondHomeExpenses)}</Text>
              </View>
            )}
            
            {data.deductibleItems.workClothesExpenses && (
              <View style={[styles.tableRow, styles.tableRowEven]}>
                <Text style={styles.tableCellLabel}>{translations.fields.workClothesExpenses}:</Text>
                <Text style={styles.tableCellValue}>{formatCurrency(data.deductibleItems.workClothesExpenses)}</Text>
              </View>
            )}
            
            {data.deductibleItems.educationExpenses && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLabel}>{translations.fields.educationExpenses}:</Text>
                <Text style={styles.tableCellValue}>{formatCurrency(data.deductibleItems.educationExpenses)}</Text>
              </View>
            )}
            
            {data.deductibleItems.insuranceExpenses && (
              <View style={[styles.tableRow, styles.tableRowEven]}>
                <Text style={styles.tableCellLabel}>{translations.fields.insuranceExpenses}:</Text>
                <Text style={styles.tableCellValue}>{formatCurrency(data.deductibleItems.insuranceExpenses)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Section 4: Tax Savings Highlight */}
        <View style={styles.savingsHighlight}>
          <Text style={styles.savingsAmount}>{formatCurrency(data.taxSavings.estimatedSaving)}</Text>
          <Text style={styles.savingsText}>{translations.sections.taxSavings}</Text>
        </View>

        {/* Section 5: Additional Notes */}
        {(data.additionalNotes || data.taxSavings.estimatedSaving > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.sections.additionalNotes}</Text>
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                {data.additionalNotes || interpolateString(translations.calculations.savingsNote, {
                  amount: data.taxSavings.estimatedSaving
                })}
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{translations.footer.generatedBy}</Text>
          <Text style={styles.footerBrand}>PendlerApp</Text>
          <Text style={styles.footerText}>{translations.footer.contact}</Text>
          <Text style={styles.footerText}>{translations.footer.date}: {currentDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main generator functions
export const generatePdf = async (data: PdfData, lang: SupportedLanguage = 'cz'): Promise<Blob> => {
  const translations = getTranslations(lang);
  const doc = <TaxPDFDocument data={data} translations={translations} />;
  return await pdf(doc).toBlob();
};

export const downloadPdf = async (data: PdfData, lang: SupportedLanguage = 'cz'): Promise<void> => {
  const translations = getTranslations(lang);
  const blob = await generatePdf(data, lang);
  
  // Create filename based on language
  const fileNames = {
    cz: 'danovy-dokument-2025.pdf',
    de: 'steuerdokument-2025.pdf',
    pl: 'dokument-podatkowy-2025.pdf'
  };
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileNames[lang];
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default TaxPDFDocument;
