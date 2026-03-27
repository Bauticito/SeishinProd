import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuditProvider } from './context/AuditContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollToTop from './components/ScrollToTop';
import { AppLayout } from './components/JetsonConsole/AppLayout';
import { ProtectedRoute } from './components/JetsonConsole/ProtectedRoute';
import { InactivityBanner } from './components/JetsonConsole/InactivityBanner';

const RecruiterNotification = lazy(() => import('./components/RecruiterNotification'));

const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const SeishinIaPage = lazy(() => import('./pages/SeishinIaPage'));
const VigilanciaPage = lazy(() => import('./pages/VigilanciaPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const JobsPage = lazy(() => import('./pages/marketing/JobsPage'));
const JobDetailPage = lazy(() => import('./pages/marketing/JobDetailPage'));

const LandingPage = lazy(() => import('./pages/JetsonPages/LandingPage'));
const LoginPage = lazy(() => import('./pages/JetsonPages/LoginPage'));
const Dashboard = lazy(() => import('./pages/JetsonPages/Dashboard'));
const InferencePage = lazy(() => import('./pages/JetsonPages/InferencePage'));
const AutomationsPage = lazy(() => import('./pages/JetsonPages/AutomationsPage'));
const CamerasPage = lazy(() => import('./pages/JetsonPages/CamerasPage'));
const CamerasDelimiterPage = lazy(() => import('./pages/JetsonPages/CamerasDelimiterPage'));
const CamerasInventoryPage = lazy(() => import('./pages/JetsonPages/CamerasInventoryPage'));
const CamerasValidationPage = lazy(() => import('./pages/JetsonPages/CamerasValidationPage'));
const ModelsPage = lazy(() => import('./pages/JetsonPages/ModelsPage'));
const DatasetsPage = lazy(() => import('./pages/JetsonPages/DatasetsPage'));
const TrainingPage = lazy(() => import('./pages/JetsonPages/TrainingPage'));
const LogsPage = lazy(() => import('./pages/JetsonPages/LogsPage'));
const AdminPage = lazy(() => import('./pages/JetsonPages/AdminPage'));
const BillingPage = lazy(() => import('./pages/JetsonPages/BillingPage'));
const ModulesPage = lazy(() => import('./pages/JetsonPages/ModulesPage'));
const AccountsPage = lazy(() => import('./pages/JetsonPages/AccountsPage'));
const NotFound = lazy(() => import('./pages/JetsonPages/NotFound'));

const queryClient = new QueryClient();

function RouteFallback() {
  return <div className="min-h-[40vh] bg-[var(--bg-primary)]" />;
}

function MarketingLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />
      <Outlet />
      <Footer />
      <Suspense fallback={null}>
        <RecruiterNotification />
      </Suspense>
    </div>
  );
}

function LoginGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/jetson" replace />;

  return (
    <Suspense fallback={<RouteFallback />}>
      <LoginPage />
    </Suspense>
  );
}

function JetsonRoutes() {
  return (
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
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
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

        <Route path="/jetson/landing" element={<LandingPage />} />
        <Route path="/jetson/login" element={<LoginGuard />} />

        <Route
          path="/jetson/*"
          element={
            <ProtectedRoute>
              <AuditProvider>
                <InactivityBanner />
                <AppLayout>
                  <JetsonRoutes />
                </AppLayout>
              </AuditProvider>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <AppRoutes />
          <ScrollToTopButton />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
