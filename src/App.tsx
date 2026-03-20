import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuditProvider } from './context/AuditContext';

// Marketing layout
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import RecruiterNotification from './components/RecruiterNotification';

// Marketing pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import CalculatorPage from './pages/CalculatorPage';
import GalleryPage from './pages/GalleryPage';
import SeishinIaPage from './pages/SeishinIaPage';
import VigilanciaPage from './pages/VigilanciaPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import JobsPage from './pages/marketing/JobsPage';
import JobDetailPage from './pages/marketing/JobDetailPage';

// JetsonConsole layout + components
import { AppLayout } from './components/JetsonConsole/AppLayout';
import { ProtectedRoute } from './components/JetsonConsole/ProtectedRoute';
import { InactivityBanner } from './components/JetsonConsole/InactivityBanner';

// JetsonConsole pages
import LandingPage from './pages/JetsonPages/LandingPage';
import LoginPage from './pages/JetsonPages/LoginPage';
import Dashboard from './pages/JetsonPages/Dashboard';
import InferencePage from './pages/JetsonPages/InferencePage';
import AutomationsPage from './pages/JetsonPages/AutomationsPage';
import CamerasPage from './pages/JetsonPages/CamerasPage';
import CamerasDelimiterPage from './pages/JetsonPages/CamerasDelimiterPage';
import CamerasInventoryPage from './pages/JetsonPages/CamerasInventoryPage';
import CamerasValidationPage from './pages/JetsonPages/CamerasValidationPage';
import ModelsPage from './pages/JetsonPages/ModelsPage';
import DatasetsPage from './pages/JetsonPages/DatasetsPage';
import TrainingPage from './pages/JetsonPages/TrainingPage';
import LogsPage from './pages/JetsonPages/LogsPage';
import AdminPage from './pages/JetsonPages/AdminPage';
import BillingPage from './pages/JetsonPages/BillingPage';
import ModulesPage from './pages/JetsonPages/ModulesPage';
import AccountsPage from './pages/JetsonPages/AccountsPage';
import NotFound from './pages/JetsonPages/NotFound';

const queryClient = new QueryClient();

// ── Marketing layout wrapper ─────────────────────────────────────────────────
function MarketingLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />
      <Outlet />
      <Footer />
      <RecruiterNotification />
    </div>
  );
}

// ── JetsonConsole guards ─────────────────────────────────────────────────────
function LoginGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/jetson" replace />;
  return <LoginPage />;
}

// ── Main routes ──────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* ── Marketing (public) ── */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/seishinia" element={<SeishinIaPage />} />
        <Route path="/vigilancia" element={<VigilanciaPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/empleos" element={<JobsPage />} />
        <Route path="/vacante/:slug" element={<JobDetailPage />} />
      </Route>

      {/* ── JetsonConsole public pages ── */}
      <Route path="/jetson/landing" element={<LandingPage />} />
      <Route path="/jetson/login" element={<LoginGuard />} />

      {/* ── JetsonConsole dashboard (protected) ── */}
      <Route
        path="/jetson/*"
        element={
          <ProtectedRoute>
            <AuditProvider>
              <InactivityBanner />
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inference" element={<InferencePage />} />
                  <Route path="/automations" element={<AutomationsPage />} />
                  <Route path="/cameras" element={<CamerasPage />} />
                  <Route path="/cameras/inventory" element={<CamerasInventoryPage />} />
                  <Route path="/cameras/validation" element={<CamerasValidationPage />} />
                  <Route path="/cameras/delimiter" element={<CamerasDelimiterPage />} />
                  <Route path="/models" element={<ModelsPage />} />
                  <Route path="/datasets" element={<DatasetsPage />} />
                  <Route path="/training" element={<TrainingPage />} />
                  <Route path="/logs" element={<LogsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/modules" element={<ModulesPage />} />
                  <Route path="/accounts" element={<AccountsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </AuditProvider>
          </ProtectedRoute>
        }
      />

      {/* ── 404 catch-all ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// ── App root ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <ScrollToTopButton />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
