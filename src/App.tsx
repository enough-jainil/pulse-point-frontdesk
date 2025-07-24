import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inquiries from "./pages/Inquiries";
import GymMembers from "./pages/GymMembers";
import AddMember from "./pages/AddMember";
import OFCMemberships from "./pages/OFCMemberships";
import MembershipPackages from "./pages/MembershipPackages";
import UpcomingRenewals from "./pages/UpcomingRenewals";
import Reports from "./pages/Reports";
import CMSManagement from "./pages/CMSManagement";
import SEOMetaManagement from "./pages/SEOMetaManagement";
import WellnessAppointments from "./pages/WellnessAppointments";
import WellnessServices from "./pages/WellnessServices";
import WellnessPackages from "./pages/WellnessPackages";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route for authentication */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inquiries" element={<Inquiries />} />

                    {/* Wellness Center */}
                    <Route
                      path="/wellness/appointments"
                      element={<WellnessAppointments />}
                    />
                    <Route
                      path="/wellness/services"
                      element={<WellnessServices />}
                    />
                    <Route
                      path="/wellness/packages"
                      element={<WellnessPackages />}
                    />

                    {/* OFC Memberships */}
                    <Route
                      path="/ofc/packages"
                      element={<MembershipPackages />}
                    />
                    <Route
                      path="/ofc/user-memberships"
                      element={<OFCMemberships />}
                    />
                    <Route
                      path="/ofc/upcoming-renewals"
                      element={<UpcomingRenewals />}
                    />

                    {/* Gym Members */}
                    <Route path="/gym/members" element={<GymMembers />} />
                    <Route path="/gym/add-member" element={<AddMember />} />

                    {/* Billing */}
                    <Route path="/billing/invoices" element={<Invoices />} />
                    <Route path="/billing/payments" element={<Payments />} />
                    <Route
                      path="/billing/due-balances"
                      element={<Payments />}
                    />

                    {/* Reports */}
                    <Route path="/reports/sales" element={<Reports />} />
                    <Route path="/reports/cash" element={<Reports />} />
                    <Route path="/reports/gst" element={<Reports />} />

                    {/* CMS Management */}
                    <Route path="/cms/stories" element={<CMSManagement />} />
                    <Route path="/cms/gallery" element={<CMSManagement />} />
                    <Route path="/cms/team" element={<CMSManagement />} />
                    <Route
                      path="/cms/testimonial"
                      element={<CMSManagement />}
                    />
                    <Route path="/cms/seo" element={<SEOMetaManagement />} />

                    {/* Profile */}
                    <Route path="/profile" element={<Profile />} />

                    {/* Catch all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
