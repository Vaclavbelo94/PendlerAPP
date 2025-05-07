
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const HealthInsurance = () => {
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
            <h1 className="text-4xl font-bold">Zdravotní pojištění v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Komplexní přehled německého systému zdravotního pojištění, jeho typy a povinnosti pro pendlery.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Základní informace o zdravotním pojištění</CardTitle>
              <CardDescription>Povinné zdravotní pojištění v Německu</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                V Německu je zdravotní pojištění povinné pro všechny obyvatele i přeshraniční pracovníky. Existují dva hlavní typy zdravotního pojištění:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Zákonné zdravotní pojištění (GKV)</h3>
                  <p><strong>Gesetzliche Krankenversicherung</strong></p>
                  <p className="mt-2">Povinné pro zaměstnance s příjmem pod určitou hranicí. Kryje základní zdravotní péči.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Soukromé zdravotní pojištění (PKV)</h3>
                  <p><strong>Private Krankenversicherung</strong></p>
                  <p className="mt-2">Dostupné pro osoby s vyšším příjmem, státní úředníky, podnikatele a OSVČ.</p>
                </div>
              </div>
              
              <p className="mb-4">
                Zákonné zdravotní pojištění je povinné pro zaměstnance s hrubým ročním příjmem pod 64.350 € (stav k roku 2023). Osoby s vyšším příjmem se mohou rozhodnout mezi zákonným a soukromým pojištěním.
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-md mb-6">
                <p className="font-medium">Důležité pro pendlery:</p>
                <p>Pokud pracujete v Německu, vztahuje se na vás německý systém sociálního zabezpečení včetně zdravotního pojištění, i když máte trvalé bydliště v České republice.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Zákonné zdravotní pojištění (GKV)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Zákonné zdravotní pojištění poskytuje řadu veřejných pojišťoven (tzv. Krankenkassen). Všechny pojišťovny poskytují stejný základní balíček služeb stanovený zákonem, ale mohou se lišit v dodatečných službách a výši příspěvků.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Výše příspěvků</h3>
              <p className="mb-4">
                Základní sazba zákonného zdravotního pojištění je 14,6 % z hrubé mzdy. Tato částka je rozdělena mezi zaměstnance (7,3 %) a zaměstnavatele (7,3 %). K základní sazbě si každá pojišťovna účtuje dodatečný příspěvek (Zusatzbeitrag), který se pohybuje mezi 0,2 % a 2,5 % v závislosti na pojišťovně.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="font-medium">Příklad výpočtu (2023):</p>
                <p>Při hrubé mzdě 3000 € měsíčně a dodatečném příspěvku 1,3 %:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Základní příspěvek: 3000 € × 14,6 % = 438 €</li>
                  <li>Dodatečný příspěvek: 3000 € × 1,3 % = 39 €</li>
                  <li>Celkem: 477 € (zaměstnanec platí 258 €, zaměstnavatel 219 €)</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Hlavní pojišťovny v Německu</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>AOK (Allgemeine Ortskrankenkasse) - největší regionální zdravotní pojišťovny</li>
                <li>TK (Techniker Krankenkasse) - jedna z největších celostátních pojišťoven</li>
                <li>Barmer - druhá největší pojišťovna v Německu</li>
                <li>DAK-Gesundheit - celostátní pojišťovna</li>
                <li>IKK (Innungskrankenkasse) - pojišťovny pro řemeslníky</li>
                <li>BKK (Betriebskrankenkasse) - zaměstnanecké pojišťovny</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Co pokrývá zákonné pojištění</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ambulantní lékařskou péči</li>
                <li>Nemocniční léčbu</li>
                <li>Základní zubní ošetření</li>
                <li>Léky na předpis (s vlastním příspěvkem)</li>
                <li>Preventivní prohlídky</li>
                <li>Těhotenskou péči</li>
                <li>Rehabilitace</li>
                <li>Nemocenské dávky</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Zdravotní pojištění pro pendlery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Jako pendler pracující v Německu spadáte do německého systému sociálního zabezpečení a platíte zdravotní pojištění v Německu. To znamená:
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>Máte nárok na plnou zdravotní péči v Německu podle podmínek zákonného pojištění.</li>
                <li>Máte také nárok na nezbytnou zdravotní péči v České republice.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Evropský průkaz zdravotního pojištění (EHIC)</h3>
              <p className="mb-4">
                Jako pojištěnci německé zdravotní pojišťovny máte nárok na evropský průkaz zdravotního pojištění. S tímto průkazem máte v České republice nárok na nezbytnou zdravotní péči za stejných podmínek jako občané ČR.
              </p>
              
              <div className="bg-green-50 p-4 rounded-md mb-6">
                <p className="font-medium">Postup při návštěvě lékaře v ČR:</p>
                <p className="mb-2">1. Předložte svůj evropský průkaz zdravotního pojištění.</p>
                <p className="mb-2">2. Lékař by měl poskytnout ošetření bez přímé platby.</p>
                <p>3. Pokud lékař průkaz nepřijme a požaduje platbu, uschovejte si účtenky a po návratu do Německa požádejte svou pojišťovnu o proplacení.</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Rodinní příslušníci</h3>
              <p className="mb-4">
                Pokud vaši rodinní příslušníci žijí v České republice a nemají vlastní příjem, mohou být pojištěni v rámci vašeho německého zdravotního pojištění bez dodatečných nákladů. K tomu je potřeba:
              </p>
              
              <ol className="list-decimal pl-5 space-y-2 mb-6">
                <li>Vyplnit formulář E106/S1 u vaší německé pojišťovny.</li>
                <li>Registrovat se s tímto formulářem u české zdravotní pojišťovny.</li>
                <li>Rodinní příslušníci pak dostanou český průkaz pojištěnce a mají nárok na plnou zdravotní péči v ČR.</li>
              </ol>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Doporučení pro pendlery:</p>
                <p className="mb-2">1. Vždy noste s sebou evropský průkaz zdravotního pojištění.</p>
                <p className="mb-2">2. Zvažte doplňkové cestovní pojištění pro případy, kdy je třeba repatriace nebo jiné služby nad rámec běžné zdravotní péče.</p>
                <p>3. Informujte se u své německé pojišťovny o možnostech zdravotní péče v České republice.</p>
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
            <a href="https://www.bundesgesundheitsministerium.de/themen/krankenversicherung/grundprinzipien.html" target="_blank" rel="noopener noreferrer">
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

export default HealthInsurance;
