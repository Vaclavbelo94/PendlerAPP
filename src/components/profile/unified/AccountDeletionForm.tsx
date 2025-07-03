
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const AccountDeletionForm = () => {
  const { t } = useTranslation('profile');
  const { t: tError } = useTranslation('errors');
  
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const expectedText = "SMAZAT MŮJ ÚČET";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmText !== expectedText) {
      toast.error(t('confirmationTextIncorrect'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t('deletionRequestSent'));
      setConfirmText("");
    } catch (error) {
      toast.error(t('deletionRequestError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          {t('accountDeletion')}
        </CardTitle>
        <CardDescription>
          {t('permanentlyDeleteAccount')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-destructive/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{tError('generic')}:</strong> {t('warningIrreversible')}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-deletion">
              {t('confirmDeletionText')} <strong>{expectedText}</strong>
            </Label>
            <Input
              id="confirm-deletion"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={t('enterConfirmationText')}
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="destructive"
            disabled={isLoading || confirmText !== expectedText}
            className="w-full"
          >
            {isLoading ? t('sendingDeletionRequest') : t('deleteAccount')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionForm;
