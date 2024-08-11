import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/themeContext.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import { default as CreateJobPage } from "./pages/CreateJobPage.tsx";
import CreateResumePage from "./pages/CreateResumePage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import { Test } from "./pages/Test.tsx";
import { JobRecommendationsPage } from "./pages/jobRecommendationsPage.tsx";

interface AppProps {}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
        children: [
          {
            path: "create",
            element: <CreateJobPage />,
          },
        ],
      },
      {
        path: "create-resume",
        element: <CreateResumePage />,
      },
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "job-recommendations",
        element: <JobRecommendationsPage />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignupPage />,
          },
        ],
      },
    ],
  },
]);
export default function App({}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 20,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
