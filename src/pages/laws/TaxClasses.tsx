
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const TaxClasses = () => {
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
            <h1 className="text-4xl font-bold">Daňové třídy v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Přehled německých daňových tříd (Lohnsteuerklassen), jejich význam a vliv na zdanění příjmu.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Přehled daňových tříd v Německu</CardTitle>
              <CardDescription>Systém daňových tříd a jejich základní charakteristika</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                V Německu existuje šest daňových tříd (Steuerklassen), které určují výši srážek daně z příjmu ze mzdy. Daňová třída se přiděluje na základě rodinného stavu, příjmu a dalších faktorů.
              </p>
              
              <div className="space-y-6">
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída I</h3>
                  <p><strong>Pro koho:</strong> Svobodní, rozvedení, ovdovělí nebo v registrovaném partnerství, kteří nežijí s dítětem v jedné domácnosti.</p>
                  <p><strong>Charakteristika:</strong> Střední míra zdanění příjmu.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída II</h3>
                  <p><strong>Pro koho:</strong> Svobodní, rozvedení nebo ovdovělí rodiče samoživitelé žijící s dítětem v jedné domácnosti.</p>
                  <p><strong>Charakteristika:</strong> Nižší míra zdanění než třída I, zahrnuje úlevu pro samoživitele.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída III</h3>
                  <p><strong>Pro koho:</strong> Ženatí/vdané nebo registrovaní partneři, kde jeden z partnerů vydělává výrazně více (zatímco druhý má třídu V).</p>
                  <p><strong>Charakteristika:</strong> Nejnižší míra zdanění, vhodná pro hlavního živitele rodiny.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída IV</h3>
                  <p><strong>Pro koho:</strong> Ženatí/vdané nebo registrovaní partneři s podobnou výší příjmu.</p>
                  <p><strong>Charakteristika:</strong> Střední míra zdanění, oba partneři jsou zdaněni stejně.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída V</h3>
                  <p><strong>Pro koho:</strong> Ženatí/vdané nebo registrovaní partneři, kde jeden z partnerů vydělává výrazně méně (zatímco druhý má třídu III).</p>
                  <p><strong>Charakteristika:</strong> Nejvyšší míra zdanění, méně výhodná pro partnera s nižším příjmem.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída VI</h3>
                  <p><strong>Pro koho:</strong> Pro osoby s více než jedním pracovním poměrem (pro druhé a další zaměstnání).</p>
                  <p><strong>Charakteristika:</strong> Nejvyšší míra zdanění, bez jakýchkoliv úlev a odpočtů.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Volba daňových tříd u manželů/registrovaných partnerů</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Manželé a registrovaní partneři mají na výběr z těchto kombinací daňových tříd:
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>Kombinace III/V</strong> - výhodná, pokud jeden z partnerů vydělává výrazně více než druhý. Partner s vyšším příjmem si zvolí třídu III, partner s nižším příjmem třídu V.
                </li>
                <li>
                  <strong>Kombinace IV/IV</strong> - vhodná, pokud oba partneři vydělávají podobně. Oba si zvolí třídu IV.
                </li>
                <li>
                  <strong>Kombinace IV/IV s faktorem</strong> - umožňuje spravedlivější rozdělení daňové zátěže mezi partnery s různými příjmy.
                </li>
              </ul>
              
              <div className="bg-yellow-50 p-4 rounded-md mb-6">
                <p className="font-medium">Důležité:</p>
                <p className="mb-2">Volba daňové třídy ovlivňuje pouze výši měsíčních srážek daně z příjmu, nikoliv celkovou roční daňovou povinnost.</p>
                <p>Při ročním zúčtování daně (Steuererklärung) dochází k přesnému výpočtu daňové povinnosti bez ohledu na zvolenou daňovou třídu.</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Kdy se vyplatí kombinace III/V?</h3>
              <p className="mb-4">
                Tato kombinace se vyplatí, když jeden z partnerů vydělává výrazně více než druhý. Může však vést k vysokému nedoplatku při ročním zúčtování, pokud oba partneři vydělávají podobně, ale zvolí si tuto kombinaci.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Kdy se vyplatí kombinace IV/IV?</h3>
              <p className="mb-4">
                Tato kombinace je vhodnější, když oba partneři vydělávají podobně. Vede k vyrovnanějšímu rozdělení daňové zátěže během roku a minimalizuje riziko nedoplatku při ročním zúčtování.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Změna daňové třídy a její dopady</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Změnu daňové třídy lze provést u místního finančního úřadu (Finanzamt) nebo online prostřednictvím portálu ELSTER. Změna je možná jednou za kalendářní rok.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Dopady změny daňové třídy</h3>
              <p className="mb-2">Změna daňové třídy může ovlivnit:</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Výši měsíčního čistého příjmu</li>
                <li>Výši některých sociálních dávek (rodičovský příspěvek, podpora v nezaměstnanosti, nemocenská)</li>
                <li>Výši příspěvků na zdravotní pojištění a sociální zabezpečení</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Pozor:</p>
                <p className="mb-2">Změna daňové třídy má vliv i na výpočet některých dávek, jako je rodičovský příspěvek (Elterngeld) nebo nemocenská (Krankengeld).</p>
                <p>Pokud plánujete čerpání těchto dávek, je vhodné změnit daňovou třídu alespoň 7 měsíců před jejich nárokováním.</p>
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
            <a href="https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Lohnsteuer/lohnsteuer.html" target="_blank" rel="noopener noreferrer">
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

export default TaxClasses;
