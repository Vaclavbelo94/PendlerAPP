
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const WorkContract = () => {
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
            <h1 className="text-4xl font-bold">Pracovní smlouva v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Co by měla obsahovat pracovní smlouva v Německu a na co si dát pozor před podpisem.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Náležitosti pracovní smlouvy</CardTitle>
              <CardDescription>Povinné součásti pracovní smlouvy podle německého práva</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Podle německého práva může být pracovní smlouva uzavřena i ústně, avšak zaměstnavatel má povinnost nejpozději jeden měsíc po nástupu do práce poskytnout zaměstnanci písemně základní podmínky pracovního poměru (Nachweisgesetz).
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Povinné náležitosti pracovní smlouvy</h3>
              <ul className="list-disc pl-5 space-y-3 mb-8">
                <li>
                  <strong>Jméno a adresa smluvních stran</strong> - úplné údaje o zaměstnavateli a zaměstnanci
                </li>
                <li>
                  <strong>Datum zahájení pracovního poměru</strong> - přesné datum nástupu do práce
                </li>
                <li>
                  <strong>Doba trvání pracovního poměru</strong> - zda se jedná o pracovní poměr na dobu určitou nebo neurčitou
                </li>
                <li>
                  <strong>Místo výkonu práce</strong> - adresa nebo místo, kde bude práce vykonávána
                </li>
                <li>
                  <strong>Popis pracovní pozice</strong> - náplň práce nebo stručný popis činností
                </li>
                <li>
                  <strong>Výše odměny</strong> - hrubá mzda nebo plat, včetně příplatků a bonusů
                </li>
                <li>
                  <strong>Pracovní doba</strong> - denní nebo týdenní pracovní doba
                </li>
                <li>
                  <strong>Délka dovolené</strong> - počet dní placené dovolené za rok
                </li>
                <li>
                  <strong>Výpovědní lhůty</strong> - podmínky a lhůty pro ukončení pracovního poměru
                </li>
                <li>
                  <strong>Odkaz na kolektivní smlouvy</strong> - pokud se na pracovní poměr vztahují
                </li>
              </ul>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="font-medium">Důležité upozornění:</p>
                <p>I když německé právo umožňuje uzavírat pracovní smlouvy ústně, vždy trvejte na písemné formě smlouvy. Chráníte tím své zájmy a předejdete případným sporům.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Druhy pracovních smluv</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Pracovní smlouva na dobu neurčitou (unbefristeter Arbeitsvertrag)</h3>
                  <p>Nejběžnější a pro zaměstnance nejvýhodnější typ smlouvy. Trvá do doby, než jedna ze stran podá výpověď. Poskytuje nejvyšší míru ochrany zaměstnance.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Pracovní smlouva na dobu určitou (befristeter Arbeitsvertrag)</h3>
                  <p>Uzavírá se na předem stanovené období. V Německu existují přísná pravidla pro řetězení smluv na dobu určitou - bez věcného důvodu lze smlouvu prodloužit maximálně třikrát v celkové době trvání až 2 roky.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Mini-job (Minijob)</h3>
                  <p>Pracovní poměr s nízkým příjmem do 520 € měsíčně (od října 2022). Zaměstnanec neplatí daně a odvody na sociální pojištění. Omezený počet hodin práce.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Midi-job (Midijob)</h3>
                  <p>Pracovní poměr s příjmem 520,01 € až 1.600 € měsíčně (od ledna 2023). Zaměstnanec platí snížené odvody na sociální pojištění.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Částečný úvazek (Teilzeit)</h3>
                  <p>Pracovní poměr s pracovní dobou kratší než je obvyklá týdenní pracovní doba. Zaměstnanci mají stejná práva jako zaměstnanci na plný úvazek, poměrně podle odpracované doby.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Na co si dát pozor při podpisu pracovní smlouvy</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-3 mb-6">
                <li>
                  <strong>Zkušební doba (Probezeit)</strong>
                  <p className="mt-1">Obvykle trvá až 6 měsíců. Během zkušební doby je možné pracovní poměr ukončit s kratší výpovědní lhůtou (obvykle 2 týdny).</p>
                </li>
                
                <li>
                  <strong>Výpovědní lhůty (Kündigungsfristen)</strong>
                  <p className="mt-1">Zákonná výpovědní lhůta je 4 týdny k 15. dni nebo ke konci kalendářního měsíce. Ve smlouvě může být sjednána delší výpovědní lhůta, ale pro zaměstnance nesmí být delší než pro zaměstnavatele.</p>
                </li>
                
                <li>
                  <strong>Konkurenční doložka (Wettbewerbsverbot)</strong>
                  <p className="mt-1">Omezuje možnost pracovat pro konkurenci po skončení pracovního poměru. Je platná pouze pokud zaměstnavatel poskytne kompenzaci ve výši nejméně 50 % poslední mzdy.</p>
                </li>
                
                <li>
                  <strong>Pracovní doba a přesčasy</strong>
                  <p className="mt-1">Ujistěte se, jak jsou upraveny přesčasy - zda jsou zahrnuty v základní mzdě nebo jsou placeny zvlášť.</p>
                </li>
                
                <li>
                  <strong>Dovolená</strong>
                  <p className="mt-1">Zákonné minimum je 20 pracovních dní při pětidenním pracovním týdnu (24 dní při šestidenním týdnu). Většina zaměstnavatelů poskytuje 25-30 dní.</p>
                </li>
                
                <li>
                  <strong>Kolektivní smlouva (Tarifvertrag)</strong>
                  <p className="mt-1">Pokud se na vás vztahuje kolektivní smlouva, zajistěte si její kopii a seznamte se s jejími ustanoveními.</p>
                </li>
              </ol>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Praktická rada:</p>
                <p className="mb-2">Před podpisem smlouvy si ji pečlivě přečtěte, případně se poraďte s odborníkem (odborový svaz, právník).</p>
                <p>Německý občanský zákoník (BGB) a zákon o ochraně před výpovědí (KSchG) poskytují zaměstnancům v Německu poměrně silnou právní ochranu, zejména po uplynutí zkušební doby a v případě dlouhodobého pracovního poměru.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Specifika pro pendlery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Jako pendler (přeshraniční pracovník) byste měli věnovat zvláštní pozornost těmto bodům ve vaší pracovní smlouvě:
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>Místo výkonu práce</strong>
                  <p className="mt-1">Přesné určení místa výkonu práce je pro pendlery důležité. V případě, že zaměstnavatel požaduje výkon práce na jiném místě, může to výrazně ovlivnit dojíždění.</p>
                </li>
                
                <li>
                  <strong>Pracovní doba a flexibilita</strong>
                  <p className="mt-1">Vzhledem k dojíždění je důležité mít jasně stanovené začátky a konce pracovní doby nebo možnost flexibilní pracovní doby či home office.</p>
                </li>
                
                <li>
                  <strong>Náhrada cestovních výdajů</strong>
                  <p className="mt-1">Některé německé firmy nabízejí pendlerům příspěvky na dopravu. Pokud je to možné, vyjednejte si tuto výhodu.</p>
                </li>
                
                <li>
                  <strong>Dny pracovního volna</strong>
                  <p className="mt-1">Německo má jiné státní svátky než Česká republika. Ujasněte si, které dny jsou pracovní a které volné.</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Jazykové aspekty smlouvy</h3>
              <p className="mb-4">
                Pracovní smlouva bude pravděpodobně v němčině. Pokud němčině plně nerozumíte:
              </p>
              
              <ol className="list-decimal pl-5 space-y-2">
                <li>Požádejte o překlad smlouvy do češtiny nebo angličtiny.</li>
                <li>Pokud to není možné, nechte si smlouvu přeložit nebo přečíst někým, kdo dobře rozumí oběma jazykům.</li>
                <li>V případě pochybností se poraďte s odborníkem (např. přes česko-německou hospodářskou komoru).</li>
              </ol>
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

export default WorkContract;
