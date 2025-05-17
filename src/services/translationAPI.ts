
interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

interface TranslationDictionary {
  [sourceLanguage: string]: {
    [targetLanguage: string]: {
      [phrase: string]: string;
    };
  };
}

// This is a simple mock translation API for demo purposes
// In a real application, you'd integrate with a real API like LibreTranslate, Google Translate, etc.
export async function translateText(
  text: string, 
  sourceLanguage: string, 
  targetLanguage: string
): Promise<TranslationResponse> {
  // Simple dictionary for demo purposes
  const translations: TranslationDictionary = {
    cs: {
      de: {
        "ahoj": "hallo",
        "dobrý den": "guten tag",
        "děkuji": "danke",
        "prosím": "bitte",
        "ano": "ja",
        "ne": "nein",
        "jak se máš": "wie geht es dir",
        "na shledanou": "auf wiedersehen",
        "dobrý večer": "guten abend",
        "dobrou noc": "gute nacht",
        "promiň": "entschuldigung",
        "kde je": "wo ist",
        "kolik stojí": "wie viel kostet",
        "nerozumím": "ich verstehe nicht",
        "pomoc": "hilfe",
        "jak se jmenuješ": "wie heißt du",
        "kolik je hodin": "wie spät ist es",
        "potřebuji pomoc": "ich brauche hilfe",
        "kde je nejbližší": "wo ist der nächste",
        "nemocnice": "krankenhaus",
        "lékárna": "apotheke",
        "restaurace": "restaurant",
        "hotel": "hotel",
        "nádraží": "bahnhof",
        "letiště": "flughafen",
        "supermarket": "supermarkt",
        "obchod": "geschäft",
        "toaleta": "toilette",
        "banka": "bank",
      },
      en: {
        "ahoj": "hello",
        "dobrý den": "good day",
        "děkuji": "thank you",
        "prosím": "please",
        "ano": "yes",
        "ne": "no",
        "jak se máš": "how are you",
        "na shledanou": "goodbye",
        "dobrý večer": "good evening",
        "dobrou noc": "good night",
        "promiň": "sorry",
        "kde je": "where is",
        "kolik stojí": "how much does it cost",
        "nerozumím": "I don't understand",
        "pomoc": "help",
        "jak se jmenuješ": "what's your name",
        "kolik je hodin": "what time is it",
        "potřebuji pomoc": "I need help",
        "kde je nejbližší": "where is the nearest",
        "nemocnice": "hospital",
        "lékárna": "pharmacy",
        "restaurace": "restaurant",
        "hotel": "hotel",
        "nádraží": "train station",
        "letiště": "airport",
        "supermarket": "supermarket",
        "obchod": "shop",
        "toaleta": "toilet",
        "banka": "bank",
      },
      sk: {
        "ahoj": "ahoj",
        "dobrý den": "dobrý deň",
        "děkuji": "ďakujem",
        "prosím": "prosím",
        "ano": "áno",
        "ne": "nie",
        "jak se máš": "ako sa máš",
        "na shledanou": "dovidenia",
        "dobrý večer": "dobrý večer",
        "dobrou noc": "dobrú noc",
        "promiň": "prepáč",
        "kde je": "kde je",
        "kolik stojí": "koľko stojí",
        "nerozumím": "nerozumiem",
        "pomoc": "pomoc",
      },
      pl: {
        "ahoj": "cześć",
        "dobrý den": "dzień dobry",
        "děkuji": "dziękuję",
        "prosím": "proszę",
        "ano": "tak",
        "ne": "nie",
        "jak se máš": "jak się masz",
        "na shledanou": "do widzenia",
        "dobrý večer": "dobry wieczór",
        "dobrou noc": "dobranoc",
        "promiň": "przepraszam",
        "kde je": "gdzie jest",
        "kolik stojí": "ile kosztuje",
        "nerozumím": "nie rozumiem",
        "pomoc": "pomoc",
      }
    },
    de: {
      cs: {
        "hallo": "ahoj",
        "guten tag": "dobrý den",
        "danke": "děkuji",
        "bitte": "prosím",
        "ja": "ano",
        "nein": "ne",
        "wie geht es dir": "jak se máš",
        "auf wiedersehen": "na shledanou",
        "guten abend": "dobrý večer",
        "gute nacht": "dobrou noc",
        "entschuldigung": "promiň",
        "wo ist": "kde je",
        "wie viel kostet": "kolik stojí",
        "ich verstehe nicht": "nerozumím",
        "hilfe": "pomoc",
        "wie heißt du": "jak se jmenuješ",
        "wie spät ist es": "kolik je hodin",
        "ich brauche hilfe": "potřebuji pomoc",
        "wo ist der nächste": "kde je nejbližší",
        "krankenhaus": "nemocnice",
        "apotheke": "lékárna",
        "restaurant": "restaurace",
        "hotel": "hotel",
        "bahnhof": "nádraží",
        "flughafen": "letiště",
        "supermarkt": "supermarket",
        "geschäft": "obchod",
        "toilette": "toaleta",
        "bank": "banka",
      },
      en: {
        "hallo": "hello",
        "guten tag": "good day",
        "danke": "thank you",
        "bitte": "please",
        "ja": "yes",
        "nein": "no",
        "wie geht es dir": "how are you",
        "auf wiedersehen": "goodbye",
        "guten abend": "good evening",
        "gute nacht": "good night",
      }
    },
    en: {
      cs: {
        "hello": "ahoj",
        "good day": "dobrý den",
        "thank you": "děkuji",
        "please": "prosím",
        "yes": "ano",
        "no": "ne",
        "how are you": "jak se máš",
        "goodbye": "na shledanou",
        "good evening": "dobrý večer",
        "good night": "dobrou noc",
        "excuse me": "promiňte",
        "where is": "kde je",
        "how much is it": "kolik to stojí",
        "I don't understand": "nerozumím",
        "help": "pomoc",
        "what's your name": "jak se jmenuješ",
        "what time is it": "kolik je hodin",
        "I need help": "potřebuji pomoc",
        "where is the nearest": "kde je nejbližší",
        "hospital": "nemocnice",
        "pharmacy": "lékárna",
        "restaurant": "restaurace",
        "hotel": "hotel",
        "train station": "nádraží",
        "airport": "letiště",
        "supermarket": "supermarket",
        "shop": "obchod",
        "toilet": "toaleta",
        "bank": "banka",
      },
      de: {
        "hello": "hallo",
        "good day": "guten tag",
        "thank you": "danke",
        "please": "bitte",
        "yes": "ja",
        "no": "nein",
        "how are you": "wie geht es dir",
        "goodbye": "auf wiedersehen",
        "good evening": "guten abend",
        "good night": "gute nacht",
        "excuse me": "entschuldigung",
        "where is": "wo ist",
        "how much is it": "wie viel kostet",
        "I don't understand": "ich verstehe nicht",
        "help": "hilfe",
        "what's your name": "wie heißt du",
        "what time is it": "wie spät ist es",
        "I need help": "ich brauche hilfe",
        "where is the nearest": "wo ist der nächste",
        "hospital": "krankenhaus",
        "pharmacy": "apotheke",
        "restaurant": "restaurant",
        "hotel": "hotel",
        "train station": "bahnhof",
        "airport": "flughafen",
        "supermarket": "supermarkt",
        "shop": "geschäft",
        "toilet": "toilette",
        "bank": "bank",
      }
    },
  };

  // Simple fallback mock implementation
  try {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lowerText = text.toLowerCase().trim();
    let result = "";
    
    if (translations[sourceLanguage]?.[targetLanguage]?.[lowerText]) {
      // Direct match found
      result = translations[sourceLanguage][targetLanguage][lowerText];
    } else {
      // Basic word-by-word translation for demo
      const words = lowerText.split(' ');
      const translatedWords = words.map(word => {
        const translatedWord = translations[sourceLanguage]?.[targetLanguage]?.[word];
        return translatedWord || word;
      });
      result = translatedWords.join(' ');
      
      // For longer texts, generate a plausible response
      if (words.length > 3 && result === lowerText) {
        if (targetLanguage === "de") {
          result = lowerText.split(' ')
            .map(word => word.length > 3 ? word + 'en' : word)
            .join(' ');
        } else if (targetLanguage === "cs") {
          result = lowerText.split(' ')
            .map(word => word.endsWith('en') ? word.slice(0, -2) : word)
            .join(' ');
        } else if (targetLanguage === "sk") {
          // Simulate Czech to Slovak conversion
          result = lowerText.split(' ')
            .map(word => {
              if (word.includes("ě")) return word.replace(/ě/g, "e");
              if (word.endsWith("í")) return word.replace(/í$/g, "ie");
              return word;
            })
            .join(' ');
        } else if (targetLanguage === "pl") {
          // Simulate Czech to Polish conversion
          result = lowerText.split(' ')
            .map(word => {
              if (word.includes("ř")) return word.replace(/ř/g, "rz");
              if (word.endsWith("ý")) return word.replace(/ý$/g, "y");
              return word;
            })
            .join(' ');
        }
      }
    }
    
    return {
      translatedText: result,
      detectedLanguage: sourceLanguage
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Překlad selhal. Zkuste to prosím později.");
  }
}

// LibreTranslate API implementation - uncomment and use API key if available
/*
export async function translateTextWithLibreTranslate(
  text: string, 
  sourceLanguage: string, 
  targetLanguage: string
): Promise<TranslationResponse> {
  try {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: "text",
        // api_key: "YOUR_API_KEY", // Add your API key if using a paid tier
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      translatedText: data.translatedText,
      detectedLanguage: data.detectedLanguage?.language
    };
  } catch (error) {
    console.error("Translation API error:", error);
    throw new Error("Překlad selhal. Zkuste to prosím později.");
  }
}
*/
