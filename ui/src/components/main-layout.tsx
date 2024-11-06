// import MainSidebar from "./main-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import MainSidebar from "./main-sidebar";
import MainNavbar from "./main-navbar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <MainSidebar />
      <main className="w-full">
        <header className="w-full">
          <MainNavbar SidebarTrigger={SidebarTrigger} />
        </header>
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
