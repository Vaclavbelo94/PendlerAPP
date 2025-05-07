
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const MinimumWage = () => {
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
            <h1 className="text-4xl font-bold">Minimální mzda v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Podrobné informace o aktuální výši minimální mzdy v Německu, její historii a na koho se vztahuje.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Aktuální výše minimální mzdy</CardTitle>
              <CardDescription>Platné od 1. ledna 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary-50 p-6 rounded-md mb-6 flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Minimální mzda v Německu činí</p>
                  <p className="text-4xl font-bold text-primary">12,00 € / hodina</p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="text-sm text-muted-foreground">Měsíčně při plném úvazku (40 hod. týdně)</p>
                  <p className="text-2xl font-semibold">přibližně 2.080 €</p>
                </div>
              </div>
              
              <p className="mb-4">
                Od 1. ledna 2023 činí zákonná minimální mzda v Německu 12,00 € za hodinu. Tato sazba se vztahuje na všechny zaměstnance pracující v Německu, bez ohledu na to, zda je zaměstnavatel německá společnost nebo zahraniční firma.
              </p>
              
              <p className="mb-4">
                Minimální mzda platí pro všechny zaměstnance starší 18 let. Pro mladistvé do 18 let bez dokončeného odborného vzdělání mohou platit výjimky.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Vývoj německé minimální mzdy</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Období</th>
                    <th className="text-right py-2">Minimální mzda (€/h)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">od 01.01.2023</td>
                    <td className="text-right py-2">12,00 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">01.07.2022 - 31.12.2022</td>
                    <td className="text-right py-2">10,45 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">01.01.2022 - 30.06.2022</td>
                    <td className="text-right py-2">9,82 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">01.01.2021 - 31.12.2021</td>
                    <td className="text-right py-2">9,50 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">01.01.2020 - 31.12.2020</td>
                    <td className="text-right py-2">9,35 €</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Na koho se minimální mzda vztahuje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Minimální mzda se vztahuje na všechny zaměstnance pracující na území Německa, včetně:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Zaměstnanců na plný úvazek</li>
                <li>Zaměstnanců na částečný úvazek</li>
                <li>Zaměstnanců s mini-jobs (Minijobs) - dříve "450€ Jobs", nyní "520€ Jobs"</li>
                <li>Sezónních pracovníků</li>
                <li>Zahraničních pracovníků vykonávajících práci v Německu</li>
                <li>Praktikantů (s výjimkami pro povinné praxe vyplývající ze školních nebo studijních programů)</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Výjimky z minimální mzdy</h3>
              <p className="mb-2">Minimální mzda se nevztahuje na:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Mladistvé do 18 let bez dokončeného odborného vzdělání</li>
                <li>Učně během odborné přípravy</li>
                <li>Dlouhodobě nezaměstnané (déle než 12 měsíců) - během prvních 6 měsíců nového zaměstnání</li>
                <li>Povinné stáže v rámci vzdělávání nebo studia</li>
                <li>Dobrovolnické stáže trvající méně než 3 měsíce</li>
                <li>OSVČ (samostatně výdělečné osoby)</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Kontrola dodržování minimální mzdy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Za kontrolu dodržování minimální mzdy je zodpovědný německý celní úřad (Zoll). Zaměstnavatelé, kteří neplatí minimální mzdu, mohou dostat pokutu až do výše 500 000 €.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Co dělat, pokud nedostáváte minimální mzdu?</h3>
              <p className="mb-4">
                Pokud jako zaměstnanec nedostáváte minimální mzdu, máte několik možností:
              </p>
              
              <ol className="list-decimal pl-5 space-y-2 mb-6">
                <li>Obraťte se na svého zaměstnavatele a upozorněte ho na porušení zákona.</li>
                <li>Kontaktujte Finanční kontrolu nelegálního zaměstnávání (FKS) při celním úřadu.</li>
                <li>Poraďte se s odborovou organizací nebo právníkem specializujícím se na pracovní právo.</li>
                <li>Podejte žalobu u pracovního soudu (Arbeitsgericht) - nárok na doplacení minimální mzdy je možné uplatnit až 3 roky zpětně.</li>
              </ol>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Důležité upozornění:</p>
                <p>Odmítnutí práce za nižší než minimální mzdu není důvodem k výpovědi. Pokud vám zaměstnavatel z tohoto důvodu dá výpověď, je neplatná.</p>
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
            <a href="https://www.bundesregierung.de/breg-de/themen/mindestlohn" target="_blank" rel="noopener noreferrer">
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

export default MinimumWage;
