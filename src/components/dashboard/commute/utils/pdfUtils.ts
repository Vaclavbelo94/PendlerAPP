
import { initializePDF, addDocumentHeader, addDocumentFooter } from "@/utils/pdf/pdfHelper";
import { createStyledTable, addSection, addInfoBox } from "@/utils/pdf/enhancedPdfHelper";

// Sample data - in a real application, this would be passed in
const detailedData = [
  { name: '1. týden', auto: 42, mhd: 32 },
  { name: '2. týden', auto: 36, mhd: 28 },
  { name: '3. týden', auto: 38, mhd: 30 },
  { name: '4. týden', auto: 32, mhd: 38 }
];

export const generateComparisonPdf = async () => {
  // Inicializace vylepšeného PDF
  const doc = initializePDF();
  
  // Přidání moderní hlavičky
  addDocumentHeader(doc, "Analýza dojíždění", "Měsíční přehled nákladů a vzdáleností");
  
  let currentY = 65;
  
  // Sekce se shrnutím
  currentY = addSection(doc, "Souhrn za aktuální měsíc", currentY);
  
  // Vytvoření moderní tabulky se shrnutím
  await createStyledTable(doc, {
    head: [['Metrika', 'Hodnota', 'Poznámka']],
    body: [
      ['Celková vzdálenost', '128 km', 'Měsíční součet'],
      ['Průměrně denně', '6.4 km', 'Pracovní dny'],
      ['Celkové náklady', '712 Kč', 'Auto + MHD'],
      ['Úspora oproti min. měsíci', '243 Kč (25%)', 'Pozitivní trend'],
      ['Automobil', '63 km (49%)', 'Snížení oproti průměru'],
      ['MHD', '65 km (51%)', 'Zvýšení využití'],
      ['Úspora CO2', '8.2 kg', 'Ekologický přínos']
    ]
  }, currentY);
  
  // Info box s tipy
  currentY = (doc as any).lastAutoTable.finalY + 10;
  currentY = addInfoBox(
    doc, 
    "💡 Tip: Zvýšením podílu MHD o dalších 10% můžete ušetřit až 150 Kč měsíčně!", 
    currentY, 
    'info'
  );
  
  // Sekce s týdenními daty
  currentY = addSection(doc, "Týdenní detailní přehled", currentY + 5);
  
  // Týdenní data tabulka
  await createStyledTable(doc, {
    head: [['Týden', 'Automobil (km)', 'MHD (km)', 'Celkem (km)', 'Náklady (Kč)']],
    body: detailedData.map(item => [
      item.name, 
      item.auto.toString(), 
      item.mhd.toString(),
      (item.auto + item.mhd).toString(),
      Math.round((item.auto * 8.5 + item.mhd * 3.2)).toString()
    ])
  }, currentY);
  
  // Ekologická sekce
  currentY = (doc as any).lastAutoTable.finalY + 10;
  currentY = addInfoBox(
    doc, 
    "🌱 Vaše rozhodnutí přispěla k úspoře 8.2 kg CO2 oproti čistě automobilové dopravě", 
    currentY, 
    'success'
  );
  
  // Přidání vylepšené patičky
  addDocumentFooter(doc);
  
  // Uložení s optimalizovaným názvem
  const fileName = `analyza-dojizdeni-${new Date().toISOString().slice(0, 7)}.pdf`;
  doc.save(fileName);
};
