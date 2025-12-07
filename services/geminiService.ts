
import { GoogleGenAI, Type } from "@google/genai";
import { Project, AIHealthCheckResult, Incident, AIAnalysisResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeProjectHealth = async (project: Project): Promise<AIHealthCheckResult> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a Senior Technical Program Manager. Analyze the health of the following project based on its status and metrics.
      
      Project: ${project.title}
      Description: ${project.description}
      Status: ${project.status}
      Progress: ${project.progress}%
      Deadline: ${project.deadline}
      Tech Stack: ${project.techStack.join(', ')}

      Current Date: ${new Date().toISOString().split('T')[0]}

      Determine if the project is on track. Identify potential risks based on the tech stack, progress vs deadline, and complexity.
      Provide a JSON response.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.INTEGER, description: "0-100 score. 100 is perfect health." },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            summary: { type: Type.STRING, description: "Executive summary of project status." },
            keyRisks: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIHealthCheckResult;

  } catch (error) {
    console.error("Error analyzing project:", error);
    return {
      healthScore: 50,
      riskLevel: 'Medium',
      summary: "AI Analysis unavailable. Manual review recommended.",
      keyRisks: ["Analysis service offline"],
      recommendations: ["Check manual logs"]
    };
  }
};

export const analyzeIncidentWithGemini = async (incident: Incident): Promise<AIAnalysisResult> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a Cyber Security Expert. Analyze the following security incident.
      
      Incident ID: ${incident.id}
      Title: ${incident.title}
      Severity: ${incident.severity}
      System: ${incident.affectedSystem}
      Description: ${incident.description || 'No detailed description provided'}
      
      Assess the risk score (0-100), provide a summary of the threat, and list recommended actions to mitigate or resolve it.
      Provide a JSON response.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: "0-100 risk score where 100 is highest risk." },
            summary: { type: Type.STRING, description: "Summary of the incident analysis." },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of recommended actions."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing incident:", error);
    return {
      riskScore: 0,
      summary: "AI Analysis unavailable. Please review manually.",
      recommendedActions: ["Manual investigation required"]
    };
  }
};
