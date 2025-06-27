
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/auth';
import { Edit, Save, X } from 'lucide-react';

export interface ProfileOverviewSectionProps {
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ProfileOverviewSection: React.FC<ProfileOverviewSectionProps> = ({
  onEdit = () => {},
  onSave = () => {},
  onCancel = () => {},
  isEditing = false
}) => {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Základní informace</CardTitle>
            {!isEditing ? (
              <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Upravit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={onSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Uložit
                </Button>
                <Button onClick={onCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Zrušit
                </Button>
              </div>
            )}
          </div>
          <CardDescription>
            Vaše základní profilové údaje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Uživatelské jméno</label>
            <p className="text-sm text-muted-foreground">
              {user?.user_metadata?.username || 'Nenastaveno'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Registrace</label>
            <p className="text-sm text-muted-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : 'Neznámé'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiky</CardTitle>
          <CardDescription>
            Přehled vaší aktivity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm">Počet směn</span>
            <span className="text-sm font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Vozidla</span>
            <span className="text-sm font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Aktivní od</span>
            <span className="text-sm font-medium">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : 'Neznámé'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverviewSection;
