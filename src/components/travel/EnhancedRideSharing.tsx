
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import RideSharing from './RideSharing';

const EnhancedRideSharing: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sdílení jízd
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RideSharing />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRideSharing;
