
import React from 'react';
import { Button } from "@/components/ui/button";
import { ListTree } from 'lucide-react';
import { PremiumBadge } from '@/components/premium/PremiumBadge';

const PremiumExercisesBanner: React.FC = () => {
  return (
    <div className="mt-4 bg-primary/5 rounded-md p-4 border border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTree className="h-5 w-5 text-primary" />
          <span className="font-medium">Další gramatická cvičení</span>
          <PremiumBadge variant="compact" />
        </div>
        <Button variant="default" size="sm">
          Aktivovat Premium
        </Button>
      </div>
    </div>
  );
};

export default PremiumExercisesBanner;
