import { Bell, Moon, Plus, Sun, User, Package, HelpCircle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handlePowerGymClick = () => {
    navigate("/gym/members");
    toast({
      title: "Navigated to Gym Members",
      description: "You are now viewing the gym members section",
    });
  };

  const handleNewItemClick = (type: string) => {
    switch (type) {
      case "member":
        navigate("/gym/add-member");
        toast({
          title: "Add Member",
          description: "Navigating to add new member form",
        });
        break;
      case "inquiry":
        navigate("/inquiries");
        toast({
          title: "Add Inquiry",
          description: "Navigating to inquiries page",
        });
        break;
      case "package":
        navigate("ofc/packages");
        toast({
          title: "Add Package",
          description: "Navigating to membership packages page",
        });
        break;
      default:
        break;
    }
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      New
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => handleNewItemClick("member")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Add Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNewItemClick("inquiry")}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Add Inquiry
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNewItemClick("package")}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Add Package
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePowerGymClick}
                >
                  Power Gym
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      5
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>New member registration</DropdownMenuItem>
                  <DropdownMenuItem>Payment received</DropdownMenuItem>
                  <DropdownMenuItem>Membership expiring</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Front desk</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Front Desk Executive</span>
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    FD
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-muted/20">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
