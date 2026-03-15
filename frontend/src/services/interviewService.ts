import { authService } from './authService';

export interface InterviewQuestion {
  questionId: string;
  questionText: string;
  category: 'technical' | 'behavioral' | 'problem-solving';
  expectedKeyPoints: string[];
}

export interface InterviewSession {
  id: string;
  careerRole: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  questions: InterviewQuestion[];
  totalScore: number;
  averageScore: number;
  status: 'in-progress' | 'completed';
  feedback?: string;
  createdAt: string;
}

export interface AnswerEvaluation {
  aiScore: number;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  communicationScore: number;
  technicalAccuracy: number;
  feedback: string;
}

class InterviewService {
  /**
   * Generate interview questions
   */
  async generateQuestions(careerRole: string, difficultyLevel: 'beginner' | 'intermediate' | 'advanced'): Promise<InterviewSession> {
    const response = await authService.request('/interview/question', {
      method: 'POST',
      body: JSON.stringify({ careerRole, difficultyLevel }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate questions');
    }

    return data.data;
  }

  /**
   * Evaluate interview answer
   */
  async evaluateAnswer(
    sessionId: string,
    question: string,
    userAnswer: string
  ): Promise<AnswerEvaluation> {
    const response = await authService.request('/interview/evaluate', {
      method: 'POST',
      body: JSON.stringify({ sessionId, question, userAnswer }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to evaluate answer');
    }

    return data.data.answer;
  }

  /**
   * Complete interview session
   */
  async completeSession(sessionId: string): Promise<{ session: InterviewSession; xpEarned: number }> {
    const response = await authService.request('/interview/complete', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to complete session');
    }

    return data.data;
  }

  /**
   * Get all interview sessions
   */
  async getSessions(): Promise<InterviewSession[]> {
    const response = await authService.request('/interview/sessions');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch sessions');
    }

    return data.data;
  }

  /**
   * Get specific session with answers
   */
  async getSession(id: string): Promise<{ session: InterviewSession; answers: any[] }> {
    const response = await authService.request(`/interview/sessions/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch session');
    }

    return data.data;
  }
}

export const interviewService = new InterviewService();
