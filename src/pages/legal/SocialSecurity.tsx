
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileCheck, AlertTriangle, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Helmet } from "react-helmet";

const SocialSecurity = () => {
  return (
    <PremiumCheck featureKey="legal-assistant">
      <div className="flex flex-col">
        <Helmet>
          <title>Sociální zabezpečení | Právní asistent</title>
        </Helmet>
        
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4">
            <Link to="/legal-assistant" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Zpět na Právní asistenta
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <FileCheck className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Sociální zabezpečení pro pendlery</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Průvodce systémem sociálního zabezpečení pro přeshraniční pracovníky mezi ČR a Německem.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Základní principy sociálního zabezpečení</CardTitle>
                <CardDescription>Který stát je odpovědný za sociální zabezpečení pendlerů</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Pro přeshraniční pracovníky platí princip <strong>jednotnosti právního systému sociálního zabezpečení</strong>. 
                  To znamená, že jako pendler byste měli být účastni systému sociálního zabezpečení pouze v jednom státě, 
                  i když pracujete v jiném státě, než ve kterém máte bydliště.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <h3 className="text-lg font-semibold mb-2">Hlavní pravidlo</h3>
                  <p>Jako přeshraniční pracovník budete zpravidla pojištěni v zemi, kde <strong>vykonáváte pracovní činnost</strong> (tedy v Německu), i když máte bydliště v České republice.</p>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Složky sociálního zabezpečení</h3>
                <ul className="list-disc pl-5 space-y-3 mb-6">
                  <li>
                    <strong>Zdravotní pojištění</strong> (Krankenversicherung) - pokrývá náklady na zdravotní péči
                  </li>
                  <li>
                    <strong>Důchodové pojištění</strong> (Rentenversicherung) - zajišťuje starobní důchod
                  </li>
                  <li>
                    <strong>Pojištění pro případ nezaměstnanosti</strong> (Arbeitslosenversicherung) - poskytuje podporu v nezaměstnanosti
                  </li>
                  <li>
                    <strong>Pojištění dlouhodobé péče</strong> (Pflegeversicherung) - kryje náklady na dlouhodobou péči
                  </li>
                  <li>
                    <strong>Úrazové pojištění</strong> (Unfallversicherung) - kryje pracovní úrazy a nemoci z povolání
                  </li>
                </ul>
                
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                    <p>
                      Formulář A1 je klíčový dokument, který potvrzuje, ve kterém státě jste účastni systému sociálního zabezpečení. 
                      Tento formulář vám vydá Česká správa sociálního zabezpečení, pokud na základě výjimky platíte pojištění v ČR, 
                      nebo jej můžete obdržet od německého úřadu, pokud jste pojištěni v Německu.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Specifika pro pendlery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Výjimky z hlavního pravidla</h3>
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <h4 className="font-medium mb-1">1. Práce ve více zemích</h4>
                      <p className="text-sm">Pokud pracujete jak v Německu, tak v České republice, vztahují se na vás speciální pravidla:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                        <li>Pokud vykonáváte <strong>podstatnou část</strong> (alespoň 25 %) své činnosti v zemi bydliště (ČR), budete podléhat českému systému sociálního zabezpečení pro všechny vaše činnosti.</li>
                        <li>Pokud pracujete pro jednoho zaměstnavatele ve více zemích, ale nevykonáváte podstatnou část v zemi bydliště, budete pojištěni v zemi sídla vašeho zaměstnavatele.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-md">
                      <h4 className="font-medium mb-1">2. Vyslání pracovníka</h4>
                      <p className="text-sm">Pokud vás český zaměstnavatel dočasně vyšle pracovat do Německa na dobu nepřesahující 24 měsíců, můžete zůstat účastníkem českého systému sociálního zabezpečení.</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold">Výše odvodů v Německu (2025)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Typ pojištění</th>
                          <th className="text-right py-2">Sazba</th>
                          <th className="text-right py-2">Zaměstnanec platí</th>
                          <th className="text-right py-2">Zaměstnavatel platí</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Zdravotní pojištění</td>
                          <td className="text-right py-2">14,6% + příplatek</td>
                          <td className="text-right py-2">7,3% + příplatek</td>
                          <td className="text-right py-2">7,3%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Důchodové pojištění</td>
                          <td className="text-right py-2">18,6%</td>
                          <td className="text-right py-2">9,3%</td>
                          <td className="text-right py-2">9,3%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Pojištění pro případ nezaměstnanosti</td>
                          <td className="text-right py-2">2,6%</td>
                          <td className="text-right py-2">1,3%</td>
                          <td className="text-right py-2">1,3%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Pojištění dlouhodobé péče</td>
                          <td className="text-right py-2">3,4%</td>
                          <td className="text-right py-2">1,7%</td>
                          <td className="text-right py-2">1,7%</td>
                        </tr>
                        <tr>
                          <td className="py-2">Úrazové pojištění</td>
                          <td className="text-right py-2">variabilní</td>
                          <td className="text-right py-2">0%</td>
                          <td className="text-right py-2">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground">* Příplatek ke zdravotnímu pojištění se liší podle zdravotní pojišťovny, průměrně činí 1,3%. Pro bezdětné osoby starší 23 let se navyšuje pojistné na dlouhodobou péči o 0,35%.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Praktické kroky pro pendlery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Jak postupovat při nástupu do práce v Německu
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Požádejte zaměstnavatele o registraci do systému sociálního pojištění (Anmeldung zur Sozialversicherung).</li>
                      <li>Vyberte si německou zdravotní pojišťovnu (Krankenkasse). Ta bude koordinovat všechny odvody sociálního pojištění.</li>
                      <li>Získejte číslo sociálního pojištění (Sozialversicherungsnummer) a průkaz pojištěnce.</li>
                      <li>Pokud máte rodinu v ČR, informujte se o možnosti jejich pojištění jako rodinných příslušníků.</li>
                      <li>Jestliže se na vás vztahuje výjimka, požádejte o formulář A1.</li>
                    </ol>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Dokumenty, které budete potřebovat
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Občanský průkaz nebo cestovní pas</strong> - pro potvrzení vaší totožnosti</li>
                      <li><strong>Potvrzení o bydlišti</strong> - pro doložení vašeho místa pobytu</li>
                      <li><strong>Pracovní smlouva</strong> - pro doložení vašeho zaměstnání</li>
                      <li><strong>Formulář A1</strong> - pokud na vás vztahuje některá z výjimek</li>
                      <li><strong>Evropský průkaz zdravotního pojištění (EHIC)</strong> - pro potřebu zdravotní péče v jiných zemích EU</li>
                    </ul>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Co dělat při ukončení pracovního poměru v Německu
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Informujte svou německou zdravotní pojišťovnu o ukončení zaměstnání.</li>
                      <li>Požádejte o výpis doby pojištění pro důchodové účely.</li>
                      <li>Pokud se vracíte do ČR, registrujte se u české zdravotní pojišťovny a na úřadu práce (pokud hledáte nové zaměstnání).</li>
                      <li>Můžete mít nárok na německou podporu v nezaměstnanosti, pokud jste v Německu pracovali a platili odvody dostatečně dlouho.</li>
                    </ul>
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
              <a href="https://www.deutsche-rentenversicherung.de/DRV/DE/Ueber-uns-und-Presse/Presse/002_fremdsprachenmedien/fremdsprachenmedien/fremdsprachenmedien_detail.html?cms_gtp=1019496_Dokumente%253D1" target="_blank" rel="noopener noreferrer">
                <Button>
                  Oficiální informace Deutsche Rentenversicherung
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </PremiumCheck>
  );
};

export default SocialSecurity;
