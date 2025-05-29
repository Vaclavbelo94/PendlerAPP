
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Package, 
  TrendingUp, 
  BarChart3,
  Settings,
  Download,
  Play
} from 'lucide-react';

interface SmartLanguagePackDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartLanguagePackDashboard: React.FC<SmartLanguagePackDashboardProps> = ({
  isOpen,
  onClose
}) => {
  // Mock data for demo
  const mockPacks = [
    {
      id: '1',
      title: 'Pracovní němčina',
      category: 'work',
      progress: 75,
      totalItems: 50,
      completedItems: 38,
      difficulty: 'intermediate'
    },
    {
      id: '2',
      title: 'Každodenní konverzace',
      category: 'daily',
      progress: 60,
      totalItems: 30,
      completedItems: 18,
      difficulty: 'beginner'
    }
  ];

  const mockStats = {
    totalPacks: 2,
    avgCompletion: 67.5,
    totalItemsLearned: 56,
    streakDays: 5
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Smart Language Packs Dashboard
          </DialogTitle>
          <DialogDescription>
            Správa a analytika vašich inteligentních učebních balíčků
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{mockStats.totalPacks}</div>
                <p className="text-xs text-muted-foreground">Aktivní balíčky</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{mockStats.avgCompletion}%</div>
                <p className="text-xs text-muted-foreground">Průměrná dokončenost</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">{mockStats.totalItemsLearned}</div>
                <p className="text-xs text-muted-foreground">Naučených položek</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">{mockStats.streakDays}</div>
                <p className="text-xs text-muted-foreground">Dní v řadě</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Packs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Aktivní balíčky
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPacks.map((pack) => (
                <div key={pack.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{pack.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{pack.category}</Badge>
                        <Badge variant="secondary">{pack.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{pack.progress}%</div>
                      <div className="text-xs text-muted-foreground">
                        {pack.completedItems}/{pack.totalItems}
                      </div>
                    </div>
                  </div>
                  
                  <Progress value={pack.progress} className="mb-3" />
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Pokračovat
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Statistiky
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Nastavení
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pack Creation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Vytvořit nový balíček
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Brain className="h-6 w-6 mb-2" />
                  <span className="text-sm">AI doporučení</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Package className="h-6 w-6 mb-2" />
                  <span className="text-sm">Vlastní balíček</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span className="text-sm">Import balíčku</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartLanguagePackDashboard;
