import { useAuthContext } from "@/contexts/AuthContext.jsx";
import { cn } from "@/lib/utils.js";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";

type TextNavLinkProps = {
  to: string;
  className?: string;
  children: ReactNode;
};
function TextNavLink({ to, className, children }: TextNavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          isActive ? "text-foreground" : "text-muted-foreground",
          "hover:text-foreground",
          className
        )
      }
    >
      {children}
    </NavLink>
  );
}
export default function Navbar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-opacity-30 px-4 backdrop-blur-md backdrop-filter md:px-16">
      <nav className="flex w-full items-center gap-4 text-sm font-medium">
        <TextNavLink to="/">Home</TextNavLink>
        <TextNavLink to="/dashboard">Dashboard</TextNavLink>
        <TextNavLink to="/dashboard/create">Create job</TextNavLink>
        <TextNavLink to="/create-resume">Create resume</TextNavLink>
        {user && <TextNavLink to="/dashboard">Job Tracker</TextNavLink>}
        <div className="ms-auto flex items-center gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user.firstName[0] + user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/user")}>
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <TextNavLink to="/auth/login">Login</TextNavLink>
              <TextNavLink to="/auth/signup">Sign Up</TextNavLink>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
