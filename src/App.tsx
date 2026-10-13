import React, { useEffect, useState } from 'react';
import { CatalogProvider } from './context/CatalogContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SacredGeometryBg } from './components/layout/SacredGeometryBg';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppShell: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    return window.location.hash === '#/admin' || window.location.pathname === '/admin'
      ? 'admin'
      : 'public';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#/' || window.location.hash === '') {
        setCurrentView('public');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: 'public' | 'admin') => {
    setCurrentView(view);
    window.location.hash = view === 'admin' ? '#/admin' : '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 flex flex-col justify-between">
      <SacredGeometryBg />
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <div className="flex-1">
        {currentView === 'public' ? (
          <PublicPortfolioPage />
        ) : isAuthenticated ? (
          <AdminDashboardPage />
        ) : (
          <AdminLoginPage onSuccess={() => setCurrentView('admin')} />
        )}
      </div>

      <Footer onNavigateAdmin={() => handleNavigate('admin')} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <AppShell />
      </CatalogProvider>
    </AuthProvider>
  );
}

export default App;
