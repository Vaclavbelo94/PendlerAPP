
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ShieldCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  startDate: Date | null;
  endDate: Date | null;
  type: string;
  coverage: string;
  premium: string;
  contactPhone: string;
}

const InsuranceCard = () => {
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo>({
    provider: "Allianz",
    policyNumber: "DE9876543210",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 11, 31),
    type: "Plné havarijní pojištění",
    coverage: "10,000,000",
    premium: "560",
    contactPhone: "+49123456789"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedInsurance, setEditedInsurance] = useState<InsuranceInfo>(insuranceInfo);

  const handleSaveInsurance = () => {
    setInsuranceInfo(editedInsurance);
    setIsEditing(false);
    toast.success("Informace o pojištění aktualizovány");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Pojištění
            </CardTitle>
            <CardDescription>Informace o pojištění vozidla</CardDescription>
          </div>
          <Button onClick={() => {
            setEditedInsurance({...insuranceInfo});
            setIsEditing(true);
          }} size="sm" variant="outline">
            Upravit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Pojišťovna</h3>
              <p className="font-medium">{insuranceInfo.provider}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Číslo pojistky</h3>
              <p className="font-medium">{insuranceInfo.policyNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Typ pojištění</h3>
              <p className="font-medium">{insuranceInfo.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Krytí (€)</h3>
              <p className="font-medium">{insuranceInfo.coverage}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Platnost od</h3>
              <p className="font-medium">
                {insuranceInfo.startDate ? format(insuranceInfo.startDate, "dd.MM.yyyy") : "Neuvedeno"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Platnost do</h3>
              <p className="font-medium">
                {insuranceInfo.endDate ? format(insuranceInfo.endDate, "dd.MM.yyyy") : "Neuvedeno"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Roční pojistné (€)</h3>
              <p className="font-medium">{insuranceInfo.premium}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Kontaktní telefon</h3>
              <p className="font-medium">{insuranceInfo.contactPhone}</p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Dialog for editing insurance info */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit informace o pojištění</DialogTitle>
            <DialogDescription>
              Aktualizujte detaily pojištění vašeho vozidla.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="provider">Pojišťovna</Label>
                <Input
                  id="provider"
                  value={editedInsurance.provider}
                  onChange={(e) => setEditedInsurance({ ...editedInsurance, provider: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policyNumber">Číslo pojistky</Label>
                <Input
                  id="policyNumber"
                  value={editedInsurance.policyNumber}
                  onChange={(e) => setEditedInsurance({ ...editedInsurance, policyNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Platnost od</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editedInsurance.startDate && "text-muted-foreground"
                      )}
                      id="startDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedInsurance.startDate ? format(editedInsurance.startDate, "PPP") : <span>Vyberte datum</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedInsurance.startDate || undefined}
                      onSelect={(date) => setEditedInsurance({ ...editedInsurance, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Platnost do</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editedInsurance.endDate && "text-muted-foreground"
                      )}
                      id="endDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedInsurance.endDate ? format(editedInsurance.endDate, "PPP") : <span>Vyberte datum</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedInsurance.endDate || undefined}
                      onSelect={(date) => setEditedInsurance({ ...editedInsurance, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Typ pojištění</Label>
              <Input
                id="type"
                value={editedInsurance.type}
                onChange={(e) => setEditedInsurance({ ...editedInsurance, type: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="coverage">Krytí (€)</Label>
                <Input
                  id="coverage"
                  value={editedInsurance.coverage}
                  onChange={(e) => setEditedInsurance({ ...editedInsurance, coverage: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="premium">Roční pojistné (€)</Label>
                <Input
                  id="premium"
                  value={editedInsurance.premium}
                  onChange={(e) => setEditedInsurance({ ...editedInsurance, premium: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Kontaktní telefon</Label>
              <Input
                id="contactPhone"
                value={editedInsurance.contactPhone}
                onChange={(e) => setEditedInsurance({ ...editedInsurance, contactPhone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Zrušit
            </Button>
            <Button onClick={handleSaveInsurance}>
              Uložit změny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InsuranceCard;
