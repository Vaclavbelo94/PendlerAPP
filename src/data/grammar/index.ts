
import { basicGrammarRules } from "./basicGrammarRules";
import { advancedGrammarRules } from "./advancedGrammarRules";

export const grammarExercises = [...basicGrammarRules, ...advancedGrammarRules];

// Export individual rule sets for more granular imports
export { basicGrammarRules, advancedGrammarRules };
