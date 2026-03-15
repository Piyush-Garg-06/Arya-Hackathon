import { authService } from './authService';

export interface XPProgress {
  id: string;
  userId: string;
  xpPoints: number;
  level: 'Beginner' | 'Learner' | 'Skilled' | 'Interview Ready';
  interviewsCompleted: number;
  dailyStreak: number;
  lastPracticeDate: string;
  totalXPEarned: number;
  xpHistory: Array<{
    xpAmount: number;
    reason: string;
    date: string;
  }>;
  badges?: Badge[];
  progressToNextLevel?: number;
  nextLevelThreshold?: number | null;
}

export interface Badge {
  id: string;
  badgeName: string;
  description: string;
  category: 'achievement' | 'milestone' | 'streak' | 'special';
  icon: string;
  dateUnlocked: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  email: string;
  profileImage?: string;
  xpPoints: number;
  level: string;
  interviewsCompleted: number;
  dailyStreak: number;
}

class GamificationService {
  /**
   * Get user's XP progress
   */
  async getProgress(): Promise<XPProgress> {
    const response = await authService.request('/xp/progress');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch XP progress');
    }

    return data.data;
  }

  /**
   * Record daily practice
   */
  async recordDailyPractice(): Promise<XPProgress> {
    const response = await authService.request('/xp/daily-practice', {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to record practice');
    }

    return data.data;
  }

  /**
   * Get XP history
   */
  async getXPHistory(limit: number = 50): Promise<Array<{ xpAmount: number; reason: string; date: string }>> {
    const response = await authService.request(`/xp/history?limit=${limit}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch XP history');
    }

    return data.data;
  }

  /**
   * Get user's badges
   */
  async getBadges(): Promise<Badge[]> {
    const response = await authService.request('/xp/badges');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch badges');
    }

    return data.data;
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    const response = await authService.request(`/leaderboard?limit=${limit}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch leaderboard');
    }

    return data.data;
  }

  /**
   * Get user's rank
   */
  async getUserRank(): Promise<{ rank: number; totalUsers: number; percentile: string; xpPoints: number; level: string }> {
    const response = await authService.request('/leaderboard/rank');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch rank');
    }

    return data.data;
  }

  /**
   * Get leaderboard statistics
   */
  async getLeaderboardStats(): Promise<{
    totalUsers: number;
    averageXP: number;
    topXP: number;
    levelDistribution: Record<string, number>;
  }> {
    const response = await authService.request('/leaderboard/stats');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stats');
    }

    return data.data;
  }
}

export const gamificationService = new GamificationService();
