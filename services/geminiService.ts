import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AcademicFormat } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    introduction: {
      type: Type.STRING,
      description: "A comprehensive academic introduction to the topic.",
    },
    development: {
      type: Type.STRING,
      description: "The main body of the assignment, detailed and structured.",
    },
    conclusion: {
      type: Type.STRING,
      description: "A strong conclusion summarizing the findings.",
    },
    bibliography: {
      type: Type.STRING,
      description: "References and bibliography in the requested format.",
    },
  },
  required: ["introduction", "development", "conclusion", "bibliography"],
};

export const generateAssignment = async (
  topic: string,
  format: AcademicFormat,
  details: string,
  length: string
) => {
  try {
    const prompt = `
      Create a comprehensive academic assignment on the topic: "${topic}".
      Format Style: ${format}.
      Approximate Length: ${length}.
      Additional specific instructions or subtopics: ${details}.
      
      Ensure the tone is formal, academic, non-repetitive, and coherent.
      The content should be substantial suitable for a university level paper.
      
      Structure the response clearly into Introduction, Development, Conclusion, and Bibliography.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert academic professor and writer capable of generating high-quality research papers.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No text generated");
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};