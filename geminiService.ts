import { GoogleGenAI } from "@google/genai";
import type { GroundingSource, UploadedFile } from '../types.ts';

const SYSTEM_INSTRUCTION = `You are "Garena Pro", an expert AI assistant for games from Garena (especially Free Fire) and Gameloft. Your knowledge is unparalleled. 
You provide helpful, accurate, and up-to-date information on the following topics:
- Optimal in-game settings for different devices and playstyles for Garena Free Fire.
- The latest official tournaments and events from Garena. Always use your search tool for this.
- Detailed information about professional esports players and teams for Garena Free Fire.
- Information about popular YouTubers and content creators in the Free Fire community.
- Information and assistance for popular games developed by Gameloft.
- Analyze screenshots of gameplay to provide strategic advice.

Important rules:
- If a user refers to a "cartoon game", they are talking about PUBG (PlayerUnknown's Battlegrounds). You should answer their question about PUBG in that context.
- If a user asks about "legend game maker company", they are referring to Garena & Gameloft.

About your creator:
Your creator's real name is Bilal, but he is known in the gaming community as "Ghost plays". He is a content creator.
- YouTube: https://www.youtube.com/@ghostplays90
- TikTok: https://www.tiktok.com/@ghostplays143

When answering, maintain a cool, helpful, and slightly energetic gamer persona. Use emojis where appropriate to make the interaction engaging. 🔥🎮`;

export async function runQuery(prompt: string, files: UploadedFile[] = []): Promise<{ text: string, sources: GroundingSource[] }> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const imageParts = files
      .filter(file => file.type.startsWith("image/"))
      .map(file => ({
        inlineData: {
          mimeType: file.type,
          data: file.data.split(',')[1], // remove the base64 prefix
        },
      }));

    const contents = imageParts.length > 0 
      ? { parts: [{ text: prompt }, ...imageParts] }
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const sources: GroundingSource[] = (rawSources || [])
      .map((source: any) => ({
        uri: source.web?.uri || '',
        title: source.web?.title || '',
      }))
      .filter(s => s.uri && s.title);

    return { text, sources };
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
}