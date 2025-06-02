
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Copy, Calendar, Users, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  duration: number;
  max_uses: number | null;
  used_count: number;
  valid_until: string;
  created_at: string;
}

export const PromoCodesPanel: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    duration: '',
    maxUses: '',
    validUntil: ''
  });

  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast.error('Nepodařilo se načíst promo kódy');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promoData = {
        code: formData.code.toUpperCase(),
        discount: parseInt(formData.discount),
        duration: parseInt(formData.duration),
        max_uses: formData.maxUses ? parseInt(formData.maxUses) : null,
        valid_until: formData.validUntil
      };

      if (editingCode) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', editingCode.id);
        
        if (error) throw error;
        toast.success('Promo kód byl aktualizován');
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert([promoData]);
        
        if (error) throw error;
        toast.success('Promo kód byl vytvořen');
      }

      setIsDialogOpen(false);
      setEditingCode(null);
      setFormData({ code: '', discount: '', duration: '', maxUses: '', validUntil: '' });
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error saving promo code:', error);
      toast.error(error.message || 'Nepodařilo se uložit promo kód');
    }
  };

  const handleEdit = (promoCode: PromoCode) => {
    setEditingCode(promoCode);
    setFormData({
      code: promoCode.code,
      discount: promoCode.discount.toString(),
      duration: promoCode.duration.toString(),
      maxUses: promoCode.max_uses?.toString() || '',
      validUntil: promoCode.valid_until.split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento promo kód?')) return;

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Promo kód byl smazán');
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast.error('Nepodařilo se smazat promo kód');
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Kód zkopírován do schránky');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promo kódy</h1>
          <p className="text-muted-foreground">Správa slevových kódů a jejich využití</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCode(null);
              setFormData({ code: '', discount: '', duration: '', maxUses: '', validUntil: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nový promo kód
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCode ? 'Upravit promo kód' : 'Vytvořit nový promo kód'}
              </DialogTitle>
              <DialogDescription>
                Vyplňte detaily pro {editingCode ? 'úpravu' : 'vytvoření'} promo kódu.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Kód</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SLEVA20"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Sleva (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="20"
                    min="1"
                    max="100"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Doba trvání (dny)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxUses">Max. použití</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="Neomezeno"
                    min="1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="validUntil">Platné do</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Zrušit
                </Button>
                <Button type="submit">
                  {editingCode ? 'Aktualizovat' : 'Vytvořit'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Celkem kódů</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promoCodes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktivní kódy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {promoCodes.filter(code => new Date(code.valid_until) > new Date()).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Celkem použití</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {promoCodes.reduce((sum, code) => sum + code.used_count, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Průměrná sleva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {promoCodes.length > 0 
                ? Math.round(promoCodes.reduce((sum, code) => sum + code.discount, 0) / promoCodes.length)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Přehled promo kódů</CardTitle>
          <CardDescription>Správa všech slevových kódů</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kód</TableHead>
                <TableHead>Sleva</TableHead>
                <TableHead>Doba trvání</TableHead>
                <TableHead>Použití</TableHead>
                <TableHead>Platné do</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promoCode) => {
                const isActive = new Date(promoCode.valid_until) > new Date();
                const isLimitReached = promoCode.max_uses && promoCode.used_count >= promoCode.max_uses;
                
                return (
                  <TableRow key={promoCode.id}>
                    <TableCell className="font-mono font-medium">
                      <div className="flex items-center gap-2">
                        {promoCode.code}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(promoCode.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        {promoCode.discount}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {promoCode.duration} dní
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {promoCode.used_count}
                        {promoCode.max_uses && `/${promoCode.max_uses}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(promoCode.valid_until).toLocaleDateString('cs-CZ')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isActive && !isLimitReached ? "default" : "secondary"}>
                        {isLimitReached ? 'Vyčerpáno' : isActive ? 'Aktivní' : 'Vypršel'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(promoCode)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(promoCode.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {promoCodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Žádné promo kódy nebyly nalezeny. Vytvořte první promo kód.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
