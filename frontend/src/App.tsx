import AppLayout from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import CareerRecommendation from "@/pages/CareerRecommendation";
import CareerSetup from "@/pages/CareerSetup";
import ChatBot from "@/pages/ChatBot";
import Dashboard from "@/pages/Dashboard";
import InterestDiscoveryTest from "@/pages/InterestDiscoveryTest";
import InterviewPreparation from "@/pages/InterviewPreparation";
import LandingPage from "@/pages/LandingPage";
import Leaderboard from "@/pages/Leaderboard";
import LoginPage from "@/pages/LoginPage";
import PersonalRoadmap from "@/pages/PersonalRoadmap";
import Profile from "@/pages/Profile";
import SignupPage from "@/pages/SignupPage";
import SituationSelection from "@/pages/SituationSelection";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shell",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/dashboard",
  component: Dashboard,
});

const situationRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/situation",
  component: SituationSelection,
});

const quizRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/quiz",
  component: InterestDiscoveryTest,
});

const careersRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/career-guidance",
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) ?? "discovery",
    data: (search.data as string) ?? "",
  }),
  component: CareerRecommendation,
});

const careerSetupRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/career-setup",
  component: CareerSetup,
});

const interviewRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/interview-preparation",
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as string) ?? "",
  }),
  component: InterviewPreparation,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/leaderboard",
  component: Leaderboard,
});

const profileRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/profile",
  component: Profile,
});

const chatbotRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/chatbot",
  component: ChatBot,
});

const roadmapRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/roadmap",
  component: PersonalRoadmap,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  shellRoute.addChildren([
    dashboardRoute,
    situationRoute,
    careerSetupRoute,
    quizRoute,
    careersRoute,
    interviewRoute,
    leaderboardRoute,
    profileRoute,
    chatbotRoute,
    roadmapRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
