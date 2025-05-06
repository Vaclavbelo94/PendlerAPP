
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const About = () => {
  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Info className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">O projektu</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Pendler Helper je komplexní řešení pro české pendlery pracující v Německu.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Naše mise</h2>
              <p className="mb-4">
                Naším cílem je zjednodušit život českých pendlerů pracujících v Německu prostřednictvím 
                praktických nástrojů a užitečných informací. Chceme odstranit jazykové, právní a 
                logistické překážky, kterým pendleři denně čelí.
              </p>
              <p>
                Věříme, že díky správným nástrojům a informacím může být práce v zahraničí jednodušší 
                a příjemnější zkušeností.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Historie projektu</h2>
              <p className="mb-4">
                Projekt Pendler Helper vznikl v roce 2023 na základě vlastních zkušeností jeho zakladatelů, 
                kteří sami několik let pracovali jako pendleři v Německu. Díky vlastní zkušenosti dokázali 
                identifikovat hlavní problémy a výzvy, se kterými se čeští pendleři denně potýkají.
              </p>
              <p>
                Od svého vzniku se projekt rozrostl z jednoduchého slovníčku frází na komplexní platformu 
                zahrnující výuku němčiny, přehled zákonů, správu vozidla a plánování směn.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Tým</h2>
              <p className="mb-4">
                Náš tým je složen z profesionálů s přímou zkušeností s prací v Německu, právníků 
                specializujících se na mezinárodní pracovní právo a jazykových expertů. Společně 
                pracujeme na tom, abychom vytvořili nejlepší možný nástroj pro české pendlery.
              </p>
              <p>
                Jsme hrdí na to, že všechny funkce a obsah naší aplikace jsou vytvářeny ve spolupráci 
                s aktivními pendlery, kteří nám poskytují neocenitelnou zpětnou vazbu a návrhy na zlepšení.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
