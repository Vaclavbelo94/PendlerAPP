
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from "lucide-react";

interface CountryRequirement {
  country: string;
  flag: string;
  requiredDocuments: string[];
  additionalRequirements: string[];
}

const CrossBorderCard = () => {
  const [countryRequirements, setCountryRequirements] = useState<CountryRequirement[]>([
    {
      country: "Německo",
      flag: "🇩🇪",
      requiredDocuments: [
        "Řidičský průkaz",
        "Technický průkaz vozidla",
        "Doklad o pojištění (zelená karta)",
        "Reflexní vesta (pro každého cestujícího)",
        "Výstražný trojúhelník"
      ],
      additionalRequirements: [
        "Zimní pneumatiky jsou povinné za zimních podmínek (sníh, led, námraza)",
        "Dálniční známka pro dálnice a rychlostní silnice"
      ]
    },
    {
      country: "Česká republika",
      flag: "🇨🇿",
      requiredDocuments: [
        "Řidičský průkaz",
        "Technický průkaz vozidla",
        "Doklad o pojištění (zelená karta)",
        "Reflexní vesta",
        "Výstražný trojúhelník",
        "Lékárnička"
      ],
      additionalRequirements: [
        "Zimní pneumatiky povinné od 1.11. do 31.3.",
        "Dálniční známka pro dálnice a rychlostní silnice"
      ]
    },
    {
      country: "Rakousko",
      flag: "🇦🇹",
      requiredDocuments: [
        "Řidičský průkaz",
        "Technický průkaz vozidla",
        "Doklad o pojištění (zelená karta)",
        "Reflexní vesta",
        "Výstražný trojúhelník",
        "Lékárnička"
      ],
      additionalRequirements: [
        "Zimní pneumatiky povinné od 1.11. do 15.4. za zimních podmínek",
        "Dálniční známka pro dálnice a rychlostní silnice"
      ]
    }
  ]);

  const [selectedCountry, setSelectedCountry] = useState<string>("Německo");

  const selectedRequirements = countryRequirements.find(c => c.country === selectedCountry);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Přeshraniční požadavky
          </CardTitle>
          <CardDescription>Povinná výbava a předpisy pro cestování do zahraničí</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-6 space-x-2">
          {countryRequirements.map((country) => (
            <Button 
              key={country.country}
              onClick={() => setSelectedCountry(country.country)}
              variant={selectedCountry === country.country ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{country.flag}</span>
              <span>{country.country}</span>
            </Button>
          ))}
        </div>

        {selectedRequirements && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Povinné dokumenty a výbava</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Položka</TableHead>
                      <TableHead>Povinné</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRequirements.requiredDocuments.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell>{doc}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-600">✓</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Další požadavky</h3>
              <ul className="list-disc pl-5 space-y-2">
                {selectedRequirements.additionalRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrossBorderCard;
