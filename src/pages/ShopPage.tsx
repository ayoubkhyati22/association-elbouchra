import React from 'react';
import { MessageCircle } from 'lucide-react';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import tshirtsData from '../data/tshirts.json';

export default function ShopPage() {
  const { t } = useLanguage();

  const handleBuyClick = (tshirt: any) => {
    const message = `Bonjour! Je souhaite acheter le ${t(tshirt.name)} au prix de ${tshirt.price}€. Merci!`;
    const whatsappUrl = `https://wa.me/212661234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('tshirt.title')}
          </h1>
          <p className="text-xl text-blue-600">
            {t('tshirt.subtitle')}
          </p>
        </div>

        {/* T-shirts Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tshirtsData.map((tshirt) => (
            <Card key={tshirt.id} className="overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={tshirt.image}
                  alt={t(tshirt.name)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                  {t(tshirt.name)}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(tshirt.description)}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    {tshirt.price}{t('tshirt.price')}
                  </span>
                  <div className="flex space-x-1">
                    {tshirt.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBuyClick(tshirt)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  <MessageCircle size={20} />
                  <span>{t('tshirt.buy')}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}