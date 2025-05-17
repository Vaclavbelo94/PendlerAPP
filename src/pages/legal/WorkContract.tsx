
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FilePen, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Helmet } from "react-helmet";

const WorkContractGuide = () => {
  return (
    <PremiumCheck featureKey="legal-assistant">
      <div className="flex flex-col">
        <Helmet>
          <title>Pracovní smlouva | Právní asistent</title>
        </Helmet>
        
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4">
            <Link to="/legal-assistant" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Zpět na Právní asistenta
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <FilePen className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Pracovní smlouva v Německu</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Podrobný průvodce náležitostmi pracovní smlouvy v Německu a na co si dát pozor před podpisem.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Obsah pracovní smlouvy</CardTitle>
                <CardDescription>Povinné a doporučené součásti pracovní smlouvy v Německu</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Pracovní smlouva (Arbeitsvertrag) v Německu je základ pracovněprávního vztahu. I když německé právo umožňuje i ústní pracovní smlouvy, vždy je lepší mít smlouvu v písemné podobě.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Povinné náležitosti pracovní smlouvy</h3>
                <ul className="list-disc pl-5 space-y-3 mb-8">
                  <li>
                    <strong>Jména a adresy</strong> - identifikace zaměstnavatele a zaměstnance
                  </li>
                  <li>
                    <strong>Datum zahájení</strong> - přesné datum nástupu do práce
                  </li>
                  <li>
                    <strong>Popis pracovní pozice</strong> - náplň práce a odpovědnosti
                  </li>
                  <li>
                    <strong>Místo výkonu práce</strong> - adresa pracoviště
                  </li>
                  <li>
                    <strong>Výše mzdy</strong> - hrubá mzda, benefity, způsob a termín výplaty
                  </li>
                  <li>
                    <strong>Pracovní doba</strong> - počet hodin týdně, rozvržení práce
                  </li>
                  <li>
                    <strong>Dovolená</strong> - počet dní dovolené (minimálně 20 dní při 5 pracovních dnech týdně)
                  </li>
                  <li>
                    <strong>Výpovědní lhůty</strong> - pro obě strany
                  </li>
                </ul>
                
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="font-medium">Důležité upozornění:</p>
                  <p>Vždy si nechte pracovní smlouvu přeložit, pokud neovládáte němčinu na vysoké úrovni. Jakékoliv nejasnosti konzultujte s právním poradcem.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Zkušební doba a pracovní poměr na dobu určitou</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Zkušební doba (Probezeit)</h3>
                    <p>Zkušební doba může trvat maximálně 6 měsíců. Během zkušební doby může být pracovní poměr ukončen s výpovědní lhůtou 2 týdny, pokud není ve smlouvě stanoveno jinak. Není povinná, ale v Německu je velmi běžná.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Pracovní poměr na dobu určitou</h3>
                    <p>Pracovní poměr na dobu určitou (befristeter Arbeitsvertrag) může být sjednán maximálně na 2 roky bez uvedení důvodu a může být prodloužen až třikrát v rámci této doby. Po 2 letech musí zaměstnavatel uvést zákonný důvod pro další prodloužení na dobu určitou.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Daňové aspekty a sociální zabezpečení</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Pracovní smlouva by měla obsahovat také informace o:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Daňová třída (Steuerklasse)</h3>
                    <p>V Německu existuje 6 daňových tříd, které ovlivňují výši zdanění. Pro pendlery je důležitá informace, že pokud v Německu nevydělávají aspoň 90% celkových příjmů, obvykle spadají do daňové třídy I.</p>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Sociální pojištění</h3>
                    <p>Ze mzdy se automaticky odvádí příspěvky na sociální pojištění (cca 20% z hrubé mzdy). To zahrnuje zdravotní pojištění, důchodové pojištění, pojištění pro případ nezaměstnanosti a pojištění dlouhodobé péče.</p>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">A1 formulář pro přeshraniční pracovníky</h3>
                    <p>Pendleři by měli mít vyřízený A1 formulář, který potvrzuje, v které zemi platí sociální pojištění, aby se předešlo dvojímu odvodu pojistného.</p>
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
              <a href="https://www.arbeitsrechte.de/arbeitsvertrag/" target="_blank" rel="noopener noreferrer">
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

export default WorkContractGuide;
