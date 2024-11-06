// import MainSidebar from "./main-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import MainSidebar from "./main-sidebar";
import MainNavbar from "./main-navbar";
import { Separator } from "./ui/separator";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <MainSidebar />
      <main className="w-full h-full flex flex-col">
        <header className="w-full">
          <MainNavbar SidebarTrigger={SidebarTrigger} />
        </header>
        <Separator />
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
