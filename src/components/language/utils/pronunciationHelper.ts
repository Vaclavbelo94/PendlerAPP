
// Helper function pro přehrání výslovnosti
export const pronounceWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE';
    utterance.rate = 0.8; // Pomalejší tempo pro lepší porozumění
    speechSynthesis.speak(utterance);
  }
};

export const pronouncePhrase = (phrase: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'de-DE';
    utterance.rate = 0.7; // Ještě pomalejší pro celé věty
    speechSynthesis.speak(utterance);
  }
};
