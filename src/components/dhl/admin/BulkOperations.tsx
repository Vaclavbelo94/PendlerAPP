import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  Trash, 
  Edit3, 
  Clock, 
  Calendar,
  CheckSquare,
  Square,
  Upload,
  Download,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BulkOperationsProps {
  selectedShifts: string[];
  onSelectionChange: (shifts: string[]) => void;
  onRefresh: () => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedShifts,
  onSelectionChange,
  onRefresh
}) => {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newType, setNewType] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  const handleBulkUpdate = async () => {
    if (selectedShifts.length === 0) {
      toast.error('Nejdříve vyberte směny');
      return;
    }

    setLoading(true);
    try {
      const updates: any = {};
      
      if (newStartTime) updates.start_time = newStartTime;
      if (newEndTime) updates.end_time = newEndTime;
      if (newType) updates.type = newType;

      const { error } = await supabase
        .from('shifts')
        .update(updates)
        .in('id', selectedShifts);

      if (error) throw error;

      toast.success(`Aktualizováno ${selectedShifts.length} směn`);
      onSelectionChange([]);
      onRefresh();
    } catch (error) {
      console.error('Error updating shifts:', error);
      toast.error('Chyba při aktualizaci směn');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedShifts.length === 0) {
      toast.error('Nejdříve vyberte směny');
      return;
    }

    if (!confirm(`Opravdu chcete smazat ${selectedShifts.length} směn?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .in('id', selectedShifts);

      if (error) throw error;

      toast.success(`Smazáno ${selectedShifts.length} směn`);
      onSelectionChange([]);
      onRefresh();
    } catch (error) {
      console.error('Error deleting shifts:', error);
      toast.error('Chyba při mazání směn');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCopy = async () => {
    if (selectedShifts.length === 0) {
      toast.error('Nejdříve vyberte směny');
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast.error('Vyberte cílové datumové rozmezí');
      return;
    }

    setLoading(true);
    try {
      // Načtení vybraných směn
      const { data: shifts, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .in('id', selectedShifts);

      if (fetchError) throw fetchError;

      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const newShifts = [];
      
      for (let i = 0; i <= daysDiff; i++) {
        const targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + i);
        
        for (const shift of shifts || []) {
          newShifts.push({
            ...shift,
            id: undefined,
            date: targetDate.toISOString().split('T')[0],
            created_at: undefined,
            updated_at: undefined
          });
        }
      }

      const { error: insertError } = await supabase
        .from('shifts')
        .insert(newShifts);

      if (insertError) throw insertError;

      toast.success(`Zkopírováno ${newShifts.length} směn`);
      onSelectionChange([]);
      onRefresh();
    } catch (error) {
      console.error('Error copying shifts:', error);
      toast.error('Chyba při kopírování směn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Výběr směn
          </CardTitle>
          <CardDescription>
            Aktuálně vybrané směny pro hromadné operace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm">
              {selectedShifts.length} vybraných směn
            </Badge>
            {selectedShifts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectionChange([])}
              >
                <Square className="h-4 w-4 mr-2" />
                Zrušit výběr
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Hromadné operace
          </CardTitle>
          <CardDescription>
            Provádění operací na více směnách najednou
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bulk Update */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hromadná aktualizace
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-start-time">Nový začátek směny</Label>
                <Input
                  id="bulk-start-time"
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-end-time">Nový konec směny</Label>
                <Input
                  id="bulk-end-time"
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-type">Nový typ směny</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ranní">Ranní směna</SelectItem>
                    <SelectItem value="odpolední">Odpolední směna</SelectItem>
                    <SelectItem value="noční">Noční směna</SelectItem>
                    <SelectItem value="víkendová">Víkendová směna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleBulkUpdate}
              disabled={loading || selectedShifts.length === 0}
              className="w-full"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Aktualizovat vybrané směny
            </Button>
          </div>

          <Separator />

          {/* Bulk Copy */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Hromadné kopírování
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="copy-from">Od data</Label>
                <Input
                  id="copy-from"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copy-to">Do data</Label>
                <Input
                  id="copy-to"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>
            <Button
              onClick={handleBulkCopy}
              disabled={loading || selectedShifts.length === 0}
              className="w-full"
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Kopírovat do vybraného období
            </Button>
          </div>

          <Separator />

          {/* Bulk Delete */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2 text-red-600">
              <Trash className="h-4 w-4" />
              Hromadné mazání
            </h4>
            <Button
              onClick={handleBulkDelete}
              disabled={loading || selectedShifts.length === 0}
              variant="destructive"
              className="w-full"
            >
              <Trash className="h-4 w-4 mr-2" />
              Smazat vybrané směny
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Rychlé filtry
          </CardTitle>
          <CardDescription>
            Rychlé způsoby výběru směn podle kritérií
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Vybrat všechny směny tento týden
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Clock className="h-4 w-4 mr-2" />
            Vybrat všechny ranní směny
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <CheckSquare className="h-4 w-4 mr-2" />
            Vybrat všechny prázdné pozice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;