
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ServiceRecord {
  id: string;
  date: Date;
  type: string;
  description: string;
  mileage: string;
  cost: string;
}

const ServiceRecordCard = () => {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: "1",
      date: new Date(2024, 3, 15),
      type: "Výměna oleje",
      description: "Výměna oleje a filtrů",
      mileage: "120000",
      cost: "150"
    },
    {
      id: "2",
      date: new Date(2024, 2, 10),
      type: "Brzdy",
      description: "Výměna brzdových destiček",
      mileage: "115000",
      cost: "320"
    }
  ]);
  
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<ServiceRecord>>({
    date: new Date(),
    type: "",
    description: "",
    mileage: "",
    cost: ""
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleAddRecord = () => {
    if (!newRecord.type || !newRecord.mileage) {
      toast.error("Vyplňte všechna povinná pole");
      return;
    }

    const record: ServiceRecord = {
      id: Date.now().toString(),
      date: newRecord.date || new Date(),
      type: newRecord.type || "",
      description: newRecord.description || "",
      mileage: newRecord.mileage || "",
      cost: newRecord.cost || ""
    };

    setServiceRecords([record, ...serviceRecords]);
    setNewRecord({
      date: new Date(),
      type: "",
      description: "",
      mileage: "",
      cost: ""
    });
    setIsAddingRecord(false);
    toast.success("Servisní záznam přidán");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Servisní záznamy
            </CardTitle>
            <CardDescription>Historie servisních záznamů vozidla</CardDescription>
          </div>
          <Button onClick={() => setIsAddingRecord(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Přidat záznam
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {serviceRecords.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Stav km</TableHead>
                  <TableHead>Cena (€)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(record.date, "dd.MM.yyyy")}</TableCell>
                    <TableCell>
                      <div className="font-medium">{record.type}</div>
                      <div className="text-xs text-muted-foreground">{record.description}</div>
                    </TableCell>
                    <TableCell>{record.mileage}</TableCell>
                    <TableCell>{record.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Wrench className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Žádné servisní záznamy</p>
          </div>
        )}
      </CardContent>

      {/* Dialog for adding new record */}
      <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Přidat servisní záznam</DialogTitle>
            <DialogDescription>
              Zadejte detaily servisního zásahu na vozidle.
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
                    {newRecord.date ? format(newRecord.date, "PPP") : <span>Vyberte datum</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newRecord.date}
                    onSelect={(date) => setNewRecord({ ...newRecord, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Typ servisu*</Label>
              <Input
                id="type"
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                placeholder="např. Výměna oleje"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Popis</Label>
              <Input
                id="description"
                value={newRecord.description}
                onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                placeholder="Podrobnosti o servisu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mileage">Stav tachometru (km)*</Label>
              <Input
                id="mileage"
                value={newRecord.mileage}
                onChange={(e) => setNewRecord({ ...newRecord, mileage: e.target.value })}
                placeholder="např. 120000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Cena (€)</Label>
              <Input
                id="cost"
                value={newRecord.cost}
                onChange={(e) => setNewRecord({ ...newRecord, cost: e.target.value })}
                placeholder="např. 150"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
              Zrušit
            </Button>
            <Button onClick={handleAddRecord}>
              Uložit záznam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceRecordCard;
