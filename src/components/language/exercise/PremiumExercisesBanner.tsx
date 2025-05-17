
import React from 'react';
import { Button } from "@/components/ui/button";
import { ListTree } from 'lucide-react';
import { PremiumBadge } from '@/components/premium/PremiumBadge';
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const PremiumExercisesBanner: React.FC = () => {
  const navigate = useNavigate();
  
  const handleActivatePremium = () => {
    navigate('/premium');
  };
  
  return (
    <Card className="mt-4 bg-primary/5 border-primary/10">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTree className="h-5 w-5 text-primary" />
          <span className="font-medium">Další gramatická cvičení</span>
          <PremiumBadge variant="compact" />
        </div>
        <Button variant="default" size="sm" onClick={handleActivatePremium}>
          Aktivovat Premium
        </Button>
      </div>
    </Card>
  );
};

export default PremiumExercisesBanner;
