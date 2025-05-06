import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Vehicle = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Správa vozidla</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Vše potřebné pro správu vašeho vozidla v Německu.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="info">Informace o vozidle</TabsTrigger>
              <TabsTrigger value="dates">Důležité termíny</TabsTrigger>
            </TabsList>

            {/* Vehicle Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Základní informace</CardTitle>
                  <CardDescription>Zde naleznete informace o Vašem vozidle.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Značka</Label>
                    <Input id="brand" defaultValue="Volkswagen" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" defaultValue="Passat" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-plate">SPZ</Label>
                    <Input id="license-plate" defaultValue="3BA 456" disabled />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Important Dates Tab */}
            <TabsContent value="dates">
              <Card>
                <CardHeader>
                  <CardTitle>Důležité termíny</CardTitle>
                  <CardDescription>Zde si můžete nastavit připomenutí důležitých termínů.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Pojištění</Label>
                    <Input id="insurance" defaultValue="Allianz" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Datum pojištění</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Vyberte datum</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Vehicle;
