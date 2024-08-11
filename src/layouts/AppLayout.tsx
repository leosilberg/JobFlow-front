import Navbar from "@/components/Navbar.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <Outlet />
          <Toaster />
        </div>
      </AuthProvider>
    </>
  );
}
