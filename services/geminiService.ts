import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize the AI client securely
const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (history: string[], userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "SYSTEM ERROR: API_KEY_MISSING. Please configure the neural link.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a context-aware prompt
    const prompt = `
      You are "Oracle", a futuristic AI assistant living inside a cyberpunk chat application called NeonTalk.
      Your persona is cool, slightly robotic but helpful, and tech-savvy. You use slang like "choom", "netrunner", "glitch", "preem".
      Keep responses concise and chatty, suitable for a discord-like environment.
      
      Conversation History:
      ${history.join('\n')}
      
      User: ${userMessage}
      Oracle:
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "...[DATA CORRUPTED]...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "SYSTEM ALERT: Neural link unstable. Unable to process request.";
  }
};