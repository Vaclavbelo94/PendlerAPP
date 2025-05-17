
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BookOpen, Languages, FileText, Cloud, ArrowRight, Star, Trophy, Award } from 'lucide-react';
import { PremiumBadge } from '@/components/premium/PremiumBadge';
import DailyChallenge from './DailyChallenge';
import { useLanguageContext } from './LanguageManager';

interface LanguageSidebarProps {
  offlineStatus: {
    grammarSaved: boolean;
    vocabularySaved: boolean;
    phrasesSaved: boolean;
  };
  isOffline: boolean;
  saveForOffline: (type: 'grammar' | 'vocabulary' | 'phrases') => void;
}

const LanguageSidebar: React.FC<LanguageSidebarProps> = ({ 
  offlineStatus, 
  isOffline, 
  saveForOffline 
}) => {
  const navigate = useNavigate();
  const { completeDailyGoal } = useLanguageContext();

  // Handle completion of daily challenge
  const handleChallengeComplete = () => {
    // Zavoláme funkci pro splnění denního cíle
    completeDailyGoal();
  };
  
  return (
    <div className="w-full md:w-1/3 space-y-4">
      {/* Premium Banner */}
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <span>Premium</span>
            <PremiumBadge variant="compact" />
          </CardTitle>
          <CardDescription>
            Odemkněte všechny prémiové funkce
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p>S Premium účtem získáte přístup k pokročilým funkcím jako interaktivní kvízy, gamifikace, offline výuka, a mnoho dalšího.</p>
        </CardContent>
        <CardFooter>
          <Button variant="default" onClick={() => navigate('/premium')} className="w-full">
            Aktivovat Premium <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Denní výzvy - gamifikační prvek */}
      <DailyChallenge onComplete={handleChallengeComplete} />
      
      {/* Offline Access Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {isOffline ? (
              <>
                <Cloud className="h-5 w-5 text-red-500" /> 
                <span>Offline režim</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Offline studium</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isOffline ? 
              "Jste v offline režimu" : 
              "Stáhněte si lekce pro studium offline"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Gramatika</span>
              </div>
              {isOffline ? (
                <Badge variant={offlineStatus.grammarSaved ? "outline" : "destructive"}>
                  {offlineStatus.grammarSaved ? "Dostupné offline" : "Nedostupné"}
                </Badge>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => saveForOffline('grammar')}
                  disabled={offlineStatus.grammarSaved}
                >
                  {offlineStatus.grammarSaved ? "Staženo" : "Stáhnout"}
                </Button>
              )}
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Slovíčka</span>
              </div>
              {isOffline ? (
                <Badge variant={offlineStatus.vocabularySaved ? "outline" : "destructive"}>
                  {offlineStatus.vocabularySaved ? "Dostupné offline" : "Nedostupné"}
                </Badge>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => saveForOffline('vocabulary')}
                  disabled={offlineStatus.vocabularySaved}
                >
                  {offlineStatus.vocabularySaved ? "Staženo" : "Stáhnout"}
                </Button>
              )}
            </div>
            
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center">
                <Languages className="h-4 w-4 mr-2" />
                <span>Fráze</span>
              </div>
              {isOffline ? (
                <Badge variant={offlineStatus.phrasesSaved ? "outline" : "destructive"}>
                  {offlineStatus.phrasesSaved ? "Dostupné offline" : "Nedostupné"}
                </Badge>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => saveForOffline('phrases')}
                  disabled={offlineStatus.phrasesSaved}
                >
                  {offlineStatus.phrasesSaved ? "Staženo" : "Stáhnout"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        {!isOffline && (
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => {
                if (!offlineStatus.grammarSaved) saveForOffline('grammar');
                if (!offlineStatus.vocabularySaved) saveForOffline('vocabulary');
                if (!offlineStatus.phrasesSaved) saveForOffline('phrases');
              }}
              disabled={offlineStatus.grammarSaved && offlineStatus.vocabularySaved && offlineStatus.phrasesSaved}
            >
              Stáhnout vše
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Learning Progress Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <span>Učební pokrok</span>
          </CardTitle>
          <CardDescription>
            Váš pokrok v německém jazyce
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Gramatika</span>
              <span className="font-medium">35%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Slovíčka</span>
              <span className="font-medium">48%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: '48%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fráze</span>
              <span className="font-medium">22%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: '22%' }}></div>
            </div>
          </div>
          
          <div className="pt-2 flex justify-between items-center">
            <div>
              <Badge variant="outline" className="flex items-center gap-1 border-amber-200 dark:border-amber-700">
                <Award className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                <span>Úroveň A2</span>
              </Badge>
            </div>
            <Button variant="link" size="sm" className="text-sm p-0" onClick={() => navigate('/profile')}>
              Zobrazit detail
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSidebar;
