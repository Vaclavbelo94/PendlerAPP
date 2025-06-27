
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/auth';
import { User, Crown, Shield, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

interface ProfileOverviewSectionProps {
  onEdit: () => void;
}

export const ProfileOverviewSection: React.FC<ProfileOverviewSectionProps> = ({ onEdit }) => {
  const { user, unifiedUser } = useAuth();

  if (!user) return null;

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  const joinDate = new Date(user.created_at).toLocaleDateString('cs-CZ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Přehled profilu</CardTitle>
        <CardDescription>
          Základní informace o vašem účtu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="text-lg">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-xl font-semibold">{username}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {unifiedUser?.isPremium && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {unifiedUser?.isAdmin && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Upravit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Člen od</p>
              <p className="text-sm text-muted-foreground">{joinDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverviewSection;
