
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, FileText, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  expiryDate: Date | null;
  reminderDays: number;
  notes: string;
}

const DocumentsCard = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "SPZ Registrace",
      expiryDate: new Date(2025, 5, 15),
      reminderDays: 30,
      notes: "Německé SPZ"
    },
    {
      id: "2",
      name: "Dálniční známka",
      expiryDate: new Date(2025, 0, 31),
      reminderDays: 14,
      notes: "Německá dálniční známka"
    },
    {
      id: "3",
      name: "Pojištění",
      expiryDate: new Date(2025, 3, 1),
      reminderDays: 30,
      notes: "Allianz pojištění"
    }
  ]);
  
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    name: "",
    expiryDate: null,
    reminderDays: 30,
    notes: ""
  });

  const handleAddDocument = () => {
    if (!newDocument.name) {
      toast.error("Vyplňte alespoň název dokumentu");
      return;
    }

    const document: Document = {
      id: Date.now().toString(),
      name: newDocument.name,
      expiryDate: newDocument.expiryDate,
      reminderDays: newDocument.reminderDays || 30,
      notes: newDocument.notes || ""
    };

    setDocuments([...documents, document]);
    setNewDocument({
      name: "",
      expiryDate: null,
      reminderDays: 30,
      notes: ""
    });
    setIsAddingDocument(false);
    toast.success("Dokument přidán");
  };

  const getExpiryStatus = (expiryDate: Date | null) => {
    if (!expiryDate) return "";
    
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return "Expirováno";
    if (daysUntilExpiry < 30) return "Brzy expiruje";
    return "Platné";
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Expirováno":
        return "bg-red-100 text-red-800";
      case "Brzy expiruje":
        return "bg-amber-100 text-amber-800";
      case "Platné":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dokumenty
            </CardTitle>
            <CardDescription>Správa dokumentů a připomenutí</CardDescription>
          </div>
          <Button onClick={() => setIsAddingDocument(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Přidat dokument
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document) => {
              const status = getExpiryStatus(document.expiryDate);
              return (
                <div key={document.id} className="rounded-md border p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{document.name}</h3>
                    {document.expiryDate && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(status)}`}>
                        {status}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Platnost do:</span>{" "}
                      {document.expiryDate ? format(document.expiryDate, "dd.MM.yyyy") : "Bez data expirace"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Připomenutí:</span>{" "}
                      {document.reminderDays} dní před expirací
                    </div>
                  </div>
                  {document.notes && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Poznámky:</span>{" "}
                      {document.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Žádné dokumenty</p>
          </div>
        )}
      </CardContent>

      {/* Dialog for adding new document */}
      <Dialog open={isAddingDocument} onOpenChange={setIsAddingDocument}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Přidat dokument</DialogTitle>
            <DialogDescription>
              Zaznamenejte důležité dokumenty a jejich platnost.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Název dokumentu*</Label>
              <Input
                id="name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                placeholder="např. Technický průkaz"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry">Datum expirace</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newDocument.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDocument.expiryDate ? format(newDocument.expiryDate, "PPP") : <span>Vyberte datum</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newDocument.expiryDate || undefined}
                    onSelect={(date) => setNewDocument({ ...newDocument, expiryDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reminderDays">Připomenout před expirací (dny)</Label>
              <Input
                id="reminderDays"
                type="number"
                value={newDocument.reminderDays?.toString() || "30"}
                onChange={(e) => setNewDocument({ ...newDocument, reminderDays: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Poznámky</Label>
              <Input
                id="notes"
                value={newDocument.notes}
                onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                placeholder="Dodatečné informace"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingDocument(false)}>
              Zrušit
            </Button>
            <Button onClick={handleAddDocument}>
              Uložit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentsCard;
