
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Twitter, Facebook, Instagram, Linkedin, Github } from "lucide-react";

export interface SocialLinksProps {
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ 
  onEdit = () => {}, 
  onSave = () => {}, 
  onCancel = () => {}, 
  isEditing = false 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sociální sítě</CardTitle>
        <CardDescription>
          Propojte své sociální profily
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-500" />
                <Input id="twitter" placeholder="@username" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <Input id="linkedin" placeholder="linkedin.com/in/username" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave} size="sm">Uložit</Button>
              <Button onClick={onCancel} variant="outline" size="sm">Zrušit</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Zatím nemáte propojené žádné sociální sítě.
            </p>
            <Button onClick={onEdit} variant="outline" size="sm">
              Přidat sociální sítě
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinks;
