import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import eventsData from '../data/events.json';

export default function ProgramPage() {
  const { t, currentLanguage } = useLanguage();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('program.title')}
          </h1>
          <p className="text-xl text-blue-600">
            {t('program.subtitle')}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {eventsData.map((event) => (
            <Card key={event.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Date Badge */}
                <div className="bg-blue-600 text-white rounded-lg p-4 text-center min-w-[120px]">
                  <div className="text-2xl font-bold">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="text-sm">
                    {new Date(event.date).toLocaleDateString('fr-FR', { 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    {event.title[currentLanguage.code]}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {event.description[currentLanguage.code]}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{event.location[currentLanguage.code]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}