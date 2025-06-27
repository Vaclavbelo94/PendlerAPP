
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, MapPin, Clock, User, AlertTriangle } from "lucide-react";
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DHLProfileSettingsProps {
  // Add any props here
}

interface DHLAssignment {
  personal_number: string;
  depot: string;
  route: string;
  shift: string;
}

const DHLProfileSettings: React.FC<DHLProfileSettingsProps> = ({ /* props */ }) => {
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<DHLAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempAssignment, setTempAssignment] = useState<DHLAssignment>({
    personal_number: '',
    depot: '',
    route: '',
    shift: '',
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_dhl_assignments')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching DHL assignment:', error);
          if (error.code !== 'PGRST116') { // Not found error is OK
            toast.error('Failed to load DHL assignment');
          }
        }

        if (data) {
          // Note: The user_dhl_assignments table has different structure
          // This is a placeholder - you may need to adjust based on actual data structure
          setAssignment({
            personal_number: 'N/A', // These fields don't exist in user_dhl_assignments
            depot: 'N/A',
            route: 'N/A', 
            shift: 'N/A',
          });
          setTempAssignment({
            personal_number: 'N/A',
            depot: 'N/A',
            route: 'N/A',
            shift: 'N/A',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    if (assignment) {
      setTempAssignment({ ...assignment });
    }
  };

  const handleSaveAssignment = async () => {
    if (!user?.id) return;

    try {
      // Note: This update won't work with current schema
      // The user_dhl_assignments table doesn't have these fields
      // You may need to create a separate table or modify the schema
      toast.info('DHL assignment functionality needs schema updates');
    } catch (error) {
      console.error('Error updating DHL assignment:', error);
      toast.error('Failed to update DHL assignment');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          DHL Profil
        </CardTitle>
        <CardDescription>Nastavení pro DHL uživatele</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!assignment ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nemáte přiřazené žádné DHL údaje. Kontaktujte administrátora.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Label>Osobní číslo</Label>
              <Badge>{assignment.personal_number}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label>Depo</Label>
              <Badge>{assignment.depot}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <Label>Trasa</Label>
              <Badge>{assignment.route}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label>Směna</Label>
              <Badge>{assignment.shift}</Badge>
            </div>
          </>
        )}
        {isEditing ? (
          <div className="grid gap-4">
            <div>
              <Label htmlFor="personal_number">Osobní číslo</Label>
              <Input
                type="text"
                id="personal_number"
                name="personal_number"
                value={tempAssignment.personal_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="depot">Depo</Label>
              <Input
                type="text"
                id="depot"
                name="depot"
                value={tempAssignment.depot}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="route">Trasa</Label>
              <Input
                type="text"
                id="route"
                name="route"
                value={tempAssignment.route}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shift">Směna</Label>
              <Select onValueChange={(value) => handleInputChange({ target: { name: 'shift', value } } as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vyberte směnu" defaultValue={tempAssignment.shift} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ranní">Ranní</SelectItem>
                  <SelectItem value="Odpolední">Odpolední</SelectItem>
                  <SelectItem value="Noční">Noční</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleCancelEditing}>
                Zrušit
              </Button>
              <Button onClick={handleSaveAssignment}>Uložit</Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleStartEditing} disabled={!assignment}>
            Upravit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DHLProfileSettings;
