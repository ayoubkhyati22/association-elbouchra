import React from 'react';
import { Leaf, Recycle, GraduationCap, Handshake } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import activitiesData from '../data/activities.json';

export default function ActivitiesPage() {
  const { t, currentLanguage } = useLanguage();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('activities.title')}
          </h1>
          <p className="text-xl text-blue-600">
            {t('activities.subtitle')}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {activitiesData.map((activity) => {
            const getIconComponent = (iconName: string) => {
              switch (iconName) {
                case 'Leaf': return Leaf;
                case 'Recycle': return Recycle;
                case 'GraduationCap': return GraduationCap;
                case 'Handshake': return Handshake;
                default: return Leaf;
              }
            };
            const IconComponent = getIconComponent(activity.icon);
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600'
            };

            return (
              <Card key={activity.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[activity.color]}`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      {activity.title[currentLanguage.code]}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {activity.description[currentLanguage.code]}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Impact Section */}
        <Card className="p-8 mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 text-center mb-8">
            {t('activities.impact.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
              <div className="text-gray-700">{t('activities.impact.trees')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-700">{t('activities.impact.people')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
              <div className="text-gray-700">{t('activities.impact.projects')}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}