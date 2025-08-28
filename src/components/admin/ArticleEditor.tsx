import React, { useState, useEffect } from 'react';
import { Save, X, Image, Eye, Upload, Link, Bold, Italic, List, AlignLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../Card';

interface ArticleEditorProps {
  article?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const { t } = useLanguage();
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
      alert(t('admin.editor.title-required'));
      return;
    }

    if (!content.trim()) {
      alert(t('admin.editor.content-required'));
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
      alert(t('admin.editor.save-error').replace('{error}', error.message));
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
          <h1 className="text-2xl font-bold text-blue-900">{t('admin.editor.article-preview')}</h1>
          <div className="flex space-x-3">
            <button
              onClick={handlePreview}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <X size={16} />
              <span>{t('admin.editor.close-preview')}</span>
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
          {article ? t('admin.editor.edit-article') : t('admin.editor.new-article')}
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Eye size={16} />
            <span>{t('admin.editor.preview')}</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <X size={16} />
            <span>{t('admin.editor.cancel')}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
          >
            <Save size={16} />
            <span>{loading ? t('admin.editor.saving') : t('admin.editor.publish')}</span>
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
                  {t('admin.editor.title-label')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder={t('admin.editor.title-placeholder')}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {t('admin.editor.title-chars').replace('{count}', title.length.toString())}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.editor.excerpt-label')}
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('admin.editor.excerpt-placeholder')}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {t('admin.editor.excerpt-chars').replace('{count}', excerpt.length.toString())}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.editor.content-label')}
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    style={{ minHeight: '400px' }}
                    placeholder={t('admin.editor.content-placeholder')}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t('admin.editor.content-help')}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image à la une */}
          <Card className="p-6 opacity-50 pointer-events-none bg-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.editor.featured-image')}</h3>
            
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
                  {t('admin.editor.remove-image')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    {t('admin.editor.add-image')}
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
                    <span>{t('admin.editor.disabled')}</span>
                  </label>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{t('admin.editor.image-url')}</p>
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={() => {}}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder={t('admin.editor.image-url-placeholder')}
                    disabled
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Informations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.editor.information')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('admin.editor.status')} :</span>
                <span className="font-medium text-green-600">{t('admin.editor.draft')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('admin.editor.author')} :</span>
                <span className="font-medium">{currentUser?.email || 'Admin'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('admin.editor.date')} :</span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </Card>

          {/* Conseils de rédaction */}
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">{t('admin.editor.writing-tips')}</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>{t('admin.editor.tip1')}</li>
              <li>{t('admin.editor.tip2')}</li>
              <li>{t('admin.editor.tip3')}</li>
              <li>{t('admin.editor.tip4')}</li>
              <li>{t('admin.editor.tip5')}</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}