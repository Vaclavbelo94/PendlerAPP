import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VocabularyItem, TestResult, TestItem, SkillsData } from '@/models/VocabularyItem';
import TestQuestion from './test/TestQuestion';
import TestResults from './test/TestResults';

interface TestModeProps {
  vocabularyItems: VocabularyItem[];
  onComplete?: (result: TestResult) => void;
}

const TestMode: React.FC<TestModeProps> = ({ vocabularyItems, onComplete }) => {
  const [testActive, setTestActive] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);

  // Min number of items for a test
  const MIN_TEST_ITEMS = 5;
  const MAX_TEST_ITEMS = 20;

  // Select test items from available vocabulary
  const selectTestItems = () => {
    // If not enough items available, use all of them
    if (vocabularyItems.length <= MIN_TEST_ITEMS) {
      return [...vocabularyItems];
    }

    // Randomly select between MIN and MAX items
    const testSize = Math.min(
      Math.max(MIN_TEST_ITEMS, Math.floor(vocabularyItems.length * 0.3)),
      MAX_TEST_ITEMS
    );
    
    // Shuffle vocabulary items and pick the first N
    const shuffled = [...vocabularyItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, testSize);
  };

  const startTest = () => {
    const selectedItems = selectTestItems();
    
    // Create test items with initial states
    const newTestItems: TestItem[] = selectedItems.map(item => ({
      item,
      wasCorrect: false,
      userAnswer: '',
      responseTimeMs: 0
    }));
    
    setTestItems(newTestItems);
    setCurrentQuestionIndex(0);
    setTestActive(true);
    setTestCompleted(false);
    setStartTime(new Date());
    setQuestionStartTime(new Date());
  };

  const handleAnswer = (itemId: string, answer: string, isCorrect: boolean) => {
    // Calculate response time
    const responseTime = questionStartTime ? new Date().getTime() - questionStartTime.getTime() : 0;
    
    // Update test items with the user's answer and result
    setTestItems(prev => 
      prev.map((testItem, index) => 
        index === currentQuestionIndex
          ? { 
              ...testItem, 
              wasCorrect: isCorrect, 
              userAnswer: answer,
              responseTimeMs: responseTime
            }
          : testItem
      )
    );

    // Move to next question or complete the test
    if (currentQuestionIndex < testItems.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(new Date()); // Reset timer for next question
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    setTestActive(false);
    setTestCompleted(true);
    setEndTime(new Date());
  };

  // Generate test results when the test is completed
  useEffect(() => {
    if (testCompleted && startTime && endTime && onComplete) {
      // Count correct and incorrect answers
      const correctAnswers = testItems.filter(item => item.wasCorrect).length;
      const incorrectAnswers = testItems.length - correctAnswers;
      
      // Calculate score
      const score = Math.round((correctAnswers / testItems.length) * 100);
      
      // Get time spent in seconds
      const timeSpentSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
      
      // Extract unique categories and difficulties
      const categories = Array.from(new Set(
        testItems.map(item => item.item.category || 'uncategorized')
      ));
      
      const difficulties = Array.from(new Set(
        testItems.map(item => item.item.difficulty || 'unspecified')
      ));
      
      // Generate skills data based on performance
      // This is simulated data - in real app it would be based on actual measurements
      const skillsData: SkillsData = {
        reading: Math.round(65 + (score / 5) - Math.random() * 15),
        writing: Math.round(60 + (score / 6) - Math.random() * 15),
        speaking: Math.round(50 + (score / 7) - Math.random() * 20),
        listening: Math.round(55 + (score / 6) - Math.random() * 15),
        grammar: Math.round(45 + (score / 5) - Math.random() * 20),
      };

      // Create final result object
      const result: TestResult = {
        startTime,
        endTime,
        totalQuestions: testItems.length,
        correctAnswers,
        incorrectAnswers,
        wrongAnswers: incorrectAnswers, // Duplicate for backward compatibility
        score,
        timeSpentSeconds,
        categories,
        difficulties,
        testItems,
        skillsData  // Předáváme skills data
      };
      
      onComplete(result);
    }
  }, [testCompleted, startTime, endTime, testItems, onComplete]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Testování znalostí</CardTitle>
            <CardDescription>Otestujte si svou znalost slovíček</CardDescription>
          </div>
          {testActive && (
            <div className="text-sm">
              Otázka {currentQuestionIndex + 1} z {testItems.length}
            </div>
          )}
        </div>
        {testActive && (
          <Progress value={(currentQuestionIndex / testItems.length) * 100} className="mt-2" />
        )}
      </CardHeader>
      <CardContent>
        {!testActive && !testCompleted && (
          <div className="space-y-4">
            <p>
              Test bude obsahovat {vocabularyItems.length <= MIN_TEST_ITEMS 
                ? 'všech ' + vocabularyItems.length 
                : 'náhodný výběr ' + Math.min(MAX_TEST_ITEMS, Math.max(MIN_TEST_ITEMS, Math.floor(vocabularyItems.length * 0.3)))
              } slovíček z vaší sbírky.
            </p>
            <p>
              Odpovídejte co nejpřesněji, ale také se snažte odpovídat rychle pro lepší vyhodnocení vašich dovedností.
            </p>
          </div>
        )}
        
        {testActive && currentQuestionIndex < testItems.length && (
          <TestQuestion 
            item={testItems[currentQuestionIndex].item} 
            onAnswer={handleAnswer}
          />
        )}
        
        {testCompleted && (
          <TestResults 
            testItems={testItems} 
            timeSpentSeconds={startTime && endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0}
          />
        )}
      </CardContent>
      <CardFooter className={testActive ? "justify-between" : "justify-end"}>
        {testActive && (
          <Button variant="outline" onClick={completeTest}>
            Ukončit test
          </Button>
        )}
        
        {!testActive && !testCompleted && (
          <Button 
            onClick={startTest} 
            disabled={vocabularyItems.length === 0}
          >
            Začít test
          </Button>
        )}
        
        {!testActive && testCompleted && (
          <Button onClick={startTest}>
            Nový test
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TestMode;
