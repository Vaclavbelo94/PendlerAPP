
import React, { useState } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

interface TestQuestionProps {
  item: VocabularyItem;
  onAnswer: (id: string, answer: string, isCorrect: boolean) => void;
}

const TestQuestion: React.FC<TestQuestionProps> = ({ item, onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) return;
    
    // Check if the answer is correct (case insensitive)
    const isCorrect = answer.trim().toLowerCase() === item.translation.toLowerCase();
    onAnswer(item.id, answer, isCorrect);
    setAnswer('');
    setShowHint(false);
  };
  
  const getHint = () => {
    const translation = item.translation;
    return translation.charAt(0) + '...' + translation.charAt(translation.length - 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-muted rounded-md">
        <div className="text-xl md:text-2xl font-medium text-center mb-2">
          {item.word}
        </div>
        {item.category && (
          <div className="text-sm text-center text-muted-foreground">
            Kategorie: {item.category}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="answer" className="block text-sm font-medium">
          Přeložte toto slovo:
        </label>
        <Input
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full"
          placeholder="Vaše odpověď"
          autoComplete="off"
          autoFocus
        />
      </div>
      
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-muted-foreground mt-2"
          >
            Nápověda: {getHint()}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setShowHint(true)} 
          disabled={showHint}
        >
          Nápověda
        </Button>
        <Button type="submit">
          Odpovědět
        </Button>
      </div>
    </form>
  );
};

export default TestQuestion;
