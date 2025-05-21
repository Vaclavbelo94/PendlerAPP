
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Info, TrendingUp, Euro, Car, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Ukázková data o regionech
const regions = [
  {
    id: "bavaria",
    name: "Bavorsko",
    country: "Německo",
    minWage: "12.41 €",
    averageWage: "3,890 €",
    unemploymentRate: 3.2,
    livingCostIndex: 82,
    distance: "0-250 km od českých hranic",
    majorCities: ["Mnichov", "Norimberk", "Řezno", "Pasov"],
    industries: ["Automobilový průmysl", "Strojírenství", "IT & technologie", "Cestovní ruch"],
    pendlerBenefits: [
      {
        title: "Dětské přídavky (Kindergeld)",
        description: "I pendleři mají za určitých podmínek nárok na německé přídavky na děti ve výši 250 € měsíčně na dítě."
      },
      {
        title: "Daňová třída I",
        description: "Pendleři mohou čerpat daňové výhody v rámci daňové třídy I a odečítat náklady na dojíždění."
      }
    ],
    transportInfo: "Dobré vlakové spojení do větších měst, pro menší města je výhodnější dojíždět autem."
  },
  {
    id: "saxony",
    name: "Sasko",
    country: "Německo",
    minWage: "12.41 €",
    averageWage: "3,420 €",
    unemploymentRate: 5.8,
    livingCostIndex: 72,
    distance: "0-150 km od českých hranic",
    majorCities: ["Drážďany", "Lipsko", "Chemnitz", "Zwickau"],
    industries: ["Elektrotechnika", "Strojírenství", "Logistika", "Zdravotnictví"],
    pendlerBenefits: [
      {
        title: "Bonus za nedostatek pracovních sil",
        description: "V některých odvětvích (zdravotnictví, IT) jsou vypláceny bonusy pro zahraniční pracovníky."
      },
      {
        title: "Úleva na dani z příjmu",
        description: "Možnost uplatnit vyšší odpočty při dojíždění z jiné země."
      }
    ],
    transportInfo: "Výborné vlakové i autobusové spojení s ČR, zejména směr Drážďany, Pirna, Bad Schandau."
  },
  {
    id: "upperAustria",
    name: "Horní Rakousko",
    country: "Rakousko",
    minWage: "dle kolektivní smlouvy",
    averageWage: "3,750 €",
    unemploymentRate: 4.0,
    livingCostIndex: 78,
    distance: "0-100 km od českých hranic",
    majorCities: ["Linec", "Wels", "Steyr"],
    industries: ["Ocelářský průmysl", "Chemický průmysl", "Potravinářství", "Služby"],
    pendlerBenefits: [
      {
        title: "Pendlerpauschale",
        description: "Daňový odpočet pro pendlery s pravidelnou cestou do zaměstnání."
      },
      {
        title: "Zdravotní pojištění",
        description: "Pendleři jsou účastníky rakouského zdravotního systému s možností ošetření v Rakousku i ČR."
      }
    ],
    transportInfo: "Dostupnost jak autem, tak vlakovými spoji do Lince. Pro menší města je výhodnější auto."
  }
];

const RegionalInfo: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = React.useState(regions[0]);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Regionální informace pro pendlery</CardTitle>
          <CardDescription>
            Důležité informace o příhraničních oblastech, mzdách a pracovních příležitostech
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={regions[0].id} onValueChange={(value) => {
            const region = regions.find(r => r.id === value);
            if (region) setSelectedRegion(region);
          }}>
            <TabsList className="mb-4 w-full gap-3">
              {regions.map(region => (
                <TabsTrigger key={region.id} value={region.id} className="flex-1">
                  <MapPin className="h-4 w-4 mr-1 hidden md:inline-block" />
                  {region.name}
                </TabsTrigger>
              ))}
            </TabsList>
          
            {regions.map(region => (
              <TabsContent key={region.id} value={region.id} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      {region.name}, {region.country}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {region.distance}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1 flex items-center">
                          <Euro className="h-4 w-4 mr-1 text-primary" />
                          Minimální mzda
                        </h4>
                        <p className="text-lg">{region.minWage}</p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1 flex items-center">
                          <Euro className="h-4 w-4 mr-1 text-primary" />
                          Průměrná mzda
                        </h4>
                        <p className="text-lg">{region.averageWage}</p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                          Nezaměstnanost
                        </h4>
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{region.unemploymentRate}%</span>
                          <Progress value={region.unemploymentRate * 10} className="h-2 flex-grow" />
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1 flex items-center">
                          <Info className="h-4 w-4 mr-1 text-primary" />
                          Index životních nákladů
                        </h4>
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{region.livingCostIndex}/100</span>
                          <Progress value={region.livingCostIndex} className="h-2 flex-grow" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Hlavní města</h4>
                  <div className="flex flex-wrap gap-1">
                    {region.majorCities.map((city, idx) => (
                      <Badge key={idx} variant="secondary">{city}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Hlavní odvětví</h4>
                  <div className="flex flex-wrap gap-1">
                    {region.industries.map((industry, idx) => (
                      <Badge key={idx} variant="outline">{industry}</Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Car className="h-4 w-4 mr-1" />
                    Dopravní informace
                  </h4>
                  <p>{region.transportInfo}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Benefity pro pendlery
                  </h4>
                  
                  <div className="space-y-3">
                    {region.pendlerBenefits.map((benefit, idx) => (
                      <div key={idx} className="bg-muted p-3 rounded-md">
                        <h5 className="font-medium">{benefit.title}</h5>
                        <p className="text-sm">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Stáhnout průvodce regionem
            </Button>
            <Button variant="default" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Zobrazit na mapě
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Daňové a právní informace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3">
            Pro pendlery z ČR do {selectedRegion.name} ({selectedRegion.country}) je důležité znát:
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
              <p><strong>Pravidlo 183 dnů:</strong> Pokud v {selectedRegion.country} strávíte více než 183 dní v roce, budete tam považováni za daňového rezidenta.</p>
            </li>
            <li className="flex items-start">
              <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
              <p><strong>Daňové přiznání:</strong> I když jste zaměstnáni v {selectedRegion.country}, pravděpodobně budete muset podávat daňové přiznání v obou zemích.</p>
            </li>
            <li className="flex items-start">
              <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
              <p><strong>Zdravotní pojištění:</strong> Jako pendler budete podléhat systému zdravotního pojištění země, kde pracujete, tedy {selectedRegion.country}.</p>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="link" className="p-0">
            Zobrazit podrobného průvodce pro pendlery v sekci Zákony →
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegionalInfo;
