import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/Card';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const { currentLanguage, t } = useLanguage();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      console.log('Fetching articles...');
      const articlesCollection = collection(db, 'articles');
      const querySnapshot = await getDocs(articlesCollection);
      
      if (querySnapshot.empty) {
        console.log('No articles found');
        setArticles([]);
      } else {
        const articlesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Article data:', data);
          return {
            id: doc.id,
            title: data.title || 'Titre non défini',
            content: data.content || 'Contenu non défini',
            ...data
          };
        });
        setArticles(articlesData);
        console.log('Articles loaded:', articlesData.length);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      // En cas d'erreur, afficher un message à l'utilisateur
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp) {
      return timestamp;
    }
    return currentLanguage.code === 'fr' ? 'Article récent' : 'مقال حديث';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleArticleClick = (articleId: string) => {
    // Ouvrir dans un nouvel onglet
    window.open(`/article/${articleId}`, '_blank');
  };

  const getArticleContent = (article: any, field: string) => {
    return article[field] || '';
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
          >
            {currentLanguage.direction === 'rtl' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            <span>{currentLanguage.code === 'fr' ? 'Retour aux articles' : 'العودة إلى المقالات'}</span>
          </button>

          <article className="max-w-4xl mx-auto">
            <Card className="p-8">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                  {getArticleContent(selectedArticle, 'title')}
                </h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>Association EL BOUCHRA</span>
                  </div>
                  {selectedArticle.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{selectedArticle.createdAt}</span>
                    </div>
                  )}
                </div>
              </header>

              <div 
                className="prose max-w-none prose-lg prose-blue"
                dangerouslySetInnerHTML={{ 
                  __html: getArticleContent(selectedArticle, 'content') 
                }}
              />
            </Card>
          </article>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {currentLanguage.code === 'fr' ? 'Articles' : 'المقالات'}
          </h1>
          <p className="text-xl text-blue-600">
            {currentLanguage.code === 'fr' 
              ? 'Découvrez nos dernières actualités et réflexions'
              : 'اكتشف آخر أخبارنا وتأملاتنا'
            }
          </p>
        </div>

        {articles.length === 0 ? (
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <div className="text-gray-500">
              <p className="text-lg mb-2">
                {currentLanguage.code === 'fr' 
                  ? 'Aucun article disponible pour le moment'
                  : 'لا توجد مقالات متاحة في الوقت الحالي'
                }
              </p>
              <p className="text-sm">
                {currentLanguage.code === 'fr'
                  ? 'Connectez-vous à l\'administration pour ajouter des articles.'
                  : 'قم بتسجيل الدخول إلى الإدارة لإضافة مقالات.'
                }
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {articles.map((article) => (
              <Card 
                key={article.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 line-clamp-2">
                    {getArticleContent(article, 'title')}
                  </h3>
                  
                  <div className="text-gray-600 mb-4 line-clamp-3">
                    {truncateText(getArticleContent(article, 'content')?.replace(/<[^>]*>/g, '') || '', 120)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    {article.createdAt && (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar size={14} />
                        <span>{article.createdAt}</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleArticleClick(article.id)}
                      className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                    >
                      {currentLanguage.code === 'fr' ? 'Lire plus' : 'اقرأ المزيد'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}