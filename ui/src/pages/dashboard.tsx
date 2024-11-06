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
          className={theme === "light" ? "text-teal-800" : "text-teal-500"}
        />
        <span
          className={cn(
            "text-5xl tracking-wide",
            theme === "light" ? "text-teal-800" : "text-teal-500"
          )}
        >
          ConvoBot
        </span>
      </div>
      <p className="text-primary">
        Welcome back, {authState.userDetails?.firstName} choose a chat to
        continue conversation or use a new chat
      </p>
    </section>
  );
};

export default DashboardPage;
