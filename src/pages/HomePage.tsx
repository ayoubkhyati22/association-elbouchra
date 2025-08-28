import React from 'react';
import { useState } from 'react';
import { Leaf, Users, Heart, Award, Star, Calendar } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import teamMembersData from '../data/teamMembers.json';
import eventsData from '../data/events.json';
import statsData from '../data/stats.json';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export default function HomePage({ onPageChange }: HomePageProps) {
  const { t, currentLanguage } = useLanguage();
  const [showFullMessage, setShowFullMessage] = useState(false);

  // Prendre seulement les 3 premiers membres pour la page d'accueil
  const teamMembers = teamMembersData.slice(0, 8);

  // Prendre seulement les 3 premiers événements pour la page d'accueil
  const upcomingEvents = eventsData.slice(0, 3).map(event => ({
    title: event.title[currentLanguage.code],
    date: new Date(event.date).toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    location: event.location[currentLanguage.code]
  }));

  const handleMembersClick = () => {
    onPageChange('members');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProgramClick = () => {
    onPageChange('program');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const presidentMessage = t('home.president.message');
  const maxLength = 300; // Nombre de caractères à afficher initialement

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-600 mb-8">
            {t('home.hero.subtitle')}
          </p>
        </div>
        <ImageSlider />
      </section>

      {/* President Message Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
          {/* President Message Card */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              {t('home.president.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-justify whitespace-pre-line">
              {showFullMessage ? presidentMessage : truncateText(presidentMessage, maxLength)}
            </p>
            {presidentMessage.length > maxLength && (
              <button
                onClick={() => setShowFullMessage(!showFullMessage)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 text-left transition-colors duration-200"
              >
                {showFullMessage ? t('common.read-less') : t('common.read-more')}
              </button>
            )}
            <div className="border-t border-gray-200 pt-4">
              <p className="font-semibold text-blue-900">
                {t('home.president.name')}
              </p>
              <p className="text-blue-600 text-sm">
                {t('home.president.position')}
              </p>
            </div>
          </Card>

          {/* President Image Card */}
          <Card className="overflow-hidden h-[400px] lg:sticky lg:top-8">
            <div className="h-full">
              <img
                src="/assets/mot-president.jpg"
                alt={t('home.president.name')}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">
            {t('home.mission.title')}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('home.mission.text')}
          </p>
        </Card>
      </section>

      {/* Activities Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
          {t('home.activities.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              {t('home.activities.env.title')}
            </h3>
            <p className="text-gray-700">
              {t('home.activities.env.text')}
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              {t('home.activities.education.title')}
            </h3>
            <p className="text-gray-700">
              {t('home.activities.education.text')}
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              {t('home.activities.community.title')}
            </h3>
            <p className="text-gray-700">
              {t('home.activities.community.text')}
            </p>
          </Card>
        </div>
      </section>
      {/* Team Members Section */}
      <section className="container mx-auto px-4 py-16 bg-blue-50">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
          {t('home.team.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src={member.image}
                  alt={member.name[currentLanguage.code]}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                {member.name[currentLanguage.code]}
              </h3>
              <p className="text-blue-600 font-medium">
                {member.role[currentLanguage.code]}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={handleMembersClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            {t('home.team.button')}
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
          {t('home.events.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-blue-600 text-sm mb-1">
                    📅 {event.date}
                  </p>
                  <p className="text-gray-600 text-sm">
                    📍 {event.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={handleProgramClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            {t('home.events.button')}
          </button>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Découvrez nos actions
          </h2>
          <p className="text-blue-600 text-lg mb-8">
            Regardez notre vidéo de présentation
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/jcGYJmE6kHE?start=28"
              title="Vidéo de présentation - Association EL BOUCHRA"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-600 to-blue-800 mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.impact.title')}
          </h2>
          <p className="text-blue-100 text-lg">
            {t('home.impact.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {statsData.map((stat) => {
            const getIconComponent = (iconName: string) => {
              switch (iconName) {
                case 'Users': return Users;
                case 'Award': return Award;
                case 'Star': return Star;
                default: return Users;
              }
            };
            const IconComponent = getIconComponent(stat.icon);
            
            return (
              <div key={stat.id} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="text-white" size={28} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label[currentLanguage.code]}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}