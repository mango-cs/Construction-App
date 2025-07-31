import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { onAuthStateChange } from './services/auth';
import type { AuthState } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UpdatePage from './pages/UpdatePage';
import ProjectsPage from './pages/ProjectsPage';
import ProgressPage from './pages/ProgressPage';
import AdminPage from './pages/AdminPage';
import LoadingSpinner from './components/LoadingSpinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setAuthState);
    return () => unsubscribe();
  }, []);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className={authState.user?.role === 'admin' ? 'dashboard-container' : 'mobile-container'}>
            <Routes>
              <Route 
                path="/login" 
                element={
                  authState.user ? <Navigate to="/dashboard" replace /> : <LoginPage />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  authState.user ? <DashboardPage user={authState.user} /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/update" 
                element={
                  authState.user ? <UpdatePage user={authState.user} /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/projects" 
                element={
                  authState.user ? <ProjectsPage user={authState.user} /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/progress" 
                element={
                  authState.user ? <ProgressPage user={authState.user} /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/admin" 
                element={
                  authState.user?.role === 'admin' ? <AdminPage user={authState.user} /> : <Navigate to="/dashboard" replace />
                } 
              />
              <Route 
                path="/" 
                element={<Navigate to={authState.user ? "/dashboard" : "/login"} replace />} 
              />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
