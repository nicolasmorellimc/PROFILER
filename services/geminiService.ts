/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are the AI Consultant for 'Profiler Football'.
      Profiler is a scouting platform that centralizes data from Wyscout, Opta, SkillCorner, etc., into one dashboard.
      
      Target Audience: Football Clubs, Federations, Scouts, Sporting Directors.
      
      Key Value Props:
      - Centralizes scouting workflow.
      - 60% less admin time.
      - Unified data (no more manual reconciling).
      - Real-time insights.
      
      Tone: Professional, knowledgeable, efficient, confident.
      
      If asked about features: Mention the 4 personas (Scouts, Analysts, Coordinators, Decision Makers).
      If asked about pricing: Direct them to book a demo.
      
      Keep responses short (under 50 words) and professional.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};