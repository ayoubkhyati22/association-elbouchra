import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User, Home } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/Card';

interface ArticleDetailPageProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleDetailPage({ articleId, onBack }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage, t } = useLanguage();

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      console.log('Fetching article:', articleId);
      const articleDoc = await getDoc(doc(db, 'articles', articleId));
      
      if (articleDoc.exists()) {
        const data = articleDoc.data();
        setArticle({
          id: articleDoc.id,
          title: data.title || 'Titre non défini',
          content: data.content || 'Contenu non défini',
          createdAt: data.createdAt || '',
          createdBy: data.createdBy || 'Association EL BOUCHRA'
        });
        console.log('Article loaded:', data.title);
      } else {
        console.log('Article not found');
        setArticle(null);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Home size={20} />
            <span>Retour à l'accueil</span>
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            {currentLanguage.direction === 'rtl' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            <span>{currentLanguage.code === 'fr' ? 'Retour aux articles' : 'العودة إلى المقالات'}</span>
          </button>

          {/* Logo */}
          <button 
            onClick={handleBackToHome}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <img 
              src="/assets/logo-ass.png" 
              alt="Logo EL BOUCHRA" 
              className="w-12 h-12 object-contain"
            />
          </button>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          <Card className="p-8">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                {article.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Association EL BOUCHRA</span>
                </div>
                {article.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{article.createdAt}</span>
                  </div>
                )}
              </div>
            </header>

            <div 
              className="prose max-w-none prose-lg prose-blue"
              dangerouslySetInnerHTML={{ 
                __html: article.content 
              }}
            />

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <button
                  onClick={handleBackToHome}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Home size={20} />
                  <span>Retour à l'accueil</span>
                </button>
              </div>
            </footer>
          </Card>
        </article>
      </div>
    </div>
  );
}