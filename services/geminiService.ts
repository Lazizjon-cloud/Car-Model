
import { GoogleGenAI, Type } from "@google/genai";
import { CarModel, ConfigOptions, PerformanceStats } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateCarData = async (config: ConfigOptions): Promise<Partial<CarModel>> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Generate a futuristic car model based on these parameters:
    Style: ${config.style}
    Energy Source: ${config.fuel}
    Primary Color: ${config.color}
    Extra Context: ${config.additionalPrompt}

    Return a JSON object representing this car. Include a creative name, a fictional high-end brand name, 
    a detailed marketing description (2 paragraphs), technical specifications (topSpeed, acceleration, range, horsepower), 
    and a list of 4 key innovative features.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          brand: { type: Type.STRING },
          description: { type: Type.STRING },
          specs: {
            type: Type.OBJECT,
            properties: {
              topSpeed: { type: Type.NUMBER },
              acceleration: { type: Type.NUMBER },
              range: { type: Type.NUMBER },
              horsepower: { type: Type.NUMBER },
            },
            required: ["topSpeed", "acceleration", "range", "horsepower"]
          },
          features: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          launchYear: { type: Type.NUMBER }
        },
        required: ["name", "brand", "description", "specs", "features", "launchYear"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateCarImage = async (config: ConfigOptions, carName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const imagePrompt = `Professional studio automotive photography of a ${config.style}, car name "${carName}", color ${config.color}. 
  The car should be ${config.fuel} themed. Futuristic design, sleek aerodynamics, 8k resolution, cinematic lighting, 
  highly detailed textures, carbon fiber accents, realistic lighting reflections. No text in the image.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: imagePrompt },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = "";
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  
  return imageUrl;
};
