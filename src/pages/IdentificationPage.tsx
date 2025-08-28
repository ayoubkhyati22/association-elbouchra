import React from 'react';
import { Target, Eye, Award } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';

export default function IdentificationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('identification.title')}
          </h1>
          <p className="text-xl text-blue-600">
            {t('identification.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Vision */}
          <Card className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="text-blue-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('identification.vision.title')}</h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('identification.vision.text')}
                </p>
              </div>
            </div>
          </Card>

          {/* Mission */}
          <Card className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="text-green-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('identification.mission.title')}</h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('identification.mission.text')}
                </p>
              </div>
            </div>
          </Card>

          {/* Valeurs */}
          <Card className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('identification.values.title')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">{t('identification.values.environment.title')}</h3>
                    <p className="text-sm text-gray-700">{t('identification.values.environment.text')}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">{t('identification.values.solidarity.title')}</h3>
                    <p className="text-sm text-gray-700">{t('identification.values.solidarity.text')}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">{t('identification.values.innovation.title')}</h3>
                    <p className="text-sm text-gray-700">{t('identification.values.innovation.text')}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">{t('identification.values.transparency.title')}</h3>
                    <p className="text-sm text-gray-700">{t('identification.values.transparency.text')}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}