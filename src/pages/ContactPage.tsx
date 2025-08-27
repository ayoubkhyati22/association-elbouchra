import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import contactInfoData from '../data/contactInfo.json';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans un vrai projet, ceci enverrait les données à un serveur
    console.log('Form submitted:', formData);
    alert('Message envoyé avec succès!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-blue-600">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrez votre nom complet"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="votre.email@exemple.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Écrivez votre message ici..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>{t('contact.form.send')}</span>
              </button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                {t('contact.info.title')}
              </h2>
              
              <div className="space-y-6">
                {contactInfoData.map((info) => {
                  const getIconComponent = (iconName: string) => {
                    switch (iconName) {
                      case 'MapPin': return MapPin;
                      case 'Mail': return Mail;
                      case 'MessageCircle': return MessageCircle;
                      default: return Mail;
                    }
                  };
                  const IconComponent = getIconComponent(info.icon);
                  const content = (
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={info.color} size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {t(info.title)}
                        </h3>
                        <p className="text-gray-600">{info.value}</p>
                      </div>
                    </div>
                  );

                  if (info.href) {
                    return (
                      <a
                        key={info.id}
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div key={info.id}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Map placeholder */}
            <Card className="p-8">
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-600">Carte interactive (Google Maps)</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}