import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedPost, PostRequest } from "../types";

const apiKey = process.env.API_KEY;

// Schema definition for structured JSON output
const postSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    content: {
      type: Type.STRING,
      description: "The main body text of the social media post. Include emojis where appropriate for the requested tone.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-7 relevant hashtags.",
    },
    imageSuggestion: {
      type: Type.STRING,
      description: "A short, descriptive prompt for an image that would go well with this post.",
    },
    estimatedReach: {
      type: Type.STRING,
      description: "A fictional prediction of engagement (e.g., 'High', 'Moderate') based on the content quality.",
    }
  },
  required: ["content", "hashtags", "imageSuggestion", "estimatedReach"],
};

export const generateSocialContent = async (request: PostRequest): Promise<GeneratedPost> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Social Media Strategist and Copywriter. 
    Your goal is to write high-engagement posts tailored to specific platforms and audiences.
    
    Platform Rules:
    - LinkedIn: Professional, spaced out for readability, insightful, use bullet points if needed. No more than 3-5 hashtags.
    - Twitter/X: Punchy, under 280 characters (unless a thread is implied, but strictly keep this single response under 280 chars for now). High energy.
    - Facebook: Community-focused, conversational, encourages comments.

    Tone Guidelines:
    - Adjust vocabulary and sentence structure strictly based on the requested tone.
    
    General:
    - Do not include the hashtags inside the 'content' field unless they are naturally woven into sentences. 
    - The 'hashtags' array will be appended separately in the UI.
    - Ensure the content is ready-to-post.
  `;

  const prompt = `
    Create a ${request.platform} post.
    Topic: ${request.topic}
    Tone: ${request.tone}
    Target Audience: ${request.audience}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: postSchema,
        temperature: 0.7, // Creativity balance
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No content generated.");
    }

    const data = JSON.parse(responseText) as GeneratedPost;
    return data;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
