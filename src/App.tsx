import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inquiries from "./pages/Inquiries";
import GymMembers from "./pages/GymMembers";
import AddMember from "./pages/AddMember";
import OFCMemberships from "./pages/OFCMemberships";
import UpcomingRenewals from "./pages/UpcomingRenewals";
import Reports from "./pages/Reports";
import CMSManagement from "./pages/CMSManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inquiries" element={<Inquiries />} />
            
            {/* Gym Members */}
            <Route path="/gym/members" element={<GymMembers />} />
            <Route path="/gym/add-member" element={<AddMember />} />
            
            {/* OFC Memberships */}
            <Route path="/ofc/packages" element={<OFCMemberships />} />
            <Route path="/ofc/user-memberships" element={<OFCMemberships />} />
            <Route path="/ofc/upcoming-renewals" element={<UpcomingRenewals />} />
            
            {/* Reports */}
            <Route path="/reports/sales" element={<Reports />} />
            <Route path="/reports/cash" element={<Reports />} />
            <Route path="/reports/gst" element={<Reports />} />
            
            {/* CMS Management */}
            <Route path="/cms/stories" element={<CMSManagement />} />
            <Route path="/cms/gallery" element={<CMSManagement />} />
            <Route path="/cms/team" element={<CMSManagement />} />
            <Route path="/cms/testimonial" element={<CMSManagement />} />
            <Route path="/cms/seo" element={<CMSManagement />} />
            
            {/* Wellness Center (Placeholder) */}
            <Route path="/wellness/*" element={<Dashboard />} />
            
            {/* Billing (Placeholder) */}
            <Route path="/billing/*" element={<Dashboard />} />
            
            {/* Events (Placeholder) */}
            <Route path="/events/*" element={<Dashboard />} />
            
            {/* Notifications (Placeholder) */}
            <Route path="/notifications/*" element={<Dashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
