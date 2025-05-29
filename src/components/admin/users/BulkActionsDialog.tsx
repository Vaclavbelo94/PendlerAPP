
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Crown, 
  Shield, 
  Mail, 
  Ban, 
  Download, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkActionsDialogProps {
  selectedUsers: string[];
  onClose: () => void;
  onComplete: () => void;
}

export const BulkActionsDialog: React.FC<BulkActionsDialogProps> = ({ 
  selectedUsers, 
  onClose, 
  onComplete 
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [confirmDangerousAction, setConfirmDangerousAction] = useState(false);

  const bulkActions = [
    {
      id: 'grant_premium',
      title: 'Udělit Premium',
      description: 'Přidat Premium status vybraným uživatelům',
      icon: <Crown className="h-5 w-5 text-amber-600" />,
      danger: false
    },
    {
      id: 'revoke_premium',
      title: 'Odebrat Premium',
      description: 'Odebrat Premium status vybraným uživatelům',
      icon: <Crown className="h-5 w-5 text-gray-600" />,
      danger: true
    },
    {
      id: 'grant_admin',
      title: 'Udělit Admin práva',
      description: 'Přidat administrátorská oprávnění',
      icon: <Shield className="h-5 w-5 text-red-600" />,
      danger: true
    },
    {
      id: 'revoke_admin',
      title: 'Odebrat Admin práva',
      description: 'Odebrat administrátorská oprávnění',
      icon: <Shield className="h-5 w-5 text-gray-600" />,
      danger: true
    },
    {
      id: 'send_email',
      title: 'Poslat hromadný email',
      description: 'Odeslat email všem vybraným uživatelům',
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      danger: false
    },
    {
      id: 'export_data',
      title: 'Exportovat data',
      description: 'Stáhnout data vybraných uživatelů',
      icon: <Download className="h-5 w-5 text-green-600" />,
      danger: false
    },
    {
      id: 'delete_users',
      title: 'Smazat uživatele',
      description: 'Trvale smazat vybrané uživatele',
      icon: <Ban className="h-5 w-5 text-red-600" />,
      danger: true
    }
  ];

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);
    setConfirmDangerousAction(false);
  };

  const executeAction = async () => {
    if (!selectedAction) {
      toast.error('Vyberte akci k provedení');
      return;
    }

    const action = bulkActions.find(a => a.id === selectedAction);
    if (!action) return;

    if (action.danger && !confirmDangerousAction) {
      toast.error('Potvrďte provedení nebezpečné akce');
      return;
    }

    if (selectedAction === 'send_email' && (!emailSubject || !emailMessage)) {
      toast.error('Vyplňte předmět a obsah emailu');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      switch (selectedAction) {
        case 'grant_premium':
          toast.success(`Premium status udělen ${selectedUsers.length} uživatelům`);
          break;
        case 'revoke_premium':
          toast.success(`Premium status odebrán ${selectedUsers.length} uživatelům`);
          break;
        case 'grant_admin':
          toast.success(`Admin práva udělena ${selectedUsers.length} uživatelům`);
          break;
        case 'revoke_admin':
          toast.success(`Admin práva odebrána ${selectedUsers.length} uživatelům`);
          break;
        case 'send_email':
          toast.success(`Email odeslán ${selectedUsers.length} uživatelům`);
          break;
        case 'export_data':
          // Simulate file download
          const csvContent = selectedUsers.map(id => `user-${id},data`).join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `bulk-export-${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('Data exportována');
          break;
        case 'delete_users':
          toast.success(`${selectedUsers.length} uživatelů smazáno`);
          break;
        default:
          toast.success('Akce dokončena');
      }

      onComplete();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Nastala chyba při provádění akce');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedActionDetails = bulkActions.find(a => a.id === selectedAction);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Hromadné akce
          </DialogTitle>
          <DialogDescription>
            Provedení akce na {selectedUsers.length} vybraných uživatelích
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Users Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vybraní uživatelé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {selectedUsers.length} uživatelů
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {selectedUsers.slice(0, 3).join(', ')}
                  {selectedUsers.length > 3 && ` +${selectedUsers.length - 3} dalších`}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vyberte akci</CardTitle>
              <CardDescription>
                Klikněte na akci, kterou chcete provést
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {bulkActions.map((action) => (
                  <div
                    key={action.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAction === action.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleActionSelect(action.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {action.icon}
                        <span className="font-medium">{action.title}</span>
                      </div>
                      {action.danger && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Nebezpečné
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Details */}
          {selectedActionDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {selectedActionDetails.icon}
                  {selectedActionDetails.title}
                </CardTitle>
                <CardDescription>
                  Konfigurace vybrané akce
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedActionDetails.danger && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Tato akce je nevratná a může mít vážné následky. Ujistěte se, že rozumíte důsledkům.
                    </AlertDescription>
                  </Alert>
                )}

                {selectedAction === 'send_email' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailSubject">Předmět emailu</Label>
                      <input
                        id="emailSubject"
                        className="w-full p-2 border rounded-md"
                        placeholder="Zadejte předmět emailu..."
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailMessage">Obsah emailu</Label>
                      <Textarea
                        id="emailMessage"
                        placeholder="Zadejte obsah emailu..."
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </div>
                )}

                {selectedActionDetails.danger && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="confirmDangerous"
                      checked={confirmDangerousAction}
                      onCheckedChange={(checked) => setConfirmDangerousAction(checked === true)}
                    />
                    <Label htmlFor="confirmDangerous" className="text-sm">
                      Potvrzuji, že rozumím důsledkům této akce
                    </Label>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Akce bude provedena na {selectedUsers.length} uživatelích
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                      Zrušit
                    </Button>
                    <Button 
                      onClick={executeAction} 
                      disabled={isProcessing}
                      variant={selectedActionDetails.danger ? "destructive" : "default"}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Provádí se...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Provést akci
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
