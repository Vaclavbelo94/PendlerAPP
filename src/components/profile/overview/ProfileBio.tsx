
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, User, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ProfileBio = () => {
  const { user, isPremium } = useAuth();

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg">
              {user?.email ? getInitials(user.email) : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2 w-full">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-center break-words">
                {user?.email ? getUserDisplayName(user.email) : 'Uživatel'}
              </h2>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="break-all text-xs">{user?.email}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              {isPremium ? (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Základní účet
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileBio;
