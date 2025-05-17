
import React from 'react';
import TestMode from './TestMode';
import { VocabularyItem } from '@/models/VocabularyItem';

export interface TestItem {
  item: VocabularyItem;
  wasCorrect: boolean;
  userAnswer?: string;
}

export interface TestResult {
  id?: string; // Adding optional id property
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  wrongAnswers: number;
  score: number; // percentage
  timeSpentSeconds: number;
  categories: string[];
  difficulties: string[];
  testItems: TestItem[]; // Adding test items array to track individual question results
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
