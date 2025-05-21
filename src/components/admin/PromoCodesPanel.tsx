
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  duration: number; // trvání v měsících
  validUntil: string;
  usedCount: number;
  maxUses: number | null;
}

interface PromoCodeFormValues {
  code: string;
  discount: number;
  duration: number;
  maxUses: number | null;
}

export const PromoCodesPanel = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState<Partial<PromoCode>>({
    code: "",
    discount: 100, // 100% sleva = zdarma
    duration: 1,
    maxUses: 10,
  });

  useEffect(() => {
    // Načtení promo kódů z localStorage
    const loadPromoCodes = () => {
      setIsLoading(true);
      try {
        const storedCodes = JSON.parse(localStorage.getItem("promoCodes") || "[]");
        setPromoCodes(storedCodes);
      } catch (error) {
        console.error("Chyba při načítání promo kódů:", error);
        toast.error("Nepodařilo se načíst promo kódy");
      } finally {
        setIsLoading(false);
      }
    };

    loadPromoCodes();
  }, []);

  const savePromoCodes = (codes: PromoCode[]) => {
    localStorage.setItem("promoCodes", JSON.stringify(codes));
    setPromoCodes(codes);
  };

  const handleCreatePromoCode = () => {
    const code = newPromoCode.code?.toUpperCase().replace(/\s/g, "") || generateRandomCode();
    const now = new Date();
    const validUntil = new Date();
    validUntil.setMonth(now.getMonth() + 3); // Platnost 3 měsíce od vytvoření

    // Ensure discount is a number between 0 and 100
    const discount = Math.min(100, Math.max(0, newPromoCode.discount || 100));

    const newCode: PromoCode = {
      id: Math.random().toString(36).substr(2, 9),
      code,
      discount,
      duration: newPromoCode.duration || 1,
      validUntil: validUntil.toISOString(),
      usedCount: 0,
      maxUses: newPromoCode.maxUses || null,
    };

    const updatedCodes = [...promoCodes, newCode];
    savePromoCodes(updatedCodes);
    toast.success(`Promo kód ${code} byl úspěšně vytvořen`);
    setShowDialog(false);
    setNewPromoCode({
      code: "",
      discount: 100,
      duration: 1,
      maxUses: 10,
    });
  };

  const deletePromoCode = (id: string) => {
    const updatedCodes = promoCodes.filter(code => code.id !== id);
    savePromoCodes(updatedCodes);
    toast.success("Promo kód byl úspěšně smazán");
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "PROMO-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Add functionality to reset usage count
  const resetUsageCount = (id: string) => {
    const updatedCodes = promoCodes.map(code => {
      if (code.id === id) {
        return {
          ...code,
          usedCount: 0
        };
      }
      return code;
    });
    savePromoCodes(updatedCodes);
    toast.success("Počet použití byl resetován");
  };

  // Extended validity of a promo code
  const extendValidity = (id: string) => {
    const updatedCodes = promoCodes.map(code => {
      if (code.id === id) {
        const newValidUntil = new Date();
        newValidUntil.setMonth(newValidUntil.getMonth() + 3); // Extend by 3 months
        return {
          ...code,
          validUntil: newValidUntil.toISOString()
        };
      }
      return code;
    });
    savePromoCodes(updatedCodes);
    toast.success("Platnost promo kódu byla prodloužena");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Aktivní promo kódy</h3>
        <Button onClick={() => setShowDialog(true)}>
          Vytvořit nový kód
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Načítání promo kódů...</p>
          </div>
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium">Žádné promo kódy</h3>
          <p className="text-sm text-muted-foreground mt-2">
            V systému nejsou vytvořeny žádné promo kódy.
          </p>
          <Button onClick={() => setShowDialog(true)} className="mt-4">
            Vytvořit první kód
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kód</TableHead>
              <TableHead>Sleva</TableHead>
              <TableHead>Trvání</TableHead>
              <TableHead>Platnost do</TableHead>
              <TableHead>Použito / Max</TableHead>
              <TableHead className="text-right">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-medium">{code.code}</TableCell>
                <TableCell>{code.discount}%</TableCell>
                <TableCell>{code.duration} {code.duration === 1 ? 'měsíc' : code.duration < 5 ? 'měsíce' : 'měsíců'}</TableCell>
                <TableCell>{new Date(code.validUntil).toLocaleDateString()}</TableCell>
                <TableCell>
                  {code.usedCount} / {code.maxUses === null ? "∞" : code.maxUses}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resetUsageCount(code.id)}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => extendValidity(code.id)}
                  >
                    Prodloužit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deletePromoCode(code.id)}
                  >
                    Smazat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog pro vytvoření promo kódu */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vytvořit nový promo kód</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promoCode">Kód (volitelné)</Label>
              <Input
                id="promoCode"
                placeholder="Např. SUMMER2025 (pokud nevyplníte, vygeneruje se náhodný)"
                value={newPromoCode.code}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Sleva (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={newPromoCode.discount}
                onChange={(e) => setNewPromoCode({ 
                  ...newPromoCode, 
                  discount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) 
                })}
              />
              <p className="text-xs text-muted-foreground">
                100% = plný premium přístup, 0% = žádná sleva
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Trvání předplatného</Label>
              <Select 
                value={newPromoCode.duration?.toString()} 
                onValueChange={(value) => setNewPromoCode({ ...newPromoCode, duration: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte trvání" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 měsíc</SelectItem>
                  <SelectItem value="3">3 měsíce</SelectItem>
                  <SelectItem value="6">6 měsíců</SelectItem>
                  <SelectItem value="12">1 rok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses">Maximální počet použití</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                placeholder="Neomezeno"
                value={newPromoCode.maxUses === null ? "" : newPromoCode.maxUses}
                onChange={(e) => {
                  const value = e.target.value === "" ? null : parseInt(e.target.value);
                  setNewPromoCode({ ...newPromoCode, maxUses: value !== null ? Math.max(1, value) : null });
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Zrušit
            </Button>
            <Button onClick={handleCreatePromoCode}>
              Vytvořit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
