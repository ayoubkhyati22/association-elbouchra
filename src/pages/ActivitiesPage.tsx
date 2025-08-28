import React from 'react';
import { useState } from 'react';
import { Leaf, Recycle, GraduationCap, Handshake, Megaphone, Waves, Sprout, Sun, Filter } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import activitiesData from '../data/activities.json';

export default function ActivitiesPage() {
  const { t, currentLanguage } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtrer les activités selon le statut sélectionné
  const filteredActivities = activitiesData.filter(activity => {
    if (statusFilter === 'all') return true;
    return activity.status === statusFilter;
  });

  const getFilterCount = (status) => {
    if (status === 'all') return activitiesData.length;
    return activitiesData.filter(activity => activity.status === status).length;
  };

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

        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-blue-600" size={20} />
              <span className="font-medium text-blue-900">{t('activities.filter.title')}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('activities.filter.all')} ({getFilterCount('all')})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  statusFilter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('activities.filter.active')} ({getFilterCount('active')})
              </button>
              <button
                onClick={() => setStatusFilter('archived')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  statusFilter === 'archived'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('activities.filter.archived')} ({getFilterCount('archived')})
              </button>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredActivities.map((activity) => {
            const getIconComponent = (iconName: string) => {
              switch (iconName) {
                case 'Leaf': return Leaf;
                case 'Recycle': return Recycle;
                case 'GraduationCap': return GraduationCap;
                case 'Handshake': return Handshake;
                case 'Megaphone': return Megaphone;
                case 'Waves': return Waves;
                case 'Sprout': return Sprout;
                case 'Sun': return Sun;
                default: return Leaf;
              }
            };
            const IconComponent = getIconComponent(activity.icon);
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
              red: 'bg-red-100 text-red-600',
              cyan: 'bg-cyan-100 text-cyan-600',
              emerald: 'bg-emerald-100 text-emerald-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              amber: 'bg-amber-100 text-amber-600'
            };

            return (
              <Card key={activity.id} className={`overflow-hidden relative ${
                activity.status === 'archived' ? 'opacity-75' : ''
              }`}>
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.status === 'active' ? t('activities.status.active') : t('activities.status.archived')}
                  </span>
                </div>
                
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

          {/* No results message */}
          {filteredActivities.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <Filter size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">{t('activities.filter.no-results')}</p>
                <p className="text-sm">{t('activities.filter.try-different')}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Impact Section */}
        <Card className="p-8 mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 text-center mb-8">
            {t('activities.impact.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">750+</div>
              <div className="text-gray-700">{t('activities.impact.people')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{activitiesData.length}</div>
              <div className="text-gray-700">{t('activities.impact.projects')}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}