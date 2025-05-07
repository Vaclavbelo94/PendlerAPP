
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const ChildBenefits = () => {
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
            <h1 className="text-4xl font-bold">Přídavky na děti v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Podmínky pro získání německých přídavků na děti (Kindergeld) a co by měli vědět pendleři.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Přídavky na děti (Kindergeld)</CardTitle>
              <CardDescription>Základní informace o německých přídavcích na děti</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Kindergeld jsou měsíční přídavky na děti vyplácené rodinám v Německu bez ohledu na jejich příjem. Vyplácí je Rodinná pokladna (Familienkasse) při úřadu práce (Agentur für Arbeit).
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Aktuální výše přídavků (2023)</h3>
              <div className="bg-primary-50 p-6 rounded-md mb-6">
                <ul className="list-disc pl-5 space-y-3">
                  <li><strong>250 € měsíčně</strong> za každé dítě</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Pro které děti lze přídavky získat</h3>
              <p className="mb-2">
                Přídavky jsou vypláceny na:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Děti do 18 let bez dalších podmínek</li>
                <li>Nezaměstnané děti do 21 let (registrované na úřadu práce v Německu)</li>
                <li>Studující děti nebo děti v profesní přípravě do 25 let</li>
                <li>Děti se zdravotním postižením, které se o sebe nemohou finančně postarat (bez věkové hranice)</li>
              </ul>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="font-medium">Důležité pro pendlery:</p>
                <p>I když pracujete v Německu, ale vaše děti žijí v České republice, můžete za určitých podmínek mít nárok na německé přídavky na děti. Podle pravidel EU má přednost vyplácet rodinné dávky stát, ve kterém je vykonávána výdělečná činnost.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Podmínky nároku pro pendlery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Jako pendler můžete mít nárok na německé přídavky na děti, pokud:
              </p>
              
              <ol className="list-decimal pl-5 space-y-3 mb-6">
                <li>
                  <strong>Pracujete v Německu jako zaměstnanec nebo OSVČ</strong>
                  <p className="mt-1">Přeshraniční pracovník s bydlištěm v ČR má nárok na německé rodinné dávky, pokud v Německu vykonává „podstatnou část" výdělečné činnosti (obvykle alespoň 25% pracovní doby).</p>
                </li>
                <li>
                  <strong>Máte v Německu neomezené daňové povinnosti</strong>
                  <p className="mt-1">To obvykle znamená, že více než 90% vašich celosvětových příjmů podléhá zdanění v Německu.</p>
                </li>
                <li>
                  <strong>Vaše dítě s vámi žije ve společné domácnosti</strong>
                  <p className="mt-1">Nebo je jiným způsobem finančně závislé na vaší podpoře.</p>
                </li>
              </ol>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Vyrovnávací doplatek</h3>
              <p className="mb-4">
                Pokud máte nárok na rodinné dávky v České republice a zároveň v Německu:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Primárně budete dostávat dávky od státu, kde pracujete (Německo)</li>
                <li>Pokud jsou české přídavky na děti vyšší než německé (což není běžné), můžete požádat o vyrovnávací doplatek v České republice</li>
                <li>České přídavky jsou příjmově testované, německé nikoliv</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Příklad:</p>
                <p className="mt-1">Pan Novák pracuje v Německu, jeho manželka a dvě děti (8 a 13 let) žijí v ČR. Manželka nepracuje. Pan Novák má nárok na německý Kindergeld ve výši 2 × 250 € = 500 € měsíčně.</p>
                <p className="mt-2">Pokud by měl nárok na české přídavky na děti (podle příjmové situace rodiny), ale ty jsou nižší než německé, český úřad by žádné přídavky nevyplácel.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Jak požádat o Kindergeld</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Potřebné dokumenty</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Vyplněný formulář žádosti "Antrag auf Kindergeld" (KG1)</li>
                <li>Příloha "Anlage Kind" - pro každé dítě</li>
                <li>Pro pendlery: formulář "Anlage Ausland" (příloha pro zahraniční vztahy)</li>
                <li>Rodný list dítěte (přeložený do němčiny)</li>
                <li>Potvrzení o bydlišti (Meldebescheinigung) nebo výpis z registru obyvatel (pro pendlery)</li>
                <li>Pro děti nad 18 let: potvrzení o studiu nebo odborné přípravě</li>
                <li>Daňové identifikační číslo (Steueridentifikationsnummer) vaše i dítěte (pokud bylo přiděleno)</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Kde podat žádost</h3>
              <p className="mb-4">
                Žádost se podává u příslušné Familienkasse:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Pro pendlery je obvykle příslušná Familienkasse Bayern Nord</li>
                <li>Žádost je možné podat poštou nebo osobně</li>
                <li>Některé formuláře lze vyplnit online, ale následně je nutné je vytisknout a podepsat</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Vyplácení přídavků</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Přídavky jsou vypláceny měsíčně na bankovní účet</li>
                <li>Lze je vyplácet i na účet v České republice, ale mohou být účtovány poplatky za zahraniční platbu</li>
                <li>Nárok na přídavky lze uplatnit až 6 měsíců zpětně od měsíce podání žádosti</li>
              </ul>
              
              <div className="bg-green-50 p-4 rounded-md">
                <p className="font-medium">Praktické tipy:</p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Všechny cizojazyčné dokumenty je nutné přeložit do němčiny (oficiálním překladatelem).</li>
                  <li>Nezapomeňte každý rok předkládat aktuální potvrzení o studiu pro děti nad 18 let.</li>
                  <li>Jakékoliv změny (adresa, rodinný stav, ukončení studia dítěte) je nutné neprodleně hlásit Familienkasse.</li>
                  <li>Mějte na paměti, že Kindergeld podléhá tzv. „progresivní výhradě" při zdanění vašich příjmů (zvyšuje daňovou sazbu, ale sám není zdaněn).</li>
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
            <a href="https://www.arbeitsagentur.de/familie-und-kinder/kindergeld-im-ueberblick" target="_blank" rel="noopener noreferrer">
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

export default ChildBenefits;
