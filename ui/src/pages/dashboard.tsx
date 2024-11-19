import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { MessageCircleMoreIcon } from "lucide-react";
import { useEffect } from "react";

const DashboardPage = () => {
  const authState = useAuthStore();
  const { theme } = useTheme();
  useEffect(() => {
    console.log("DEBUG: authState", authState);
  }, [authState]);
  return (
    <section className="w-full my-20 flex items-center justify-center flex-col gap-5">
      <div className="flex items-center gap-2">
        <MessageCircleMoreIcon
          size={64}
          className={theme === "light" ? "text-blue-400" : "text-blue-400"}
        />
        <span
          className={cn(
            "text-5xl tracking-wide",
            theme === "light" ? "text-blue-400" : "text-blue-400"
          )}
        >
          ConvoBot
        </span>
      </div>
      <p className="text-primary text-center flex flex-col gap-2">
        <span>
          Welcome back, <strong>{authState.userDetails?.firstName}</strong>.
        </span>
        <span>Choose a chat to continue conversation or create a new chat</span>
      </p>
    </section>
  );
};

export default DashboardPage;
