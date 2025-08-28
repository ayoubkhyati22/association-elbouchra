import React, { useState, useEffect } from 'react';
import { Save, X, Image, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import Card from '../Card';

interface ArticleEditorProps {
  article?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [content, setContent] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title?.fr || '');
      setTitleAr(article.title?.ar || '');
      setContent(article.content?.fr || '');
      setContentAr(article.content?.ar || '');
      setExcerpt(article.excerpt?.fr || '');
      setExcerptAr(article.excerpt?.ar || '');
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
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'video'
  ];

  const handleImageUpload = async (file: File): Promise<string> => {
    const imageRef = ref(storage, `articles/${Date.now()}_${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Veuillez remplir au moins le titre et le contenu en français.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = featuredImage;
      
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const articleData = {
        title: {
          fr: title,
          ar: titleAr
        },
        content: {
          fr: content,
          ar: contentAr
        },
        excerpt: {
          fr: excerpt,
          ar: excerptAr
        },
        featuredImage: imageUrl,
        updatedAt: serverTimestamp(),
        published: true
      };

      if (article?.id) {
        // Update existing article
        await updateDoc(doc(db, 'articles', article.id), articleData);
      } else {
        // Create new article
        await addDoc(collection(db, 'articles'), {
          ...articleData,
          createdAt: serverTimestamp()
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Erreur lors de la sauvegarde de l\'article.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Aperçu de l'article</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <X size={16} />
            <span>Fermer l'aperçu</span>
          </button>
        </div>

        <Card className="p-8">
          {featuredImage && (
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
          {excerpt && (
            <p className="text-lg text-gray-600 mb-6 italic">{excerpt}</p>
          )}
          <div 
            className="prose max-w-none"
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
          {article ? 'Modifier l\'article' : 'Nouvel article'}
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
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
            <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Version française */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Version française</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Titre de l'article"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extrait
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Résumé de l'article"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                style={{ height: '300px', marginBottom: '50px' }}
              />
            </div>
          </div>
        </Card>

        {/* Version arabe */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">النسخة العربية</h2>
          
          <div className="space-y-4" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="عنوان المقال"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المقتطف
              </label>
              <textarea
                value={excerptAr}
                onChange={(e) => setExcerptAr(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ملخص المقال"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المحتوى
              </label>
              <ReactQuill
                theme="snow"
                value={contentAr}
                onChange={setContentAr}
                modules={modules}
                formats={formats}
                style={{ height: '300px', marginBottom: '50px', direction: 'rtl' }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Image section */}
      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Image à la une</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Télécharger une image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {featuredImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aperçu de l'image
              </label>
              <img
                src={featuredImage}
                alt="Aperçu"
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}