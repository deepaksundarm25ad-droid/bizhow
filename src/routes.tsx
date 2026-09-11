import { createBrowserRouter, redirect } from "react-router";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Applications from "@/pages/Applications";
import ApplicationDetail from "@/pages/ApplicationDetail";
import Documents from "@/pages/Documents";
import Checklist from "@/pages/Checklist";
import RiskAnalysis from "@/pages/RiskAnalysis";
import Schemes from "@/pages/Schemes";
import Analytics from "@/pages/Analytics";
import Notifications from "@/pages/Notifications";
import Grievances from "@/pages/Grievances";
import Licences from "@/pages/Licences";
import Inspections from "@/pages/Inspections";
import AIInsights from "@/pages/AIInsights";
import OfficerDashboard from "@/pages/OfficerDashboard";
import BusinessProfile from "@/pages/BusinessProfile";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

function requireAuth() {
  if (!localStorage.getItem("govflow_auth")) {
    return redirect("/login");
  }
  return null;
}

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/onboarding", Component: Onboarding },
  {
    Component: Layout,
    loader: requireAuth,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/business", Component: BusinessProfile },
      { path: "/checklist", Component: Checklist },
      { path: "/applications", Component: Applications },
      { path: "/applications/:id", Component: ApplicationDetail },
      { path: "/documents", Component: Documents },
      { path: "/licences", Component: Licences },
      { path: "/inspections", Component: Inspections },
      { path: "/risk", Component: RiskAnalysis },
      { path: "/ai-insights", Component: AIInsights },
      { path: "/schemes", Component: Schemes },
      { path: "/analytics", Component: Analytics },
      { path: "/notifications", Component: Notifications },
      { path: "/grievances", Component: Grievances },
      { path: "/admin", Component: AdminDashboard },
      { path: "/officer", Component: OfficerDashboard },
      { path: "/officer/queue", Component: Applications },
    ],
  },
  { path: "*", Component: NotFound },
]);
