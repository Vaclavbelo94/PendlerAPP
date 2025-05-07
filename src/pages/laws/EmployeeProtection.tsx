
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeProtection = () => {
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
            <h1 className="text-4xl font-bold">Ochrana zaměstnanců v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Práva a povinnosti zaměstnanců, ochrana před výpovědí a další prvky ochrany pracovníků.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pracovní doba a odpočinek</CardTitle>
              <CardDescription>Zákonná úprava pracovní doby v Německu</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Maximální pracovní doba</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>8 hodin denně, může být prodloužena až na 10 hodin, pokud je v průměru za 6 měsíců dodržen 8hodinový limit.</li>
                <li>Maximálně 48 hodin týdně.</li>
                <li>Minimální přestávka 30 minut při práci 6 až 9 hodin, 45 minut při práci nad 9 hodin.</li>
                <li>Mezi koncem jedné směny a začátkem další musí být minimálně 11 hodin odpočinku.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Práce v neděli a o svátcích</h3>
              <p className="mb-4">
                V Německu je obecně zakázána práce v neděli a o státních svátcích, s výjimkou:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Pohotovostních služeb (nemocnice, policie, hasiči)</li>
                <li>Gastronomie a hotelnictví</li>
                <li>Dopravy a souvisejících služeb</li>
                <li>Výroby s nepřetržitým provozem</li>
                <li>Dalších výjimek povolených zákonem</li>
              </ul>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="font-medium">Pro pendlery:</p>
                <p>I když jste pendler, vztahují se na vás německé předpisy o pracovní době. Doba strávená dojížděním se nepočítá do pracovní doby, pokud během ní nevykonáváte práci nebo nejste v pohotovosti.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ochrana před výpovědí</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Německý zákon o ochraně před výpovědí (Kündigungsschutzgesetz) poskytuje zaměstnancům významnou ochranu, zejména po uplynutí zkušební doby.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Koho se ochrana týká</h3>
              <p className="mb-2">
                Ochrana před výpovědí se vztahuje na zaměstnance:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Kteří jsou zaměstnáni déle než 6 měsíců bez přerušení</li>
                <li>Pracující v podnicích s více než 10 zaměstnanci</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Důvody pro výpověď</h3>
              <p className="mb-2">
                Zaměstnavatel může dát zaměstnanci výpověď pouze z těchto důvodů:
              </p>
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>Důvody související s osobou zaměstnance</strong>
                  <p className="mt-1">Například dlouhodobá nemoc, ztráta pracovního povolení nebo řidičského průkazu potřebného pro výkon práce.</p>
                </li>
                <li>
                  <strong>Důvody související s chováním zaměstnance</strong>
                  <p className="mt-1">Například opakované porušování pracovních povinností, neomluvené absence, krádeže. V těchto případech musí obvykle předcházet výpovědi písemné napomenutí.</p>
                </li>
                <li>
                  <strong>Provozní důvody</strong>
                  <p className="mt-1">Například rušení pracovních míst z ekonomických důvodů, ukončení určité činnosti podniku. V případě výpovědi z provozních důvodů musí zaměstnavatel provést tzv. sociální výběr (Sozialauswahl), kdy zohledňuje sociální kritéria jako věk, délku zaměstnání, vyživovací povinnosti a případné zdravotní postižení.</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Zvláštní ochrana</h3>
              <p className="mb-2">
                Zvýšenou ochranu před výpovědí mají:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Těhotné ženy a matky až do 4 měsíců po porodu</li>
                <li>Zaměstnanci na rodičovské dovolené</li>
                <li>Osoby se zdravotním postižením</li>
                <li>Členové podnikové rady (Betriebsrat)</li>
                <li>Učni během odborného vzdělávání</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Co dělat, když dostanete výpověď:</p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Překontrolujte, zda je výpověď v písemné formě (jinak je neplatná).</li>
                  <li>Pokud nesouhlasíte s výpovědí, můžete podat žalobu na její neplatnost u pracovního soudu (Arbeitsgericht) do 3 týdnů od doručení výpovědi.</li>
                  <li>Poraďte se s odborovou organizací nebo právníkem specializovaným na pracovní právo.</li>
                  <li>Registrujte se na úřadu práce (Agentur für Arbeit) nejpozději 3 dny po obdržení výpovědi.</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Další práva zaměstnanců</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Dovolená</h3>
              <p className="mb-4">
                Každý zaměstnanec má podle zákona nárok na minimálně 20 pracovních dní placené dovolené za rok při pětidenním pracovním týdnu (24 dní při šestidenním týdnu). Většina zaměstnavatelů poskytuje více dní dovolené, obvykle 25-30 dní.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Nemocenská</h3>
              <p className="mb-4">
                V případě nemoci má zaměstnanec nárok na pokračování vyplácení mzdy po dobu 6 týdnů v plné výši. Po této době přechází na nemocenské dávky od zdravotní pojišťovny (70 % hrubé mzdy, max. 90 % čisté mzdy).
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Podniková rada (Betriebsrat)</h3>
              <p className="mb-4">
                V podnicích s minimálně 5 zaměstnanci mají pracovníci právo zvolit podnikovou radu. Ta zastupuje zájmy zaměstnanců a má řadu oprávnění:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Spolurozhodovat při pracovní době, dovolených, zásadách odměňování</li>
                <li>Být informována a konzultována při výpovědích</li>
                <li>Dohlížet na dodržování zákonů a kolektivních smluv</li>
                <li>Účastnit se přijímacích pohovorů</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Diskriminace na pracovišti</h3>
              <p className="mb-4">
                Německý Všeobecný zákon o rovném zacházení (Allgemeines Gleichbehandlungsgesetz, AGG) zakazuje diskriminaci na základě:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Rasového nebo etnického původu</li>
                <li>Pohlaví</li>
                <li>Náboženství nebo světového názoru</li>
                <li>Zdravotního postižení</li>
                <li>Věku</li>
                <li>Sexuální identity</li>
              </ul>
              
              <div className="bg-green-50 p-4 rounded-md">
                <p className="font-medium">Rada pro pendlery:</p>
                <p className="mb-2">I když pracujete v Německu jako pendler, máte stejná práva jako němečtí zaměstnanci. Pokud se setkáte s diskriminací nebo porušováním práv:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Zdokumentujte veškeré případy porušování vašich práv.</li>
                  <li>Obraťte se na podnikovou radu, pokud existuje.</li>
                  <li>Kontaktujte odborovou organizaci ve vašem odvětví.</li>
                  <li>V případě vážnějších porušení se poraďte s právníkem nebo se obraťte na inspektorát práce (Gewerbeaufsichtsamt).</li>
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
            <a href="https://www.bmas.de/DE/Arbeit/Arbeitsrecht/arbeitsrecht.html" target="_blank" rel="noopener noreferrer">
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

export default EmployeeProtection;
