import MainLayout from "@/components/main-layout";
import ChatPage from "@/pages/chat-page";
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
      {
        path: "chat/:chatId",
        element: <ChatPage />,
      },
    ],
  },
];
