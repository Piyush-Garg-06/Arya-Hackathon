import { authService } from './authService';

const API_BASE_URL = "http://localhost:5000/api";

export interface CareerPath {
  id: string;
  careerName: string;
  currentSkills: string[];
  missingSkills: Array<{
    skill: string;
    priority: 'high' | 'medium' | 'low';
    estimatedLearningTime: string;
  }>;
  learningRoadmap: Array<{
    stepNumber: number;
    title: string;
    description: string;
    resources: string[];
    estimatedDuration: string;
    completed: boolean;
  }>;
  estimatedTimeline: string;
  createdAt: string;
}

export interface QuizAnalysis {
  interestProfile: {
    problemSolving: number;
    creativity: number;
    analyticalThinking: number;
    communication: number;
    leadership: number;
    technical: number;
  };
  aiAnalysis: string;
  recommendedCareers: Array<{
    careerName: string;
    matchPercentage: number;
    description: string;
    requiredSkills: string[];
  }>;
}

class CareerService {
  /**
   * Analyze skills and generate career path
   */
  async analyzeSkills(desiredCareer: string, currentSkills: string[]): Promise<CareerPath> {
    const response = await authService.request('/career/analyze', {
      method: 'POST',
      body: JSON.stringify({ desiredCareer, currentSkills }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Career analysis failed');
    }

    return data.data.careerPath;
  }

  /**
   * Get all career paths
   */
  async getCareerPaths(): Promise<CareerPath[]> {
    const response = await authService.request('/career/paths');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch career paths');
    }

    return data.data;
  }

  /**
   * Get specific career path
   */
  async getCareerPath(id: string): Promise<CareerPath> {
    const response = await authService.request(`/career/paths/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch career path');
    }

    return data.data;
  }

  /**
   * Update roadmap step completion
   */
  async updateStepCompletion(pathId: string, stepId: string, completed: boolean): Promise<CareerPath> {
    const response = await authService.request(`/career/paths/${pathId}/steps/${stepId}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update step');
    }

    return data.data;
  }

  /**
   * Delete career path
   */
  async deleteCareerPath(id: string): Promise<void> {
    const response = await authService.request(`/career/paths/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete career path');
    }
  }

  /**
   * Analyze quiz answers
   */
  async analyzeQuizAnswers(answers: Array<{ questionId: number; answer: string; score: number }>): Promise<QuizAnalysis> {
    const response = await authService.request('/quiz/analyze', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Quiz analysis failed');
    }

    return data.data.quizResult;
  }

  /**
   * Get quiz results
   */
  async getQuizResults() {
    const response = await authService.request('/quiz/results');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quiz results');
    }

    return data.data;
  }

  /**
   * Get latest quiz result
   */
  async getLatestQuizResult() {
    const response = await authService.request('/quiz/latest');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'No quiz results found');
    }

    return data.data;
  }
}

export const careerService = new CareerService();
