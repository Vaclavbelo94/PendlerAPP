
// Helper functions for pronunciation and audio features
export const pronounceWord = (word: string, lang: string = 'de-DE', rate: number = 0.8) => {
  if ('speechSynthesis' in window) {
    // Stop any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.volume = 0.8;
    
    // Add error handling
    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event.error);
    };
    
    speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
  }
};

export const pronouncePhrase = (phrase: string, lang: string = 'de-DE', rate: number = 0.7) => {
  pronounceWord(phrase, lang, rate);
};

export const pronounceCzech = (word: string) => {
  pronounceWord(word, 'cs-CZ', 0.8);
};

export const pronouncePolish = (word: string) => {
  pronounceWord(word, 'pl-PL', 0.8);
};

// Get available voices for the language
export const getGermanVoices = () => {
  if ('speechSynthesis' in window) {
    const voices = speechSynthesis.getVoices();
    return voices.filter(voice => voice.lang.startsWith('de'));
  }
  return [];
};

// Check if speech synthesis is supported
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};
