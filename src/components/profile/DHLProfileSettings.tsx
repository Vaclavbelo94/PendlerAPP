import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, Settings, CheckCircle, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DHLProfileSettings = () => {
  const { user, unifiedUser } = useAuth();
  const { userAssignment, positions, workGroups, isLoading } = useDHLData(user?.id);
  const { t } = useTranslation(['profile', 'dhl']);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    personalNumber: '',
    positionId: userAssignment?.dhl_position_id || '',
    workGroupId: userAssignment?.dhl_work_group_id || ''
  });

  const currentPosition = positions.find(p => p.id === userAssignment?.dhl_position_id);
  const currentWorkGroup = workGroups.find(w => w.id === userAssignment?.dhl_work_group_id);

  const handleEdit = () => {
    setEditData({
      personalNumber: user?.user_metadata?.personal_number || '',
      positionId: userAssignment?.dhl_position_id || '',
      workGroupId: userAssignment?.dhl_work_group_id || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.id || !userAssignment?.id) {
      toast.error(t('dhl:setupError'));
      return;
    }

    try {
      // Update user assignment
      const { error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .update({
          dhl_position_id: editData.positionId,
          dhl_work_group_id: editData.workGroupId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userAssignment.id);

      if (assignmentError) {
        console.error('Error updating DHL assignment:', assignmentError);
        toast.error(t('dhl:setupError'));
        return;
      }

      toast.success(t('profile:settingsSaved'));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving DHL settings:', error);
      toast.error(t('dhl:setupError'));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!unifiedUser?.isDHLEmployee) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Truck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t('profile:dhlSettings')}
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  {t('profile:dhlSettingsDescription')}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
              DHL Premium
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Current Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('profile:currentSettings')}
            </CardTitle>
            {!isEditing && userAssignment && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {t('profile:edit')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!userAssignment ? (
            <div className="text-center p-6 text-muted-foreground">
              <p>{t('profile:noDHLSetup')}</p>
              <Button 
                onClick={() => window.location.href = '/dhl-setup'} 
                className="mt-4"
              >
                {t('dhl:dhlSetup')}
              </Button>
            </div>
          ) : (
            <>
              {/* Position */}
              <div className="space-y-2">
                <Label>{t('dhl:position')}</Label>
                {isEditing ? (
                  <Select
                    value={editData.positionId}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, positionId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('dhl:positionPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    {currentPosition?.name || t('profile:notSet')}
                  </div>
                )}
              </div>

              <Separator />

              {/* Work Group */}
              <div className="space-y-2">
                <Label>{t('dhl:workWeek')}</Label>
                {isEditing ? (
                  <Select
                    value={editData.workGroupId}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, workGroupId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('dhl:workWeekPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {workGroups.map((workGroup) => (
                        <SelectItem key={workGroup.id} value={workGroup.id}>
                          {workGroup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    {currentWorkGroup?.name || t('profile:notSet')}
                  </div>
                )}
              </div>

              {/* Assignment Info */}
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">{t('profile:assignedAt')}:</span>
                  <br />
                  {new Date(userAssignment.assigned_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">{t('profile:lastUpdated')}:</span>
                  <br />
                  {new Date(userAssignment.updated_at).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {t('profile:save')}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    {t('profile:cancel')}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLProfileSettings;