
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const AccountDeletionForm = () => {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const expectedText = "SMAZAT MŮJ ÚČET";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmText !== expectedText) {
      toast.error("Potvrzovací text není správný");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Žádost o smazání účtu byla odeslána");
      setConfirmText("");
    } catch (error) {
      toast.error("Při odeslání žádosti došlo k chybě");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Smazání účtu
        </CardTitle>
        <CardDescription>
          Trvale smazat váš účet a všechna související data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-destructive/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Varování:</strong> Tato akce je nevratná. Všechna vaše data budou trvale smazána.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-deletion">
              Pro potvrzení napište: <strong>{expectedText}</strong>
            </Label>
            <Input
              id="confirm-deletion"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Napište potvrzovací text"
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="destructive"
            disabled={isLoading || confirmText !== expectedText}
            className="w-full"
          >
            {isLoading ? "Odesílání žádosti..." : "Smazat účet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionForm;
