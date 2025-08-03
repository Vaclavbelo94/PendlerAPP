import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Gift, 
  Users,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Copy,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface CompanyPremiumCode {
  id: string;
  company: 'dhl' | 'adecco' | 'randstad' | null;
  code: string;
  name: string;
  description?: string;
  premium_duration_months: number;
  max_users?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  auto_generate: boolean;
  code_prefix?: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  company: 'dhl' | 'adecco' | 'randstad' | 'classic' | null;
  code: string;
  name: string;
  description: string;
  premium_duration_months: number;
  max_users: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  auto_generate: boolean;
  code_prefix: string;
}

export const CompanyPremiumCodesV2: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<CompanyPremiumCode | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>();

  // Fetch company premium codes
  const { data: premiumCodes = [], isLoading } = useQuery({
    queryKey: ['company-premium-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_premium_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CompanyPremiumCode[];
    },
  });

  // Fetch redemption statistics
  const { data: redemptionStats = [] } = useQuery({
    queryKey: ['premium-code-redemptions-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_premium_code_redemptions')
        .select(`
          company_premium_code_id,
          company_premium_codes!inner(code, name, company)
        `);

      if (error) throw error;
      return data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data, error } = await supabase
        .from('company_premium_codes')
        .insert({
          company: formData.company,
          code: formData.code,
          name: formData.name,
          description: formData.description || null,
          premium_duration_months: formData.premium_duration_months,
          max_users: formData.max_users ? parseInt(formData.max_users) : null,
          valid_from: formData.valid_from,
          valid_until: formData.valid_until,
          is_active: formData.is_active,
          auto_generate: formData.auto_generate,
          code_prefix: formData.code_prefix || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Premium kód byl vytvořen');
      queryClient.invalidateQueries({ queryKey: ['company-premium-codes'] });
      setIsCreateDialogOpen(false);
      reset();
    },
    onError: (error) => {
      console.error('Error creating premium code:', error);
      toast.error('Nepodařilo se vytvořit premium kód');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { data, error } = await supabase
        .from('company_premium_codes')
        .update({
          company: formData.company,
          code: formData.code,
          name: formData.name,
          description: formData.description || null,
          premium_duration_months: formData.premium_duration_months,
          max_users: formData.max_users ? parseInt(formData.max_users) : null,
          valid_from: formData.valid_from,
          valid_until: formData.valid_until,
          is_active: formData.is_active,
          auto_generate: formData.auto_generate,
          code_prefix: formData.code_prefix || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Premium kód byl aktualizován');
      queryClient.invalidateQueries({ queryKey: ['company-premium-codes'] });
      setEditingCode(null);
      reset();
    },
    onError: (error) => {
      console.error('Error updating premium code:', error);
      toast.error('Nepodařilo se aktualizovat premium kód');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_premium_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Premium kód byl smazán');
      queryClient.invalidateQueries({ queryKey: ['company-premium-codes'] });
    },
    onError: (error) => {
      console.error('Error deleting premium code:', error);
      toast.error('Nepodařilo se smazat premium kód');
    },
  });

  const filteredCodes = premiumCodes.filter(code => 
    selectedCompany === 'all' || code.company === selectedCompany
  );

  const handleOpenEditDialog = (code: CompanyPremiumCode) => {
    setEditingCode(code);
    setValue('company', code.company);
    setValue('code', code.code);
    setValue('name', code.name);
    setValue('description', code.description || '');
    setValue('premium_duration_months', code.premium_duration_months);
    setValue('max_users', code.max_users?.toString() || '');
    setValue('valid_from', format(new Date(code.valid_from), 'yyyy-MM-dd'));
    setValue('valid_until', format(new Date(code.valid_until), 'yyyy-MM-dd'));
    setValue('is_active', code.is_active);
    setValue('auto_generate', code.auto_generate);
    setValue('code_prefix', code.code_prefix || '');
  };

  const onSubmit = (formData: FormData) => {
    if (editingCode) {
      updateMutation.mutate({ id: editingCode.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Kód zkopírován do schránky');
  };

  const getCompanyBadge = (company: string) => {
    const colors = {
      dhl: 'bg-red-100 text-red-800',
      adecco: 'bg-blue-100 text-blue-800',
      randstad: 'bg-green-100 text-green-800',
    };
    return (
      <Badge className={colors[company as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {company.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Premium kódy pro firmy</h1>
          <p className="text-muted-foreground">
            Správa premium kódů pro jednotlivé firmy
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen || !!editingCode} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setEditingCode(null);
            reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Vytvořit kód
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCode ? 'Upravit premium kód' : 'Vytvořit nový premium kód'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Firma</Label>
                  <Select onValueChange={(value) => setValue('company', value as 'dhl' | 'adecco' | 'randstad')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte firmu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="adecco">Adecco</SelectItem>
                      <SelectItem value="randstad">Randstad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="code">Kód</Label>
                  <Input
                    {...register('code', { required: 'Kód je povinný' })}
                    placeholder="DHL_PREMIUM_2025"
                  />
                  {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="name">Název</Label>
                <Input
                  {...register('name', { required: 'Název je povinný' })}
                  placeholder="DHL Premium 2025"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  {...register('description')}
                  placeholder="Popis premium kódu..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="premium_duration_months">Délka trvání (měsíce)</Label>
                  <Input
                    type="number"
                    {...register('premium_duration_months', { 
                      required: 'Délka trvání je povinná',
                      valueAsNumber: true,
                      min: 1
                    })}
                    placeholder="12"
                  />
                  {errors.premium_duration_months && <p className="text-sm text-red-600">{errors.premium_duration_months.message}</p>}
                </div>

                <div>
                  <Label htmlFor="max_users">Max. počet uživatelů</Label>
                  <Input
                    type="number"
                    {...register('max_users')}
                    placeholder="1000 (prázdné = neomezeno)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Platný od</Label>
                  <Input
                    type="date"
                    {...register('valid_from', { required: 'Datum začátku je povinné' })}
                  />
                  {errors.valid_from && <p className="text-sm text-red-600">{errors.valid_from.message}</p>}
                </div>

                <div>
                  <Label htmlFor="valid_until">Platný do</Label>
                  <Input
                    type="date"
                    {...register('valid_until', { required: 'Datum konce je povinné' })}
                  />
                  {errors.valid_until && <p className="text-sm text-red-600">{errors.valid_until.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch {...register('is_active')} />
                <Label htmlFor="is_active">Aktivní</Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch {...register('auto_generate')} />
                  <Label htmlFor="auto_generate">Automatické generování kódů</Label>
                </div>
                
                {watch('auto_generate') && (
                  <div>
                    <Label htmlFor="code_prefix">Prefix pro auto-generované kódy</Label>
                    <Input
                      {...register('code_prefix')}
                      placeholder="DHL_"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingCode(null);
                    reset();
                  }}
                >
                  Zrušit
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingCode ? 'Aktualizovat' : 'Vytvořit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Filtry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Všechny firmy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny firmy</SelectItem>
                <SelectItem value="dhl">DHL</SelectItem>
                <SelectItem value="adecco">Adecco</SelectItem>
                <SelectItem value="randstad">Randstad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Premium Codes List */}
      <div className="grid gap-4">
        {filteredCodes.map((code) => (
          <Card key={code.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{code.name}</h3>
                    {getCompanyBadge(code.company)}
                    {code.is_active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aktivní
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Neaktivní
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4" />
                      <code className="bg-muted px-2 py-1 rounded font-mono">{code.code}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCodeToClipboard(code.code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {code.premium_duration_months} měsíc{code.premium_duration_months > 1 ? 'ů' : ''}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {code.used_count}/{code.max_users || '∞'} použití
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {Math.round((code.used_count / (code.max_users || 100)) * 100)}% využití
                    </div>
                  </div>
                  
                  {code.description && (
                    <p className="text-sm text-muted-foreground">{code.description}</p>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Platný: {format(new Date(code.valid_from), 'dd.MM.yyyy', { locale: cs })} - {format(new Date(code.valid_until), 'dd.MM.yyyy', { locale: cs })}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditDialog(code)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Smazat premium kód</AlertDialogTitle>
                        <AlertDialogDescription>
                          Opravdu chcete smazat premium kód "{code.name}"? 
                          Tato akce je nevratná.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(code.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Smazat
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCodes.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Žádné premium kódy nenalezeny</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};