
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const TaxOptimizationTips = () => {
  return (
    <div className="prose prose-sm sm:prose max-w-none">
      <h3>Jak optimalizovat vaše daně jako pendler</h3>
      
      <p>
        Zde jsou nejdůležitější tipy, které vám mohou pomoci ušetřit na daních při práci v Německu:
      </p>
      
      <h4>1. Náklady na dojíždění (Entfernungspauschale)</h4>
      <p>
        <strong>Jak to funguje:</strong> Můžete si odečíst 0,30 € za každý kilometr jednosměrné cesty do práce pro prvních 20 km 
        a 0,38 € za každý další kilometr nad 20 km. Počítá se nejkratší možná trasa a uplatňuje se za každý odpracovaný den.
      </p>
      <p>
        <strong>Příklad:</strong> Při dojíždění 50 km jedním směrem a 220 pracovních dnech v roce může odpočet činit až 3 828 €.
      </p>
      
      <h4>2. Druhé bydlení (Doppelte Haushaltsführung)</h4>
      <p>
        Pokud máte hlavní bydliště v ČR, ale kvůli práci pronajímáte byt v Německu, můžete si odečíst:
      </p>
      <ul>
        <li>Náklady na nájem (do 1 000 € měsíčně)</li>
        <li>Náklady na vybavení bytu (do 5 000 € ročně)</li>
        <li>Náklady na cesty domů (jednou týdně)</li>
      </ul>
      
      <h4>3. Pracovní pomůcky a vybavení (Arbeitsmittel)</h4>
      <p>
        Můžete odečíst náklady na pracovní pomůcky a vybavení, které potřebujete ke své práci:
      </p>
      <ul>
        <li>Pracovní oděvy a jejich čištění (ne běžné oblečení)</li>
        <li>Nástroje a nářadí</li>
        <li>Počítač a software pro pracovní účely</li>
        <li>Odborná literatura a vzdělávací materiály</li>
      </ul>
      
      <h4>4. Další odpočitatelné položky</h4>
      <ul>
        <li><strong>Náklady na daňové poradenství:</strong> Poplatky za vyplnění daňového přiznání</li>
        <li><strong>Náklady na jazykové kurzy:</strong> Pokud jsou potřebné pro vaši práci</li>
        <li><strong>Soukromé pojištění:</strong> Zdravotní, úrazové, životní pojištění</li>
      </ul>
      
      <div className="bg-blue-50 p-4 rounded-md my-4">
        <h4 className="text-blue-800 mt-0">Důležitá poznámka</h4>
        <p className="mb-0">
          Daňová optimalizace vyžaduje pečlivou dokumentaci. Uchovávejte všechny účtenky, faktury a potvrzení
          související s vašimi odpočitatelnými položkami po dobu nejméně 7 let pro případnou kontrolu finančního úřadu.
        </p>
      </div>
      
      <h4>5. Výhody daňového přiznání pro pendlery</h4>
      <p>
        Někteří pendleři získají při podání daňového přiznání vrácení daně ve výši několika tisíc eur ročně.
        Tento nástroj vám může pomoci odhadnout, kolik byste mohli ušetřit díky správné optimalizaci.
      </p>
      
      <div className="flex justify-start mt-4">
        <Button variant="outline" className="gap-2" asChild>
          <a href="https://www.steuerklassen.com/en/" target="_blank" rel="noopener noreferrer">
            <FileText className="h-4 w-4" />
            Oficiální informace o daňových třídách
          </a>
        </Button>
      </div>
    </div>
  );
};

export default TaxOptimizationTips;
