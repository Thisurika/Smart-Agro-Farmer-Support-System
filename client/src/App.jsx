import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { ThemeProvider } from './context/ThemeContext';
import PageLoader from './components/common/PageLoader';

// ─── Lazy-Loaded Pages (Code Splitting) ───────────────────
// Public
const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const CareersPage = lazy(() => import('./pages/public/CareersPage'));
const LegalPage = lazy(() => import('./pages/public/LegalPage'));
const FeedbackPage = lazy(() => import('./pages/public/FeedbackPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));

// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));

// User
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const CropBrowsePage = lazy(() => import('./pages/user/CropBrowsePage'));
const CropDetailPage = lazy(() => import('./pages/user/CropDetailPage'));
const ChemicalBrowsePage = lazy(() => import('./pages/user/ChemicalBrowsePage'));
const ChemicalDetailPage = lazy(() => import('./pages/user/ChemicalDetailPage'));
const CartPage = lazy(() => import('./pages/user/CartPage'));
const CheckoutPage = lazy(() => import('./pages/user/CheckoutPage'));
const PaymentHistoryPage = lazy(() => import('./pages/user/PaymentHistoryPage'));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));
const WeatherPage = lazy(() => import('./pages/user/WeatherPage'));
const PlantDoctorPage = lazy(() => import('./pages/user/PlantDoctorPage'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagePage = lazy(() => import('./pages/admin/UserManagePage'));
const CropManagePage = lazy(() => import('./pages/admin/CropManagePage'));
const CropAddEditPage = lazy(() => import('./pages/admin/CropAddEditPage'));
const ChemicalManagePage = lazy(() => import('./pages/admin/ChemicalManagePage'));
const ChemicalAddEditPage = lazy(() => import('./pages/admin/ChemicalAddEditPage'));
const FeedbackManagePage = lazy(() => import('./pages/admin/FeedbackManagePage'));
const PaymentListPage = lazy(() => import('./pages/admin/PaymentListPage'));
const WeatherRecordsPage = lazy(() => import('./pages/admin/WeatherRecordsPage'));

// Route Guards (kept eager — they're tiny)
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public and User Routes with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="legal" element={<LegalPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              
              {/* Protected User Routes */}
              <Route path="" element={<PrivateRoute />}>
                <Route path="user/dashboard" element={<UserDashboard />} />
                <Route path="user/crops" element={<CropBrowsePage />} />
                <Route path="user/crops/:id" element={<CropDetailPage />} />
                <Route path="user/chemicals" element={<ChemicalBrowsePage />} />
                <Route path="user/chemicals/:id" element={<ChemicalDetailPage />} />
                <Route path="user/cart" element={<CartPage />} />
                <Route path="user/checkout" element={<CheckoutPage />} />
                <Route path="user/payments" element={<PaymentHistoryPage />} />
                <Route path="user/profile" element={<ProfilePage />} />
                <Route path="user/weather" element={<WeatherPage />} />
                <Route path="user/plant-doctor" element={<PlantDoctorPage />} />
              </Route>
            </Route>

            {/* Protected Admin Routes with AdminLayout */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagePage />} />
                <Route path="/admin/crops" element={<CropManagePage />} />
                <Route path="/admin/crops/new" element={<CropAddEditPage />} />
                <Route path="/admin/crops/:id/edit" element={<CropAddEditPage />} />
                <Route path="/admin/chemicals" element={<ChemicalManagePage />} />
                <Route path="/admin/chemicals/new" element={<ChemicalAddEditPage />} />
                <Route path="/admin/chemicals/:id/edit" element={<ChemicalAddEditPage />} />
                <Route path="/admin/feedback" element={<FeedbackManagePage />} />
                <Route path="/admin/payments" element={<PaymentListPage />} />
                <Route path="/admin/weather" element={<WeatherRecordsPage />} />
              </Route>
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
