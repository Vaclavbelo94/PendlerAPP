
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Truck, Calendar, Settings, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDHLData } from "@/hooks/dhl/useDHLData";
import { useDHLSetup } from "@/hooks/dhl/useDHLSetup";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

interface UserDHLAssignment {
  id: string;
  dhl_position_id: string;
  dhl_work_group_id: string;
  reference_date?: string;
  reference_woche?: number;
  dhl_position?: {
    name: string;
    description?: string;
  };
  dhl_work_group?: {
    name: string;
    description?: string;
  };
}

const DHLProfileSettings = () => {
  const { t } = useTranslation('profile');
  const { user } = useAuth();
  
  // Pass user.id to useDHLData to properly load assignment data
  const { positions, workGroups, userAssignment, isLoading: dhlDataLoading, error: dhlDataError } = useDHLData(user?.id);
  const { submitSetup, isSubmitting } = useDHLSetup();
  
  const [assignment, setAssignment] = useState<UserDHLAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<string>('');
  const [referenceDate, setReferenceDate] = useState<string>('');
  const [referenceWoche, setReferenceWoche] = useState<string>('');

  console.log('DHLProfileSettings - User:', user?.email);
  console.log('DHLProfileSettings - DHL Data Loading:', dhlDataLoading);
  console.log('DHLProfileSettings - DHL Data Error:', dhlDataError);
  console.log('DHLProfileSettings - User Assignment:', userAssignment);
  console.log('DHLProfileSettings - Positions:', positions.length);
  console.log('DHLProfileSettings - Work Groups:', workGroups.length);

  useEffect(() => {
    // Use the userAssignment from useDHLData hook
    if (userAssignment) {
      setAssignment(userAssignment);
      setSelectedPosition(userAssignment.dhl_position_id);
      setSelectedWorkGroup(userAssignment.dhl_work_group_id);
      setReferenceDate(userAssignment.reference_date || '');
      setReferenceWoche(userAssignment.reference_woche?.toString() || '');
    }
    setLoading(dhlDataLoading);
  }, [userAssignment, dhlDataLoading]);

  const handleSave = async () => {
    if (!selectedPosition || !selectedWorkGroup || !referenceDate || !referenceWoche) {
      toast.error('Vyplňte všechna povinná pole');
      return;
    }

    console.log('DHLProfileSettings - Saving setup:', {
      position_id: selectedPosition,
      work_group_id: selectedWorkGroup,
      reference_date: referenceDate,
      reference_woche: parseInt(referenceWoche)
    });

    const success = await submitSetup({
      position_id: selectedPosition,
      work_group_id: selectedWorkGroup,
      reference_date: referenceDate,
      reference_woche: parseInt(referenceWoche)
    });

    if (success) {
      toast.success('DHL nastavení bylo úspěšně uloženo');
      // Reload the assignment data
      window.location.reload();
    }
  };

  // Show error state if there's an error loading DHL data
  if (dhlDataError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Truck className="h-5 w-5" />
            Chyba načítání DHL dat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Nepodařilo se načíst DHL data: {dhlDataError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Zkusit znovu
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-yellow-600" />
            DHL Nastavení
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-yellow-600" />
          DHL Nastavení
        </CardTitle>
        <CardDescription>
          Spravujte své DHL nastavení včetně pozice, pracovní skupiny a Woche reference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {assignment && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-sm">Aktuální nastavení</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Pozice:</strong> {assignment.dhl_position?.name}
              </div>
              <div>
                <strong>Skupina:</strong> {assignment.dhl_work_group?.name}
              </div>
              {assignment.reference_date && (
                <div>
                  <strong>Ref. datum:</strong> {new Date(assignment.reference_date).toLocaleDateString('cs-CZ')}
                </div>
              )}
              {assignment.reference_woche && (
                <div>
                  <strong>Ref. Woche:</strong> {assignment.reference_woche}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dhl-position">Pozice</Label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte svou pozici" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    <div>
                      <div className="font-medium">{position.name}</div>
                      {position.description && (
                        <div className="text-xs text-muted-foreground">{position.description}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dhl-workgroup">Pracovní skupina</Label>
            <Select value={selectedWorkGroup} onValueChange={setSelectedWorkGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte pracovní skupinu" />
              </SelectTrigger>
              <SelectContent>
                {workGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <div>
                      <div className="font-medium">{group.name}</div>
                      {group.description && (
                        <div className="text-xs text-muted-foreground">{group.description}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reference-date">Referenční datum</Label>
            <Input
              id="reference-date"
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Datum, od kterého se počítá váš Woche cyklus
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference-woche">Referenční Woche</Label>
            <Select value={referenceWoche} onValueChange={setReferenceWoche}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte Woche" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => i + 1).map(week => (
                  <SelectItem key={week} value={week.toString()}>
                    Woche {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Jaké Woche číslo máte k referenčnímu datumu
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Info:</strong> Změna těchto nastavení ovlivní výpočet vašeho aktuálního Woche cyklu 
              a může mít vliv na import směn od administrátora.
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={!selectedPosition || !selectedWorkGroup || !referenceDate || !referenceWoche || isSubmitting}
            className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
          >
            {isSubmitting ? (
              'Ukládám...'
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Uložit DHL nastavení
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DHLProfileSettings;
