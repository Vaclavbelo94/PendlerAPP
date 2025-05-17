
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const TaxReturnGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    {
      title: "Základní informace",
      content: "Daňové přiznání v Německu (Einkommensteuererklärung) musíte podat do 31. července následujícího roku. Jako pendler máte možnost získat zpět část zaplacených daní.",
      completed: true
    },
    {
      title: "Potřebné dokumenty",
      content: "Pro úspěšné podání daňového přiznání budete potřebovat: roční zúčtování mzdy (Lohnsteuerbescheinigung), potvrzení o placení zdravotního pojištění, doklady k odpočitatelným položkám a daňové identifikační číslo.",
      completed: true
    },
    {
      title: "Výběr metody podání",
      content: "Daňové přiznání můžete podat elektronicky přes ELSTER (zdarma), pomocí komerčního daňového softwaru nebo prostřednictvím daňového poradce.",
      completed: false
    },
    {
      title: "Odpočitatelné položky",
      content: "Jako pendler můžete uplatnit náklady na dojíždění (0,30 € za km do práce), pracovní pomůcky, náklady na druhé bydlení a další výdaje spojené s prací.",
      completed: false
    },
    {
      title: "Vyplnění formuláře",
      content: "Při vyplňování se zaměřte především na sekce: osobní údaje, příjmy ze zaměstnání, odpočitatelné položky (Werbungskosten), mimořádné výdaje (Sonderausgaben) a zaplacené daně.",
      completed: false
    },
    {
      title: "Kontrola a odeslání",
      content: "Před odesláním zkontrolujte všechny údaje, zejména číslo účtu pro vrácení případného přeplatku. Po odeslání obdržíte potvrzení, které si uschovejte.",
      completed: false
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interaktivní průvodce daňovým přiznáním</CardTitle>
          <CardDescription>Krok za krokem vás provedeme procesem podání daňového přiznání v Německu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium">Začínáme</span>
                <span className="text-sm font-medium">Dokončeno</span>
              </div>
              
              <div className="relative h-2 bg-muted rounded-full mb-6">
                <div 
                  className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                      ${index + 1 <= currentStep ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-muted text-muted-foreground'}`}
                  >
                    {index + 1 <= currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="mt-8 border-primary/20">
              <CardHeader>
                <CardTitle>Krok {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{steps[currentStep - 1].content}</p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                  >
                    Předchozí
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                    disabled={currentStep === steps.length}
                  >
                    Další krok
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="faq-1">
                <AccordionTrigger>Je pro mě jako pendlera výhodné podat daňové přiznání?</AccordionTrigger>
                <AccordionContent>
                  Ano, ve většině případů je to velmi výhodné. Jako pendler můžete uplatnit náklady na dojíždění, které jsou často vysoké, a získat tak značnou část zaplacených daní zpět. Průměrná vratka pro pendlery se pohybuje mezi 800-1200 €.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Do kdy musím podat daňové přiznání?</AccordionTrigger>
                <AccordionContent>
                  Povinné daňové přiznání musíte podat do 31. července roku následujícího po zdaňovacím období. Například za rok 2023 je termín 31.7.2024. Při zastoupení daňovým poradcem se lhůta prodlužuje do konce února druhého následujícího roku.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>Musím podat daňové přiznání i v České republice?</AccordionTrigger>
                <AccordionContent>
                  Ano, jako rezident ČR musíte přiznat své celosvětové příjmy v českém daňovém přiznání. Díky smlouvě o zamezení dvojího zdanění však příjmy zdaněné v Německu nebudou v ČR znovu zdaněny, ale použijí se pro výpočet daňové sazby (metoda vynětí s progresí).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-center mt-8">
              <Link to="/laws/tax-return">
                <Button variant="outline" className="flex items-center gap-2">
                  Přečíst komplexní průvodce daňovým přiznáním
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReturnGuide;
