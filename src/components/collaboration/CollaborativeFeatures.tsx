
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Calendar, 
  BookOpen,
  Clock,
  Star,
  Plus,
  Search
} from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'german' | 'czech';
  isPrivate: boolean;
  lastActivity: Date;
}

interface StudyBuddy {
  id: string;
  name: string;
  avatar?: string;
  level: string;
  location: string;
  sharedGoals: string[];
  studyTime: string;
  isOnline: boolean;
  compatibility: number;
}

interface SharedSession {
  id: string;
  title: string;
  type: 'vocabulary' | 'conversation' | 'grammar' | 'pronunciation';
  participants: string[];
  scheduledTime: Date;
  duration: number;
  status: 'upcoming' | 'active' | 'completed';
}

export const CollaborativeFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const studyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Němčina pro pendlery',
      description: 'Skupina pro Čechy pracující v Německu',
      members: 24,
      level: 'intermediate',
      language: 'german',
      isPrivate: false,
      lastActivity: new Date()
    },
    {
      id: '2',
      name: 'Začátečníci - první kroky',
      description: 'Společně zvládneme základy němčiny',
      members: 12,
      level: 'beginner',
      language: 'german',
      isPrivate: false,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Pokročilí - Business němčina',
      description: 'Profesionální němčina pro práci',
      members: 8,
      level: 'advanced',
      language: 'german',
      isPrivate: true,
      lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  ];

  const studyBuddies: StudyBuddy[] = [
    {
      id: '1',
      name: 'Tomáš Novák',
      avatar: '/api/placeholder/32/32',
      level: 'Intermediate',
      location: 'Praha → München',
      sharedGoals: ['Pracovní němčina', 'Konverzace'],
      studyTime: '19:00-20:00',
      isOnline: true,
      compatibility: 95
    },
    {
      id: '2',
      name: 'Petra Svobodová',
      avatar: '/api/placeholder/32/32',
      level: 'Beginner',
      location: 'Brno → Stuttgart',
      sharedGoals: ['Základy', 'Každodenní situace'],
      studyTime: '20:00-21:00',
      isOnline: false,
      compatibility: 88
    },
    {
      id: '3',
      name: 'Jan Dvořák',
      avatar: '/api/placeholder/32/32',
      level: 'Advanced',
      location: 'Ostrava → Dresden',
      sharedGoals: ['Business', 'Pokročilá gramatika'],
      studyTime: '18:30-19:30',
      isOnline: true,
      compatibility: 82
    }
  ];

  const sharedSessions: SharedSession[] = [
    {
      id: '1',
      title: 'Konverzační večer',
      type: 'conversation',
      participants: ['Tomáš', 'Petra', 'Já'],
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 60,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Slovní zásoba - práce',
      type: 'vocabulary',
      participants: ['Jan', 'Já'],
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      duration: 45,
      status: 'upcoming'
    }
  ];

  const StudyGroupCard: React.FC<{ group: StudyGroup }> = ({ group }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription className="mt-1">{group.description}</CardDescription>
          </div>
          {group.isPrivate && (
            <Badge variant="secondary">Soukromá</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Členů:</span>
            <span className="font-medium">{group.members}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Úroveň:</span>
            <Badge variant="outline">
              {group.level === 'beginner' ? 'Začátečník' :
               group.level === 'intermediate' ? 'Pokročilý' : 'Expert'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Aktivita:</span>
            <span className="text-xs">
              {group.lastActivity.toLocaleTimeString('cs-CZ', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <Button className="w-full mt-3">
            Připojit se
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const StudyBuddyCard: React.FC<{ buddy: StudyBuddy }> = ({ buddy }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={buddy.avatar} />
              <AvatarFallback>{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {buddy.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{buddy.name}</CardTitle>
            <CardDescription>{buddy.location}</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-sm font-medium">{buddy.compatibility}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Úroveň:</span>
            <Badge variant="outline">{buddy.level}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Studijní čas:</span>
            <span className="font-medium">{buddy.studyTime}</span>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Společné cíle:</span>
            <div className="flex flex-wrap gap-1">
              {buddy.sharedGoals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="flex-1">
              <MessageCircle className="h-3 w-3 mr-1" />
              Chat
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Calendar className="h-3 w-3 mr-1" />
              Plán
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SessionCard: React.FC<{ session: SharedSession }> = ({ session }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{session.title}</CardTitle>
            <CardDescription>
              {session.scheduledTime.toLocaleString('cs-CZ')}
            </CardDescription>
          </div>
          <Badge variant={session.status === 'upcoming' ? 'default' : 'secondary'}>
            {session.status === 'upcoming' ? 'Nadcházející' : 'Dokončeno'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{session.duration} minut</span>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Účastníci:</span>
            <div className="flex -space-x-2">
              {session.participants.map((participant, index) => (
                <div key={index} className="relative">
                  <Avatar className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-xs">{participant[0]}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
          {session.status === 'upcoming' && (
            <Button size="sm" className="w-full">
              Připojit se
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Společné učení
          </h2>
          <p className="text-muted-foreground">
            Spojte se s ostatními studenty a učte se společně
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Vytvořit skupinu
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Hledat skupiny, partnery nebo témata..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="groups">Studijní skupiny</TabsTrigger>
          <TabsTrigger value="buddies">Studijní partneři</TabsTrigger>
          <TabsTrigger value="sessions">Společné lekce</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyGroups.map(group => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="buddies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyBuddies.map(buddy => (
              <StudyBuddyCard key={buddy.id} buddy={buddy} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Naplánovat společnou lekci</CardTitle>
              <CardDescription>
                Vytvořte novou společnou studijní seszi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-20 flex-col">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="text-sm">Slovní zásoba</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span className="text-sm">Konverzace</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Trophy className="h-6 w-6 mb-2" />
                  <span className="text-sm">Kvíz</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Share2 className="h-6 w-6 mb-2" />
                  <span className="text-sm">Výslovnost</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborativeFeatures;
