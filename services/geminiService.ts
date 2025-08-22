import { GoogleGenAI } from "@google/genai";

const cleanBase64 = (base64String: string): string => {
    return base64String.split(',')[1] || base64String;
};

export const compareFaces = async (
    imageBase64_1: string,
    imageBase64_2: string
): Promise<boolean> => {
    const API_KEY = process.env.API_KEY;
    
    if (!API_KEY) {
        throw new Error("API_KEY is not configured. Cannot perform face comparison.");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const imagePart1 = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64(imageBase64_1),
            },
        };

        const imagePart2 = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64(imageBase64_2),
            },
        };

        const textPart = {
            text: "Analyze the two images provided. Are they of the exact same person? Respond with only 'Yes' or 'No', with no additional explanation or punctuation."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart1, imagePart2, textPart] },
        });

        const resultText = response.text.trim().toLowerCase();
        
        return resultText === 'yes';

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to verify identity due to an API error.");
    }
};
