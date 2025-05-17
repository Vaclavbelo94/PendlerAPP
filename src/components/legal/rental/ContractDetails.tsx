
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ContractDetails = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Náležitosti nájemní smlouvy</CardTitle>
        <CardDescription>Povinné součásti nájemní smlouvy podle německého práva</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-6">
          Nájemní smlouva (Mietvertrag) v Německu upravuje vztah mezi pronajímatelem a nájemcem. Německé právo poskytuje nájemcům poměrně silnou ochranu, proto je důležité znát svá práva a povinnosti.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">Povinné náležitosti nájemní smlouvy</h3>
        <ul className="list-disc pl-5 space-y-3 mb-8">
          <li>
            <strong>Identifikace smluvních stran</strong> - jména a adresy pronajímatele a nájemce
          </li>
          <li>
            <strong>Popis nemovitosti</strong> - přesná adresa, velikost bytu v m², počet místností
          </li>
          <li>
            <strong>Doba nájmu</strong> - zda se jedná o nájem na dobu určitou nebo neurčitou
          </li>
          <li>
            <strong>Výše nájemného</strong> - částka, způsob a termín platby
          </li>
          <li>
            <strong>Poplatky za služby</strong> - Nebenkosten (topení, voda, odvoz odpadu atd.)
          </li>
          <li>
            <strong>Výše kauce</strong> - Kaution (maximálně 3 měsíční nájmy)
          </li>
          <li>
            <strong>Předávací protokol</strong> - Übergabeprotokoll (stav bytu při nastěhování)
          </li>
          <li>
            <strong>Pravidla pro užívání</strong> - domovní řád, možnost chovat zvířata atd.
          </li>
          <li>
            <strong>Podmínky pro výpověď</strong> - výpovědní lhůty pro obě strany
          </li>
        </ul>
        
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="font-medium">Důležité upozornění:</p>
          <p>Vždy si vyžádejte písemnou smlouvu a pečlivě ji prostudujte. Pokud jste začátečníci v němčině, nechte si ji přeložit nebo využijte služeb právního poradce.</p>
        </div>
      </CardContent>
    </Card>
  );
};
