
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RentalTypes = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Rozlišení mezi Kaltmiete a Warmmiete</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Kaltmiete (studený nájem)</h3>
            <p>Základní nájemné bez poplatků za služby. Zahrnuje pouze užívání nemovitosti a společných prostor. Pronajímatel musí uvést výši studeného nájmu samostatně.</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Warmmiete (teplý nájem)</h3>
            <p>Celková částka zahrnující základní nájemné a zálohy na služby (Nebenkosten). Služby obvykle zahrnují topení, teplou vodu, správu budovy, úklid společných prostor, odvoz odpadu a další.</p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="font-medium">Příklad rozpisu nákladů:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Kaltmiete: 700 € (základní nájemné)</li>
            <li>Topení a teplá voda: 80 €</li>
            <li>Správa nemovitosti: 30 €</li>
            <li>Odvoz odpadu: 25 €</li>
            <li>Vodné a stočné: 40 €</li>
            <li>Ostatní služby: 25 €</li>
            <li><strong>Warmmiete celkem: 900 €</strong></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
