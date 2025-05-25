
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast.error("Chyba při změně hesla: " + error.message);
      } else {
        toast.success("Heslo bylo úspěšně změněno");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error("Chyba při změně hesla");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Změna hesla
        </CardTitle>
        <CardDescription>
          Aktualizujte své heslo pro lepší zabezpečení
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Současné heslo</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Zadejte současné heslo"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Nové heslo</Label>
          <Input
            id="newPassword"
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Zadejte nové heslo (min. 6 znaků)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Potvrďte nové heslo</Label>
          <Input
            id="confirmPassword"
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Zadejte nové heslo znovu"
          />
        </div>

        <Button 
          onClick={handleChangePassword}
          disabled={!currentPassword || !newPassword || !confirmPassword || loading}
          className="w-full"
        >
          {loading ? "Měním heslo..." : "Změnit heslo"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
