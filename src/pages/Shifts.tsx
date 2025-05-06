import { useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const Shifts = () => {
  const [activeSection, setActiveSection] = useState("calendar");

  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Plánování směn</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Efektivní plánování pracovních směn a spolujízdy pro pendlery.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Můj kalendář</CardTitle>
                <CardDescription>Přehled plánovaných směn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Funkce kalendáře bude brzy dostupná.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Route Planning Section */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Plánování trasy</CardTitle>
                <CardDescription>Zadejte svou trasu a časy cesty</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="from">Odkud</Label>
                  <Input id="from" placeholder="Místo odjezdu" />
                </div>
                <div>
                  <Label htmlFor="to">Kam</Label>
                  <Input id="to" placeholder="Cílová destinace" />
                </div>
                <div>
                  <Label htmlFor="time">Čas odjezdu</Label>
                  <Input id="time" type="time" />
                </div>
                <Button className="w-full">Uložit trasu</Button>
              </CardContent>
            </Card>

            {/* Ride Sharing Section */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Spolujízda</CardTitle>
                <CardDescription>Najděte nebo nabídněte spolujízdu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Zde se zobrazí nabídky spolujízdy..." className="h-32" readOnly />
                <Button className="w-full">Hledat spolujízdu</Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Tipy pro efektivní plánování</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimalizace trasy</CardTitle>
                  <CardDescription>Jak ušetřit čas a peníze na cestě</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Využívejte navigaci s aktuální dopravní situací</li>
                    <li>Zvažte alternativní trasy mimo dopravní špičku</li>
                    <li>Naplánujte si přestávky na odpočinek</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bezpečnost na cestách</CardTitle>
                  <CardDescription>Důležité rady pro bezpečnou jízdu</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Pravidelně kontrolujte technický stav vozidla</li>
                    <li>Dodržujte bezpečnou vzdálenost</li>
                    <li>Neřiďte unavení</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Shifts;
