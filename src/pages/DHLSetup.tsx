
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useDHLSetup } from '@/hooks/dhl/useDHLSetup';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import { DHLLayout } from '@/components/dhl/DHLLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, Truck, Calendar, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

const DHLSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userAssignment, positions, workGroups, isLoading: isDataLoading } = useDHLData(user?.id);
  const { submitSetup, isSubmitting } = useDHLSetup();

  const [selectedPosition, setSelectedPosition] = React.useState('');
  const [selectedWorkGroup, setSelectedWorkGroup] = React.useState('');
  const [referenceDate, setReferenceDate] = React.useState('');
  const [referenceWoche, setReferenceWoche] = React.useState('');

  // Populate form if user already has assignment
  React.useEffect(() => {
    if (userAssignment) {
      setSelectedPosition(userAssignment.dhl_position_id);
      setSelectedWorkGroup(userAssignment.dhl_work_group_id);
      setReferenceDate(userAssignment.reference_date || '');
      setReferenceWoche(userAssignment.reference_woche?.toString() || '');
    }
  }, [userAssignment]);

  // Redirect if user doesn't have DHL access
  React.useEffect(() => {
    if (user && !canAccessDHLFeatures(user)) {
      navigate('/dashboard');
      toast.error('Nemáte oprávnění pro přístup k DHL funkcím');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPosition || !selectedWorkGroup) {
      toast.error('Prosím vyberte pozici a pracovní skupinu');
      return;
    }

    const setupData = {
      position_id: selectedPosition,
      work_group_id: selectedWorkGroup,
      ...(referenceDate && { reference_date: referenceDate }),
      ...(referenceWoche && { reference_woche: parseInt(referenceWoche) })
    };

    const success = await submitSetup(setupData);
    if (success) {
      navigate('/dhl-dashboard');
    }
  };

  if (isDataLoading) {
    return (
      <DHLLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Načítám DHL data...</p>
          </div>
        </div>
      </DHLLayout>
    );
  }

  // If user already has complete setup, show success state
  if (userAssignment && selectedPosition && selectedWorkGroup) {
    return (
      <DHLLayout>
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">DHL Setup dokončen!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Pozice</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userAssignment.dhl_position?.name}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Pracovní skupina</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userAssignment.dhl_work_group?.name}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button onClick={() => navigate('/dhl-dashboard')} className="flex-1">
                  Přejít na Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPosition('')} 
                  className="flex-1"
                >
                  Upravit nastavení
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DHLLayout>
    );
  }

  return (
    <DHLLayout>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Truck className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DHL Setup</h1>
          <p className="text-gray-600">
            Nastavte svou DHL pozici a pracovní skupinu pro automatické generování směn
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Základní nastavení</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Position Selection */}
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  DHL Pozice *
                </Label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte svou DHL pozici" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        <div>
                          <div className="font-medium">{position.name}</div>
                          {position.description && (
                            <div className="text-sm text-muted-foreground">
                              {position.description}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Work Group Selection */}
              <div className="space-y-2">
                <Label htmlFor="workGroup" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pracovní skupina *
                </Label>
                <Select value={selectedWorkGroup} onValueChange={setSelectedWorkGroup} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte pracovní skupinu" />
                  </SelectTrigger>
                  <SelectContent>
                    {workGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div>
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Týden {group.week_number}
                            {group.description && ` - ${group.description}`}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Reference Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Referenční bod (volitelné)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nastavte referenční datum a Woche pro přesné generování směn podle vašeho plánu
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceDate">Referenční datum</Label>
                    <Input
                      id="referenceDate"
                      type="date"
                      value={referenceDate}
                      onChange={(e) => setReferenceDate(e.target.value)}
                      placeholder="Vyberte datum"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referenceWoche">Referenční Woche</Label>
                    <Input
                      id="referenceWoche"
                      type="number"
                      min="1"
                      max="15"
                      value={referenceWoche}
                      onChange={(e) => setReferenceWoche(e.target.value)}
                      placeholder="1-15"
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  Po dokončení setupu budete automaticky směrováni na DHL Dashboard, 
                  kde můžete spravovat své směny a generovat nové podle vašeho plánu.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Zrušit
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedPosition || !selectedWorkGroup}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Ukládám...
                    </>
                  ) : (
                    'Dokončit setup'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DHLLayout>
  );
};

export default DHLSetup;
