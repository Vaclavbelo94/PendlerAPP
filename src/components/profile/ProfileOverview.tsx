
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileBio from "./overview/ProfileBio";
import ProfileInfo from "./overview/ProfileInfo";
import ProfileCards from "./overview/ProfileCards";
import { formatDate, getShiftTypeLabel } from "./utils/formatters";

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

  return (
    <div className="space-y-6">
      {/* Bio a základní info */}
      <ProfileBio bio={profile.bio} loading={loading} />
      
      {/* Informace o lokaci, webu atd. */}
      {!loading && (
        <ProfileInfo
          location={profile.location}
          website={profile.website}
          createdAt={profile.created_at}
          formatDate={formatDate}
        />
      )}
      
      {/* Pracovní preference a certifikáty */}
      {!loading && (
        <ProfileCards
          workPreferences={workPreferences}
          certificatesCount={certificatesCount}
          getShiftTypeLabel={getShiftTypeLabel}
        />
      )}
    </div>
  );
};

export default ProfileOverview;
