
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { KeyIcon } from "lucide-react";

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        throw error;
      }
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Heslo bylo úspěšně změněno");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Chyba při změně hesla");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyIcon className="h-5 w-5" />
          Změna hesla
        </CardTitle>
        <CardDescription>
          Aktualizujte své heslo pro lepší zabezpečení účtu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Současné heslo</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Zadejte současné heslo"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Nové heslo</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Zadejte nové heslo (min. 6 znaků)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Potvrďte nové heslo</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Zadejte nové heslo znovu"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handlePasswordChange}
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
          >
            {isLoading ? "Měním heslo..." : "Změnit heslo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
