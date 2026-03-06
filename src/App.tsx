import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { MobileHeader } from './components/navigation/MobileHeader';
import LoginPage from './pages/kirish/page';
import SignupPage from './pages/royhatdan-otish/page';
import DashboardPage from './pages/bosh-sahifa/page';
import TransactionsPage from './pages/tranzaksiyalar/page';
import CategoriesPage from './pages/kategoriyalar/page';
import AnalyticsPage from './pages/analitika/page';
import ReportsPage from './pages/hisobotlar/page';
import SettingsPage from './pages/sozlamalar/page';
import HistoryPage from './pages/tarix/page';
import { motion, AnimatePresence } from 'motion/react';
import { isFirebaseReady } from './services/firebase';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/kirish" />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-72 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        <MobileHeader />
        <main className="flex-1 p-4 lg:px-10 lg:pt-6 lg:pb-10 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/kirish" element={<LoginPage />} />
          <Route path="/royhatdan-otish" element={<SignupPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/daromad" element={<TransactionsPage type="daromad" />} />
            <Route path="/xarajatlar" element={<TransactionsPage type="xarajat" />} />
            <Route path="/tarix" element={<HistoryPage />} />
            <Route path="/kategoriyalar" element={<CategoriesPage />} />
            <Route path="/analitika" element={<AnalyticsPage />} />
            <Route path="/hisobotlar" element={<ReportsPage />} />
            <Route path="/sozlamalar" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
