import { FilesRepository, ScannedFile } from '../database/repositories/FilesRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AIAnalysisResult {
  summary: string;
  healthScore: number;
  recommendations: Array<{
    id: number;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: 'Review' | 'Delete' | 'Archive' | 'Ignore';
    affectedFiles: string[]; // URIs
  }>;
}

const CACHE_KEY = 'MEMORA_AI_LATEST_ANALYSIS';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class AIService {
  
  static async getCachedAnalysis(): Promise<AIAnalysisResult | null> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static async analyzeFiles(): Promise<AIAnalysisResult | null> {
    try {
      const files = await FilesRepository.getAllFiles();
      if (files.length === 0) return null;

      const fileData = files.map(f => ({
        uri: f.uri,
        name: f.name,
        sizeMB: parseFloat((f.size / (1024 * 1024)).toFixed(2)),
        category: f.category,
        daysOld: Math.floor((Date.now() - f.createdAt) / (1000 * 60 * 60 * 24)),
      }));

      const systemPrompt = `You are MemoraAI, an advanced digital footprint analyzer.
Analyze the user's file metadata and provide a health score (0-100), a summary, and actionable recommendations.
You MUST reply with ONLY a valid JSON object matching this exact TypeScript schema:
{
  "summary": "Brief overall analysis of their digital footprint.",
  "healthScore": 92,
  "recommendations": [
    {
      "id": 1,
      "priority": "high" | "medium" | "low",
      "title": "Short title",
      "description": "Explain WHY this recommendation exists.",
      "action": "Review" | "Delete" | "Archive" | "Ignore",
      "affectedFiles": ["uri1", "uri2"]
    }
  ]
}`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Here is my file metadata: ${JSON.stringify(fileData)}` }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Groq API Error: ${data.error?.message || response.statusText}`);
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("No response from Groq");

      const result: AIAnalysisResult = JSON.parse(content);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(result));
      return result;
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return null;
    }
  }
}

