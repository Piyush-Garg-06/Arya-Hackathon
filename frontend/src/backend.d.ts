import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    username: string;
    badges: Array<string>;
    rank: bigint;
    totalScore: bigint;
    sessionsCount: bigint;
}
export interface CareerSession {
    matchPercentage: number;
    timestamp: Time;
    careerPathName: string;
    skills: Array<string>;
}
export type Time = bigint;
export interface UserProfile {
    bio: string;
    username: string;
    avatarUrl: string;
    quizAnswers: Array<string>;
    currentSituation: string;
}
export interface InterviewSession {
    strengths: Array<string>;
    improvements: Array<string>;
    feedback: string;
    score: bigint;
    interviewType: string;
    timestamp: Time;
}
export interface backendInterface {
    getCareerSessions(): Promise<Array<CareerSession>>;
    getInterviewSessions(): Promise<Array<InterviewSession>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getUserProfile(): Promise<UserProfile>;
    saveCareerSession(careerPathName: string, matchPercentage: number, skills: Array<string>): Promise<void>;
    saveInterviewSession(interviewType: string, score: bigint, feedback: string, strengths: Array<string>, improvements: Array<string>): Promise<void>;
    updateProfile(username: string, bio: string, avatarUrl: string, currentSituation: string, quizAnswers: Array<string>): Promise<void>;
}
