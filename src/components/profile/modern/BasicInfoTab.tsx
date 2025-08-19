import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Lock, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PasswordChangeModal } from './PasswordChangeModal';
import { motion } from 'framer-motion';

export const BasicInfoTab: React.FC = () => {
  const { user, unifiedUser } = useAuth();
  const { t } = useTranslation('profile');
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    location: '',
    phone_number: ''
  });

  // Fetch profile data separately since it's not in UnifiedUser
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, location, phone_number')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setFormData({
          username: data.username || '',
          location: data.location || '',
          phone_number: data.phone_number || ''
        });
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          location: formData.location,
          phone_number: formData.phone_number,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: t('profileUpdated'),
        description: t('profileUpdated'),
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('errorUpdatingProfile'),
        description: t('errorUpdatingProfile'),
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    // Refetch original data
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('username, location, phone_number')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setFormData({
        username: data.username || '',
        location: data.location || '',
        phone_number: data.phone_number || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{t('personalInformation')}</CardTitle>
                <CardDescription>{t('personalInfoManage')}</CardDescription>
              </div>
            </div>
            
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {t('edit')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? t('saving') : t('save')}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Display Name / Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {t('displayName')}
            </Label>
            {isEditing ? (
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder={t('yourDisplayName')}
                className="bg-background/50"
              />
            ) : (
              <div className="p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">{formData.username || t('notSet')}</span>
              </div>
            )}
          </div>

          {/* Address/Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t('homeAddress')}
            </Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder={t('enterHomeAddress')}
                className="bg-background/50"
              />
            ) : (
              <div className="p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">{formData.location || t('notSet')}</span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {t('phoneNumber')}
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder={t('enterPhoneNumber')}
                className="bg-background/50"
              />
            ) : (
              <div className="p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">{formData.phone_number || t('notSet')}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">{t('phoneDisplayNote')}</p>
          </div>

          <Separator className="my-4" />

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {t('email')}
            </Label>
            <div className="p-3 bg-muted/20 rounded-lg border border-dashed">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <p className="text-xs text-muted-foreground mt-1">
                {t('emailCannotBeChanged')}
              </p>
            </div>
          </div>

          {/* Password Change */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              {t('password')}
            </Label>
            <Button
              variant="outline"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full justify-start"
            >
              <Lock className="h-4 w-4 mr-2" />
              {t('changePassword')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </motion.div>
  );
};