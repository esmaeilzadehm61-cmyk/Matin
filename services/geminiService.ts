
import { GoogleGenAI, Type } from '@google/genai';
import type { AttendanceResult, ImageFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    present: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "List of names of people who are present in the photo."
    },
    absent: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "List of names of people who are absent from the photo."
    },
  },
  required: ["present", "absent"],
};

export const checkAttendance = async (
  imageFile: ImageFile,
  attendeeList: string
): Promise<AttendanceResult> => {
  const prompt = `
    Based on the provided image and the following list of expected attendees, please determine who is present and who is absent.
    
    Expected Attendees:
    ${attendeeList}
    
    Carefully analyze the faces in the image and compare them against the list. Return the result as a JSON object with two keys: "present" and "absent". The values for these keys should be arrays of names from the provided list.
  `;

  const imagePart = {
    inlineData: {
      data: imageFile.base64,
      mimeType: imageFile.mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
    }
  });

  const jsonString = response.text.trim();
  
  try {
    const result: AttendanceResult = JSON.parse(jsonString);
    // Validate the structure
    if (Array.isArray(result.present) && Array.isArray(result.absent)) {
        return result;
    } else {
        throw new Error("AI response has an invalid structure.");
    }
  } catch (e) {
    console.error("Failed to parse AI response:", jsonString);
    throw new Error("Could not parse the response from the AI model.");
  }
};
