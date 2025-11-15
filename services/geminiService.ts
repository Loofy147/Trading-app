
import { GoogleGenAI, Type } from "@google/genai";
import type { StructuredStrategy } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    strategyName: {
      type: Type.STRING,
      description: "A concise, catchy name for the trading strategy based on its rules.",
    },
    description: {
      type: Type.STRING,
      description: "A brief, one-sentence summary of the strategy's core concept.",
    },
    entryConditions: {
      type: Type.ARRAY,
      description: "A list of specific conditions that must be met to trigger a trade entry.",
      items: {
        type: Type.STRING,
      },
    },
    confirmationSignals: {
      type: Type.ARRAY,
      description: "A list of signals that confirm the entry setup is valid before executing the trade.",
      items: {
        type: Type.STRING,
      },
    },
    exitTargets: {
      type: Type.ARRAY,
      description: "A list of conditions or price levels for taking profit and exiting the trade.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["strategyName", "description", "entryConditions", "confirmationSignals", "exitTargets"],
};

export const analyzeStrategy = async (rawStrategy: string): Promise<StructuredStrategy> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following trading strategy and convert it into the specified JSON format. Be precise and extract the key components as described in the schema. Strategy: "${rawStrategy}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Basic validation
    if (!parsedJson.strategyName || !Array.isArray(parsedJson.entryConditions)) {
        throw new Error("AI response is not in the expected format.");
    }

    return parsedJson as StructuredStrategy;
  } catch (error) {
    console.error("Error analyzing strategy with Gemini:", error);
    throw new Error("Failed to analyze the strategy. Please check your input or try again.");
  }
};
