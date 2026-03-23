import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Programmes from "./pages/Programmes";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import Calendrier from "./pages/Calendrier";
import PublicationsPage from "./pages/PublicationsPage";
import PublicationDetail from "./pages/PublicationDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import InitialSetup from "./pages/auth/InitialSetup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import ProgramsAdmin from "./pages/admin/ProgramsAdmin";
import PublicationsAdmin from "./pages/admin/PublicationsAdmin";
import CalendarAdmin from "./pages/admin/CalendarAdmin";
import MediaLibrary from "./pages/admin/MediaLibrary";
import UsersManagement from "./pages/admin/UsersManagement";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/programmes" element={<PageTransition><Programmes /></PageTransition>} />
        <Route path="/programmes/:id" element={<PageTransition><ProgrammeDetail /></PageTransition>} />
        <Route path="/calendrier" element={<PageTransition><Calendrier /></PageTransition>} />
        <Route path="/publications" element={<PageTransition><PublicationsPage /></PageTransition>} />
        <Route path="/publications/:id" element={<PageTransition><PublicationDetail /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

        {/* Auth */}
        <Route path="/auth/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/auth/setup" element={<PageTransition><InitialSetup /></PageTransition>} />
        <Route path="/auth/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/auth/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

        {/* Admin */}
        <Route path="/admin" element={<PageTransition><ProtectedRoute><Dashboard /></ProtectedRoute></PageTransition>} />
        <Route path="/admin/programs" element={<PageTransition><ProtectedRoute><ProgramsAdmin /></ProtectedRoute></PageTransition>} />
        <Route path="/admin/publications" element={<PageTransition><ProtectedRoute><PublicationsAdmin /></ProtectedRoute></PageTransition>} />
        <Route path="/admin/calendar" element={<PageTransition><ProtectedRoute><CalendarAdmin /></ProtectedRoute></PageTransition>} />
        <Route path="/admin/media" element={<PageTransition><ProtectedRoute><MediaLibrary /></ProtectedRoute></PageTransition>} />
        <Route path="/admin/users" element={<PageTransition><ProtectedRoute requireSuperAdmin><UsersManagement /></ProtectedRoute></PageTransition>} />
        <Route path="/admin/testimonials" element={<PageTransition><ProtectedRoute><TestimonialsAdmin /></ProtectedRoute></PageTransition>} />
        <Route path="/admin/settings" element={<PageTransition><ProtectedRoute><SettingsAdmin /></ProtectedRoute></PageTransition>} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
