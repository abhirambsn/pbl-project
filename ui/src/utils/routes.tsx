import MainLayout from "@/components/main-layout";
import DashboardPage from "@/pages/dashboard";
import KnowledgeBasesPage from "@/pages/knowledge-bases";

export const ROUTES = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "kb",
        element: <KnowledgeBasesPage />,
      },
    ],
  },
];
