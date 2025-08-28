import React, { useState } from 'react';
import { LogOut, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import ArticleEditor from '../../components/admin/ArticleEditor';
import ArticlesList from '../../components/admin/ArticlesList';

type AdminView = 'dashboard' | 'articles' | 'editor' | 'edit';

export default function AdminDashboard() {
  const { logout, currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    setCurrentView('edit');
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setCurrentView('editor');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'articles':
        return <ArticlesList onEdit={handleEditArticle} onNew={handleNewArticle} />;
      case 'editor':
      case 'edit':
        return (
          <ArticleEditor 
            article={editingArticle} 
            onSave={() => setCurrentView('articles')}
            onCancel={() => setCurrentView('articles')}
          />
        );
      default:
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center space-x-4" onClick={handleNewArticle}>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Nouvel Article</h3>
                  <p className="text-gray-600">Créer un article</p>
                </div>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
              <h1 className="text-xl font-bold text-blue-900">Administration</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que: {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                currentView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setCurrentView('articles')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                currentView === 'articles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Articles
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}