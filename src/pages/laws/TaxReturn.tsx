
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const TaxReturn = () => {
  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          <Link to="/laws" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Zpět na seznam zákonů
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Daňové přiznání v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Jak správně podat daňové přiznání v Německu a co všechno můžete uplatnit jako pendler.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Základní informace o daňovém přiznání</CardTitle>
              <CardDescription>Einkommensteuererklärung v Německu</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Daňové přiznání v Německu (Einkommensteuererklärung) je pro zaměstnance většinou dobrovolné, ale v mnoha případech výhodné. Pro některé skupiny osob je však povinné.
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Kdy je podání daňového přiznání povinné</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Máte-li příjmy z více zdrojů (např. kromě zaměstnání máte příjmy z podnikání)</li>
                <li>Pobíráte-li náhradu mzdy (např. rodičovský příspěvek, podpora v nezaměstnanosti)</li>
                <li>Máte-li daňovou třídu V nebo VI</li>
                <li>Pracují-li oba manželé a mají kombinaci daňových tříd III a V</li>
                <li>Máte-li vedlejší příjmy nad 410 € ročně</li>
                <li>Pracujete-li pro více zaměstnavatelů současně</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Termín pro podání daňového přiznání</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Pro povinné daňové přiznání: obvykle do 31. července následujícího roku (např. za rok 2022 do 31.7.2023)</li>
                <li>Při zastoupení daňovým poradcem: do 28./29. února druhého následujícího roku</li>
                <li>Pro dobrovolné daňové přiznání: až 4 roky zpětně</li>
              </ul>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="font-medium">Pro pendlery:</p>
                <p>Jako pendler pracující v Německu máte stejné daňové povinnosti jako němečtí pracovníci. Daně platíte v Německu, ale ve většině případů je výhodné podat daňové přiznání, protože můžete uplatnit náklady na dojíždění a další výdaje.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Možnost daňových odpočtů pro pendlery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Jako pendler máte možnost uplatnit řadu daňových odpočtů, které mohou výrazně snížit vaši daňovou povinnost:
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">1. Náklady na dojíždění (Entfernungspauschale)</h3>
              <p className="mb-4">
                Jedním z nejdůležitějších odpočtů pro pendlery jsou náklady na dojíždění:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>0,30 € za každý kilometr jednosměrné cesty do práce pro prvních 20 km</li>
                <li>0,38 € za každý kilometr jednosměrné cesty nad 20 km</li>
                <li>Počítá se nejkratší trasa mezi bydlištěm a pracovištěm, bez ohledu na skutečně použitý dopravní prostředek</li>
                <li>Uplatňuje se za každý pracovní den, kdy jste do práce dojížděli</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="font-medium">Příklad výpočtu:</p>
                <p>Pokud je vaše trasa do práce dlouhá 50 km jedním směrem a pracovali jste 220 dní v roce:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Prvních 20 km: 20 km × 0,30 € × 220 dní = 1 320 €</li>
                  <li>Zbývajících 30 km: 30 km × 0,38 € × 220 dní = 2 508 €</li>
                  <li>Celkem si můžete odečíst: 3 828 €</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">2. Pracovní pomůcky a vybavení (Arbeitsmittel)</h3>
              <p className="mb-2">Můžete si odečíst náklady na:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Pracovní oděvy a jejich údržbu</li>
                <li>Odbornou literaturu a vzdělávací materiály</li>
                <li>Počítač a software používaný pro práci</li>
                <li>Nářadí a speciální vybavení</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">3. Další odčitatelné položky specifické pro pendlery</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Náklady na druhé bydlení v Německu (pokud máte hlavní bydliště v ČR)</li>
                <li>Poplatky za daňové poradenství</li>
                <li>Náklady na zdravotní pojištění (nad rámec povinných odvodů)</li>
                <li>Náklady na jazykové kurzy němčiny (pokud jsou potřebné pro vaši práci)</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Jak podat daňové přiznání v Německu</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Možnosti podání daňového přiznání</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-primary-50 p-4 rounded-md">
                  <h4 className="font-medium mb-1">1. Elektronicky přes ELSTER</h4>
                  <p>ELSTER (Elektronische Steuererklärung) je oficiální online systém německé daňové správy. Je zdarma, ale vyžaduje registraci a certifikát.</p>
                  <a href="https://www.elster.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.elster.de</a>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h4 className="font-medium mb-1">2. Komerční daňový software</h4>
                  <p>Placené i bezplatné programy pro vyplnění daňového přiznání, např. WISO Steuer, Smartsteuer, Taxfix.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h4 className="font-medium mb-1">3. Prostřednictvím daňového poradce</h4>
                  <p>Nejpohodlnější, ale nejdražší varianta. Daňový poradce se postará o vše a může podat daňové přiznání s prodlouženou lhůtou.</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Potřebné doklady</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Roční zúčtování daně (Lohnsteuerbescheinigung) od zaměstnavatele</li>
                <li>Potvrzení o placení zdravotního a sociálního pojištění</li>
                <li>Doklady k odpočitatelným položkám (účty, potvrzení)</li>
                <li>Daňové identifikační číslo (Steueridentifikationsnummer)</li>
                <li>Číslo účtu pro případné vrácení daně</li>
              </ul>
              
              <div className="bg-green-50 p-4 rounded-md">
                <p className="font-medium">Praktické tipy pro pendlery:</p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Shromažďujte všechny relevantní účty a doklady během roku.</li>
                  <li>Veďte si evidenci pracovních dnů, kdy jste dojížděli do Německa.</li>
                  <li>Zvažte využití služeb daňového poradce, který má zkušenosti s přeshraničními pracovníky.</li>
                  <li>Nezapomeňte na daňové přiznání v České republice, kde budete deklarovat příjmy z Německa (ty jsou v ČR obvykle od daně osvobozeny, ale musí být přiznány).</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mt-8">
            <Link to="/laws">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Zpět na seznam zákonů
              </Button>
            </Link>
            <a href="https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Einkommensteuer/einkommensteuer.html" target="_blank" rel="noopener noreferrer">
              <Button>
                Oficiální zdroj informací
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxReturn;
