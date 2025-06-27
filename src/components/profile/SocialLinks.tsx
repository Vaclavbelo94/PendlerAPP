import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Twitter, Globe, Plus, Trash2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

const SocialLinks: React.FC = () => {
  const { user } = useAuth();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching social links:', error);
          toast.error('Failed to load social links');
        }

        setSocialLinks(data || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialLinks();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setNewLink({ ...newLink, [field]: e.target.value });
  };

  const handleAddLink = async () => {
    if (!user?.id || !newLink.platform || !newLink.url) return;

    try {
      const { data, error } = await supabase
        .from('social_links')
        .insert([{ user_id: user.id, platform: newLink.platform, url: newLink.url }])
        .select('*')
        .single();

      if (error) {
        console.error('Error adding social link:', error);
        toast.error('Failed to add social link');
        return;
      }

      setSocialLinks([...socialLinks, data]);
      setNewLink({ platform: '', url: '' });
      toast.success('Social link added successfully');
    } catch (error) {
      console.error('Unexpected error adding social link:', error);
      toast.error('Failed to add social link');
    }
  };

  const handleDeleteLink = async (id: number) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting social link:', error);
        toast.error('Failed to delete social link');
        return;
      }

      setSocialLinks(socialLinks.filter(link => link.id !== id));
      toast.success('Social link deleted successfully');
    } catch (error) {
      console.error('Unexpected error deleting social link:', error);
      toast.error('Failed to delete social link');
    }
  };

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="h-4 w-4 mr-2" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 mr-2" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 mr-2" />;
      default:
        return <Globe className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>Add links to your social media profiles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p>Loading social links...</p>
        ) : (
          <div className="space-y-2">
            {socialLinks.map(link => (
              <div key={link.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getIcon(link.platform)}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {link.platform}
                  </a>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteLink(link.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="platform">Platform</Label>
          <Input
            id="platform"
            type="text"
            placeholder="e.g., GitHub"
            value={newLink.platform}
            onChange={(e) => handleInputChange(e, 'platform')}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="e.g., https://github.com/your-username"
            value={newLink.url}
            onChange={(e) => handleInputChange(e, 'url')}
          />
        </div>
        <Button onClick={handleAddLink} disabled={!newLink.platform || !newLink.url}>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialLinks;
