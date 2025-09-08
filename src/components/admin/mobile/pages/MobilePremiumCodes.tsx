import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Calendar,
  Users,
  Building2,
  Eye,
  Trash2
} from 'lucide-react';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const MobilePremiumCodes: React.FC = () => {
  const { hasPermission } = useAdminV2();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Form state for creating new code
  const [newCode, setNewCode] = useState({
    code: '',
    name: '',
    description: '',
    company: '',
    premium_duration_months: 1,
    max_users: null as number | null,
    valid_until: ''
  });

  const { data: premiumCodes, isLoading } = useQuery({
    queryKey: ['mobile-admin-premium-codes', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('company_premium_codes')
        .select(`
          *,
          company_premium_code_redemptions(
            id,
            user_id,
            redeemed_at,
            profiles(email)
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`code.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: hasPermission('admin')
  });

  const createCodeMutation = useMutation({
    mutationFn: async (codeData: typeof newCode) => {
      const { data, error } = await supabase
        .from('company_premium_codes')
        .insert({
          ...codeData,
          company: (codeData.company as any) || null,
          max_users: codeData.max_users || null,
          valid_until: new Date(codeData.valid_until).toISOString()
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-admin-premium-codes'] });
      toast.success('Premium kód byl vytvořen');
      setShowCreateDialog(false);
      setNewCode({
        code: '',
        name: '',
        description: '',
        company: '',
        premium_duration_months: 1,
        max_users: null,
        valid_until: ''
      });
    },
    onError: () => {
      toast.error('Nepodařilo se vytvořit premium kód');
    }
  });

  const deactivateCodeMutation = useMutation({
    mutationFn: async (codeId: string) => {
      const { error } = await supabase
        .from('company_premium_codes')
        .update({ is_active: false })
        .eq('id', codeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-admin-premium-codes'] });
      toast.success('Premium kód byl deaktivován');
    },
    onError: () => {
      toast.error('Nepodařilo se deaktivovat premium kód');
    }
  });

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(prev => ({ ...prev, code: result }));
  };

  if (!hasPermission('admin')) {
    return (
      <div className="p-4 text-center">
        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nemáte oprávnění ke správě premium kódů.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Premium kódy
        </h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Nový
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Vytvořit premium kód</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Kód</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={newCode.code}
                    onChange={(e) => setNewCode(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Zadejte kód"
                  />
                  <Button type="button" variant="outline" onClick={generateRandomCode}>
                    Generovat
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Název</Label>
                <Input
                  id="name"
                  value={newCode.name}
                  onChange={(e) => setNewCode(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Název kódu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Firma</Label>
                <Select value={newCode.company} onValueChange={(value) => setNewCode(prev => ({ ...prev, company: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte firmu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Všechny</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                    <SelectItem value="adecco">Adecco</SelectItem>
                    <SelectItem value="randstad">Randstad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Doba platnosti (měsíce)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={newCode.premium_duration_months}
                  onChange={(e) => setNewCode(prev => ({ ...prev, premium_duration_months: parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_users">Maximální počet uživatelů</Label>
                <Input
                  id="max_users"
                  type="number"
                  min="1"
                  value={newCode.max_users || ''}
                  onChange={(e) => setNewCode(prev => ({ ...prev, max_users: e.target.value ? parseInt(e.target.value) : null }))}
                  placeholder="Neomezeno"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valid_until">Platný do</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={newCode.valid_until}
                  onChange={(e) => setNewCode(prev => ({ ...prev, valid_until: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => createCodeMutation.mutate(newCode)}
                  disabled={createCodeMutation.isPending}
                  className="flex-1"
                >
                  Vytvořit
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Zrušit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Vyhledat kódy..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Premium Codes List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          premiumCodes?.map((code: any) => (
            <Card key={code.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-lg">{code.code}</span>
                      <Badge variant={code.is_active ? "default" : "secondary"}>
                        {code.is_active ? 'Aktivní' : 'Neaktivní'}
                      </Badge>
                    </div>
                    <p className="font-medium">{code.name}</p>
                    {code.description && (
                      <p className="text-sm text-muted-foreground">{code.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deactivateCodeMutation.mutate(code.id)}
                    disabled={!code.is_active || deactivateCodeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{code.company || 'Všechny firmy'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{code.premium_duration_months}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {code.used_count || 0}
                      {code.max_users ? `/${code.max_users}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Do {new Date(code.valid_until).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>
                </div>

                {code.company_premium_code_redemptions?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Nedávné využití:</p>
                    <div className="space-y-1">
                      {code.company_premium_code_redemptions.slice(0, 3).map((redemption: any) => (
                        <div key={redemption.id} className="flex justify-between text-xs text-muted-foreground">
                          <span>{redemption.profiles?.email}</span>
                          <span>{new Date(redemption.redeemed_at).toLocaleDateString('cs-CZ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )) || []
        )}

        {!isLoading && (!premiumCodes?.length) && (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Žádné premium kódy nenalezeny</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};