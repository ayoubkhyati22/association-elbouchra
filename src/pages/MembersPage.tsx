import React from 'react';
import { Users, Star, Award } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import teamMembersData from '../data/teamMembers.json';
import memberStatsData from '../data/memberStats.json';

export default function MembersPage({ onPageChange }) {
  const { t, currentLanguage } = useLanguage();

  const handleVolunteerClick = () => {
    onPageChange('membership');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('members.title')}
          </h1>
          <p className="text-xl text-blue-600">
            {t('members.subtitle')}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          {memberStatsData.map((stat, index) => {
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
              <Card key={stat.id} className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="text-blue-600" size={28} />
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label[currentLanguage.code]}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Team Members */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 text-center mb-8">
            {t('members.executive.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembersData.map((member) => (
              <Card key={member.id} className="p-6 text-center">
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
                <p className="text-blue-600 font-medium mb-2">
                  {member.role[currentLanguage.code]}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.expertise[currentLanguage.code]}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Join Us Section */}
        <Card className="p-8 mt-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            {t('members.join.title')}
          </h2>
          <p className="text-gray-700 mb-6">
            {t('members.join.text')}
          </p>
          <button 
            onClick={handleVolunteerClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            {t('members.join.button')}
          </button>
        </Card>
      </div>
    </div>
  );
}