
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const PensionInsurance = () => {
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
            <h1 className="text-4xl font-bold">Důchodové pojištění v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Jak funguje důchodový systém v Německu a co by měli vědět pendleři.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Německý důchodový systém</CardTitle>
              <CardDescription>Struktura a základní informace o důchodovém pojištění</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Německý důchodový systém stojí na třech pilířích, podobně jako v mnoha evropských zemích:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">1. Státní důchod</h3>
                  <p className="text-sm">Povinné zákonné důchodové pojištění (gesetzliche Rentenversicherung). Financováno průběžným systémem z příspěvků zaměstnavatelů a zaměstnanců.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">2. Zaměstnanecký důchod</h3>
                  <p className="text-sm">Dobrovolné důchodové zabezpečení od zaměstnavatele (betriebliche Altersvorsorge). Často nabízeno jako benefit.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">3. Soukromé spoření</h3>
                  <p className="text-sm">Individuální důchodové spoření, částečně podporované státem (např. Riester-Rente nebo Rürup-Rente).</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3">Zákonné důchodové pojištění</h3>
              <p className="mb-4">
                V Německu je důchodové pojištění povinné pro všechny zaměstnance. Příspěvky na důchodové pojištění činí 18,6 % z hrubé mzdy (2023), přičemž zaměstnavatel i zaměstnanec hradí každý polovinu, tedy 9,3 %.
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-md mb-6">
                <p className="font-medium">Pro pendlery:</p>
                <p>Jako pendler pracující v Německu jste povinně účastníkem německého důchodového pojištění a vzniká vám nárok na německý důchod za odpracované roky. Tyto roky se započítávají do celkové doby pojištění i v České republice.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Podmínky pro získání německého důchodu</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Minimální doba pojištění</h3>
              <p className="mb-6">
                Pro získání nároku na německý starobní důchod je nutné splnit minimální dobu pojištění (Wartezeit):
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>Základní starobní důchod (Regelaltersrente)</strong>
                  <p className="mt-1">Minimálně 5 let placení příspěvků do německého důchodového systému.</p>
                </li>
                <li>
                  <strong>Předčasný starobní důchod (vorzeitige Altersrente)</strong>
                  <p className="mt-1">Podle typu důchodu minimálně 35 nebo 45 let pojištění.</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Věk odchodu do důchodu</h3>
              <p className="mb-2">
                Standardní věk odchodu do důchodu se v Německu postupně zvyšuje:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Pro osoby narozené před rokem 1947: 65 let</li>
                <li>Pro osoby narozené mezi lety 1947 a 1963: postupné zvyšování</li>
                <li>Pro osoby narozené v roce 1964 a později: 67 let</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="font-medium">Jak se vypočítává výše důchodu:</p>
                <p className="mb-2">Výše německého důchodu závisí na:</p>
                <ul className="list-disc pl-5">
                  <li>Počtu let pojištění</li>
                  <li>Výši příjmů v porovnání s průměrným příjmem všech pojištěnců</li>
                  <li>Věku odchodu do důchodu (při předčasném důchodu se výše krátí)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Důchody pro pendlery</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Sčítání dob pojištění</h3>
              <p className="mb-4">
                Díky koordinaci systémů sociálního zabezpečení v rámci EU se doby pojištění v různých členských státech sčítají. To znamená:
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>Pro splnění minimální doby pojištění se započítávají i roky odpracované v České republice.</li>
                <li>Každý stát (Německo i ČR) pak vyplácí důchod odpovídající době pojištění v daném státě.</li>
                <li>Výše důchodu se vypočítává podle předpisů daného státu.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Vyplácení důchodu</h3>
              <p className="mb-4">
                Pokud splníte podmínky pro důchod v Německu:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Německý důchod vám bude vyplácen bez ohledu na to, kde v EU žijete.</li>
                <li>Stejně tak český důchod vám bude vyplácen i v případě, že se rozhodnete žít v Německu.</li>
                <li>Můžete pobírat důchod z obou zemí současně.</li>
              </ul>
              
              <div className="bg-green-50 p-4 rounded-md mb-6">
                <p className="font-medium">Praktické kroky pro pendlery:</p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Uschovávejte si veškerou dokumentaci o vašem zaměstnání a placení pojištění v Německu.</li>
                  <li>Pravidelně kontrolujte svůj výpis z důchodového pojištění (Rentenversicherungsverlauf).</li>
                  <li>Žádost o důchod podávejte v zemi, kde máte bydliště - úřady si sami vyžádají potřebné informace z druhé země.</li>
                  <li>Zvažte dodatečné důchodové spoření - státní důchod obvykle nahrazuje jen část předchozích příjmů.</li>
                </ol>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Kontakty a informace</h3>
              <p className="mb-2">Pro informace o německém důchodovém pojištění se můžete obrátit na:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Deutsche Rentenversicherung (DRV) - německá důchodová správa</li>
                <li>ČSSZ - Česká správa sociálního zabezpečení (pro otázky týkající se koordinace důchodů)</li>
                <li>Informační centrum pro přeshraniční pracovní mobilitu EURES</li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mt-8">
            <Link to="/laws">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Zpět na seznam zákonů
              </Button>
            </Link>
            <a href="https://www.deutsche-rentenversicherung.de" target="_blank" rel="noopener noreferrer">
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

export default PensionInsurance;
