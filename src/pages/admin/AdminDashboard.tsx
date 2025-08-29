import { useState } from 'react';
import { LogOut, FileText, Plus, Users, Activity, Calendar, ShoppingCart, UserCheck, Download, Eye as EyeIcon, FileText as ArticleIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../../components/Card';
import ArticleEditor from '../../components/admin/ArticleEditor';
import ArticlesList from '../../components/admin/ArticlesList';
import teamMembersData from '../../data/teamMembers.json';
import activitiesData from '../../data/activities.json';

type AdminView = 'dashboard' | 'articles' | 'editor' | 'edit';

export default function AdminDashboard() {
  const { logout, currentUser } = useAuth();
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <h2 className="text-xl font-bold text-blue-900 mb-6">{t('admin.dashboard.statistics')}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Activity className="text-blue-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">{activitiesData.length}</div>
                  <div className="text-sm text-gray-600">{t('admin.dashboard.total-activities')}</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ArticleIcon className="text-green-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">0</div>
                  <div className="text-sm text-gray-600">{t('admin.dashboard.total-articles')}</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="text-purple-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">{teamMembersData.length}</div>
                  <div className="text-sm text-gray-600">{t('admin.dashboard.total-members')}</div>
                </Card>
                
                <Card className="p-4 text-center opacity-50 pointer-events-none bg-gray-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="text-orange-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">0</div>
                  <div className="text-sm text-gray-600">{t('admin.dashboard.pdf-downloads')}</div>
                </Card>
                
                <Card className="p-4 text-center opacity-50 pointer-events-none bg-gray-100">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <EyeIcon className="text-red-600" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">0</div>
                  <div className="text-sm text-gray-600">{t('admin.dashboard.site-visitors')}</div>
                </Card>
              </div>
            </div>

            {/* Management Section */}
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-6">{t('admin.dashboard.management')}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Articles - Active */}
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center space-x-4" onClick={handleNewArticle}>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Plus className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{t('admin.dashboard.new-article')}</h3>
                      <p className="text-gray-600">{t('admin.dashboard.create-article')}</p>
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
                      <h3 className="text-lg font-semibold text-gray-500">{t('admin.dashboard.user-management')}</h3>
                      <p className="text-gray-400">{t('admin.dashboard.coming-soon')}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <UserCheck className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">{t('admin.dashboard.member-management')}</h3>
                      <p className="text-gray-400">{t('admin.dashboard.coming-soon')}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Activity className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">{t('admin.dashboard.activity-management')}</h3>
                      <p className="text-gray-400">{t('admin.dashboard.coming-soon')}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Calendar className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">{t('admin.dashboard.program-management')}</h3>
                      <p className="text-gray-400">{t('admin.dashboard.coming-soon')}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">{t('admin.dashboard.tshirt-management')}</h3>
                      <p className="text-gray-400">{t('admin.dashboard.coming-soon')}</p>
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
            {/* Logo et titre */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
              <h1 className="text-xl font-bold text-blue-900">{t('admin.header.administration')}</h1>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600 truncate max-w-xs">
                {t('admin.header.connected-as')}: {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>{t('admin.header.logout')}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                  <div className="font-medium">{t('admin.header.connected-as')}:</div>
                  <div className="truncate">{currentUser?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>{t('admin.header.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                currentView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.nav.dashboard')}
            </button>
            <button
              onClick={() => setCurrentView('articles')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                currentView === 'articles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.nav.articles')}
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