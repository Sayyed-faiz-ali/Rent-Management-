
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerTenants from './pages/owner/Tenants';
import OwnerTenantDetails from './pages/owner/TenantDetailsPage';
import OwnerMessaging from './pages/owner/Messaging';

// Tenant Pages
import TenantDashboard from './pages/tenant/Dashboard';
import TenantPaymentHistory from './pages/tenant/PaymentHistory';
import TenantFamilyDetails from './pages/tenant/FamilyDetails';

import DashboardLayout from './components/layout/DashboardLayout';

const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
    const { user } = useAppContext();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />; // Or a 'Not Found' page
    }

    return <DashboardLayout><Outlet /></DashboardLayout>;
};


const App: React.FC = () => {
    return (
        <AppContextProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login/:role" element={<LoginPage />} />
                    <Route path="/signup/:role" element={<SignupPage />} />

                    {/* Owner Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
                        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                        <Route path="/owner/tenants" element={<OwnerTenants />} />
                        <Route path="/owner/tenants/:_id" element={<OwnerTenantDetails />} />
                        <Route path="/owner/messaging" element={<OwnerMessaging />} />
                    </Route>

                    {/* Tenant Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
                        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
                        <Route path="/tenant/payments" element={<TenantPaymentHistory />} />
                        <Route path="/tenant/family" element={<TenantFamilyDetails />} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </HashRouter>
        </AppContextProvider>
    );
};

export default App;