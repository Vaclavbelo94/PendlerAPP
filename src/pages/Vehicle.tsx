
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

// Import komponenty
import ServiceRecordCard from "@/components/vehicle/ServiceRecordCard";
import FuelConsumptionCard from "@/components/vehicle/FuelConsumptionCard";
import DocumentsCard from "@/components/vehicle/DocumentsCard";
import InsuranceCard from "@/components/vehicle/InsuranceCard";
import CrossBorderCard from "@/components/vehicle/CrossBorderCard";
import PremiumCheck from "@/components/premium/PremiumCheck";

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

  // Přidáváme stav pro editování údajů
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicleInfo, setEditedVehicleInfo] = useState(vehicleInfo);

  // Funkce pro změnu hodnot formuláře
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedVehicleInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Funkce pro uložení změn
  const saveChanges = () => {
    setVehicleInfo(editedVehicleInfo);
    setIsEditing(false);
    toast.success("Údaje o vozidle byly úspěšně uloženy");
    
    // Uložení do localStorage pro budoucí načtení
    localStorage.setItem("vehicleInfo", JSON.stringify(editedVehicleInfo));
  };

  // Načtení uložených údajů při prvním renderu
  useState(() => {
    const savedVehicleInfo = localStorage.getItem("vehicleInfo");
    if (savedVehicleInfo) {
      setVehicleInfo(JSON.parse(savedVehicleInfo));
      setEditedVehicleInfo(JSON.parse(savedVehicleInfo));
    }
  });

  const verifyVin = async () => {
    setIsVerifying(true);
    // In a real implementation, this would be a call to the CEBIA API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration purposes, we'll verify only specific VINs
      if (vinNumber === "WVWZZZ3CZLE042658") {
        const updatedInfo = {
          brand: "Volkswagen",
          model: "Passat",
          year: "2020",
          odometer: "85000",
          vinVerified: true,
          fuelType: "Diesel",
          licensePlate: vehicleInfo.licensePlate,
          lastInspection: vehicleInfo.lastInspection,
          nextInspection: vehicleInfo.nextInspection
        };
        
        setVehicleInfo(updatedInfo);
        setEditedVehicleInfo(updatedInfo);
        localStorage.setItem("vehicleInfo", JSON.stringify(updatedInfo));
        
        toast.success("Vozidlo úspěšně ověřeno v systému CEBIA");
      } else if (vinNumber === "TMBJJ7NE8G0110974") {
        const updatedInfo = {
          brand: "Škoda",
          model: "Octavia",
          year: "2016",
          odometer: "146000",
          vinVerified: true,
          fuelType: "Benzín",
          licensePlate: vehicleInfo.licensePlate,
          lastInspection: vehicleInfo.lastInspection,
          nextInspection: vehicleInfo.nextInspection
        };
        
        setVehicleInfo(updatedInfo);
        setEditedVehicleInfo(updatedInfo);
        localStorage.setItem("vehicleInfo", JSON.stringify(updatedInfo));
        
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
    <PremiumCheck featureKey="vehicle">
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
            <div className="flex justify-between mb-6">
              <Button 
                onClick={() => setVinDialogOpen(true)} 
                variant="outline"
              >
                <Car className="mr-2 h-4 w-4" />
                Ověřit vozidlo podle VIN
              </Button>
              
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Upravit údaje
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => {
                    setIsEditing(false);
                    setEditedVehicleInfo(vehicleInfo);
                  }} variant="outline">
                    Zrušit
                  </Button>
                  <Button onClick={saveChanges}>
                    Uložit změny
                  </Button>
                </div>
              )}
            </div>

            <Tabs defaultValue="info" className="w-full" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8">
                <TabsTrigger value="info">Informace o vozidle</TabsTrigger>
                <TabsTrigger value="service">Servis a palivo</TabsTrigger>
                <TabsTrigger value="documents">Doklady a pojištění</TabsTrigger>
                <TabsTrigger value="travel">Cestování</TabsTrigger>
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
                      <Input 
                        id="brand" 
                        value={isEditing ? editedVehicleInfo.brand : vehicleInfo.brand} 
                        disabled={!isEditing || vehicleInfo.vinVerified}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input 
                        id="model" 
                        value={isEditing ? editedVehicleInfo.model : vehicleInfo.model} 
                        disabled={!isEditing || vehicleInfo.vinVerified}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">SPZ</Label>
                      <Input 
                        id="licensePlate" 
                        value={isEditing ? editedVehicleInfo.licensePlate : vehicleInfo.licensePlate} 
                        disabled={!isEditing}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Rok výroby</Label>
                      <Input 
                        id="year" 
                        value={isEditing ? editedVehicleInfo.year : vehicleInfo.year} 
                        disabled={!isEditing || vehicleInfo.vinVerified}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="odometer">Stav tachometru (km)</Label>
                      <Input 
                        id="odometer" 
                        value={isEditing ? editedVehicleInfo.odometer : vehicleInfo.odometer}
                        disabled={!isEditing}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelType">Palivo</Label>
                      <Input 
                        id="fuelType" 
                        value={isEditing ? editedVehicleInfo.fuelType : vehicleInfo.fuelType} 
                        disabled={!isEditing || vehicleInfo.vinVerified}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastInspection">Poslední STK</Label>
                      <Input 
                        id="lastInspection" 
                        value={isEditing ? editedVehicleInfo.lastInspection : vehicleInfo.lastInspection} 
                        disabled={!isEditing}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextInspection">Příští STK</Label>
                      <Input 
                        id="nextInspection" 
                        value={isEditing ? editedVehicleInfo.nextInspection : vehicleInfo.nextInspection} 
                        disabled={!isEditing}
                        onChange={handleChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Service and Fuel Tab */}
              <TabsContent value="service">
                <div className="grid gap-6 md:grid-cols-1">
                  <ServiceRecordCard />
                  <FuelConsumptionCard />
                </div>
              </TabsContent>

              {/* Documents and Insurance Tab */}
              <TabsContent value="documents">
                <div className="grid gap-6 md:grid-cols-1">
                  <DocumentsCard />
                  <InsuranceCard />
                </div>
              </TabsContent>

              {/* Travel Tab */}
              <TabsContent value="travel">
                <div className="grid gap-6 md:grid-cols-1">
                  <CrossBorderCard />
                </div>
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
    </PremiumCheck>
  );
};

export default Vehicle;
