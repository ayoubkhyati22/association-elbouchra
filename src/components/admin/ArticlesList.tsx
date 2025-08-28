import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, User, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../Card';

interface ArticlesListProps {
  onEdit: (article: any) => void;
}
interface ArticlesListProps {
  onEdit: (article: any) => void;
  onNew?: () => void;
}

export default function ArticlesList({ onEdit, onNew }: ArticlesListProps) {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
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
      console.log('Admin: Fetching articles...');
      const articlesCollection = collection(db, 'articles');
      const querySnapshot = await getDocs(articlesCollection);
      
      if (querySnapshot.empty) {
        console.log('Admin: No articles found');
        setArticles([]);
      } else {
        const articlesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Titre non défini',
            content: data.content || 'Contenu non défini',
            ...data
          };
        });
        setArticles(articlesData);
        console.log('Admin: Articles loaded:', articlesData.length);
      }
    } catch (error) {
      console.error('Admin: Error fetching articles:', error);
      alert('Erreur lors du chargement des articles. Vérifiez la console pour plus de détails.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (window.confirm(t('admin.articles.confirm-delete'))) {
      try {
        await deleteDoc(doc(db, 'articles', articleId));
        setArticles(articles.filter(article => article.id !== articleId));
      } catch (error) {
        console.error('Error deleting article:', error);
        alert(t('admin.articles.delete-error'));
      }
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp) {
      return timestamp;
    }
    return new Date().toLocaleDateString('fr-FR');
  };

  const handlePageChange = (page: number) => {
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
      <div className="flex justify-center items-center space-x-2 mt-8">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeft size={16} />
          <span>{t('admin.articles.previous')}</span>
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
          <span>{t('admin.articles.next')}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">{t('admin.articles.title')}</h1>
        <div className="flex items-center space-x-4">
          {onNew && (
            <button
              onClick={onNew}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus size={16} />
              <span>{t('admin.articles.new-article')}</span>
            </button>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              {articles.length} {articles.length === 1 ? t('admin.articles.count') : t('admin.articles.count-plural')}
            </span>
            {totalPages > 1 && (
              <span>{t('admin.articles.page-of').replace('{current}', currentPage.toString()).replace('{total}', totalPages.toString())}</span>
            )}
          </div>
        </div>
      </div>

      {articles.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <Eye size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">{t('admin.articles.no-articles')}</p>
            <p className="text-sm">{t('admin.articles.create-first')}</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {currentArticles.map((article) => (
            <Card key={article.id} className="p-6">
              <div className="flex gap-6">
                {/* Image */}
                {article.featuredImage ? (
                  <div className="flex-shrink-0">
                    <img
                      src={article.featuredImage}
                      alt={article.title || 'Article'}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">{t('admin.articles.no-image')}</span>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-blue-900 truncate">
                      {article.title || t('admin.articles.undefined-title')}
                    </h3>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => onEdit(article)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title={t('admin.articles.edit')}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title={t('admin.articles.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-600 mb-3">
                    {article.excerpt ? (
                      <p className="text-sm italic text-blue-600 mb-2">"{article.excerpt}"</p>
                    ) : null}
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: truncateText(article.content?.replace(/<[^>]*>/g, '') || '', 150)
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{article.createdBy || t('admin.articles.created-by')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Articles count info */}
      {articles.length > 0 && totalPages > 1 && (
        <div className="text-center mt-6 text-sm text-gray-500">
          {t('admin.articles.showing')
            .replace('{start}', (startIndex + 1).toString())
            .replace('{end}', Math.min(endIndex, articles.length).toString())
            .replace('{total}', articles.length.toString())}
        </div>
      )}
    </div>
  );
}