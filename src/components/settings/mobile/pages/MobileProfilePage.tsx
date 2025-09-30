import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Crown, Shield, ChevronRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MobileProfilePage = () => {
  const { t } = useTranslation('settings');
  const { unifiedUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [contactInfoOpen, setContactInfoOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, [unifiedUser?.id]);

  const loadProfile = async () => {
    if (!unifiedUser?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', unifiedUser.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setUsername(data.username || '');
      setBio(data.bio || '');
      setLocation(data.location || '');
      setWebsite(data.website || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Chyba při načítání profilu');
    } finally {
      setLoading(false);
    }
  };

  const savePersonalInfo = async () => {
    if (!unifiedUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username, bio })
        .eq('id', unifiedUser.id);
      
      if (error) throw error;
      
      toast.success('Osobní údaje uloženy');
      setPersonalInfoOpen(false);
      loadProfile();
    } catch (error) {
      console.error('Error saving personal info:', error);
      toast.error('Chyba při ukládání');
    }
  };

  const saveContactInfo = async () => {
    if (!unifiedUser?.id) return;
    
    try {
      // Contact info is now managed in other sections
      toast.success('Kontaktní informace uloženy');
      setContactInfoOpen(false);
      loadProfile();
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Chyba při ukládání');
    }
  };

  const saveAddress = async () => {
    if (!unifiedUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ location, website })
        .eq('id', unifiedUser.id);
      
      if (error) throw error;
      
      toast.success('Adresa uložena');
      setAddressOpen(false);
      loadProfile();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Chyba při ukládání');
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Hesla se neshodují');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Heslo musí mít alespoň 6 znaků');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Heslo změněno');
      setPasswordOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Chyba při změně hesla');
    }
  };

  const deleteAccount = async () => {
    if (!confirm('Opravdu chcete smazat účet? Tuto akci nelze vrátit zpět.')) return;
    
    toast.error('Mazání účtu bude brzy k dispozici');
  };

  if (loading) {
    return <div className="p-4">Načítání...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* User Info Card */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{profile?.username || unifiedUser?.email || t('guest')}</h3>
            <div className="flex items-center gap-2 mt-1">
              {profile?.is_premium && (
                <Badge variant="secondary" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  {t('premiumStatus')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setPersonalInfoOpen(true)}
          className="w-full justify-between h-auto py-3 px-4"
        >
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{t('personalInfo')}</div>
              <div className="text-sm text-muted-foreground">
                {t('personalInfoDesc')}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => setContactInfoOpen(true)}
          className="w-full justify-between h-auto py-3 px-4"
        >
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{t('contactInfo')}</div>
              <div className="text-sm text-muted-foreground">
                {t('contactInfoDesc')}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => setAddressOpen(true)}
          className="w-full justify-between h-auto py-3 px-4"
        >
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{t('address')}</div>
              <div className="text-sm text-muted-foreground">
                {t('addressDesc')}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => setPasswordOpen(true)}
          className="w-full justify-between h-auto py-3 px-4"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{t('changePassword')}</div>
              <div className="text-sm text-muted-foreground">
                {t('changePasswordDesc')}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <h4 className="font-medium text-destructive mb-2">{t('dangerZone')}</h4>
        <Button
          variant="outline"
          className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/10"
          onClick={deleteAccount}
        >
          {t('deleteAccount')}
        </Button>
      </div>

      {/* Dialogs */}
      <Dialog open={personalInfoOpen} onOpenChange={setPersonalInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('personalInfo')}</DialogTitle>
            <DialogDescription>{t('personalInfoDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('username')}</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <Label>{t('bio')}</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPersonalInfoOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={savePersonalInfo}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactInfoOpen} onOpenChange={setContactInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('contactInfo')}</DialogTitle>
            <DialogDescription>{t('contactInfoDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>E-mail</Label>
              <Input value={unifiedUser?.email || ''} disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Email nelze změnit
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactInfoOpen(false)}>
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('address')}</DialogTitle>
            <DialogDescription>{t('addressDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('location')}</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <Label>{t('website')}</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={saveAddress}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('changePassword')}</DialogTitle>
            <DialogDescription>{t('changePasswordDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('newPassword')}</Label>
              <Input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>
            <div>
              <Label>{t('confirmPassword')}</Label>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={changePassword}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileProfilePage;
