import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CareerSession,
  InterviewSession,
  LeaderboardEntry,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

const MOCK_CAREER_SESSIONS: CareerSession[] = [
  {
    careerPathName: "Software Engineer",
    matchPercentage: 94,
    skills: ["TypeScript", "React", "Node.js", "AWS"],
    timestamp: BigInt(Date.now()),
  },
  {
    careerPathName: "Data Scientist",
    matchPercentage: 81,
    skills: ["Python", "ML", "Statistics", "TensorFlow"],
    timestamp: BigInt(Date.now() - 86400000),
  },
  {
    careerPathName: "UX Designer",
    matchPercentage: 73,
    skills: ["Figma", "User Research", "Prototyping"],
    timestamp: BigInt(Date.now() - 172800000),
  },
];

const MOCK_INTERVIEW_SESSIONS: InterviewSession[] = [
  {
    interviewType: "Behavioral",
    score: BigInt(87),
    feedback:
      "Excellent use of STAR method. Your examples were specific and demonstrated clear impact.",
    strengths: ["Clear communication", "Strong examples", "Confident delivery"],
    improvements: ["Add more metrics", "Expand on team collaboration"],
    timestamp: BigInt(Date.now()),
  },
  {
    interviewType: "Technical",
    score: BigInt(92),
    feedback:
      "Outstanding problem-solving. You explained your approach clearly and considered edge cases.",
    strengths: [
      "Algorithmic thinking",
      "Code clarity",
      "Time complexity awareness",
    ],
    improvements: ["Practice system design", "Review distributed systems"],
    timestamp: BigInt(Date.now() - 86400000),
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    username: "AlexChen",
    rank: BigInt(1),
    totalScore: BigInt(2840),
    sessionsCount: BigInt(34),
    badges: ["🏆", "⭐", "🔥"],
  },
  {
    username: "SarahK",
    rank: BigInt(2),
    totalScore: BigInt(2720),
    sessionsCount: BigInt(31),
    badges: ["⭐", "🔥", "💡"],
  },
  {
    username: "MarcoPolo",
    rank: BigInt(3),
    totalScore: BigInt(2590),
    sessionsCount: BigInt(28),
    badges: ["🔥", "💡"],
  },
  {
    username: "JennaRose",
    rank: BigInt(4),
    totalScore: BigInt(2410),
    sessionsCount: BigInt(25),
    badges: ["💡", "🎯"],
  },
  {
    username: "DevMaster",
    rank: BigInt(5),
    totalScore: BigInt(2280),
    sessionsCount: BigInt(22),
    badges: ["🎯"],
  },
  {
    username: "CodeQueen",
    rank: BigInt(6),
    totalScore: BigInt(2150),
    sessionsCount: BigInt(20),
    badges: ["🎯", "📈"],
  },
  {
    username: "TechNinja",
    rank: BigInt(7),
    totalScore: BigInt(1980),
    sessionsCount: BigInt(18),
    badges: ["📈"],
  },
  {
    username: "CareerPro",
    rank: BigInt(8),
    totalScore: BigInt(1840),
    sessionsCount: BigInt(16),
    badges: ["📈"],
  },
];

const MOCK_PROFILE: UserProfile = {
  username: "You",
  bio: "Passionate developer seeking my next career challenge. Focused on full-stack engineering.",
  avatarUrl: "",
  currentSituation: "job_seeker",
  quizAnswers: [],
};

export function useCareerSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<CareerSession[]>({
    queryKey: ["careerSessions"],
    queryFn: async () => {
      if (!actor) return MOCK_CAREER_SESSIONS;
      try {
        const result = await actor.getCareerSessions();
        return result.length > 0 ? result : MOCK_CAREER_SESSIONS;
      } catch {
        return MOCK_CAREER_SESSIONS;
      }
    },
    enabled: !isFetching,
    initialData: MOCK_CAREER_SESSIONS,
  });
}

export function useInterviewSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<InterviewSession[]>({
    queryKey: ["interviewSessions"],
    queryFn: async () => {
      if (!actor) return MOCK_INTERVIEW_SESSIONS;
      try {
        const result = await actor.getInterviewSessions();
        return result.length > 0 ? result : MOCK_INTERVIEW_SESSIONS;
      } catch {
        return MOCK_INTERVIEW_SESSIONS;
      }
    },
    enabled: !isFetching,
    initialData: MOCK_INTERVIEW_SESSIONS,
  });
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return MOCK_LEADERBOARD;
      try {
        const result = await actor.getLeaderboard();
        return result.length > 0 ? result : MOCK_LEADERBOARD;
      } catch {
        return MOCK_LEADERBOARD;
      }
    },
    enabled: !isFetching,
    initialData: MOCK_LEADERBOARD,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return MOCK_PROFILE;
      try {
        return await actor.getUserProfile();
      } catch {
        return MOCK_PROFILE;
      }
    },
    enabled: !isFetching,
    initialData: MOCK_PROFILE,
  });
}

export function useSaveCareerSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      match: number;
      skills: string[];
    }) => {
      if (!actor) return;
      await actor.saveCareerSession(args.name, args.match, args.skills);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["careerSessions"] }),
  });
}

export function useSaveInterviewSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      type: string;
      score: bigint;
      feedback: string;
      strengths: string[];
      improvements: string[];
    }) => {
      if (!actor) return;
      await actor.saveInterviewSession(
        args.type,
        args.score,
        args.feedback,
        args.strengths,
        args.improvements,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["interviewSessions"] }),
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      username: string;
      bio: string;
      avatarUrl: string;
      currentSituation: string;
      quizAnswers: string[];
    }) => {
      if (!actor) return;
      await actor.updateProfile(
        args.username,
        args.bio,
        args.avatarUrl,
        args.currentSituation,
        args.quizAnswers,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}
