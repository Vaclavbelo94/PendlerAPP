
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Car, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const Vehicle = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [vinNumber, setVinNumber] = useState("");
  const [vinDialogOpen, setVinDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState({
    brand: "Volkswagen",
    model: "Passat",
    licensePlate: "3BA 456",
    year: "2019",
    odometer: "125000",
    vinVerified: false,
    lastInspection: "10.05.2024",
    nextInspection: "10.05.2026",
    fuelType: "Diesel"
  });

  const verifyVin = async () => {
    setIsVerifying(true);
    // In a real implementation, this would be a call to the CEBIA API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration purposes, we'll verify only specific VINs
      if (vinNumber === "WVWZZZ3CZLE042658") {
        setVehicleInfo({
          ...vehicleInfo,
          brand: "Volkswagen",
          model: "Passat",
          year: "2020",
          odometer: "85000",
          vinVerified: true,
          fuelType: "Diesel"
        });
        toast.success("Vozidlo úspěšně ověřeno v systému CEBIA");
      } else if (vinNumber === "TMBJJ7NE8G0110974") {
        setVehicleInfo({
          ...vehicleInfo,
          brand: "Škoda",
          model: "Octavia",
          year: "2016",
          odometer: "146000",
          vinVerified: true,
          fuelType: "Benzín"
        });
        toast.success("Vozidlo úspěšně ověřeno v systému CEBIA");
      } else {
        toast.error("VIN nebyl nalezen v databázi CEBIA");
      }
      setVinDialogOpen(false);
    } catch (error) {
      toast.error("Došlo k chybě při ověřování VIN");
    } finally {
      setIsVerifying(false);
    }
  };

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
          <Button 
            onClick={() => setVinDialogOpen(true)} 
            className="mb-6"
            variant="outline"
          >
            <Car className="mr-2 h-4 w-4" />
            Ověřit vozidlo podle VIN
          </Button>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="info">Informace o vozidle</TabsTrigger>
              <TabsTrigger value="dates">Důležité termíny</TabsTrigger>
            </TabsList>

            {/* Vehicle Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Základní informace
                    {vehicleInfo.vinVerified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Ověřeno CEBIA
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Zde naleznete informace o Vašem vozidle.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Značka</Label>
                    <Input id="brand" value={vehicleInfo.brand} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" value={vehicleInfo.model} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-plate">SPZ</Label>
                    <Input id="license-plate" value={vehicleInfo.licensePlate} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Rok výroby</Label>
                    <Input id="year" value={vehicleInfo.year} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odometer">Stav tachometru (km)</Label>
                    <Input id="odometer" value={vehicleInfo.odometer} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel-type">Palivo</Label>
                    <Input id="fuel-type" value={vehicleInfo.fuelType} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-inspection">Poslední STK</Label>
                    <Input id="last-inspection" value={vehicleInfo.lastInspection} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next-inspection">Příští STK</Label>
                    <Input id="next-inspection" value={vehicleInfo.nextInspection} disabled />
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

      {/* VIN Verification Dialog */}
      <Dialog open={vinDialogOpen} onOpenChange={setVinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ověření vozidla podle VIN</DialogTitle>
            <DialogDescription>
              Zadejte VIN kód vašeho vozidla pro ověření v databázi CEBIA.
              <p className="mt-2 text-xs">
                Pro testovací účely zkuste VIN: WVWZZZ3CZLE042658 (Volkswagen) nebo TMBJJ7NE8G0110974 (Škoda)
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN kód</Label>
              <Input
                id="vin"
                placeholder="např. WVWZZZ3CZLE042658"
                value={vinNumber}
                onChange={(e) => setVinNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVinDialogOpen(false)}>
              Zrušit
            </Button>
            <Button onClick={verifyVin} disabled={isVerifying || !vinNumber}>
              {isVerifying ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                  Ověřuji...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Ověřit VIN
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vehicle;
