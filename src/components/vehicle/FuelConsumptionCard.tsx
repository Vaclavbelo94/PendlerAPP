
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Fuel, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FuelRecord {
  id: string;
  date: Date;
  liters: string;
  price: string;
  mileage: string;
  fullTank: boolean;
}

const FuelConsumptionCard = () => {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([
    {
      id: "1",
      date: new Date(2024, 4, 5),
      liters: "45",
      price: "75.6",
      mileage: "125000",
      fullTank: true
    },
    {
      id: "2",
      date: new Date(2024, 3, 20),
      liters: "40",
      price: "67.2",
      mileage: "124200",
      fullTank: true
    }
  ]);
  
  const [isAddingFuel, setIsAddingFuel] = useState(false);
  const [newFuelRecord, setNewFuelRecord] = useState<Partial<FuelRecord>>({
    date: new Date(),
    liters: "",
    price: "",
    mileage: "",
    fullTank: true
  });

  const calculateAverageFuelConsumption = () => {
    // Need at least 2 full tank records to calculate consumption
    const fullTankRecords = fuelRecords
      .filter(r => r.fullTank)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (fullTankRecords.length < 2) return null;
    
    // Take most recent consecutive records
    const newestRecord = fullTankRecords[0];
    const previousRecord = fullTankRecords[1];
    
    const kilometers = parseFloat(newestRecord.mileage) - parseFloat(previousRecord.mileage);
    const liters = parseFloat(newestRecord.liters);
    
    // L/100km
    if (kilometers <= 0 || isNaN(liters) || isNaN(kilometers)) return null;
    
    return (liters / kilometers * 100).toFixed(1);
  };

  const calculateAveragePrice = () => {
    if (fuelRecords.length === 0) return null;
    
    const totalPrice = fuelRecords.reduce((sum, record) => {
      return sum + parseFloat(record.price);
    }, 0);
    
    const totalLiters = fuelRecords.reduce((sum, record) => {
      return sum + parseFloat(record.liters);
    }, 0);
    
    if (totalLiters === 0) return null;
    
    return (totalPrice / totalLiters).toFixed(2);
  };

  const averageConsumption = calculateAverageFuelConsumption();
  const averagePrice = calculateAveragePrice();

  const handleAddFuel = () => {
    if (!newFuelRecord.liters || !newFuelRecord.mileage) {
      toast.error("Vyplňte všechna povinná pole");
      return;
    }

    const record: FuelRecord = {
      id: Date.now().toString(),
      date: newFuelRecord.date || new Date(),
      liters: newFuelRecord.liters || "",
      price: newFuelRecord.price || "",
      mileage: newFuelRecord.mileage || "",
      fullTank: newFuelRecord.fullTank || false
    };

    setFuelRecords([record, ...fuelRecords]);
    setNewFuelRecord({
      date: new Date(),
      liters: "",
      price: "",
      mileage: "",
      fullTank: true
    });
    setIsAddingFuel(false);
    toast.success("Tankování přidáno");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Spotřeba paliva
            </CardTitle>
            <CardDescription>Sledování tankování a spotřeby</CardDescription>
          </div>
          <Button onClick={() => setIsAddingFuel(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Přidat tankování
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Průměrná spotřeba</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">
                      {averageConsumption ? `${averageConsumption} L/100km` : "N/A"}
                    </p>
                  </div>
                </div>
                {averageConsumption && parseFloat(averageConsumption) < 7 ? (
                  <TrendingDown className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Průměrná cena</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">
                      {averagePrice ? `${averagePrice} €/L` : "N/A"}
                    </p>
                  </div>
                </div>
                <Fuel className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {fuelRecords.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Litry</TableHead>
                  <TableHead>Cena (€)</TableHead>
                  <TableHead>Stav km</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(record.date, "dd.MM.yyyy")}</TableCell>
                    <TableCell>
                      <div className="font-medium">{record.liters} L</div>
                      {record.fullTank && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Plná nádrž
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{record.price}</TableCell>
                    <TableCell>{record.mileage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Fuel className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Žádné záznamy o tankování</p>
          </div>
        )}
      </CardContent>

      {/* Dialog for adding new fuel record */}
      <Dialog open={isAddingFuel} onOpenChange={setIsAddingFuel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Přidat tankování</DialogTitle>
            <DialogDescription>
              Zaznamenejte detaily o tankování paliva.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Datum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newFuelRecord.date ? format(newFuelRecord.date, "PPP") : <span>Vyberte datum</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newFuelRecord.date}
                    onSelect={(date) => setNewFuelRecord({ ...newFuelRecord, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="liters">Množství (L)*</Label>
              <Input
                id="liters"
                value={newFuelRecord.liters}
                onChange={(e) => setNewFuelRecord({ ...newFuelRecord, liters: e.target.value })}
                placeholder="např. 45"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Cena (€)</Label>
              <Input
                id="price"
                value={newFuelRecord.price}
                onChange={(e) => setNewFuelRecord({ ...newFuelRecord, price: e.target.value })}
                placeholder="např. 75.60"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mileage">Stav tachometru (km)*</Label>
              <Input
                id="mileage"
                value={newFuelRecord.mileage}
                onChange={(e) => setNewFuelRecord({ ...newFuelRecord, mileage: e.target.value })}
                placeholder="např. 125000"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fullTank"
                checked={newFuelRecord.fullTank}
                onChange={(e) => setNewFuelRecord({ ...newFuelRecord, fullTank: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="fullTank">Plná nádrž (pro výpočet spotřeby)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFuel(false)}>
              Zrušit
            </Button>
            <Button onClick={handleAddFuel}>
              Uložit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FuelConsumptionCard;
