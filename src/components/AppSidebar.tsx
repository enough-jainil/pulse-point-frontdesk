import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronUp,
  CreditCard,
  Dumbbell,
  FileText,
  Heart,
  Home,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  User,
  LogOut
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Inquiries",
    url: "/inquiries",
    icon: MessageSquare,
  },
];

const sectionMenuItems = [
  {
    title: "Wellness Center",
    icon: Heart,
    items: [
      { title: "Appointments", url: "/wellness/appointments" },
      { title: "Services", url: "/wellness/services" },
      { title: "Packages", url: "/wellness/packages" },
    ],
  },
  {
    title: "OFC Memberships",
    icon: CreditCard,
    items: [
      { title: "Packages", url: "/ofc/packages" },
      { title: "User Memberships", url: "/ofc/user-memberships" },
      { title: "Upcoming Renewals", url: "/ofc/upcoming-renewals" },
    ],
  },
  {
    title: "Gym Members",
    icon: Dumbbell,
    items: [
      { title: "Member List", url: "/gym/members" },
      { title: "Add Member", url: "/gym/add-member" },
    ],
  },
  {
    title: "Billings",
    icon: CreditCard,
    items: [
      { title: "Invoices", url: "/billing/invoices" },
      { title: "Payments", url: "/billing/payments" },
      { title: "Due Balances", url: "/billing/due-balances" },
    ],
  },
  {
    title: "Reports",
    icon: TrendingUp,
    items: [
      { title: "Sales Register", url: "/reports/sales" },
      { title: "Cash Register", url: "/reports/cash" },
      { title: "GST Report", url: "/reports/gst" },
    ],
  },
  {
    title: "CMS Manage",
    icon: Settings,
    items: [
      { title: "Stories", url: "/cms/stories" },
      { title: "Our Gallery", url: "/cms/gallery" },
      { title: "Our Team", url: "/cms/team" },
      { title: "Testimonial", url: "/cms/testimonial" },
      { title: "SEO Meta", url: "/cms/seo" },
    ],
  },
  {
    title: "Event Management",
    icon: Calendar,
    items: [
      { title: "Events", url: "/events" },
      { title: "Bookings", url: "/events/bookings" },
    ],
  },
  {
    title: "User Notification",
    icon: MessageSquare,
    items: [
      { title: "Send Notifications", url: "/notifications/send" },
      { title: "Notification History", url: "/notifications/history" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: { url: string }[]) =>
    items.some((item) => currentPath.startsWith(item.url));

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-primary">Octane Fit City</h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Menu Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Menu Items */}
        {sectionMenuItems.map((section) => (
          <SidebarGroup key={section.title}>
            <Collapsible
              defaultOpen={isGroupActive(section.items)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center gap-3 px-3 py-2">
                    <section.icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{section.title}</span>
                        <ChevronUp className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {!isCollapsed && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                            <NavLink to={item.url} className="px-6 py-1">
                              {item.title}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-3 px-3 py-2">
                  <User className="h-4 w-4" />
                  {!isCollapsed && (
                    <>
                      <div className="flex flex-col flex-1 text-left">
                        <span className="text-sm font-medium">
                          {user?.email || "Front Desk"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Admin User
                        </span>
                      </div>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] bg-popover border">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}