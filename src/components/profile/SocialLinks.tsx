
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit2, Save, X, Twitter, Facebook, Instagram, Linkedin, Github } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SocialLinksProps {
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ onEdit, onSave, onCancel, isEditing }) => {
  const { user } = useAuth();
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    github: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_social_links')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching social links:', error);
          toast.error('Failed to load social links');
        }

        if (data) {
          setSocialLinks({
            twitter: data.twitter || '',
            facebook: data.facebook || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
          });
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialLinks();
  }, [user?.id]);

  const handleInputChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_social_links')
        .upsert({
          user_id: user.id,
          ...socialLinks,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving social links:', error);
        toast.error('Failed to save social links');
        return;
      }

      toast.success('Social links saved successfully');
      onSave();
    } catch (error) {
      console.error('Error saving social links:', error);
      toast.error('Failed to save social links');
    }
  };

  if (isLoading) {
    return <div>Loading social links...</div>;
  }

  const socialPlatforms = [
    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { key: 'github', label: 'GitHub', icon: Github, color: 'text-gray-800' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sociální sítě</CardTitle>
        <CardDescription>Přidejte odkazy na své sociální sítě</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialPlatforms.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="flex items-center space-x-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span>{label}</span>
            </Label>
            {isEditing ? (
              <Input
                id={key}
                value={socialLinks[key as keyof typeof socialLinks]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={`Váš ${label} profil`}
              />
            ) : (
              <div className="flex items-center space-x-2">
                {socialLinks[key as keyof typeof socialLinks] ? (
                  <>
                    <Badge variant="secondary">
                      <Icon className={`h-3 w-3 mr-1 ${color}`} />
                      {label}
                    </Badge>
                    <a
                      href={socialLinks[key as keyof typeof socialLinks]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm flex items-center"
                    >
                      Zobrazit profil
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Nepřidáno</span>
                )}
              </div>
            )}
          </div>
        ))}

        {!isEditing && (
          <Button onClick={onEdit} className="w-full">
            <Edit2 className="h-4 w-4 mr-2" />
            Upravit odkazy
          </Button>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Zrušit
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Uložit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinks;
