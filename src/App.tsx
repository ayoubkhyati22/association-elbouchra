import { useState } from 'react';
import { useEffect } from 'react';
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
import ArticleDetailPage from './pages/ArticleDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Vérifier l'URL au chargement
    const path = window.location.pathname;
    if (path.startsWith('/article/')) {
      const articleId = path.split('/')[2];
      setCurrentPage(`article-${articleId}`);
    } else if (path === '/admin' || path === '/administration') {
      setCurrentPage('admin');
    }
  }, []);

  // Fonction pour changer de page et mettre à jour l'URL
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (page.startsWith('article-')) {
      const articleId = page.replace('article-', '');
      window.history.pushState({}, '', `/article/${articleId}`);
    } else if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
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
        return <MembersPage onPageChange={handlePageChange} />;
      case 'activities':
        return <ActivitiesPage />;
      case 'admin':
        return (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        );
      default:
        if (currentPage.startsWith('article-')) {
          const articleId = currentPage.replace('article-', '');
          return <ArticleDetailPage articleId={articleId} onBack={() => handlePageChange('articles')} />;
        }
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  // Ne pas afficher Header/Footer pour les pages d'articles individuelles
  const isArticleDetailPage = currentPage.startsWith('article-');

  return (
    <div className="min-h-screen">
      {!isArticleDetailPage && <Header currentPage={currentPage} onPageChange={handlePageChange} />}
      <main>
        {renderPage()}
      </main>
      {!isArticleDetailPage && <Footer onPageChange={handlePageChange} />}
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