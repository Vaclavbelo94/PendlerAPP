
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from '@/hooks/auth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployeeSync } from '@/utils/dhlAuthUtils';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface DHLSetupFormData {
  personalNumber: string;
  positionId: string;
  workGroupId: string;
}

const DHLSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation('dhl');
  const { positions, workGroups, isLoading: isDHLDataLoading, error: dhlDataError } = useDHLData(user?.id || null);
  
  const [formData, setFormData] = useState<DHLSetupFormData>({
    personalNumber: '',
    positionId: '',
    workGroupId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authorization
  useEffect(() => {
    if (!user || !isDHLEmployeeSync(user)) {
      console.log('Unauthorized access to DHL Setup');
      toast.error(t('unauthorizedAccess'));
      navigate('/profile');
    }
  }, [user, navigate, t]);

  const handleInputChange = (field: keyof DHLSetupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.positionId) {
      toast.error(t('positionRequired'));
      return;
    }
    
    if (!formData.workGroupId) {
      toast.error(t('workWeekRequired'));
      return;
    }

    if (!user?.id) {
      toast.error(t('unauthorizedAccess'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('=== DHL SETUP SUBMISSION ===');
      console.log('User ID:', user.id);
      console.log('Form Data:', formData);
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Create user DHL assignment
      const assignmentData = {
        user_id: user.id,
        dhl_position_id: formData.positionId,
        dhl_work_group_id: formData.workGroupId,
        assigned_at: new Date().toISOString(),
        is_active: true
      };

      console.log('Creating DHL assignment:', assignmentData);

      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .insert(assignmentData)
        .select()
        .single();

      if (assignmentError) {
        console.error('Error creating DHL assignment:', assignmentError);
        toast.error(t('setupError'));
        return;
      }

      console.log('DHL assignment created successfully:', assignment);

      // Optionally store personal number in profile if provided
      if (formData.personalNumber.trim()) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            personal_number: formData.personalNumber.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.warn('Could not update personal number:', profileError);
          // Non-critical error, continue with success
        }
      }

      toast.success(t('setupSuccess'));
      
      // Show completion message and redirect
      setTimeout(() => {
        toast.info(t('setupComplete'));
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('DHL Setup error:', error);
      toast.error(t('setupError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if user is not authorized
  if (!user || !isDHLEmployeeSync(user)) {
    return null;
  }

  // Loading state
  if (isDHLDataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">{t('loadingPositions')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dhlDataError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{t('setupError')}</p>
            <Button onClick={() => navigate('/profile')}>
              {t('common:back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md bg-card shadow-lg rounded-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-foreground">
            {t('dhlSetup')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('dhlSetupDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Number - Optional */}
            <div className="space-y-2">
              <Label htmlFor="personalNumber" className="text-sm font-medium">
                {t('personalNumber')}
              </Label>
              <Input
                type="text"
                id="personalNumber"
                value={formData.personalNumber}
                onChange={(e) => handleInputChange('personalNumber', e.target.value)}
                placeholder={t('personalNumberPlaceholder')}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Position - Required */}
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">
                {t('position')} *
              </Label>
              <Select
                value={formData.positionId}
                onValueChange={(value) => handleInputChange('positionId', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('positionPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {positions.length > 0 ? (
                    positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      {t('noPositionsAvailable')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Work Group - Required */}
            <div className="space-y-2">
              <Label htmlFor="workGroup" className="text-sm font-medium">
                {t('workWeek')} *
              </Label>
              <Select
                value={formData.workGroupId}
                onValueChange={(value) => handleInputChange('workGroupId', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('workWeekPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {workGroups.length > 0 ? (
                    workGroups.map((workGroup) => (
                      <SelectItem key={workGroup.id} value={workGroup.id}>
                        {workGroup.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      {t('noWorkGroupsAvailable')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isSubmitting || !formData.positionId || !formData.workGroupId}
            >
              {isSubmitting ? t('submitting') : t('submitSetup')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLSetup;
