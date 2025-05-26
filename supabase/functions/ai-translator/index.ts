
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const googleAIApiKey = Deno.env.get('GOOGLE_AI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback Google Translate function
async function translateWithGoogleTranslate(text: string, sourceLang: string = 'auto', targetLang: string = 'de') {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data[0] && data[0][0]) {
      const translatedText = data[0][0][0];
      return {
        response: `🔄 **Překlad**: ${translatedText}`,
        fallback: true
      };
    }
    throw new Error('Google Translate API error');
  } catch (error) {
    throw new Error(`Fallback translation failed: ${error.message}`);
  }
}

// Detect language from text
function detectLanguage(text: string): { source: string, target: string } {
  const czechChars = /[áčďéěíňóřšťúůýž]/i;
  const germanChars = /[äöüßÄÖÜ]/i;
  
  if (czechChars.test(text)) {
    return { source: 'cs', target: 'de' };
  } else if (germanChars.test(text)) {
    return { source: 'de', target: 'cs' };
  }
  return { source: 'auto', target: 'cs' };
}

// Analyze input type for response formatting
function analyzeInput(text: string): string {
  const wordCount = text.trim().split(/\s+/).length;
  const isQuestion = /^(jak|co|kde|kdy|proč|kdo|why|what|where|when|how|who|wie|was|wo|wann|warum|wer)\s/i.test(text.trim()) || text.includes('?');
  
  if (wordCount === 1) {
    return 'single_word';
  } else if (isQuestion) {
    return 'question';
  } else {
    return 'sentence';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    const inputType = analyzeInput(message);

    // Simplified system prompt based on input type
    let systemPrompt = '';
    
    switch (inputType) {
      case 'single_word':
        systemPrompt = `Jsi překladač. Pro jednotlivá slova poskytni:
1. Překlad do cílového jazyka
2. Jednoduchý příklad použití ve větě

Formát odpovědi:
🔄 **Překlad**: [přeložené slovo]
📝 **Příklad**: [krátká věta s použitím slova]

Buď stručný a konkrétní.`;
        break;
        
      case 'question':
        systemPrompt = `Jsi jazykový asistent. Odpovídej na otázky o jazyce stručně a prakticky.

Formát odpovědi:
💡 **Odpověď**: [krátká a jasná odpověď]

Pokud je potřeba příklad, uveď jen jeden. Buď konkrétní.`;
        break;
        
      default: // sentence
        systemPrompt = `Jsi překladač. Pro věty a delší texty poskytni pouze čistý překlad.

Formát odpovědi:
🔄 **Překlad**: [přeložený text]

Nic dalšího nepřidávej. Pouze překlad.`;
        break;
    }

    // First try Google Gemini
    try {
      console.log('Attempting Google Gemini API call...');
      
      const prompt = conversationHistory.length > 0 
        ? `${systemPrompt}\n\nKonverzace:\n${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}\n\nUživatel: ${message}`
        : `${systemPrompt}\n\nUživatel: ${message}`;

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleAIApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 200,
          }
        }),
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.text();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      
      if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content) {
        const aiResponse = geminiData.candidates[0].content.parts[0].text;
        console.log('Gemini API success');
        
        return new Response(JSON.stringify({ 
          response: aiResponse,
          service: 'gemini',
          usage: geminiData.usageMetadata 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('Invalid Gemini response format');
      }

    } catch (geminiError) {
      console.error('Gemini API failed, trying fallback:', geminiError.message);
      
      // Fallback to Google Translate
      const languages = detectLanguage(message);
      const fallbackResult = await translateWithGoogleTranslate(message, languages.source, languages.target);
      
      console.log('Fallback translation successful');
      
      return new Response(JSON.stringify({ 
        response: fallbackResult.response,
        service: 'google-translate',
        fallback: true,
        error: `AI nedostupná: ${geminiError.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Complete error in ai-translator function:', error);
    return new Response(JSON.stringify({ 
      error: `Všechny překladové služby nedostupné: ${error.message}`,
      service: 'none'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
