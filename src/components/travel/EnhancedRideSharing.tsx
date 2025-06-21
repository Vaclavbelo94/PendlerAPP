
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import RideSharing from './RideSharing';
import { useLanguage } from '@/hooks/useLanguage';

const EnhancedRideSharing: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('ridesharing')}
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
