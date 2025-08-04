import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  Plus, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Star,
  Flame,
  Award,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedAt: string;
  category: string;
  points: number;
  icon: string;
}

export const DHLGoalsAndMilestones: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Týdenní studium',
      description: 'Dosáhnout 25 hodin studia týdně',
      target: 25,
      current: 18,
      unit: 'hodin',
      deadline: '2024-08-10',
      category: 'weekly',
      priority: 'high',
      status: 'active'
    },
    {
      id: '2',
      title: 'Gramatická přesnost',
      description: 'Zvýšit skóre gramatiky na 85%',
      target: 85,
      current: 72,
      unit: '%',
      deadline: '2024-08-31',
      category: 'monthly',
      priority: 'medium',
      status: 'active'
    },
    {
      id: '3',
      title: 'Denní návyk',
      description: 'Udržet 30denní sérii studia',
      target: 30,
      current: 12,
      unit: 'dní',
      deadline: '2024-09-03',
      category: 'monthly',
      priority: 'medium',
      status: 'active'
    }
  ]);

  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'První týden',
      description: 'Dokončil jste svůj první týden studia',
      achievedAt: '2024-07-15',
      category: 'Začátek',
      points: 100,
      icon: '🎯'
    },
    {
      id: '2',
      title: 'Rychlý učedník',
      description: '50 dokončených lekcí za týden',
      achievedAt: '2024-07-22',
      category: 'Výkonnost',
      points: 250,
      icon: '⚡'
    },
    {
      id: '3',
      title: 'Mistr slovní zásoby',
      description: 'Naučil jste se 500 nových slov',
      achievedAt: '2024-07-30',
      category: 'Dovednosti',
      points: 500,
      icon: '📚'
    },
    {
      id: '4',
      title: 'Vytrvalost',
      description: '7 dní v řadě s min. 1 hodinou studia',
      achievedAt: '2024-08-01',
      category: 'Návyky',
      points: 300,
      icon: '🔥'
    }
  ]);

  const [newGoalOpen, setNewGoalOpen] = useState(false);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-blue-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weekly': return <Calendar className="h-4 w-4" />;
      case 'monthly': return <Target className="h-4 w-4" />;
      case 'quarterly': return <TrendingUp className="h-4 w-4" />;
      case 'yearly': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const renderGoalCard = (goal: Goal, index: number) => {
    const progress = (goal.current / goal.target) * 100;
    const isOverdue = new Date(goal.deadline) < new Date() && goal.status !== 'completed';
    
    return (
      <motion.div
        key={goal.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`relative overflow-hidden ${isOverdue ? 'border-red-200' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(goal.category)}
                <CardTitle className="text-sm">{goal.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(goal.priority)}>
                  {goal.priority}
                </Badge>
                {goal.status === 'completed' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <CardDescription>{goal.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={getProgressColor(progress)}>
                  {goal.current} / {goal.target} {goal.unit}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Do {new Date(goal.deadline).toLocaleDateString('cs')}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {isOverdue && (
                <div className="text-xs text-red-600 font-medium">
                  Překročen termín!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderMilestoneCard = (milestone: Milestone, index: number) => (
    <motion.div
      key={milestone.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{milestone.icon}</div>
              <div>
                <CardTitle className="text-sm">{milestone.title}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  {milestone.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="h-4 w-4" />
                <span className="font-bold">{milestone.points}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(milestone.achievedAt).toLocaleDateString('cs')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{milestone.description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Cíle a milníky</h3>
          <p className="text-muted-foreground">
            Sledujte svůj pokrok a motivujte se k dosažení cílů
          </p>
        </div>
        <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nový cíl
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vytvorit nový cíl</DialogTitle>
              <DialogDescription>
                Definujte svůj nový studijní cíl
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Název cíle</label>
                <Input placeholder="Např. Týdenní studium" />
              </div>
              <div>
                <label className="text-sm font-medium">Popis</label>
                <Textarea placeholder="Popis vašeho cíle..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Cílová hodnota</label>
                  <Input type="number" placeholder="25" />
                </div>
                <div>
                  <label className="text-sm font-medium">Jednotka</label>
                  <Input placeholder="hodin" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Termín</label>
                <Input type="date" />
              </div>
              <Button className="w-full">Vytvořit cíl</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      <div>
        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Aktivní cíle ({goals.filter(g => g.status === 'active').length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals
            .filter(goal => goal.status === 'active')
            .map((goal, index) => renderGoalCard(goal, index))}
        </div>
      </div>

      {/* Recent Milestones */}
      <div>
        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Nedávné milníky ({milestones.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone, index) => renderMilestoneCard(milestone, index))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Aktuální série
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 dní</div>
            <p className="text-xs text-muted-foreground">
              Nejdelší série: 18 dní
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Celkem bodů
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450</div>
            <p className="text-xs text-muted-foreground">
              +150 tento týden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Míra dokončení
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Cílů splněno včas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};