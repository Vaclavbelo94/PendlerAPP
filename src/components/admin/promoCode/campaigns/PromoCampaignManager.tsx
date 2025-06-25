
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, Users, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  associatedCodes: string[];
  emailTemplate?: string;
  createdAt: string;
}

const PromoCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    targetAudience: 'all',
    emailTemplate: ''
  });

  // Simulace dat - v reálné aplikaci by se načítalo z databáze
  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      // Simulace načítání kampaní
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Vánoční kampaň 2024',
          description: 'Speciální vánoční nabídka pro všechny uživatele',
          startDate: '2024-12-01',
          endDate: '2024-12-31',
          targetAudience: 'all',
          status: 'active',
          associatedCodes: ['XMAS2024', 'HOLIDAY25'],
          emailTemplate: 'Vánoční šablona',
          createdAt: '2024-11-15'
        },
        {
          id: '2',
          name: 'DHL Partnership',
          description: 'Kampaň pro DHL partnery',
          startDate: '2024-01-01',
          endDate: '2025-12-31',
          targetAudience: 'partners',
          status: 'active',
          associatedCodes: ['DHL2026'],
          createdAt: '2024-01-01'
        }
      ];

      // Simulace načítání s delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Chyba při načítání kampaní:', error);
      toast.error('Nepodařilo se načíst kampaně');
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
      toast.error('Vyplňte povinná pole');
      return;
    }

    setIsCreating(true);
    try {
      const campaign: Campaign = {
        id: Date.now().toString(),
        ...newCampaign,
        status: 'draft',
        associatedCodes: [],
        createdAt: new Date().toISOString()
      };

      setCampaigns(prev => [campaign, ...prev]);
      
      setNewCampaign({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        targetAudience: 'all',
        emailTemplate: ''
      });

      toast.success('Kampaň byla vytvořena');
    } catch (error) {
      console.error('Chyba při vytváření kampaně:', error);
      toast.error('Nepodařilo se vytvořit kampaň');
    } finally {
      setIsCreating(false);
    }
  };

  const updateCampaignStatus = (campaignId: string, newStatus: Campaign['status']) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status: newStatus } : campaign
    ));
    toast.success('Status kampaně byl aktualizován');
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    toast.success('Kampaň byla smazána');
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'paused': return 'outline';
      case 'completed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'Aktivní';
      case 'draft': return 'Návrh';
      case 'paused': return 'Pozastavena';
      case 'completed': return 'Dokončena';
      default: return status;
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Načítám kampaně...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vytvoření nové kampaně */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nová kampaň
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Název kampaně *</Label>
              <Input
                id="name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Název kampaně"
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Cílová skupina</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newCampaign.targetAudience}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, targetAudience: e.target.value }))}
                disabled={isCreating}
              >
                <option value="all">Všichni uživatelé</option>
                <option value="premium">Premium uživatelé</option>
                <option value="new">Noví uživatelé</option>
                <option value="partners">Partneři</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Datum začátku *</Label>
              <Input
                id="startDate"
                type="date"
                value={newCampaign.startDate}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Datum konce *</Label>
              <Input
                id="endDate"
                type="date"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              value={newCampaign.description}
              onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Popis kampaně"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailTemplate">Email šablona</Label>
            <Textarea
              id="emailTemplate"
              value={newCampaign.emailTemplate}
              onChange={(e) => setNewCampaign(prev => ({ ...prev, emailTemplate: e.target.value }))}
              placeholder="HTML nebo text šablona pro email"
              disabled={isCreating}
            />
          </div>

          <Button onClick={createCampaign} disabled={isCreating}>
            {isCreating ? 'Vytvářím...' : 'Vytvořit kampaň'}
          </Button>
        </CardContent>
      </Card>

      {/* Seznam kampaní */}
      <Card>
        <CardHeader>
          <CardTitle>Všechny kampaně</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    {campaign.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {campaign.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(campaign.status)}>
                      {getStatusText(campaign.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(campaign.startDate).toLocaleDateString('cs-CZ')} - {new Date(campaign.endDate).toLocaleDateString('cs-CZ')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {campaign.targetAudience}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {campaign.associatedCodes.length} kódů
                  </div>
                </div>

                {campaign.associatedCodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {campaign.associatedCodes.map((code) => (
                      <Badge key={code} variant="outline" className="text-xs">
                        {code}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {campaign.status === 'draft' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateCampaignStatus(campaign.id, 'active')}
                    >
                      Aktivovat
                    </Button>
                  )}
                  {campaign.status === 'active' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                    >
                      Pozastavit
                    </Button>
                  )}
                  {campaign.status === 'paused' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateCampaignStatus(campaign.id, 'active')}
                    >
                      Obnovit
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Upravit
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => deleteCampaign(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Smazat
                  </Button>

                  {campaign.emailTemplate && (
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Odeslat email
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCampaignManager;
