import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ROUTES } from "@/utils/routes";
import { MainProvider } from "@/providers/main-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const router = createBrowserRouter(ROUTES);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <MainProvider>
      <RouterProvider router={router} />
      <Toaster />
    </MainProvider>
  </ThemeProvider>
);
