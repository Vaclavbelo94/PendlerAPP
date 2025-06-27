import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/auth';
import { User, Mail, Calendar, MapPin, Briefcase, Edit2, Save, X } from "lucide-react";

interface ProfileOverviewProps {
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ onEdit, onSave, onCancel, isEditing }) => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.username || '');
      setLocation(user.user_metadata?.location || '');
      setBio(user.user_metadata?.bio || '');
    }
  }, [user]);

  if (!user) {
    return <p>Načítání profilu...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Přehled profilu</CardTitle>
        <CardDescription>Zde jsou vaše základní informace.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{username}</h2>
            <Badge variant="secondary">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Uživatelské jméno</Label>
          {isEditing ? (
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2 inline-block" />
              {username || 'Nezadáno'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Lokace</Label>
          {isEditing ? (
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 inline-block" />
              {location || 'Nezadáno'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2 inline-block" />
              {bio || 'Nezadáno'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Datum registrace</Label>
          <p className="text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 inline-block" />
            {user.created_at}
          </p>
        </div>

        {!isEditing && (
          <Button onClick={onEdit} className="w-full">
            <Edit2 className="h-4 w-4 mr-2" />
            Upravit profil
          </Button>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Zrušit
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Uložit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
