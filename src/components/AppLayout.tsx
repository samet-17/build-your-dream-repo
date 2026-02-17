import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const AppLayout = () => (
  <div className="flex min-h-screen">
    <AppSidebar />
    <main className="flex-1 ml-64 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <Outlet />
      </div>
    </main>
  </div>
);

export default AppLayout;
