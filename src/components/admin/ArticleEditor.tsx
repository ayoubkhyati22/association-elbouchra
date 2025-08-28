import React, { useState, useEffect } from 'react';
import { Save, X, Image, Eye, Upload, Link, Bold, Italic, List, AlignLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../Card';

interface ArticleEditorProps {
  article?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setContent(article.content || '');
      setExcerpt(article.excerpt || '');
      setFeaturedImage(article.featuredImage || '');
    }
  }, [article]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  const handleImageUpload = async (file: File) => {
    if (!file) return '';
    
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `articles/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors du téléchargement de l\'image');
      return '';
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setFeaturedImage(imageUrl);
      }
    }
  };

  const generateExcerpt = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Veuillez saisir un titre pour l\'article.');
      return;
    }

    if (!content.trim()) {
      alert('Veuillez saisir le contenu de l\'article.');
      return;
    }

    setLoading(true);
    try {
      const currentDate = new Date().toLocaleDateString('fr-FR');
      const autoExcerpt = excerpt.trim() || generateExcerpt(content);
      
      const articleData = {
        title: title.trim(),
        content: content,
        excerpt: autoExcerpt,
        featuredImage: featuredImage || '',
        createdAt: currentDate,
        createdBy: currentUser?.email || 'admin@elbouchra.org'
      };

      if (article?.id) {
        // Update existing article
        await updateDoc(doc(db, 'articles', article.id), {
          title: articleData.title,
          content: articleData.content,
          excerpt: articleData.excerpt,
          featuredImage: articleData.featuredImage
        });
        console.log('Article updated successfully');
      } else {
        // Create new article
        await addDoc(collection(db, 'articles'), articleData);
        console.log('Article created successfully');
      }

      onSave();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Erreur lors de la sauvegarde de l\'article: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Aperçu de l'article</h1>
          <div className="flex space-x-3">
            <button
              onClick={handlePreview}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <X size={16} />
              <span>Fermer l'aperçu</span>
            </button>
          </div>
        </div>

        <Card className="p-8">
          {featuredImage && (
            <div className="mb-6">
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
          
          {excerpt && (
            <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-blue-500 pl-4">
              {excerpt}
            </p>
          )}
          
          <div 
            className="prose max-w-none prose-lg prose-blue"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">
          {article ? 'Modifier l\'article' : 'Créer un nouvel article'}
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Eye size={16} />
            <span>Aperçu</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <X size={16} />
            <span>Annuler</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
          >
            <Save size={16} />
            <span>{loading ? 'Sauvegarde...' : 'Publier'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Saisissez un titre accrocheur..."
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {title.length}/100 caractères recommandés
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Résumé de l'article
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Résumé qui apparaîtra dans la liste des articles (optionnel - généré automatiquement si vide)"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {excerpt.length}/200 caractères recommandés
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu de l'article *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    style={{ minHeight: '400px' }}
                    placeholder="Rédigez le contenu de votre article... Utilisez la barre d'outils pour formater le texte, ajouter des liens, des images, etc."
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Utilisez la barre d'outils pour formater votre texte
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image à la une */}
          <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image à la une</h3>
            
            {featuredImage ? (
              <div className="space-y-4">
                <img
                  src={featuredImage}
                  alt="Image à la une"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => {}}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  disabled
                >
                  Supprimer l'image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Ajoutez une image à la une pour votre article
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => {}}
                    className="hidden"
                    id="featured-image"
                    disabled
                  />
                  <label
                    htmlFor="featured-image"
                    className="cursor-not-allowed inline-flex items-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    <Image size={16} />
                    <span>Désactivé</span>
                  </label>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Ou ajoutez une URL d'image :</p>
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={() => {}}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://exemple.com/image.jpg"
                    disabled
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Informations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <span className="font-medium text-green-600">Brouillon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auteur :</span>
                <span className="font-medium">{currentUser?.email || 'Admin'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date :</span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </Card>

          {/* Conseils de rédaction */}
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Conseils de rédaction</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Utilisez un titre accrocheur et descriptif</li>
              <li>• Ajoutez une image à la une attractive</li>
              <li>• Structurez votre contenu avec des sous-titres</li>
              <li>• Utilisez des listes à puces pour la lisibilité</li>
              <li>• Relisez avant de publier</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}