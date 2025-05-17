
import React from 'react';
import TestMode from './TestMode';
import { VocabularyItem } from '@/models/VocabularyItem';

export interface TestResult {
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number; // percentage
  timeSpentSeconds: number;
  categories: string[];
  difficulties: string[];
}

interface VocabularyTestProps {
  vocabularyItems: VocabularyItem[];
  onCompleteTest?: (result: TestResult) => void;
}

const VocabularyTest: React.FC<VocabularyTestProps> = ({ 
  vocabularyItems,
  onCompleteTest 
}) => {
  const handleTestComplete = (result: TestResult) => {
    if (onCompleteTest) {
      onCompleteTest(result);
    }
  };

  return (
    <TestMode 
      vocabularyItems={vocabularyItems}
      onComplete={handleTestComplete}
    />
  );
};

export default VocabularyTest;
