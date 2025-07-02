
// Types for grammar exercises and rules
export interface Example {
  id: string;
  german: string;
  czech: string;
}

export interface GrammarRule {
  id: string;
  name: string;
  description: string;
  examples: Example[];
}

export interface GrammarCategory {
  id: string;
  name: string;
  rules: GrammarRule[];
}

// Exercise type for interactive grammar exercises
export interface Exercise {
  id: number;
  type: 'multiplechoice' | 'fillblank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
}
