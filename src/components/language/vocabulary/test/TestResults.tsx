
import React from 'react';
import { TestItem } from '@/models/VocabularyItem';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface TestResultsProps {
  testItems: TestItem[];
  timeSpentSeconds: number;
}

const TestResults: React.FC<TestResultsProps> = ({ testItems, timeSpentSeconds }) => {
  // Calculate summary statistics
  const correctCount = testItems.filter(item => item.wasCorrect).length;
  const incorrectCount = testItems.length - correctCount;
  const accuracy = Math.round((correctCount / testItems.length) * 100);

  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format response time
  const formatResponseTime = (ms: number | undefined) => {
    if (!ms) return "n/a";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-muted text-center">
          <p className="text-sm text-muted-foreground">Celkem otázek</p>
          <p className="text-2xl font-bold">{testItems.length}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-center">
          <p className="text-sm text-muted-foreground">Správně</p>
          <p className="text-2xl font-bold">{correctCount}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-center">
          <p className="text-sm text-muted-foreground">Chybně</p>
          <p className="text-2xl font-bold">{incorrectCount}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-center">
          <p className="text-sm text-muted-foreground">Úspěšnost</p>
          <p className="text-2xl font-bold">{accuracy}%</p>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        Celkový čas: {formatTimeSpent(timeSpentSeconds)}
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Slovo</TableHead>
              <TableHead className="w-[40%]">Vaše odpověď</TableHead>
              <TableHead className="text-right">Čas odezvy</TableHead>
              <TableHead className="w-[5%]">Výsledek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testItems.map((testItem, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {testItem.item.word}
                  <div className="text-xs text-muted-foreground mt-1">
                    {testItem.item.translation}
                  </div>
                </TableCell>
                <TableCell>
                  {testItem.userAnswer || "-"}
                  {!testItem.wasCorrect && testItem.userAnswer && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Správně: {testItem.item.translation}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatResponseTime(testItem.responseTimeMs)}
                </TableCell>
                <TableCell>
                  {testItem.wasCorrect ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-red-500" />
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TestResults;
