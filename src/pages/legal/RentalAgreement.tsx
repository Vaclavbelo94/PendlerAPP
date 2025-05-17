
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, Scale, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Helmet } from "react-helmet";

const RentalAgreement = () => {
  return (
    <PremiumCheck featureKey="legal_documents">
      <div className="flex flex-col">
        <Helmet>
          <title>Nájemní smlouva | Právní asistent</title>
        </Helmet>
        
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4">
            <Link to="/legal-assistant" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Zpět na Právní asistenta
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <Home className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Nájemní smlouva v Německu</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Co by měla obsahovat nájemní smlouva v Německu a na co si dát pozor před podpisem.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
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
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Práva a povinnosti nájemce</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-green-700">
                      <Scale className="h-5 w-5 mr-2" />
                      Práva nájemce
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Právo na klidné užívání pronajatého prostoru</li>
                      <li>Právo na včasné řešení závad ze strany pronajímatele</li>
                      <li>Právo na ochranu před bezdůvodným zvyšováním nájemného</li>
                      <li>Právo na vrácení kauce při řádném ukončení nájmu</li>
                      <li>Právo na každoroční vyúčtování služeb</li>
                      <li>Právo na ochranu před neoprávněnou výpovědí</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-red-700">
                      <FileText className="h-5 w-5 mr-2" />
                      Povinnosti nájemce
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Včasné placení nájemného a záloh na služby</li>
                      <li>Užívání prostoru v souladu se smlouvou</li>
                      <li>Dodržování domovního řádu</li>
                      <li>Hlášení závad pronajímateli</li>
                      <li>Umožnění přístupu pronajímateli v odůvodněných případech</li>
                      <li>Drobné opravy a údržba (podle smlouvy)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
            
            <div className="flex justify-between items-center mt-8">
              <Link to="/legal-assistant">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Zpět na Právní asistenta
                </Button>
              </Link>
              <a href="https://www.mieterbund.de" target="_blank" rel="noopener noreferrer">
                <Button>
                  Oficiální zdroj informací
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </PremiumCheck>
  );
};

export default RentalAgreement;
