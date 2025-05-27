
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ModernPDFTemplate } from './ModernPDFTemplate';
import { ModernSection, ModernTable, ModernInfoBox, ModernStatsGrid } from './ModernPDFComponents';

const sampleData = [
  { name: '1. týden', auto: 42, mhd: 32, cost: 356 },
  { name: '2. týden', auto: 36, mhd: 28, cost: 306 },
  { name: '3. týden', auto: 38, mhd: 30, cost: 323 },
  { name: '4. týden', auto: 32, mhd: 38, cost: 272 }
];

const ModernCommuteDocument: React.FC = () => {
  const title = 'Analýza dojíždění';
  const subtitle = 'Měsíční přehled nákladů a vzdáleností • PendlerApp Professional';

  // Calculate statistics
  const totalDistance = sampleData.reduce((sum, item) => sum + item.auto + item.mhd, 0);
  const totalCost = sampleData.reduce((sum, item) => sum + item.cost, 0);
  const averageDaily = totalDistance / 20; // 20 working days
  const co2Saved = 8.2;
  const autoTotal = sampleData.reduce((sum, item) => sum + item.auto, 0);
  const mhdTotal = sampleData.reduce((sum, item) => sum + item.mhd, 0);
  const autoPercent = Math.round((autoTotal / totalDistance) * 100);
  const mhdPercent = 100 - autoPercent;

  const statsData = [
    { label: 'Celková vzdálenost', value: `${totalDistance} km` },
    { label: 'Celkové náklady', value: `${totalCost} Kč` },
    { label: 'Denní průměr', value: `${averageDaily.toFixed(1)} km` },
    { label: 'Úspora CO₂', value: `${co2Saved} kg` }
  ];

  const transportBreakdown = [
    ['Automobil', autoTotal.toString(), `${autoPercent}%`, '8,50 Kč', `${Math.round(autoTotal * 8.5)} Kč`],
    ['MHD', mhdTotal.toString(), `${mhdPercent}%`, '3,20 Kč', `${Math.round(mhdTotal * 3.2)} Kč`],
    ['CELKEM', totalDistance.toString(), '100%', '—', `${totalCost} Kč`]
  ];

  const weeklyData = sampleData.map(item => [
    item.name,
    item.auto.toString(),
    item.mhd.toString(),
    (item.auto + item.mhd).toString(),
    item.cost.toString(),
    item.mhd > item.auto ? '🟢 Optimální' : '🟡 Dobrá'
  ]);

  const recommendations = [
    ['Zvýšení podílu MHD o dalších 10%', 'úspora 150 Kč měsíčně'],
    ['Využití park & ride systému', 'rychlejší doprava pro dlouhé trasy'],
    ['Plánování cest mimo špičku', 'rychlejší MHD'],
    ['Kombinace kola + MHD', 'ekologický a zdravotní benefit']
  ];

  return (
    <ModernPDFTemplate title={title} subtitle={subtitle}>
      {/* Statistics Overview */}
      <ModernSection title="📊 Přehled statistik">
        <ModernStatsGrid stats={statsData} />
      </ModernSection>

      {/* Transport Mode Analysis */}
      <ModernSection title="🚗 Analýza dopravních prostředků">
        <ModernTable
          headers={['Dopravní prostředek', 'Vzdálenost (km)', 'Podíl (%)', 'Náklady na km', 'Celkové náklady']}
          data={transportBreakdown}
        />
      </ModernSection>

      {/* Environmental Impact */}
      <ModernInfoBox type="success">
        🌱 Ekologický dopad: Vaše rozhodnutí zvýšit podíl MHD přispěla k úspoře {co2Saved} kg CO₂ oproti čistě automobilové dopravě. 
        To odpovídá absorpci CO₂ jedním stromem za 4 měsíce.
      </ModernInfoBox>

      {/* Weekly Breakdown */}
      <ModernSection title="📋 Týdenní detailní přehled">
        <ModernTable
          headers={['Týden', 'Automobil (km)', 'MHD (km)', 'Celkem (km)', 'Náklady (Kč)', 'Efektivita']}
          data={weeklyData}
        />
      </ModernSection>

      {/* Optimization Recommendations */}
      <ModernSection title="💡 Doporučení pro optimalizaci">
        <ModernTable
          headers={['Doporučení', 'Potenciální přínos']}
          data={recommendations}
        />
      </ModernSection>

      {/* Summary */}
      <ModernInfoBox>
        📈 Shrnutí: Váš současný mix dopravy je {mhdPercent}% ekologický. Optimalizací můžete dosáhnout až 20% úspory nákladů při zachování komfortu dojíždění.
      </ModernInfoBox>
    </ModernPDFTemplate>
  );
};

export const generateModernCommuteDocument = async (): Promise<Blob> => {
  const blob = await pdf(<ModernCommuteDocument />).toBlob();
  return blob;
};

export const downloadModernCommuteDocument = async (): Promise<void> => {
  const blob = await generateModernCommuteDocument();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `PendlerApp_Analyza_Dojizdeni_${new Date().toISOString().slice(0, 7)}_modern.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
