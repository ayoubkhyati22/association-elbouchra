import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Card from '../Card';

interface ArticlesListProps {
  onEdit: (article: any) => void;
}

export default function ArticlesList({ onEdit }: ArticlesListProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteDoc(doc(db, 'articles', articleId));
        setArticles(articles.filter(article => article.id !== articleId));
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Erreur lors de la suppression de l\'article.');
      }
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp) {
      return timestamp;
    }
    return new Date().toLocaleDateString('fr-FR');
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
        <h1 className="text-2xl font-bold text-blue-900">Articles</h1>
        <div className="text-sm text-gray-600">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {articles.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <Eye size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun article trouvé</p>
            <p className="text-sm">Commencez par créer votre premier article.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="p-6">
              <div className="flex gap-6">
                {/* Image */}
                {article.featuredImage && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.featuredImage}
                      alt={article.title || 'Article'}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-blue-900 truncate">
                      {article.title || 'Titre non défini'}
                    </h3>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => onEdit(article)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-600 mb-3">
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
                      <span>{article.createdBy || 'Association EL BOUCHRA HAY ADIL'}</span>
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
    </div>
  );
}