
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { 
  Target, 
  Clock, 
  CheckCircle, 
  Star,
  Gift,
  Volume2,
  Award
} from "lucide-react";
import { pronounceWord } from './utils/pronunciationHelper';

interface DailyChallengeProps {
  onComplete?: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ onComplete }) => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Dnešní výzvy
  const dailyChallenges = [
    {
      type: 'vocabulary',
      question: 'Jak se německy řekne "balík"?',
      options: ['das Paket', 'der Karton', 'die Sendung', 'das Etikett'],
      correct: 0,
      explanation: '"Das Paket" je základní pojem pro balík v německém balíkovém centru.',
      audio: 'das Paket'
    },
    {
      type: 'phrase',
      question: 'Která fráze znamená "Potřebuji pomoct"?',
      options: ['Ich verstehe nicht', 'Ich brauche Hilfe', 'Wo ist das?', 'Wie spät ist es?'],
      correct: 1,
      explanation: '"Ich brauche Hilfe" je důležitá fráze pro žádost o pomoc v práci.',
      audio: 'Ich brauche Hilfe'
    },
    {
      type: 'situation',
      question: 'Co řeknete, když nevidíte adresu na balíku?',
      options: ['Das ist kaputt', 'Das kann ich nicht lesen', 'Das ist schwer', 'Das ist falsch'],
      correct: 1,
      explanation: 'Když nevidíte štítek nebo adresu, použijte "Das kann ich nicht lesen".',
      audio: 'Das kann ich nicht lesen'
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentChallenge] = answerIndex.toString();
    setUserAnswers(newAnswers);

    if (currentChallenge < dailyChallenges.length - 1) {
      setTimeout(() => {
        setCurrentChallenge(prev => prev + 1);
      }, 1500);
    } else {
      // Dokončení výzvy
      setTimeout(() => {
        setCompleted(true);
        if (onComplete) {
          onComplete();
        }
      }, 1500);
    }
  };

  const resetChallenge = () => {
    setCurrentChallenge(0);
    setCompleted(false);
    setUserAnswers([]);
  };

  const getScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (parseInt(answer) === dailyChallenges[index].correct ? 1 : 0);
    }, 0);
  };

  if (completed) {
    const score = getScore();
    const percentage = (score / dailyChallenges.length) * 100;
    
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
            <Award className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className={useMobileLayout ? 'text-lg' : 'text-xl'}>
            Denní výzva dokončena!
          </CardTitle>
          <CardDescription>
            Získali jste {score} z {dailyChallenges.length} bodů
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600">{percentage}%</div>
            <Progress value={percentage} className="mx-auto max-w-xs" />
          </div>
          
          <div className="flex justify-center gap-2">
            <Badge className="bg-green-500">+25 XP</Badge>
            <Badge variant="outline">🎯 Denní výzva</Badge>
          </div>
          
          {percentage === 100 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Gift className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-800">
                Perfektní výsledek! Získáváte bonus +10 XP
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={resetChallenge} variant="outline" className="w-full">
            Zkusit znovu
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const challenge = dailyChallenges[currentChallenge];
  const hasAnswered = userAnswers[currentChallenge] !== undefined;
  const userAnswer = hasAnswered ? parseInt(userAnswers[currentChallenge]) : -1;
  const isCorrect = userAnswer === challenge.correct;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className={`${useMobileLayout ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
              <Target className="h-5 w-5 text-blue-500" />
              Denní výzva
            </CardTitle>
            <CardDescription>
              Otázka {currentChallenge + 1} z {dailyChallenges.length}
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            +25 XP
          </Badge>
        </div>
        <Progress value={((currentChallenge + 1) / dailyChallenges.length) * 100} />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className={`${useMobileLayout ? 'text-base' : 'text-lg'} font-medium`}>
            {challenge.question}
          </h3>
          
          {challenge.audio && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pronounceWord(challenge.audio!)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Přehrát výslovnost
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {challenge.options.map((option, index) => {
            let buttonVariant: "default" | "outline" | "secondary" = "outline";
            let className = "";
            
            if (hasAnswered) {
              if (index === challenge.correct) {
                buttonVariant = "default";
                className = "bg-green-600 hover:bg-green-700 text-white border-green-600";
              } else if (index === userAnswer && !isCorrect) {
                buttonVariant = "outline";
                className = "border-red-500 text-red-600 bg-red-50";
              }
            }
            
            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={`w-full p-4 h-auto text-left justify-start ${className}`}
                onClick={() => !hasAnswered && handleAnswer(index)}
                disabled={hasAnswered}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                  {hasAnswered && index === challenge.correct && (
                    <CheckCircle className="h-4 w-4 ml-auto" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-start gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                {isCorrect ? '✓' : '!'}
              </div>
              <div>
                <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                  {isCorrect ? 'Správně!' : 'Téměř to bylo!'}
                </p>
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                  {challenge.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyChallenge;
