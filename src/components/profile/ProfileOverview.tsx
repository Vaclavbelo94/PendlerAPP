
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Globe, Calendar, BriefcaseIcon } from "lucide-react";

interface ProfileOverviewProps {
  userId?: string;
}

interface ExtendedProfile {
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at?: string;
}

const ProfileOverview = ({ userId }: ProfileOverviewProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ExtendedProfile>({});
  const [workPreferences, setWorkPreferences] = useState<any>(null);
  const [certificatesCount, setCertificatesCount] = useState<number>(0);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    const loadProfileData = async () => {
      if (!targetUserId) return;
      
      setLoading(true);
      try {
        // Načtení rozšířeného profilu
        const { data: extendedProfile, error: profileError } = await supabase
          .from('user_extended_profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Chyba při načítání rozšířeného profilu:', profileError);
        } else if (extendedProfile) {
          setProfile(extendedProfile);
        }

        // Načtení pracovních preferencí
        const { data: workData, error: workError } = await supabase
          .from('user_work_preferences')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();
          
        if (workError && workError.code !== 'PGRST116') {
          console.error('Chyba při načítání pracovních preferencí:', workError);
        } else if (workData) {
          setWorkPreferences(workData);
        }

        // Počet certifikátů
        const { count, error: countError } = await supabase
          .from('user_certificates')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', targetUserId);
          
        if (countError) {
          console.error('Chyba při počítání certifikátů:', countError);
        } else if (count !== null) {
          setCertificatesCount(count);
        }

      } catch (error) {
        console.error('Chyba při načítání dat profilu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [targetUserId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('cs-CZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return "";
    }
  };

  const getShiftTypeLabel = (type: string | undefined) => {
    if (!type) return "Nespecifikováno";
    
    const types: Record<string, string> = {
      "any": "Jakýkoli typ",
      "morning": "Ranní",
      "afternoon": "Odpolední",
      "night": "Noční",
      "weekday": "Pouze pracovní dny",
      "weekend": "Pouze víkendy"
    };
    
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bio a základní info */}
      {profile.bio ? (
        <div>
          <h3 className="font-medium text-lg">O uživateli</h3>
          <p className="text-muted-foreground mt-2">{profile.bio}</p>
        </div>
      ) : (
        <div>
          <h3 className="font-medium text-lg">O uživateli</h3>
          <p className="text-muted-foreground mt-2 italic">Bio nebylo vyplněno</p>
        </div>
      )}
      
      {/* Informace o lokaci, webu atd. */}
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {profile.location && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{profile.location}</span>
          </div>
        )}
        
        {profile.website && (
          <div className="flex items-center text-sm">
            <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
            <a 
              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        
        {profile.created_at && (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Členem od {formatDate(profile.created_at)}</span>
          </div>
        )}
      </div>
      
      {/* Pracovní preference a certifikáty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {workPreferences && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <BriefcaseIcon className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Pracovní preference</h4>
                  <p className="text-sm text-muted-foreground">
                    Preferovaný typ směny: {getShiftTypeLabel(workPreferences.preferred_shift_type)}
                  </p>
                  {workPreferences.preferred_locations && workPreferences.preferred_locations.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Preferované lokality: {workPreferences.preferred_locations.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {certificatesCount > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 text-primary"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L10.8 6a2 2 0 0 1 1.4-.6h2.8a2 2 0 0 1 1.4.6l1.4 1.4a2 2 0 0 0 1.4.6h2" />
                  <path d="M12 13v3" />
                  <path d="M10 16h4" />
                </svg>
                <div>
                  <h4 className="font-medium">Vzdělání a certifikáty</h4>
                  <p className="text-sm text-muted-foreground">
                    Počet certifikátů: {certificatesCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;
