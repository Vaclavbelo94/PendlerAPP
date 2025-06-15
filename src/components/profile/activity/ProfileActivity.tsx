
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Calendar, 
  BookOpen, 
  Car, 
  Target, 
  TrendingUp,
  Clock,
  Award
} from "lucide-react";

const ProfileActivity = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app this would come from API
  const activityStats = {
    totalSessions: 42,
    currentStreak: 7,
    longestStreak: 15,
    totalLearningTime: 1240, // minutes
    shiftsLogged: 28,
    distanceTraveled: 1850, // km
    fuelSaved: 125, // liters
    co2Reduced: 290 // kg
  };

  const weeklyActivity = [
    { day: 'Po', sessions: 3, minutes: 45 },
    { day: 'Út', sessions: 2, minutes: 30 },
    { day: 'St', sessions: 4, minutes: 60 },
    { day: 'Čt', sessions: 1, minutes: 15 },
    { day: 'Pá', sessions: 3, minutes: 45 },
    { day: 'So', sessions: 2, minutes: 30 },
    { day: 'Ne', sessions: 1, minutes: 20 }
  ];

  const achievements = [
    { name: 'První směna', description: 'Zaznamenal jste svou první pracovní směnu', unlocked: true },
    { name: '7 dní v řadě', description: 'Používal jste aplikaci 7 dní po sobě', unlocked: true },
    { name: 'Ekoválčnik', description: 'Ušetřil jste 100+ litrů paliva', unlocked: true },
    { name: '30 dní', description: 'Používáte aplikaci již 30 dní', unlocked: false },
    { name: 'Studijní guru', description: 'Dokončil jste 50+ lekcí němčiny', unlocked: false }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activityStats.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Celkem relací</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activityStats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Dní v řadě</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(activityStats.totalLearningTime / 60)}</p>
              <p className="text-xs text-muted-foreground">Hodin učení</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activityStats.shiftsLogged}</p>
              <p className="text-xs text-muted-foreground">Směn</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Týdenní aktivita</CardTitle>
          <CardDescription>Vaše aktivita za posledních 7 dní</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium">{day.day}</span>
                  <Progress value={(day.sessions / 5) * 100} className="w-32" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{day.sessions} relací</p>
                  <p className="text-xs text-muted-foreground">{day.minutes} min</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LearningTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Studijní pokrok
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Němčina - základy</span>
            <Badge variant="secondary">75% dokončeno</Badge>
          </div>
          <Progress value={75} />
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">127</p>
              <p className="text-sm text-muted-foreground">Slovíček</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">23</p>
              <p className="text-sm text-muted-foreground">Lekcí</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">8</p>
              <p className="text-sm text-muted-foreground">Testů</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CommutingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Dojíždění a ekologie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{activityStats.distanceTraveled}</p>
              <p className="text-sm text-muted-foreground">km ujetých</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{activityStats.fuelSaved}</p>
              <p className="text-sm text-muted-foreground">l paliva ušetřeno</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{activityStats.co2Reduced}</p>
              <p className="text-sm text-muted-foreground">kg CO₂ sníženo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AchievementsTab = () => (
    <div className="space-y-4">
      {achievements.map((achievement, index) => (
        <Card key={index} className={achievement.unlocked ? '' : 'opacity-50'}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Award className={`h-6 w-6 ${achievement.unlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{achievement.name}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
            {achievement.unlocked && (
              <Badge className="bg-yellow-500 text-white">Odemčeno</Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Aktivita a statistiky
        </CardTitle>
        <CardDescription>
          Sledujte svůj pokrok a dosažené úspěchy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Přehled</TabsTrigger>
            <TabsTrigger value="learning">Učení</TabsTrigger>
            <TabsTrigger value="commuting">Dojíždění</TabsTrigger>
            <TabsTrigger value="achievements">Úspěchy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="learning" className="mt-6">
            <LearningTab />
          </TabsContent>
          
          <TabsContent value="commuting" className="mt-6">
            <CommutingTab />
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-6">
            <AchievementsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileActivity;
