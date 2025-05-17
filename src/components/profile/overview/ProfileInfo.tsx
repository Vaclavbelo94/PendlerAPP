
import React from "react";
import { MapPin, Globe, Calendar } from "lucide-react";

interface ProfileInfoProps {
  location?: string;
  website?: string;
  createdAt?: string;
  formatDate: (dateString: string | undefined) => string;
}

const ProfileInfo = ({ location, website, createdAt, formatDate }: ProfileInfoProps) => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {location && (
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>{location}</span>
        </div>
      )}
      
      {website && (
        <div className="flex items-center text-sm">
          <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
          <a 
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
      
      {createdAt && (
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>Členem od {formatDate(createdAt)}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
