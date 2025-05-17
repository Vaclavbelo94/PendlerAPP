
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Twitter, Facebook, Instagram, Linkedin, Github } from "lucide-react";

interface SocialLinksProps {
  userId?: string;
  readOnly?: boolean;
}

interface SocialLinksData {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
}

const SocialLinks = ({ userId, readOnly = false }: SocialLinksProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [links, setLinks] = useState<SocialLinksData>({
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    github: ""
  });

  const targetUserId = userId || user?.id;

  useEffect(() => {
    const loadSocialLinks = async () => {
      if (!targetUserId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_social_links')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Chyba při načítání sociálních odkazů:', error);
          throw error;
        }

        if (data) {
          setLinks({
            twitter: data.twitter || '',
            facebook: data.facebook || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
            github: data.github || ''
          });
        }
      } catch (error) {
        console.error('Chyba při načítání sociálních odkazů:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSocialLinks();
  }, [targetUserId]);

  const handleSaveLinks = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Kontrola, zda záznam existuje
      const { data: existingData, error: checkError } = await supabase
        .from('user_social_links')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let result;
      if (existingData) {
        // Aktualizace existujícího záznamu
        result = await supabase
          .from('user_social_links')
          .update({
            twitter: links.twitter || null,
            facebook: links.facebook || null,
            instagram: links.instagram || null,
            linkedin: links.linkedin || null,
            github: links.github || null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Vytvoření nového záznamu
        result = await supabase
          .from('user_social_links')
          .insert({
            user_id: user.id,
            twitter: links.twitter || null,
            facebook: links.facebook || null,
            instagram: links.instagram || null,
            linkedin: links.linkedin || null,
            github: links.github || null
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Sociální odkazy byly úspěšně uloženy");
    } catch (error) {
      console.error('Chyba při ukládání sociálních odkazů:', error);
      toast.error("Nepodařilo se uložit sociální odkazy");
    } finally {
      setSaving(false);
    }
  };

  const formatSocialLink = (platform: string, username: string): string => {
    if (!username) return "";
    
    // Odstranit @ z uživatelského jména, pokud existuje
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // Pokud už obsahuje celý URL, vrátit jak je
    if (username.startsWith('http://') || username.startsWith('https://')) {
      return username;
    }
    
    // Jinak sestavit URL podle platformy
    switch (platform) {
      case 'twitter': return `https://twitter.com/${cleanUsername}`;
      case 'facebook': return `https://facebook.com/${cleanUsername}`;
      case 'instagram': return `https://instagram.com/${cleanUsername}`;
      case 'linkedin': return `https://linkedin.com/in/${cleanUsername}`;
      case 'github': return `https://github.com/${cleanUsername}`;
      default: return username;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sociální sítě</CardTitle>
        <CardDescription>
          {readOnly 
            ? "Profil na sociálních sítích" 
            : "Propojte svůj profil se sociálními sítěmi"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {readOnly ? (
          // Zobrazení odkazů pro čtení
          <div className="space-y-3">
            {links.twitter && (
              <a 
                href={formatSocialLink('twitter', links.twitter)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 hover:underline"
              >
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </a>
            )}
            
            {links.facebook && (
              <a 
                href={formatSocialLink('facebook', links.facebook)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
            )}
            
            {links.instagram && (
              <a 
                href={formatSocialLink('instagram', links.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-600 hover:underline"
              >
                <Instagram className="h-5 w-5" />
                <span>Instagram</span>
              </a>
            )}
            
            {links.linkedin && (
              <a 
                href={formatSocialLink('linkedin', links.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-700 hover:underline"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
            )}
            
            {links.github && (
              <a 
                href={formatSocialLink('github', links.github)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            )}
            
            {!links.twitter && !links.facebook && !links.instagram && !links.linkedin && !links.github && (
              <p className="text-muted-foreground text-center py-2">
                Tento uživatel nemá přidány žádné sociální sítě
              </p>
            )}
          </div>
        ) : (
          // Formulář pro editaci
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Twitter className="h-5 w-5 shrink-0 text-blue-500" />
              <div className="flex-1">
                <Label htmlFor="twitter" className="sr-only">Twitter</Label>
                <Input
                  id="twitter"
                  value={links.twitter}
                  onChange={(e) => setLinks(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="@uživatelské_jméno nebo URL"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Facebook className="h-5 w-5 shrink-0 text-blue-600" />
              <div className="flex-1">
                <Label htmlFor="facebook" className="sr-only">Facebook</Label>
                <Input
                  id="facebook"
                  value={links.facebook}
                  onChange={(e) => setLinks(prev => ({ ...prev, facebook: e.target.value }))}
                  placeholder="uživatelské_jméno nebo URL"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Instagram className="h-5 w-5 shrink-0 text-pink-600" />
              <div className="flex-1">
                <Label htmlFor="instagram" className="sr-only">Instagram</Label>
                <Input
                  id="instagram"
                  value={links.instagram}
                  onChange={(e) => setLinks(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="uživatelské_jméno nebo URL"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Linkedin className="h-5 w-5 shrink-0 text-blue-700" />
              <div className="flex-1">
                <Label htmlFor="linkedin" className="sr-only">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={links.linkedin}
                  onChange={(e) => setLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="uživatelské_jméno nebo URL"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <Label htmlFor="github" className="sr-only">GitHub</Label>
                <Input
                  id="github"
                  value={links.github}
                  onChange={(e) => setLinks(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="uživatelské_jméno nebo URL"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {!readOnly && (
        <CardFooter>
          <Button onClick={handleSaveLinks} disabled={saving} className="ml-auto">
            {saving ? "Ukládání..." : "Uložit odkazy"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SocialLinks;
