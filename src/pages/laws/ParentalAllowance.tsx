
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, FileText, Calendar, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";

const ParentalAllowance = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/laws" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Zpět na přehled zákonů</span>
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold">Rodičovský příspěvek v Německu (Elterngeld)</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Zákon</p>
                <p className="font-medium">Bundeselterngeld- und Elternzeitgesetz (BEEG)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aktualizováno</p>
                <p className="font-medium">15. května 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Důležité upozornění</AlertTitle>
          <AlertDescription>
            Informace na této stránce slouží pouze jako orientační vodítko. Pro aktuální a přesné informace ohledně rodičovského příspěvku se obraťte na příslušný úřad (Elterngeldstelle).
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Co je Elterngeld?</h2>
            <p>
              Elterngeld (rodičovský příspěvek) je finanční podpora od německého státu, která má pomoci rodičům v prvních měsících po narození dítěte. Příspěvek je určen pro rodiče, kteří pečují o své dítě a z tohoto důvodu nemohou pracovat na plný úvazek nebo vůbec.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Základní fakta</h2>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Výše příspěvku</h3>
              <p>Výše příspěvku závisí na příjmu před porodem a činí:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Pro osoby s příjmem: 65-67% z průměrného čistého příjmu za posledních 12 měsíců před narozením dítěte</li>
                <li>Minimální částka: 300 EUR měsíčně</li>
                <li>Maximální částka: 1.800 EUR měsíčně</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Doba vyplácení</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Základní Elterngeld (Basiselterngeld): až 14 měsíců (rozdělit mezi oba rodiče, jeden z rodičů max. 12 měsíců)</li>
                <li>ElterngeldPlus: až 28 měsíců (pro rodiče, kteří pracují částečně)</li>
                <li>Partnerschaftsbonus: další 4 měsíce pro oba rodiče, pokud oba pracují částečně</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Kdo má nárok?</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rodiče s trvalým pobytem v Německu</li>
                <li>Rodiče, kteří žijí ve společné domácnosti s dítětem</li>
                <li>Rodiče, kteří se o dítě osobně starají</li>
                <li>Rodiče, kteří pracují maximálně 32 hodin týdně</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Druhy příspěvků</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Basiselterngeld (základní příspěvek)</h3>
                <p>
                  Základní forma příspěvku, která se vyplácí až 14 měsíců po narození dítěte. Je určena pro rodiče, kteří po porodu nepracují nebo pracují velmi málo (pod 30 hodin týdně).
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Výše: 65-67% čistého příjmu před narozením dítěte</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">ElterngeldPlus (rozšířený příspěvek)</h3>
                <p>
                  Alternativní forma příspěvku pro rodiče, kteří po porodu pracují na částečný úvazek. Jeden měsíc základního příspěvku odpovídá dvěma měsícům ElterngeldPlus, ale výše měsíční platby je nižší.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Výše: 32,5-33,5% čistého příjmu před narozením dítěte</span>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Partnerschaftsbonus (partnerský bonus)</h3>
                <p>
                  Doplňková forma příspěvku, která podporuje rovnoměrné rozdělení péče o dítě a práce mezi oběma rodiči. K dispozici jsou až 4 další měsíce ElterngeldPlus pro každého z rodičů, pokud oba pracují 25-30 hodin týdně.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Jak žádat o Elterngeld</h2>
            
            <div className="space-y-3">
              <p>Pro získání rodičovského příspěvku je třeba podat žádost písemně na příslušném úřadě (Elterngeldstelle) v místě bydliště. Žádost je možné podat až po narození dítěte, a to až do 3 měsíců věku dítěte (v případě zpětného vyplacení).</p>

              <h3 className="text-lg font-medium mt-4">Potřebné dokumenty:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Vyplněný formulář žádosti (k dispozici na Elterngeldstelle nebo online)</li>
                <li>Rodný list dítěte</li>
                <li>Potvrzení o příjmu před narozením dítěte</li>
                <li>Potvrzení o přerušení pracovní činnosti nebo snížení úvazku</li>
                <li>Průkaz totožnosti obou rodičů</li>
                <li>Potvrzení o zdravotním pojištění</li>
              </ul>
            </div>
          </section>

          <section className="bg-muted p-4 rounded-md mt-6">
            <h2 className="text-xl font-semibold mb-2">Užitečné odkazy</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <a 
                  href="https://familienportal.de/familienportal/familienleistungen/elterngeld" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Oficiální portál pro rodiny (Familienportal)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <a 
                  href="https://www.elterngeld-digital.de/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Digitální podání žádosti o Elterngeld
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ParentalAllowance;
