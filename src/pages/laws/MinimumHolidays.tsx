
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, FileText, Calendar, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MinimumHolidays = () => {
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

        <h1 className="text-3xl font-bold">Minimální nárok na dovolenou v Německu</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Zákon</p>
                <p className="font-medium">Bundesurlaubsgesetz (BUrlG)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aktualizováno</p>
                <p className="font-medium">12. května 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Důležité upozornění</AlertTitle>
          <AlertDescription>
            Informace na této stránce slouží pouze jako orientační vodítko. Konkrétní podmínky a nárok na dovolenou mohou být upraveny v pracovní smlouvě nebo kolektivní smlouvě ve váš prospěch.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Základní informace</h2>
            <p>
              Federální zákon o dovolené (Bundesurlaubsgesetz) stanovuje minimální nárok na placenou dovolenou pro zaměstnance v Německu. Každý zaměstnanec má zákonný nárok na minimálně 20 pracovních dní dovolené ročně (při pětidenním pracovním týdnu), což odpovídá čtyřem týdnům dovolené.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Přehled nároku na dovolenou</h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pracovní dny v týdnu</TableHead>
                  <TableHead>Zákonný minimální nárok (dny)</TableHead>
                  <TableHead>Běžný nárok dle kolektivních smluv (dny)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>5 dní</TableCell>
                  <TableCell>20 dní</TableCell>
                  <TableCell>25-30 dní</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4 dny</TableCell>
                  <TableCell>16 dní</TableCell>
                  <TableCell>20-24 dní</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3 dny</TableCell>
                  <TableCell>12 dní</TableCell>
                  <TableCell>15-18 dní</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6 dní</TableCell>
                  <TableCell>24 dní</TableCell>
                  <TableCell>30-36 dní</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Zvláštní případy</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Osoby se zdravotním postižením:</strong> Nárok na dodatečných 5 pracovních dní dovolené ročně
                </li>
                <li>
                  <strong>Mladiství zaměstnanci:</strong> Zvýšený nárok (30 dní pro mladší 16 let, 27 dní pro mladší 17 let, 25 dní pro mladší 18 let)
                </li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Klíčová pravidla pro dovolenou</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Čerpání dovolené</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Zaměstnanec musí požádat o dovolenou předem</li>
                  <li>Zaměstnavatel schvaluje termín dovolené s ohledem na přání zaměstnance a provozní potřeby</li>
                  <li>Dovolená by měla být čerpána v aktuálním kalendářním roce</li>
                  <li>Základní pravidlo: nepřetržitý úsek dovolené alespoň dva týdny za rok (pokud je to možné)</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Převod nevyčerpané dovolené</h3>
                <p>
                  Nevyčerpaná dovolená může být převedena do následujícího roku pouze v případě, že existují provozní důvody nebo osobní důvody zaměstnance (např. nemoc), které bránily čerpání dovolené v daném roce.
                </p>
                <p className="mt-2">
                  <strong>Důležité:</strong> Převedená dovolená musí být vyčerpána do 31. března následujícího roku (pokud není stanoveno jinak v pracovní nebo kolektivní smlouvě).
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Nemoc během dovolené</h3>
                <p>
                  Pokud zaměstnanec onemocní během dovolené, dny nemoci se nepočítají jako čerpání dovolené, pokud je nemoc doložena lékařským potvrzením.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Finanční náhrada za nevyčerpanou dovolenou</h3>
                <p>
                  Zaměstnanci mají nárok na finanční kompenzaci nevyčerpané dovolené pouze v případě ukončení pracovního poměru, pokud již není možné dovolenou vyčerpat.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Poměrný nárok na dovolenou</h2>
            
            <div className="space-y-2">
              <p>
                Nárok na dovolenou vzniká již od prvního dne pracovního poměru, ale plný nárok vzniká až po uplynutí čekací doby 6 měsíců (tzv. Wartezeit). Během prvního roku zaměstnání a v případě ukončení pracovního poměru v průběhu roku má zaměstnanec nárok na poměrnou část dovolené:
              </p>
              
              <div className="bg-muted p-4 rounded-md mt-2">
                <p className="font-medium mb-2">Výpočet poměrného nároku:</p>
                <p>
                  <strong>1/12 ročního nároku na dovolenou × počet celých odpracovaných měsíců</strong>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Příklad: Při nástupu 1. července a ročním nároku 24 dní má zaměstnanec za daný rok nárok na 12 dní dovolené.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-muted p-4 rounded-md mt-6">
            <h2 className="text-xl font-semibold mb-2">Právní postavení a vymáhání práv</h2>
            <div className="space-y-2">
              <p>
                Nárok na minimální dovolenou je zákonným právem, které nelze odebrat ani omezit v neprospěch zaměstnance. Pokud zaměstnavatel porušuje toto právo, zaměstnanci mohou:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Obrátit se na podnikovou radu (Betriebsrat), pokud ve firmě existuje</li>
                <li>Kontaktovat odborovou organizaci</li>
                <li>Podat žalobu u pracovního soudu (Arbeitsgericht)</li>
              </ul>
              <p className="mt-2">
                <strong>Důležité:</strong> Nároky na dovolenou podléhají promlčecí lhůtě, obvykle tři roky od konce kalendářního roku, ve kterém nárok vznikl.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Stáhnout přehled práv na dovolenou (PDF)</span>
            </div>
            <Button variant="outline" size="sm">
              Stáhnout
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MinimumHolidays;
