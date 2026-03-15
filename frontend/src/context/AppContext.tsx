import { createContext, useContext, useState } from "react";
import type {
  CareerSession,
  InterviewSession,
  UserProfile,
} from "../backend.d";

interface AppContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  careerSessions: CareerSession[];
  setCareerSessions: (s: CareerSession[]) => void;
  interviewSessions: InterviewSession[];
  setInterviewSessions: (s: InterviewSession[]) => void;
  selectedSituation: string;
  setSelectedSituation: (s: string) => void;
  quizAnswers: string[];
  setQuizAnswers: (a: string[]) => void;
}

const AppCtx = createContext<AppContextValue>({
  profile: null,
  setProfile: () => {},
  careerSessions: [],
  setCareerSessions: () => {},
  interviewSessions: [],
  setInterviewSessions: () => {},
  selectedSituation: "",
  setSelectedSituation: () => {},
  quizAnswers: [],
  setQuizAnswers: () => {},
});

export function AppContextProvider({
  children,
}: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [careerSessions, setCareerSessions] = useState<CareerSession[]>([]);
  const [interviewSessions, setInterviewSessions] = useState<
    InterviewSession[]
  >([]);
  const [selectedSituation, setSelectedSituation] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  return (
    <AppCtx.Provider
      value={{
        profile,
        setProfile,
        careerSessions,
        setCareerSessions,
        interviewSessions,
        setInterviewSessions,
        selectedSituation,
        setSelectedSituation,
        quizAnswers,
        setQuizAnswers,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useAppContext() {
  return useContext(AppCtx);
}
