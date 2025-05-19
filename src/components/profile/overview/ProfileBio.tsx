
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileBioProps {
  bio?: string;
  loading?: boolean;
}

const ProfileBio = ({ bio, loading = false }: ProfileBioProps) => {
  if (loading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div className="bg-muted/50 rounded-md p-4">
      {bio ? (
        <p className="text-base">{bio}</p>
      ) : (
        <p className="text-muted-foreground text-sm italic">
          Tento uživatel zatím nemá vyplněný profil.
        </p>
      )}
    </div>
  );
};

export default ProfileBio;
