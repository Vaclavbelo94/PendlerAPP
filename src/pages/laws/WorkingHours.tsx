
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, FileText, Clock, Calendar, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const WorkingHours = () => {
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

        <h1 className="text-3xl font-bold">Pracovní doba v Německu</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Zákon</p>
                <p className="font-medium">Arbeitszeitgesetz (ArbZG)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aktualizováno</p>
                <p className="font-medium">10. května 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Důležité upozornění</AlertTitle>
          <AlertDescription>
            Tato stránka poskytuje pouze základní přehled zákonných pravidel. V konkrétních odvětvích mohou platit specifická pravidla podle kolektivních smluv nebo podnikových dohod.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Základní ustanovení</h2>
            <p>
              Zákon o pracovní době (Arbeitszeitgesetz) stanovuje základní rámec pro regulaci pracovní doby v Německu. Jeho hlavním cílem je ochrana zdraví a bezpečnosti zaměstnanců, stanovení minimálních standardů pro odpočinek a maximální pracovní dobu.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Maximální pracovní doba</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Denní pracovní doba</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Maximálně 8 hodin denně (pondělí až sobota)</li>
                  <li>Může být prodloužena až na 10 hodin denně, pokud je v průměru za 6 měsíců nebo 24 týdnů dodržena průměrná pracovní doba 8 hodin denně</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Týdenní pracovní doba</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Maximálně 48 hodin týdně (6 pracovních dnů po 8 hodinách)</li>
                  <li>V praxi často nižší - v mnoha odvětvích 35-40 hodin podle kolektivních smluv</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Přestávky</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Při pracovní době 6-9 hodin: minimálně 30 minut přestávky</li>
                  <li>Při pracovní době delší než 9 hodin: minimálně 45 minut přestávky</li>
                  <li>Přestávky mohou být rozděleny do bloků, ale každý blok musí trvat minimálně 15 minut</li>
                  <li>Přestávky nejsou součástí pracovní doby a nejsou placené (pokud není stanoveno jinak v pracovní smlouvě)</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Doba odpočinku</h2>
            
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Denní odpočinek</h3>
                <p>
                  Po skončení pracovní doby musí mít zaměstnanec nepřerušenou dobu odpočinku v délce minimálně 11 hodin před zahájením další směny.
                </p>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Týdenní odpočinek</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Neděle jsou obecně dny pracovního klidu</li>
                  <li>Zaměstnanec musí mít minimálně jeden den v týdnu volno</li>
                  <li>Zaměstnanci pracující v neděli musí mít náhradní volno v jiný den týdne</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Výjimky a zvláštní ustanovení</h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Odvětví/Situace</TableHead>
                  <TableHead>Povolené výjimky</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Zdravotnictví</TableCell>
                  <TableCell>Prodloužené směny, práce v neděli a o svátcích</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pohostinství</TableCell>
                  <TableCell>Flexibilnější rozdělení pracovní doby, práce v neděli</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Doprava</TableCell>
                  <TableCell>Specifická pravidla pro odpočinek, zvláštní regulace</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sezónní práce</TableCell>
                  <TableCell>Možnost prodloužené pracovní doby v určitých obdobích</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vedoucí pracovníci</TableCell>
                  <TableCell>Méně přísná pravidla pracovní doby</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-md mt-4">
              <h3 className="text-lg font-medium mb-2">Práce na směny</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Noční práce (obvykle mezi 23:00 a 6:00): nárok na dodatečnou kompenzaci nebo zvýšený plat</li>
                <li>Směnový provoz: specifické požadavky na plánování a dobu odpočinku</li>
                <li>Práce o svátcích: zvláštní náhradní volno nebo finanční kompenzace</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Flexibilní pracovní doba</h2>
            
            <div className="space-y-3">
              <p>
                V Německu je stále běžnější flexibilní pracovní doba, která může zahrnovat:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Flexitime (Gleitzeit)</h3>
                  <p>
                    Zaměstnanci mohou začít a skončit práci v určitém časovém rozmezí, přičemž je stanovena tzv. "core time", kdy musí být všichni přítomni.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Konto pracovní doby (Arbeitszeitkonto)</h3>
                  <p>
                    Systém, který umožňuje akumulovat přesčasové hodiny nebo deficit hodin, které mohou být později kompenzovány volným časem.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Práce z domova (Homeoffice)</h3>
                  <p>
                    I při práci z domova musí být dodržovány zákonné požadavky na pracovní dobu a odpočinek.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Částečný úvazek (Teilzeit)</h3>
                  <p>
                    Zaměstnanci mají zákonné právo požádat o snížení pracovní doby za určitých podmínek.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center p-4 rounded-md bg-red-50 dark:bg-red-900/20 mt-6">
            <Ban className="h-6 w-6 text-red-600 mr-3 shrink-0" />
            <div>
              <h2 className="text-lg font-medium mb-1">Porušení zákona o pracovní době</h2>
              <p className="text-sm">
                Porušení předpisů o pracovní době může být potrestáno pokutami až do výše 15 000 EUR. V případě závažných opakovaných porušení může být zahájeno trestní stíhání.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Máte dotazy k pracovní době?</span>
            </div>
            <Button>
              Kontaktovat poradnu
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WorkingHours;
