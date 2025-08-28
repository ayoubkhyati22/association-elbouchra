import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import MembershipPage from './pages/MembershipPage';
import ProgramPage from './pages/ProgramPage';
import ContactPage from './pages/ContactPage';
import IdentificationPage from './pages/IdentificationPage';
import MembersPage from './pages/MembersPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ArticlesPage from './pages/ArticlesPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'articles':
        return <ArticlesPage />;
      case 'shop':
        return <ShopPage />;
      case 'membership':
        return <MembershipPage />;
      case 'program':
        return <ProgramPage />;
      case 'contact':
        return <ContactPage />;
      case 'identification':
        return <IdentificationPage />;
      case 'members':
        return <MembersPage onPageChange={setCurrentPage} />;
      case 'activities':
        return <ActivitiesPage />;
      case 'admin':
        return (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer onPageChange={setCurrentPage} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;