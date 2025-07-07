import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageCircle, Star, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface CommunityRoute {
  id: string;
  route_name: string;
  origin: string;
  destination: string;
  users_count: number;
  average_rating: number;
  popular_times: string[];
  cost_savings: number;
  eco_impact: number;
  recent_activity: string;
}

interface CommunityTip {
  id: string;
  user_name: string;
  route: string;
  tip: string;
  likes: number;
  created_at: string;
  category: 'traffic' | 'cost' | 'route' | 'timing';
}

export const TravelCommunityHub: React.FC = () => {
  const { user } = useAuthState();
  const { t } = useTranslation('travel');
  const [popularRoutes, setPopularRoutes] = useState<CommunityRoute[]>([]);
  const [communityTips, setCommunityTips] = useState<CommunityTip[]>([]);
  const [activeTab, setActiveTab] = useState<'routes' | 'tips'>('routes');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setIsLoading(true);
    try {
      // Mock community data
      const mockRoutes: CommunityRoute[] = [
        {
          id: '1',
          route_name: 'Praha → Dresden Express',
          origin: 'Praha, CZ',
          destination: 'Dresden, DE',
          users_count: 342,
          average_rating: 4.6,
          popular_times: ['07:00', '08:30', '17:00'],
          cost_savings: 45,
          eco_impact: 128,
          recent_activity: 'před 2 hodinami'
        },
        {
          id: '2', 
          route_name: 'Karlovy Vary → Nürnberg',
          origin: 'Karlovy Vary, CZ',
          destination: 'Nürnberg, DE',
          users_count: 189,
          average_rating: 4.3,
          popular_times: ['06:30', '16:30'],
          cost_savings: 62,
          eco_impact: 95,
          recent_activity: 'před 1 hodinou'
        },
        {
          id: '3',
          route_name: 'Plzeň → München',
          origin: 'Plzeň, CZ', 
          destination: 'München, DE',
          users_count: 267,
          average_rating: 4.8,
          popular_times: ['07:30', '18:00'],
          cost_savings: 78,
          eco_impact: 156,
          recent_activity: 'před 30 minutami'
        }
      ];

      const mockTips: CommunityTip[] = [
        {
          id: '1',
          user_name: 'David K.',
          route: 'Praha → Dresden',
          tip: 'Vyhněte se A17 mezi 15:00-18:00, často kolony. Doporučuji přes Teplice.',
          likes: 23,
          created_at: '2024-01-15',
          category: 'traffic'
        },
        {
          id: '2',
          user_name: 'Anna M.',
          route: 'Karlovy Vary → Nürnberg', 
          tip: 'Tankování v Chebu je o 15 centů levnější než v Německu.',
          likes: 34,
          created_at: '2024-01-14',
          category: 'cost'
        },
        {
          id: '3',
          user_name: 'Tomáš P.',
          route: 'Plzeň → München',
          tip: 'Nová objížďka přes A93 ušetří 20 minut, ale pozor na mýtné.',
          likes: 18,
          created_at: '2024-01-13',
          category: 'route'
        }
      ];

      setPopularRoutes(mockRoutes);
      setCommunityTips(mockTips);
    } catch (error) {
      console.error('Failed to load community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: CommunityTip['category']) => {
    switch (category) {
      case 'traffic': return MapPin;
      case 'cost': return TrendingUp;
      case 'route': return MapPin;
      case 'timing': return Calendar;
      default: return MessageCircle;
    }
  };

  const getCategoryColor = (category: CommunityTip['category']) => {
    switch (category) {
      case 'traffic': return 'bg-red-100 text-red-700';
      case 'cost': return 'bg-green-100 text-green-700';
      case 'route': return 'bg-blue-100 text-blue-700';
      case 'timing': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Cestovní Komunita
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'routes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('routes')}
          >
            Populární Trasy
          </Button>
          <Button
            variant={activeTab === 'tips' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('tips')}
          >
            Tipy Komunity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'routes' && (
          <div className="space-y-4">
            {popularRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{route.route_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {route.origin} → {route.destination}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{route.average_rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {route.users_count} uživatelů
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    -{route.cost_savings}€/měsíc
                  </span>
                  <span>-{route.eco_impact}kg CO₂</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {route.popular_times.map((time) => (
                      <Badge key={time} variant="secondary" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Aktivita {route.recent_activity}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {activeTab === 'tips' && (
          <div className="space-y-4">
            {communityTips.map((tip, index) => {
              const CategoryIcon = getCategoryIcon(tip.category);
              
              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {tip.user_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{tip.user_name}</span>
                        <Badge className={`text-xs ${getCategoryColor(tip.category)}`}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {tip.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {tip.route}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2">{tip.tip}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary">
                          <Star className="h-3 w-3" />
                          {tip.likes} užitečné
                        </button>
                        <span>{new Date(tip.created_at).toLocaleDateString('cs-CZ')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelCommunityHub;