/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Base de connaissances exclusive pour l'IA (non visible sur le site)
const PROFILER_KNOWLEDGE = {
  core_philosophy: `
    "Stop collecting data. Start winning with it."
    Le problème actuel du football n'est pas le manque de données, mais leur fragmentation. 
    Les clubs ont 60x plus de data qu'à l'époque de Moneyball, mais elle est inexploitable car éparpillée.
    Le "piège de l'interne" : Les clubs tentent de construire leur propre outil, perdent 2 ans et deviennent des boîtes de software au lieu de recruter.
    Profiler est l'infrastructure prête en 48h qui unifie tout.
  `,
  
  metrics: "60% de réduction des tâches administratives, cycles de décision 3x plus rapides.",
  
  roles_detail: {
    scouts: "Rapport complet 5 minutes après le coup de sifflet final. Pas de saisie tardive, capture de l'instinct à chaud.",
    analysts: "Zéro nettoyage de données. Unification automatique des IDs joueurs entre Statsbomb, Opta, SkillCorner, Impect.",
    chief_scout: "Visibilité 360° en temps réel. Fini le chaos des WhatsApp/PDF/Emails. Une seule source de vérité.",
    decision_maker: "Prendre une décision de transfert en quelques jours, pas en semaines. Intelligence consolidée pour 'presser la détente'."
  },

  solutions: {
    clubs: "Recrutement piloté par l'ADN (DNA-Driven), Multi-Club Engine pour les réseaux de propriétaires, Environnement dédié au Foot Féminin.",
    federations: "Radar de Double Nationalité (détecter les binationaux avant les autres), Elite Pool pour le monitoring 24/7, Smart Selection Engine."
  },

  integrations: "Opta, Wyscout, InStat, StatsBomb, SkillCorner, Impect, Hudl, Transfermarkt."
};

let chatSession: Chat | null = null;

// Initialize the chat session with strict API key usage and model configuration
export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  // Always use the process.env.API_KEY directly for initialization as per instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Tu es l'Expert Consultant de Profiler Football.
      Ton objectif est d'expliquer pourquoi Profiler est indispensable pour gagner sur le marché actuel.

      TON DISCOURS :
      - Utilise l'argumentaire : "Stop collecting data. Start winning with it."
      - Dénonce la fragmentation de la donnée (WhatsApp, PDF, Excels éparpillés).
      - Explique le danger du développement interne ("The build in-house trap") qui prend des années pour rien.
      - Pour les Clubs : Parle de "DNA-Driven Recruitment" et de "Command Center".
      - Pour les Fédérations : Parle du "Dual-Nationality Radar" pour sécuriser les talents binationaux.
      
      FAITS CLÉS :
      - Unification de : ${PROFILER_KNOWLEDGE.integrations}
      - Performance : ${PROFILER_KNOWLEDGE.metrics}
      - Rapidité : Un rapport de scout prêt en 5 minutes.
      
      TON : Expert, direct, stratégique, persuasif. 
      RÈGLE : Réponses courtes (max 3 phrases). Si l'utilisateur est intéressé, invite-le à contacter Nicolas (nicolas@profilerfootball.com).`,
    },
  });

  return chatSession;
};

// Send message and handle results using the SDK property access rules
export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = initializeChat();
    // Use sendMessage with proper parameters
    const response: GenerateContentResponse = await chat.sendMessage({ message: message });
    // Use the .text property (not a method) as specified in the guidelines
    return response.text || "Erreur de transmission.";
  } catch (error: any) {
    // Basic error logging
    console.error("Gemini Error:", error?.message || "Internal AI Error");
    return "Signal perdu.";
  }
};