
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, MessageCircle } from 'lucide-react';
import RideSharing from './RideSharing';
import SmartRideshareMatching from './SmartRideshareMatching';

const EnhancedRideSharing: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Procházet
          </TabsTrigger>
          <TabsTrigger value="smart-search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Chytré hledání
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Vytvořit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <RideSharing />
        </TabsContent>

        <TabsContent value="smart-search">
          <SmartRideshareMatching />
        </TabsContent>

        <TabsContent value="create">
          <RideSharing />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedRideSharing;
