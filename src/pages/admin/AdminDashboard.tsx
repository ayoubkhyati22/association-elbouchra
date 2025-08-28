import React, { useState } from 'react';
import { LogOut, FileText, Plus, Users, Activity, Calendar, ShoppingCart, UserCheck, BarChart3, Download, Eye as EyeIcon, FileText as ArticleIcon } from 'lucide-react';
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
          <div className="space-y-8">
            {/* KPI Section */}
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-6">Statistiques</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Activity className="text-blue-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">25</div>
                  <div className="text-sm text-gray-600">Total Activités</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ArticleIcon className="text-green-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">12</div>
                  <div className="text-sm text-gray-600">Total Articles</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="text-purple-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">150</div>
                  <div className="text-sm text-gray-600">Total Membres</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="text-orange-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">89</div>
                  <div className="text-sm text-gray-600">PDF Téléchargés</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <EyeIcon className="text-red-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">2,547</div>
                  <div className="text-sm text-gray-600">Visiteurs du Site</div>
                </Card>
              </div>
            </div>

            {/* Management Section */}
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-6">Gestion</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Articles - Active */}
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

                {/* Disabled sections */}
                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Users className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">Gestion des Utilisateurs</h3>
                      <p className="text-gray-400">Bientôt disponible</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <UserCheck className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">Gestion des Membres</h3>
                      <p className="text-gray-400">Bientôt disponible</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Activity className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">Gestion des Activités</h3>
                      <p className="text-gray-400">Bientôt disponible</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Calendar className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">Programmes Annuels</h3>
                      <p className="text-gray-400">Bientôt disponible</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">Gestion des T-shirts</h3>
                      <p className="text-gray-400">Bientôt disponible</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
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