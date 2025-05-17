
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, TwitterIcon } from "lucide-react";

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
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({
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
          console.error('Chyba při načítání sociálních sítí:', error);
          throw error;
        }

        if (data) {
          setSocialLinks({
            twitter: data.twitter || "",
            facebook: data.facebook || "",
            instagram: data.instagram || "",
            linkedin: data.linkedin || "",
            github: data.github || ""
          });
        }
      } catch (error) {
        console.error('Chyba při načítání sociálních sítí:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSocialLinks();
  }, [targetUserId]);

  const handleSaveLinks = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Kontrola, zda záznam existuje
      const { data: existingLinks, error: checkError } = await supabase
        .from('user_social_links')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Chyba při kontrole existence sociálních sítí:', checkError);
        throw checkError;
      }

      let result;
      if (existingLinks) {
        // Aktualizace existujícího záznamu
        result = await supabase
          .from('user_social_links')
          .update({
            twitter: socialLinks.twitter,
            facebook: socialLinks.facebook,
            instagram: socialLinks.instagram,
            linkedin: socialLinks.linkedin,
            github: socialLinks.github,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Vytvoření nového záznamu
        result = await supabase
          .from('user_social_links')
          .insert({
            user_id: user.id,
            twitter: socialLinks.twitter,
            facebook: socialLinks.facebook,
            instagram: socialLinks.instagram,
            linkedin: socialLinks.linkedin,
            github: socialLinks.github
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast.success("Sociální sítě byly úspěšně uloženy");
    } catch (error) {
      console.error('Chyba při ukládání sociálních sítí:', error);
      toast.error("Nepodařilo se uložit sociální sítě");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sociální sítě</CardTitle>
        <CardDescription>
          {readOnly 
            ? "Profily na sociálních sítích" 
            : "Přidejte odkazy na své profily na sociálních sítích"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {readOnly ? (
            // Zobrazení v režimu pouze pro čtení
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinks.twitter && (
                <a 
                  href={`https://twitter.com/${socialLinks.twitter}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <TwitterIcon className="text-sky-500 h-5 w-5" />
                  <span>@{socialLinks.twitter}</span>
                </a>
              )}
              
              {socialLinks.facebook && (
                <a 
                  href={`https://facebook.com/${socialLinks.facebook}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <FacebookIcon className="text-blue-600 h-5 w-5" />
                  <span>{socialLinks.facebook}</span>
                </a>
              )}
              
              {socialLinks.instagram && (
                <a 
                  href={`https://instagram.com/${socialLinks.instagram}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <InstagramIcon className="text-rose-500 h-5 w-5" />
                  <span>@{socialLinks.instagram}</span>
                </a>
              )}
              
              {socialLinks.linkedin && (
                <a 
                  href={socialLinks.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <LinkedinIcon className="text-blue-700 h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
              )}
              
              {socialLinks.github && (
                <a 
                  href={`https://github.com/${socialLinks.github}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <GithubIcon className="h-5 w-5" />
                  <span>@{socialLinks.github}</span>
                </a>
              )}
              
              {!socialLinks.twitter && !socialLinks.facebook && 
               !socialLinks.instagram && !socialLinks.linkedin && 
               !socialLinks.github && (
                <p className="text-muted-foreground col-span-2 text-center py-4">
                  Nejsou nastaveny žádné sociální sítě
                </p>
              )}
            </div>
          ) : (
            // Editační režim
            <>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <TwitterIcon className="text-sky-500 h-5 w-5" />
                  Twitter
                </Label>
                <div className="flex">
                  <span className="bg-muted px-3 py-2 border-y border-l border-input rounded-l-md">
                    @
                  </span>
                  <Input
                    id="twitter"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="uživatelské_jméno"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <FacebookIcon className="text-blue-600 h-5 w-5" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                  placeholder="uživatelské_jméno nebo URL"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <InstagramIcon className="text-rose-500 h-5 w-5" />
                  Instagram
                </Label>
                <div className="flex">
                  <span className="bg-muted px-3 py-2 border-y border-l border-input rounded-l-md">
                    @
                  </span>
                  <Input
                    id="instagram"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="uživatelské_jméno"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <LinkedinIcon className="text-blue-700 h-5 w-5" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="Celá URL adresa profilu"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <GithubIcon className="h-5 w-5" />
                  GitHub
                </Label>
                <div className="flex">
                  <span className="bg-muted px-3 py-2 border-y border-l border-input rounded-l-md">
                    @
                  </span>
                  <Input
                    id="github"
                    value={socialLinks.github}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="uživatelské_jméno"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {!readOnly && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveLinks} disabled={loading}>
            {loading ? "Ukládání..." : "Uložit sociální sítě"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SocialLinks;
