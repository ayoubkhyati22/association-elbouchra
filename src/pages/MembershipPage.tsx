import React from 'react';
import { Download, CheckCircle, FileText, CreditCard, Camera, Car as IdCard } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import membershipBenefitsData from '../data/membershipBenefits.json';
import membershipRequirementsData from '../data/membershipRequirements.json';

export default function MembershipPage() {
  const { t, currentLanguage } = useLanguage();

  const handleDownloadForm = () => {
    // Dans un vrai projet, ceci téléchargerait un PDF réel
    const link = document.createElement('a');
    link.href = '/assets/membership-form.pdf';
    link.download = 'membership-form.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('membership.title')}
          </h1>
          <p className="text-xl text-blue-600">
            {t('membership.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              {t('membership.intro')}
            </p>
          </Card>

          {/* Membership Requirements */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              {t('membership.requirements.title')}
            </h2>
            
            {/* Introduction text */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 leading-relaxed">
                {currentLanguage.code === 'fr' 
                  ? t('membership.requirements.intro.fr')
                  : t('membership.requirements.intro.ar')
                }
              </p>
            </div>

            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              {t('membership.requirements.subtitle')}
            </h3>

            <div className="space-y-4">
              {membershipRequirementsData.map((requirement, index) => {
                const getIcon = (id: string) => {
                  switch (id) {
                    case 'form': return FileText;
                    case 'id-copies': return IdCard;
                    case 'photos': return Camera;
                    case 'fee': return CreditCard;
                    default: return FileText;
                  }
                };
                const IconComponent = getIcon(requirement.id);
                const text = currentLanguage.code === 'fr' ? requirement.fr : requirement.ar;
                
                return (
                  <div key={requirement.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{text}</p>
                      {requirement.id === 'fee' && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {t('membership.fee.amount')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          {/* Benefits */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              {t('membership.benefits.title')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {membershipBenefitsData.map((benefit) => (
                <div key={benefit.id} className="flex items-start space-x-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">{t(benefit.key)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Download Form */}
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="text-blue-600" size={32} />
            </div>
            
            <button
              onClick={handleDownloadForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Download size={20} />
              <span>{t('membership.download')}</span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}