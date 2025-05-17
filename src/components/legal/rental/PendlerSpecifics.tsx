
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PendlerSpecifics = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Specifika pro pendlery</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Jako pendler pracující v Německu můžete zvážit několik specifických aspektů při hledání ubytování:
        </p>
        
        <div className="space-y-4">
          <div className="bg-primary-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Zweitwohnsitz (druhé bydliště)</h3>
            <p>Pokud si v Německu pronajímáte byt jako druhé bydliště, musíte jej zaregistrovat na místním úřadě (Einwohnermeldeamt). V některých městech se platí daň z druhého bydliště (Zweitwohnsitzsteuer).</p>
          </div>
          
          <div className="bg-primary-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Wochenendpendler (víkendový pendler)</h3>
            <p>Pro pendlery, kteří tráví v Německu jen pracovní dny, může být výhodnější hledat menší byt, sdílené bydlení (WG - Wohngemeinschaft) nebo pokoj v ubytovně.</p>
          </div>
          
          <div className="bg-primary-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Daňové aspekty</h3>
            <p>Náklady na druhé bydliště můžete za určitých podmínek odečíst od daňového základu. Uschovávejte si doklady o platbách nájmu a cestovní výdaje mezi oběma bydlišti.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
