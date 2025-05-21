
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PromoCode } from "./types";
import { generateRandomCode } from "./promoCodeUtils";
import { createPromoCode } from "./promoCodeService";

interface PromoCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePromoCode: (newCode: PromoCode) => void;
}

export const PromoCodeDialog = ({ open, onOpenChange, onCreatePromoCode }: PromoCodeDialogProps) => {
  const [newPromoCode, setNewPromoCode] = useState<Partial<PromoCode>>({
    code: "",
    discount: 100, // 100% sleva = zdarma
    duration: 1,
    maxUses: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePromoCode = async () => {
    setIsSubmitting(true);

    try {
      const code = newPromoCode.code?.toUpperCase().replace(/\s/g, "") || generateRandomCode();
      const now = new Date();
      const validUntil = new Date();
      validUntil.setMonth(now.getMonth() + 3); // Platnost 3 měsíce od vytvoření

      // Ensure discount is a number between 0 and 100
      const discount = Math.min(100, Math.max(0, newPromoCode.discount || 100));

      const newCodeData: Omit<PromoCode, 'id' | 'usedCount' | 'created_at' | 'updated_at'> = {
        code,
        discount,
        duration: newPromoCode.duration || 1,
        validUntil: validUntil.toISOString(),
        maxUses: newPromoCode.maxUses || null,
      };

      const createdCode = await createPromoCode(newCodeData);
      
      if (createdCode) {
        onCreatePromoCode(createdCode);
        toast.success(`Promo kód ${code} byl úspěšně vytvořen`);
        onOpenChange(false);
        setNewPromoCode({
          code: "",
          discount: 100,
          duration: 1,
          maxUses: 10,
        });
      }
    } catch (error) {
      console.error("Chyba při vytváření promo kódu:", error);
      toast.error("Nepodařilo se vytvořit promo kód");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Zrušit
          </Button>
          <Button onClick={handleCreatePromoCode} disabled={isSubmitting}>
            {isSubmitting ? "Vytvářím..." : "Vytvořit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
