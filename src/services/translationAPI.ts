
interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  service: 'google-translate' | 'offline';
}

// Základní offline slovník pro nejčastější fráze
const offlineDictionary: Record<string, Record<string, string>> = {
  cs: {
    'dobrý den': { pl: 'dzień dobry', de: 'guten tag' },
    'děkuji': { pl: 'dziękuję', de: 'danke' },
    'prosím': { pl: 'proszę', de: 'bitte' },
    'promiňte': { pl: 'przepraszam', de: 'entschuldigung' },
    'ano': { pl: 'tak', de: 'ja' },
    'ne': { pl: 'nie', de: 'nein' },
    'kde je': { pl: 'gdzie jest', de: 'wo ist' },
    'kolik to stojí': { pl: 'ile to kosztuje', de: 'was kostet das' },
    'nerozumím': { pl: 'nie rozumiem', de: 'ich verstehe nicht' },
    'pomoc': { pl: 'pomoc', de: 'hilfe' }
  },
  pl: {
    'dzień dobry': { cs: 'dobrý den', de: 'guten tag' },
    'dziękuję': { cs: 'děkuji', de: 'danke' },
    'proszę': { cs: 'prosím', de: 'bitte' },
    'przepraszam': { cs: 'promiňte', de: 'entschuldigung' },
    'tak': { cs: 'ano', de: 'ja' },
    'nie': { cs: 'ne', de: 'nein' },
    'gdzie jest': { cs: 'kde je', de: 'wo ist' },
    'ile to kosztuje': { cs: 'kolik to stojí', de: 'was kostet das' },
    'nie rozumiem': { cs: 'nerozumím', de: 'ich verstehe nicht' },
    'pomoc': { cs: 'pomoc', de: 'hilfe' }
  },
  de: {
    'guten tag': { cs: 'dobrý den', pl: 'dzień dobry' },
    'danke': { cs: 'děkuji', pl: 'dziękuję' },
    'bitte': { cs: 'prosím', pl: 'proszę' },
    'entschuldigung': { cs: 'promiňte', pl: 'przepraszam' },
    'ja': { cs: 'ano', pl: 'tak' },
    'nein': { cs: 'ne', pl: 'nie' },
    'wo ist': { cs: 'kde je', pl: 'gdzie jest' },
    'was kostet das': { cs: 'kolik to stojí', pl: 'ile to kosztuje' },
    'ich verstehe nicht': { cs: 'nerozumím', pl: 'nie rozumiem' },
    'hilfe': { cs: 'pomoc', pl: 'pomoc' }
  }
};

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> => {
  if (sourceLang === targetLang) {
    return {
      translatedText: text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      service: 'offline'
    };
  }

  // Nejdříve zkusíme offline slovník
  const normalizedText = text.toLowerCase().trim();
  const sourceDict = offlineDictionary[sourceLang as keyof typeof offlineDictionary];
  
  if (sourceDict && sourceDict[normalizedText]) {
    const translation = sourceDict[normalizedText][targetLang as keyof typeof sourceDict[typeof normalizedText]];
    if (translation) {
      return {
        translatedText: translation,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        service: 'offline'
      };
    }
  }

  // Pokud offline slovník nepomoze, použijeme Google Translate API
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return {
        translatedText: data[0][0][0],
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        service: 'google-translate'
      };
    }
  } catch (error) {
    console.error('Translation API error:', error);
  }

  // Fallback - vrátíme původní text
  return {
    translatedText: text,
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
    service: 'offline'
  };
};
