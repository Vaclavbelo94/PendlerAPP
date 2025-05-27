
import { 
  initializeProfessionalPDF, 
  addProfessionalHeader, 
  addProfessionalFooter,
  createProfessionalTable,
  addProfessionalSection,
  addProfessionalInfoBox,
  addProfessionalStatsCard,
  PROFESSIONAL_COLORS,
  SPACING
} from "@/utils/pdf/professionalPdfHelper";

// Enhanced sample data with more realistic values
const detailedData = [
  { name: '1. týden', auto: 42, mhd: 32, cost: 356 },
  { name: '2. týden', auto: 36, mhd: 28, cost: 306 },
  { name: '3. týden', auto: 38, mhd: 30, cost: 323 },
  { name: '4. týden', auto: 32, mhd: 38, cost: 272 }
];

export const generateComparisonPdf = async () => {
  // Initialize professional PDF
  const doc = initializeProfessionalPDF();
  
  // Add professional header
  addProfessionalHeader(doc, "Analýza dojíždění", "Měsíční přehled nákladů a vzdáleností • PendlerApp Professional", 'accent');
  
  let currentY = 75;
  
  // Professional statistics overview
  const totalDistance = detailedData.reduce((sum, item) => sum + item.auto + item.mhd, 0);
  const totalCost = detailedData.reduce((sum, item) => sum + item.cost, 0);
  const averageDaily = totalDistance / 20; // 20 working days
  const co2Saved = 8.2;
  
  const stats = [
    { label: 'Celková vzdálenost', value: `${totalDistance} km`, color: PROFESSIONAL_COLORS.primary.main },
    { label: 'Celkové náklady', value: `${totalCost} Kč`, color: PROFESSIONAL_COLORS.accent.main },
    { label: 'Denní průměr', value: `${averageDaily.toFixed(1)} km`, color: PROFESSIONAL_COLORS.secondary.main },
    { label: 'Úspora CO₂', value: `${co2Saved} kg`, color: PROFESSIONAL_COLORS.success }
  ];
  
  currentY = addProfessionalStatsCard(doc, stats, currentY);
  
  // Transport mode breakdown
  currentY = addProfessionalSection(doc, "🚗 Analýza dopravních prostředků", currentY, 'primary');
  
  const autoTotal = detailedData.reduce((sum, item) => sum + item.auto, 0);
  const mhdTotal = detailedData.reduce((sum, item) => sum + item.mhd, 0);
  const autoPercent = Math.round((autoTotal / totalDistance) * 100);
  const mhdPercent = 100 - autoPercent;
  
  await createProfessionalTable(doc, {
    head: [['Dopravní prostředek', 'Vzdálenost (km)', 'Podíl (%)', 'Náklady na km', 'Celkové náklady']],
    body: [
      ['Automobil', autoTotal.toString(), `${autoPercent}%`, '8,50 Kč', `${Math.round(autoTotal * 8.5)} Kč`],
      ['MHD', mhdTotal.toString(), `${mhdPercent}%`, '3,20 Kč', `${Math.round(mhdTotal * 3.2)} Kč`],
      ['CELKEM', totalDistance.toString(), '100%', '—', `${totalCost} Kč`]
    ]
  }, currentY);
  
  // Environmental impact
  currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
  currentY = addProfessionalInfoBox(
    doc, 
    `🌱 Ekologický dopad: Vaše rozhodnutí zvýšit podíl MHD přispěla k úspoře ${co2Saved} kg CO₂ oproti čistě automobilové dopravě. To odpovídá absorpci CO₂ jedním stromem za 4 měsíce.`, 
    currentY, 
    'success'
  );
  
  // Weekly detailed breakdown
  currentY = addProfessionalSection(doc, "📊 Týdenní detailní přehled", currentY, 'secondary');
  
  await createProfessionalTable(doc, {
    head: [['Týden', 'Automobil (km)', 'MHD (km)', 'Celkem (km)', 'Náklady (Kč)', 'Efektivita']],
    body: detailedData.map(item => [
      item.name, 
      item.auto.toString(), 
      item.mhd.toString(),
      (item.auto + item.mhd).toString(),
      item.cost.toString(),
      item.mhd > item.auto ? '🟢 Optimální' : '🟡 Dobrá'
    ])
  }, currentY);
  
  // Optimization recommendations
  currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
  currentY = addProfessionalSection(doc, "💡 Doporučení pro optimalizaci", currentY, 'accent');
  
  const recommendations = [
    'Zvýšení podílu MHD o dalších 10% = úspora 150 Kč měsíčně',
    'Využití park & ride systému pro dlouhé trasy',
    'Plánování cest mimo špičku pro rychlejší MHD',
    'Kombinace kola + MHD pro krátké úseky'
  ];
  
  await createProfessionalTable(doc, {
    head: [['Doporučení', 'Potenciální přínos']],
    body: recommendations.map((rec, index) => [
      `${index + 1}. ${rec.split(' = ')[0]}`,
      rec.includes(' = ') ? rec.split(' = ')[1] : 'Ekologický a zdravotní benefit'
    ])
  }, currentY);
  
  // Final summary
  currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
  currentY = addProfessionalInfoBox(
    doc, 
    `📈 Shrnutí: Váš současný mix dopravy je ${mhdPercent}% ekologický. Optimalizací můžete dosáhnout až 20% úspory nákladů při zachování komfortu dojíždění.`, 
    currentY, 
    'info'
  );
  
  // Add professional footer
  addProfessionalFooter(doc);
  
  // Save with professional filename
  const fileName = `PendlerApp_Analyza_Dojizdeni_${new Date().toISOString().slice(0, 7)}.pdf`;
  doc.save(fileName);
};
