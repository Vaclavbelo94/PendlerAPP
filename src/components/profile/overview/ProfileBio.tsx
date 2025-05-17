
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileBioProps {
  bio?: string;
  loading: boolean;
}

const ProfileBio = ({ bio, loading }: ProfileBioProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium text-lg">O uživateli</h3>
      {bio ? (
        <p className="text-muted-foreground mt-2">{bio}</p>
      ) : (
        <p className="text-muted-foreground mt-2 italic">Bio nebylo vyplněno</p>
      )}
    </div>
  );
};

export default ProfileBio;
