import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/hooks/auth';
import { User, Mail, Calendar, MapPin, Briefcase, Activity } from "lucide-react";

interface ProfileOverviewSectionProps {
  className?: string;
}

const ProfileOverviewSection: React.FC<ProfileOverviewSectionProps> = ({ className }) => {
  const { user, unifiedUser } = useAuth();

  if (!user) return null;

  const profileCompleteness = 75; // Mock data - calculate based on filled fields
  const joinDate = new Date(user.created_at).toLocaleDateString();
  const username = user.email?.split('@')[0] || 'User';

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Přehled profilu
          </CardTitle>
          <CardDescription>
            Základní informace o vašem účtu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Člen od</p>
                <p className="text-sm text-muted-foreground">{joinDate}</p>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {unifiedUser?.isPremium && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            {unifiedUser?.isAdmin && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
            <Badge variant="outline">
              <Activity className="h-3 w-3 mr-1" />
              Aktivní
            </Badge>
          </div>

          {/* Profile Completeness */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Kompletnost profilu</span>
              <span className="text-sm text-muted-foreground">{profileCompleteness}%</span>
            </div>
            <Progress value={profileCompleteness} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Dokončete svůj profil pro lepší zážitek z aplikace
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Směny tento měsíc</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">€2,340</p>
              <p className="text-xs text-muted-foreground">Celkové výdělky</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">45</p>
              <p className="text-xs text-muted-foreground">Dní aktivní</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverviewSection;
