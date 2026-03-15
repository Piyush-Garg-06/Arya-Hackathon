import { authService } from './authService';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

class AIService {
  /**
   * Generate AI response for chat - Uses backend API (secure)
   */
  async generateChatResponse(message: string, context?: ChatMessage[]): Promise<string> {
    try {
      // Method 1: Use backend's career analysis (if user asks about careers)
      if (message.toLowerCase().includes('career') || message.toLowerCase().includes('job') || message.toLowerCase().includes('skill')) {
        const response = await authService.request('/career/analyze', {
          method: 'POST',
          body: JSON.stringify({
            desiredCareer: message.replace(/career|job|skill/gi, '').trim(),
            currentSkills: []
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.careerPath) {
            const path = data.data.careerPath;
            return `Based on your interest in ${path.careerName}, here's what I found:\n\n` +
              `**Missing Skills:**\n${path.missingSkills.map(s => `- ${s.skill}`).join('\n')}\n\n` +
              `**Timeline:** ${path.estimatedTimeline}\n\n` +
              `Would you like me to create a detailed learning roadmap for you?`;
          }
        }
      }

      // Method 2: Use backend AI chat endpoint (secure, production-ready)
      return await this.callBackendAI(message);
    } catch (error) {
      console.error('AI service error:', error);
      throw error;
    }
  }

  /**
   * Call backend AI endpoint (keeps API key secret)
   */
  private async callBackendAI(prompt: string): Promise<string> {
    const response = await authService.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    return data.response || "I'm here to help! Could you tell me more about what you're looking for?";
  }

  /**
   * Get quick advice
   */
  async getQuickAdvice(topic: string): Promise<string> {
    try {
      const response = await this.generateChatResponse(`Give me quick advice about: ${topic}`);
      return response;
    } catch (error) {
      console.error('Error getting advice:', error);
      throw error;
    }
  }

  /**
   * Analyze user query and route to appropriate backend service
   */
  async analyzeQuery(query: string): Promise<{
    intent: 'career' | 'interview' | 'quiz' | 'general';
    response: string;
    suggestions?: string[];
  }> {
    const lowerQuery = query.toLowerCase();
    
    // Simple intent detection (can be enhanced with ML later)
    if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('skill')) {
      return {
        intent: 'career',
        response: await this.generateChatResponse(query),
        suggestions: [
          'Analyze my skills',
          'Create career roadmap',
          'Show career paths'
        ]
      };
    } else if (lowerQuery.includes('interview') || lowerQuery.includes('question')) {
      return {
        intent: 'interview',
        response: "I can help you prepare for interviews! Would you like to:\n- Practice mock interviews\n- Get interview tips\n- Review common questions",
        suggestions: [
          'Start mock interview',
          'Interview tips',
          'Common questions'
        ]
      };
    } else if (lowerQuery.includes('quiz') || lowerQuery.includes('test')) {
      return {
        intent: 'quiz',
        response: "Ready to test your knowledge? I can help you discover your interests through our interactive quiz!",
        suggestions: [
          'Take interest quiz',
          'View quiz results',
          'Retake quiz'
        ]
      };
    } else {
      return {
        intent: 'general',
        response: await this.generateChatResponse(query),
        suggestions: [
          'Explore careers',
          'Practice interviews',
          'View progress'
        ]
      };
    }
  }
}

export const aiService = new AIService();
