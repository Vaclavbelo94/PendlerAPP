import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  RefreshCw,
  Eye,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConflictRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
}

interface Conflict {
  id: string;
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  affectedShifts: string[];
  userId: string;
  userName: string;
  date: string;
  suggestion?: string;
}

const ShiftConflictDetector: React.FC = () => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [rules, setRules] = useState<ConflictRule[]>([
    {
      id: 'overtime-limit',
      name: 'Překročení maximální pracovní doby',
      description: 'Detekuje směny překračující zákonný limit pracovní doby',
      severity: 'error',
      enabled: true
    },
    {
      id: 'insufficient-rest',
      name: 'Nedostatečný odpočinek',
      description: 'Kontroluje minimální dobu odpočinku mezi směnami (11 hodin)',
      severity: 'error',
      enabled: true
    },
    {
      id: 'double-booking',
      name: 'Dvojité obsazení',
      description: 'Detekuje překrývající se směny pro stejného zaměstnance',
      severity: 'error',
      enabled: true
    },
    {
      id: 'weekend-overtime',
      name: 'Přesčas o víkendu',
      description: 'Upozorňuje na práci o víkendech',
      severity: 'warning',
      enabled: true
    },
    {
      id: 'long-shift',
      name: 'Dlouhé směny',
      description: 'Upozorňuje na směny delší než 10 hodin',
      severity: 'warning',
      enabled: true
    },
    {
      id: 'position-understaffed',
      name: 'Nedostatečné obsazení pozice',
      description: 'Kontroluje minimální počet zaměstnanců na pozici',
      severity: 'info',
      enabled: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState({ total: 0, errors: 0, warnings: 0, info: 0 });

  useEffect(() => {
    runConflictDetection();
  }, []);

  const runConflictDetection = async () => {
    setLoading(true);
    try {
      // Načtení směn za posledních 30 dní
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: shifts, error: shiftsError } = await supabase
        .from('shifts')
        .select(`
          *,
          profiles:user_id (username, email)
        `)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .eq('is_dhl_managed', true)
        .order('date', { ascending: true });

      if (shiftsError) throw shiftsError;

      // Analýza konfliktů
      const detectedConflicts: Conflict[] = [];
      
      if (shifts) {
        // Skupinování směn podle uživatelů
        const shiftsByUser = shifts.reduce((acc, shift) => {
          if (!acc[shift.user_id]) acc[shift.user_id] = [];
          acc[shift.user_id].push(shift);
          return acc;
        }, {} as Record<string, any[]>);

        // Kontrola konfliktů pro každého uživatele
        Object.entries(shiftsByUser).forEach(([userId, userShifts]) => {
          userShifts.sort((a, b) => new Date(a.date + ' ' + a.start_time).getTime() - new Date(b.date + ' ' + b.start_time).getTime());
          
          for (let i = 0; i < userShifts.length; i++) {
            const currentShift = userShifts[i];
            const userName = currentShift.profiles?.username || currentShift.profiles?.email || 'Neznámý uživatel';

            // 1. Kontrola dlouhých směn
            if (rules.find(r => r.id === 'long-shift' && r.enabled)) {
              const startTime = new Date(`${currentShift.date} ${currentShift.start_time}`);
              const endTime = new Date(`${currentShift.date} ${currentShift.end_time}`);
              const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
              
              if (duration > 10) {
                detectedConflicts.push({
                  id: `long-shift-${currentShift.id}`,
                  ruleId: 'long-shift',
                  severity: 'warning',
                  title: 'Dlouhá směna',
                  description: `Směna trvá ${duration.toFixed(1)} hodin (více než 10h)`,
                  affectedShifts: [currentShift.id],
                  userId,
                  userName,
                  date: currentShift.date,
                  suggestion: 'Zvažte rozdělení směny nebo přidání přestávky'
                });
              }
            }

            // 2. Kontrola víkendových směn
            if (rules.find(r => r.id === 'weekend-overtime' && r.enabled)) {
              const shiftDate = new Date(currentShift.date);
              const dayOfWeek = shiftDate.getDay();
              
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                detectedConflicts.push({
                  id: `weekend-${currentShift.id}`,
                  ruleId: 'weekend-overtime',
                  severity: 'warning',
                  title: 'Víkendová směna',
                  description: 'Směna naplánována na víkend',
                  affectedShifts: [currentShift.id],
                  userId,
                  userName,
                  date: currentShift.date,
                  suggestion: 'Ověřte souhlas zaměstnance s víkendovou prací'
                });
              }
            }

            // 3. Kontrola nedostatečného odpočinku
            if (i > 0 && rules.find(r => r.id === 'insufficient-rest' && r.enabled)) {
              const previousShift = userShifts[i - 1];
              const previousEnd = new Date(`${previousShift.date} ${previousShift.end_time}`);
              const currentStart = new Date(`${currentShift.date} ${currentShift.start_time}`);
              const restHours = (currentStart.getTime() - previousEnd.getTime()) / (1000 * 60 * 60);
              
              if (restHours < 11) {
                detectedConflicts.push({
                  id: `rest-${currentShift.id}`,
                  ruleId: 'insufficient-rest',
                  severity: 'error',
                  title: 'Nedostatečný odpočinek',
                  description: `Pouze ${restHours.toFixed(1)} hodin odpočinku (minimum 11h)`,
                  affectedShifts: [previousShift.id, currentShift.id],
                  userId,
                  userName,
                  date: currentShift.date,
                  suggestion: 'Přesuňte směnu nebo zajistěte delší odpočinek'
                });
              }
            }

            // 4. Kontrola dvojitého obsazení (překrývající se směny)
            if (rules.find(r => r.id === 'double-booking' && r.enabled)) {
              for (let j = i + 1; j < userShifts.length; j++) {
                const otherShift = userShifts[j];
                if (currentShift.date === otherShift.date) {
                  const currentStart = new Date(`${currentShift.date} ${currentShift.start_time}`);
                  const currentEnd = new Date(`${currentShift.date} ${currentShift.end_time}`);
                  const otherStart = new Date(`${otherShift.date} ${otherShift.start_time}`);
                  const otherEnd = new Date(`${otherShift.date} ${otherShift.end_time}`);
                  
                  // Kontrola překrývání
                  if (currentStart < otherEnd && otherStart < currentEnd) {
                    detectedConflicts.push({
                      id: `double-booking-${currentShift.id}-${otherShift.id}`,
                      ruleId: 'double-booking',
                      severity: 'error',
                      title: 'Dvojité obsazení',
                      description: 'Překrývající se směny pro stejného zaměstnance',
                      affectedShifts: [currentShift.id, otherShift.id],
                      userId,
                      userName,
                      date: currentShift.date,
                      suggestion: 'Přesuňte nebo zrušte jednu ze směn'
                    });
                  }
                }
              }
            }
          }
        });
      }

      setConflicts(detectedConflicts);
      
      // Počítání výsledků
      const results = {
        total: detectedConflicts.length,
        errors: detectedConflicts.filter(c => c.severity === 'error').length,
        warnings: detectedConflicts.filter(c => c.severity === 'warning').length,
        info: detectedConflicts.filter(c => c.severity === 'info').length,
      };
      setScanResults(results);

      toast.success(`Analýza dokončena. Nalezeno ${results.total} problémů.`);
    } catch (error) {
      console.error('Error detecting conflicts:', error);
      toast.error('Chyba při detekci konfliktů');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error': return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'info': return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Detekce konfliktů směn
              </CardTitle>
              <CardDescription>
                Automatická kontrola a detekce problémů v rozvrzích směn
              </CardDescription>
            </div>
            <Button
              onClick={runConflictDetection}
              disabled={loading}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzuji...' : 'Spustit analýzu'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scanResults.total}
              </div>
              <div className="text-sm text-muted-foreground">Celkem problémů</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {scanResults.errors}
              </div>
              <div className="text-sm text-muted-foreground">Chyby</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {scanResults.warnings}
              </div>
              <div className="text-sm text-muted-foreground">Varování</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {scanResults.info}
              </div>
              <div className="text-sm text-muted-foreground">Informace</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflict Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Pravidla kontroly</CardTitle>
          <CardDescription>
            Konfigurace pravidel pro detekci konfliktů
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(rule.severity)}
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-muted-foreground">{rule.description}</div>
                  </div>
                </div>
                <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                  {rule.enabled ? 'Aktivní' : 'Neaktivní'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detected Conflicts */}
      <Card>
        <CardHeader>
          <CardTitle>Detekované konflikty</CardTitle>
          <CardDescription>
            Seznam nalezených problémů v rozvrzích směn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {conflicts.length > 0 ? (
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <Alert key={conflict.id} className={getSeverityColor(conflict.severity)}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(conflict.severity)}
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{conflict.title}</div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(conflict.date).toLocaleDateString('cs-CZ')}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div><strong>Zaměstnanec:</strong> {conflict.userName}</div>
                          <div><strong>Popis:</strong> {conflict.description}</div>
                          {conflict.suggestion && (
                            <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                              <strong>Doporučení:</strong> {conflict.suggestion}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Zobrazit směny
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            Upravit rozvrh
                          </Button>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Žádné konflikty nenalezeny</h3>
              <p className="text-muted-foreground">
                Všechny směny jsou správně naplánované bez konfliktů
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftConflictDetector;