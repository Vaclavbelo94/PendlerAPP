
import { initializePDF, addDocumentHeader, addDocumentFooter } from "@/utils/pdf/pdfHelper";

// Sample data - in a real application, this would be passed in
const detailedData = [
  { name: '1. týden', auto: 42, mhd: 32 },
  { name: '2. týden', auto: 36, mhd: 28 },
  { name: '3. týden', auto: 38, mhd: 30 },
  { name: '4. týden', auto: 32, mhd: 38 }
];

export const generateComparisonPdf = () => {
  // Inicializace PDF s českou diakritikou
  const doc = initializePDF();
  
  // Přidání hlavičky s logem
  addDocumentHeader(doc, "Analýza dojíždění");
  
  // Add summary data
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Souhrn za aktuální měsíc", 14, 50);
  
  // Import dynamicky jspdf-autotable
  import("jspdf-autotable").then((autoTable) => {
    // Create summary table
    autoTable.default(doc, {
      startY: 55,
      head: [['Metrika', 'Hodnota']],
      body: [
        ['Celková vzdálenost', '128 km'],
        ['Průměrně denně', '6.4 km'],
        ['Celkové náklady', '712 Kč'],
        ['Úspora oproti min. měsíci', '243 Kč (25%)'],
        ['Auto', '63 km (49%)'],
        ['MHD', '65 km (51%)'],
        ['Úspora CO2', '8.2 kg']
      ],
    });
    
    // Add weekly data title
    doc.setFontSize(14);
    doc.text("Týdenní přehled", 14, (doc as any).lastAutoTable.finalY + 15);
    
    // Create weekly data table
    autoTable.default(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Týden', 'Automobil (km)', 'MHD (km)']],
      body: detailedData.map(item => [item.name, item.auto, item.mhd]),
    });
    
    // Přidání patičky
    addDocumentFooter(doc);
    
    // Save the PDF
    doc.save('analyza-dojizdeni.pdf');
  });
};
