import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

const DashboardPage = () => {
  const authState = useAuthStore();
  useEffect(() => {
    console.log("DEBUG: authState", authState);
  }, [authState]);
  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
};

export default DashboardPage;
