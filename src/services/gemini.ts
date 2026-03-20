import { GoogleGenAI } from '@google/genai';
import { Message, Location } from '../types';

let aiInstance: GoogleGenAI | null = null;

export function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generateReply(
  targetLanguage: string,
  location: Location,
  chatHistory: Message[]
): Promise<string> {
  const ai = getAI();

  const systemInstruction = `You are participating in a real-life roleplay to help the user learn ${targetLanguage} through immersion.
The user has just moved to a new country and is navigating daily life.
Current Location: ${location.name} - ${location.description}
Your Character: ${location.npc.name}, ${location.npc.role}
Your Persona: ${location.npc.persona}

Instructions:
1. Respond strictly in character based on your persona and the location.
2. ONLY speak in ${targetLanguage}. Do not use English.
3. Keep your response natural, conversational, and appropriate for the real-world setting.
4. DO NOT act like an AI, a language tutor, or an assistant. Never break character.
5. React naturally to what the user says. If they say something that doesn't make sense, act confused like a real person would.`;

  const contents = chatHistory.map((msg) => ({
    role: msg.senderId === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // Gemini API requires the first message to be from the user.
  // If the first message is from the NPC (model), we prepend a dummy user action.
  if (contents.length > 0 && contents[0].role === 'model') {
    contents.unshift({ role: 'user', parts: [{ text: '*approaches*' }] });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || '...';
  } catch (error) {
    console.error('Error generating reply:', error);
    return 'Sorry, I am having trouble connecting right now.';
  }
}

export async function translateWord(
  targetLanguage: string,
  word: string
): Promise<string> {
  const ai = getAI();

  const systemInstruction = `You are a dictionary. Translate the given word from ${targetLanguage} to English.
Provide ONLY the English translation, nothing else. If the word has multiple meanings, provide the most common one in a conversational context.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: word,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    return response.text?.trim() || 'Translation unavailable';
  } catch (error) {
    console.error('Error translating word:', error);
    return 'Error';
  }
}
