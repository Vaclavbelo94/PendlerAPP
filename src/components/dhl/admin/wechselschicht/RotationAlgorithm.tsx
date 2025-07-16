import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw, 
  Users, 
  Clock, 
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import type { DHLWechselschichtPattern } from '@/types/dhl';

interface RotationAlgorithmProps {
  patterns: DHLWechselschichtPattern[];
}

interface EmployeeRotation {
  user_id: string;
  username?: string;
  email?: string;
  current_woche: number;
  next_woche: number;
  last_rotation: string | null;
  needs_rotation: boolean;
}

const RotationAlgorithm: React.FC<RotationAlgorithmProps> = ({ patterns }) => {
  const [employees, setEmployees] = useState<EmployeeRotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);

  useEffect(() => {
    loadEmployeeRotations();
    checkAutoRotationStatus();
  }, []);

  const loadEmployeeRotations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_dhl_assignments')
        .select(`
          user_id,
          current_woche,
          updated_at,
          profiles:user_id (
            username,
            email
          )
        `)
        .eq('is_active', true)
        .not('current_woche', 'is', null);

      if (error) throw error;

      const rotations: EmployeeRotation[] = data?.map(emp => {
        const currentWoche = emp.current_woche || 1;
        const nextWoche = currentWoche >= 15 ? 1 : currentWoche + 1;
        const lastRotation = emp.updated_at;
        
        // Check if rotation is needed (simplified: weekly rotation)
        const lastRotationDate = new Date(lastRotation);
        const weeksSinceRotation = Math.floor((Date.now() - lastRotationDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        return {
          user_id: emp.user_id,
          username: emp.profiles?.username,
          email: emp.profiles?.email,
          current_woche: currentWoche,
          next_woche: nextWoche,
          last_rotation: lastRotation,
          needs_rotation: weeksSinceRotation >= 1
        };
      }) || [];

      setEmployees(rotations);
    } catch (error) {
      console.error('Error loading employee rotations:', error);
      toast.error('Chyba při načítání rotací zaměstnanců');
    } finally {
      setLoading(false);
    }
  };

  const checkAutoRotationStatus = async () => {
    // Check if auto rotation is enabled (could be stored in settings table)
    setAutoRotationEnabled(false); // Default for now
  };

  const handleManualRotation = async (employeeId: string) => {
    try {
      const employee = employees.find(emp => emp.user_id === employeeId);
      if (!employee) return;

      const { error } = await supabase
        .from('user_dhl_assignments')
        .update({
          current_woche: employee.next_woche,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', employeeId)
        .eq('is_active', true);

      if (error) throw error;

      // Create notification for employee
      await supabase
        .from('notifications')
        .insert({
          user_id: employeeId,
          title: 'Rotace do nové Woche',
          message: `🔄 Byl jste přesunut z Woche ${employee.current_woche} do Woche ${employee.next_woche}`,
          type: 'woche_rotation',
          related_to: {
            type: 'rotation',
            old_woche: employee.current_woche,
            new_woche: employee.next_woche
          }
        });

      toast.success(`Zaměstnanec přesunut do Woche ${employee.next_woche}`);
      loadEmployeeRotations();
      
    } catch (error) {
      console.error('Error rotating employee:', error);
      toast.error('Chyba při rotaci zaměstnance');
    }
  };

  const handleBulkRotation = async () => {
    const employeesNeedingRotation = employees.filter(emp => emp.needs_rotation);
    
    if (employeesNeedingRotation.length === 0) {
      toast.info('Žádní zaměstnanci nepotřebují rotaci');
      return;
    }

    setLoading(true);
    setRotationProgress(0);

    try {
      for (let i = 0; i < employeesNeedingRotation.length; i++) {
        const employee = employeesNeedingRotation[i];
        
        // Update employee's woche
        const { error } = await supabase
          .from('user_dhl_assignments')
          .update({
            current_woche: employee.next_woche,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', employee.user_id)
          .eq('is_active', true);

        if (error) throw error;

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: employee.user_id,
            title: 'Automatická rotace do nové Woche',
            message: `🔄 ROTACE: Automaticky přesunut z Woche ${employee.current_woche} do Woche ${employee.next_woche}`,
            type: 'woche_rotation',
            related_to: {
              type: 'bulk_rotation',
              old_woche: employee.current_woche,
              new_woche: employee.next_woche
            }
          });

        // Update progress
        setRotationProgress(((i + 1) / employeesNeedingRotation.length) * 100);
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast.success(`Úspěšně rotováno ${employeesNeedingRotation.length} zaměstnanců`);
      loadEmployeeRotations();
      
    } catch (error) {
      console.error('Error in bulk rotation:', error);
      toast.error('Chyba při hromadné rotaci');
    } finally {
      setLoading(false);
      setRotationProgress(0);
    }
  };

  const getWochePatternName = (wocheNumber: number) => {
    const pattern = patterns.find(p => p.woche_number === wocheNumber);
    return pattern?.pattern_name || `Woche ${wocheNumber}`;
  };

  const employeesNeedingRotation = employees.filter(emp => emp.needs_rotation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Rotační algoritmus</h3>
          <p className="text-sm text-muted-foreground">
            Automatické a manuální přesouvání zaměstnanců mezi Woche vzorci
          </p>
        </div>
        <Button onClick={loadEmployeeRotations} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Obnovit
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Celkem zaměstnanců</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Čeká na rotaci</p>
                <p className="text-2xl font-bold text-orange-600">{employeesNeedingRotation.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Aktivní vzorce</p>
                <p className="text-2xl font-bold">{patterns.filter(p => p.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Auto rotace</p>
                <p className="text-lg font-bold">
                  {autoRotationEnabled ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">Zapnuto</Badge>
                  ) : (
                    <Badge variant="secondary">Vypnuto</Badge>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {employeesNeedingRotation.length > 0 && (
        <Card className="bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
              <AlertCircle className="h-5 w-5" />
              Čekající rotace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-orange-700 dark:text-orange-200">
                {employeesNeedingRotation.length} zaměstnanců čeká na rotaci do nové Woche.
              </p>
              
              {rotationProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Průběh rotace</span>
                    <span>{Math.round(rotationProgress)}%</span>
                  </div>
                  <Progress value={rotationProgress} />
                </div>
              )}
              
              <Button 
                onClick={handleBulkRotation} 
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rotace probíhá...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Rotovat všechny čekající ({employeesNeedingRotation.length})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Přehled zaměstnanců a rotací
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Načítání...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Žádní zaměstnanci s přiřazenou Woche</p>
              </div>
            ) : (
              employees.map((employee) => (
                <div 
                  key={employee.user_id} 
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    employee.needs_rotation ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      employee.needs_rotation ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {employee.current_woche}
                    </div>
                    <div>
                      <div className="font-medium">
                        {employee.username || employee.email?.split('@')[0] || 'Neznámý uživatel'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {employee.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Poslední rotace: {employee.last_rotation 
                          ? new Date(employee.last_rotation).toLocaleDateString('cs-CZ')
                          : 'Nikdy'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Aktuální</div>
                      <Badge variant="outline">
                        {getWochePatternName(employee.current_woche)}
                      </Badge>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Další</div>
                      <Badge variant="secondary">
                        {getWochePatternName(employee.next_woche)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {employee.needs_rotation ? (
                        <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Čeká
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManualRotation(employee.user_id)}
                        disabled={loading}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RotationAlgorithm;