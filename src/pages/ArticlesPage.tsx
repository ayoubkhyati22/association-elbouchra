import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/Card';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { currentLanguage, t } = useLanguage();
  
  const articlesPerPage = 6;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    // Reset to first page when articles change
    setCurrentPage(1);
  }, [articles.length]);

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
            excerpt: data.excerpt || '',
            featuredImage: data.featuredImage || '',
            createdAt: data.createdAt || '',
            createdBy: data.createdBy || '',
            ...data
          };
        });
        setArticles(articlesData);
        console.log('Articles loaded:', articlesData.length);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction améliorée pour nettoyer le HTML et extraire le texte
  const cleanHtmlContent = (htmlString) => {
    if (!htmlString || typeof htmlString !== 'string') {
      return '';
    }

    try {
      // Méthode 1: Utiliser DOMParser (plus sûr)
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const textContent = doc.body.textContent || doc.body.innerText || '';
      
      return textContent
        .replace(/\s+/g, ' ') // Remplacer les espaces multiples
        .trim(); // Supprimer les espaces en début/fin
        
    } catch (error) {
      console.error('Error with DOMParser, using fallback:', error);
      
      // Méthode 2: Fallback avec createElement
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        return textContent
          .replace(/\s+/g, ' ')
          .trim();
          
      } catch (fallbackError) {
        console.error('Error with createElement, using regex:', fallbackError);
        
        // Méthode 3: Nettoyage manuel avec regex (dernière option)
        return htmlString
          .replace(/<style[^>]*>.*?<\/style>/gis, '') // Supprimer les styles
          .replace(/<script[^>]*>.*?<\/script>/gis, '') // Supprimer les scripts
          .replace(/<[^>]*>/g, '') // Supprimer toutes les balises HTML
          .replace(/&nbsp;/g, ' ') // Espaces insécables
          .replace(/&amp;/g, '&') // Entités HTML
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&apos;/g, "'")
          .replace(/&hellip;/g, '...')
          .replace(/&mdash;/g, '—')
          .replace(/&ndash;/g, '–')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }
  };

  // Fonction pour tronquer le texte intelligemment
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    
    const cleanText = cleanHtmlContent(text);
    
    if (cleanText.length <= maxLength) return cleanText;
    
    // Couper au dernier espace avant maxLength pour éviter de couper un mot
    let truncated = cleanText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    const lastPunctIndex = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    // Si on trouve un point proche de la fin, couper là
    if (lastPunctIndex > maxLength - 30 && lastPunctIndex > 0) {
      return truncated.substring(0, lastPunctIndex + 1);
    }
    
    // Sinon couper au dernier espace
    if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength - 30) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  };

  // Fonction pour obtenir l'extrait d'un article
  const getArticleExcerpt = (article) => {
    // 1. Si on a un excerpt défini, l'utiliser
    if (article.excerpt && article.excerpt.trim()) {
      return cleanHtmlContent(article.excerpt.trim());
    }
    
    // 2. Sinon, utiliser le contenu
    if (article.content && article.content.trim()) {
      return truncateText(article.content, 200);
    }
    
    // 3. Message par défaut
    return currentLanguage.code === 'fr' 
      ? 'Contenu en cours de rédaction...'
      : 'المحتوى قيد التحرير...';
  };

  const formatDate = (timestamp) => {
    if (timestamp) {
      return timestamp;
    }
    return currentLanguage.code === 'fr' ? 'Article récent' : 'مقال حديث';
  };

  const handleArticleClick = (articleId) => {
    // Ouvrir dans un nouvel onglet
    window.open(`/article/${articleId}`, '_blank');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-12">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeft size={16} />
          <span>{currentLanguage.code === 'fr' ? 'Précédent' : 'السابق'}</span>
        </button>

        {/* Page numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 py-2 text-gray-400">...</span>
            )}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              currentPage === page
                ? 'text-white bg-blue-600 border border-blue-600'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 py-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span>{currentLanguage.code === 'fr' ? 'Suivant' : 'التالي'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const getArticleContent = (article, field) => {
    return article[field] || '';
  };

  // Debug function (remove in production)
  const debugArticleContent = (article) => {
    console.log('=== DEBUG ARTICLE ===');
    console.log('ID:', article.id);
    console.log('Title:', article.title);
    console.log('Raw content:', article.content);
    console.log('Content type:', typeof article.content);
    console.log('Content length:', article.content?.length);
    console.log('Cleaned content:', cleanHtmlContent(article.content));
    console.log('Excerpt:', getArticleExcerpt(article));
    console.log('====================');
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
            {currentArticles.map((article) => {
              // Debug pour cet article spécifique (à supprimer en production)
              if (article.id === 'vH4qP2bhBqzzhpWfZMrv') {
                debugArticleContent(article);
              }

              return (
                <Card 
                  key={article.id} 
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {article.featuredImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={article.featuredImage}
                        alt={article.title || 'Article image'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3 line-clamp-2">
                      {getArticleContent(article, 'title')}
                    </h3>
                    
                    {/* Excerpt si disponible */}
                    {article.excerpt && article.excerpt.trim() && (
                      <div className="text-blue-600 mb-3 italic text-sm border-l-2 border-blue-300 pl-3">
                        "{cleanHtmlContent(article.excerpt.trim())}"
                      </div>
                    )}
                    
                    {/* Contenu de l'article */}
                    <div className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {truncateText(article.content, 150)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      {article.createdAt && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(article.createdAt)}</span>
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
              );
            })}
          </div>
        )}
        
        {/* Pagination */}
        {renderPagination()}
        
        {/* Articles count info */}
        {articles.length > 0 && (
          <div className="text-center mt-8 text-sm text-gray-500">
            {currentLanguage.code === 'fr' 
              ? `Affichage de ${startIndex + 1}-${Math.min(endIndex, articles.length)} sur ${articles.length} articles`
              : `عرض ${startIndex + 1}-${Math.min(endIndex, articles.length)} من ${articles.length} مقالات`
            }
          </div>
        )}
      </div>
    </div>
  );
}