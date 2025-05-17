
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scale, FileText, FileCheck, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Helmet } from "react-helmet";

const LegalStatus = () => {
  return (
    <PremiumCheck featureKey="legal-assistant">
      <div className="flex flex-col">
        <Helmet>
          <title>Právní postavení pendlerů | Právní asistent</title>
        </Helmet>
        
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4">
            <Link to="/legal-assistant" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Zpět na Právní asistenta
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <Scale className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Právní postavení pendlerů</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Právní status přeshraničních pracovníků v Německu a související práva a povinnosti.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Právní definice přeshraničního pracovníka</CardTitle>
                <CardDescription>Kdo je považován za pendlera dle evropských a německých zákonů</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Přeshraniční pracovník neboli pendler je osoba, která pracuje v jednom členském státě EU 
                  (v tomto případě Německo), ale bydlí v jiném státě (např. Česká republika), kam se vrací 
                  alespoň jednou týdně.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Hlavní kritéria pro status pendlera</h3>
                <ul className="list-disc pl-5 space-y-3 mb-8">
                  <li>
                    <strong>Bydliště v jedné zemi</strong> - trvalé bydliště v České republice
                  </li>
                  <li>
                    <strong>Zaměstnání v jiné zemi</strong> - pracovní poměr v Německu
                  </li>
                  <li>
                    <strong>Pravidelné návraty</strong> - návrat do země bydliště minimálně jednou týdně
                  </li>
                  <li>
                    <strong>Daňová rezidence</strong> - obvykle zůstává v zemi bydliště, ale závisí na konkrétních mezinárodních smlouvách a národních předpisech
                  </li>
                </ul>
                
                <div className="bg-yellow-50 p-4 rounded-md mb-6">
                  <p className="font-medium">Důležité upozornění:</p>
                  <p>Status pendlera ovlivňuje vaše daňové povinnosti, sociální zabezpečení a zdravotní pojištění. Informujte se vždy u příslušných úřadů o aktuálních pravidlech.</p>
                </div>

                <h3 className="text-lg font-semibold mb-3">Právní rámec</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Nařízení EU č. 883/2004 o koordinaci systémů sociálního zabezpečení</li>
                  <li>Nařízení EU č. 492/2011 o volném pohybu pracovníků</li>
                  <li>Dvoustranná smlouva mezi Českou republikou a Německem o zamezení dvojího zdanění</li>
                  <li>Německý zákon o dani z příjmu (Einkommensteuergesetz)</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Práva přeshraničních pracovníků</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FileCheck className="h-5 w-5 mr-2 text-blue-700" />
                      Rovné zacházení
                    </h3>
                    <p>Jako pendler máte nárok na stejné pracovní podmínky, platy a sociální výhody jako němečtí občané. Nesmí docházet k žádné diskriminaci na základě státní příslušnosti.</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FileCheck className="h-5 w-5 mr-2 text-blue-700" />
                      Sociální zabezpečení
                    </h3>
                    <p>Jako pendler budete zpravidla účastni systému sociálního zabezpečení v zemi, kde pracujete (Německo). To zahrnuje důchodové pojištění, pojištění pro případ nezaměstnanosti a zdravotní pojištění. Je však důležité mít formulář A1 pro potvrzení, kde platíte sociální pojištění.</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FileCheck className="h-5 w-5 mr-2 text-blue-700" />
                      Daňové aspekty
                    </h3>
                    <p>Daňové povinnosti se řídí smlouvou o zamezení dvojího zdanění. Obvykle platíte daň z příjmu v zemi, kde pracujete (Německo), ale může dojít k různým úpravám v závislosti na vašich konkrétních okolnostech.</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <FileCheck className="h-5 w-5 mr-2 text-blue-700" />
                      Rodinné dávky
                    </h3>
                    <p>Máte nárok na rodinné dávky (Kindergeld) v Německu, i když vaše děti žijí v České republice. V případě, že máte nárok na dávky v obou zemích, existují pravidla, která určují, která země je primárně odpovědná za jejich vyplácení.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Specifické dokumenty pro pendlery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Jako přeshraniční pracovník byste měli mít následující dokumenty:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Formulář A1</h3>
                    <p>Potvrzuje, ve kterém státě jste účastni systému sociálního zabezpečení. Tento dokument vydává Česká správa sociálního zabezpečení a měli byste jej mít vždy k dispozici.</p>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Evropský průkaz zdravotního pojištění (EHIC)</h3>
                    <p>I když budete zdravotně pojištěni v Německu, je dobré mít tento průkaz pro případ potřeby zdravotní péče během pobytu v jiných zemích EU.</p>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Grenzgängerbescheinigung</h3>
                    <p>Potvrzení o statusu přeshraničního pracovníka, které může být vyžadováno německými úřady nebo zaměstnavatelem.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Časté problémy a jejich řešení</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex p-4 rounded-md border border-amber-200 bg-amber-50">
                    <AlertCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Dvojí zdanění</h3>
                      <p className="text-sm mt-1">Pokud vám hrozí riziko dvojího zdanění, kontaktujte daňového poradce se znalostí mezinárodního práva a smluv o zamezení dvojího zdanění mezi ČR a Německem.</p>
                    </div>
                  </div>
                  
                  <div className="flex p-4 rounded-md border border-amber-200 bg-amber-50">
                    <AlertCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Nesprávné zařazení do systému sociálního zabezpečení</h3>
                      <p className="text-sm mt-1">V případě pochybností o správném zařazení do systému sociálního zabezpečení se obraťte na Českou správu sociálního zabezpečení pro vystavení formuláře A1.</p>
                    </div>
                  </div>
                  
                  <div className="flex p-4 rounded-md border border-amber-200 bg-amber-50">
                    <AlertCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Diskriminace na pracovišti</h3>
                      <p className="text-sm mt-1">Pokud se setkáte s diskriminací na základě své národnosti, máte právo obrátit se na pracovněprávní poradnu nebo podat stížnost u příslušného německého úřadu pro rovné zacházení (Antidiskriminierungsstelle des Bundes).</p>
                    </div>
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
              <a href="https://europa.eu/youreurope/citizens/work/work-abroad/cross-border-commuters/" target="_blank" rel="noopener noreferrer">
                <Button>
                  Oficiální zdroj informací EU
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </PremiumCheck>
  );
};

export default LegalStatus;
