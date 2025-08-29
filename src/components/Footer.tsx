import React from 'react';
import { Mail, MessageCircle, MapPin, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: 'https://web.facebook.com/profile.php?id=100086379114341', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/ass.elbouchrahm?utm_source=qr&igsh=N2NzdWxtY2FpN2Zm', label: 'Instagram' }
  ];

  const quickLinks = [
    { key: 'home', href: 'home' },
    { key: 'identification', href: 'identification' },
    { key: 'activities', href: 'activities' },
    { key: 'membership', href: 'membership' }
  ];

  const handleLinkClick = (href: string) => {
    onPageChange(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/assets/logo-ass.png" 
                alt="Logo EL BOUCHRA" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <p className="text-blue-100 leading-relaxed mb-6">
              {t('home.mission.text')}
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                   target="_blank"
                   rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quick-links')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    {t(`nav.${link.key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-blue-300 mt-1 flex-shrink-0" size={16} />
                <span className="text-blue-100 text-sm">
                  Hay Adil, Salé, Maroc
                </span>
              </div>
              
              <a
                href="mailto:elbouchra.hayadil@gmail.com"
                className="flex items-center space-x-3 text-blue-200 hover:text-white transition-colors duration-200"
              >
                <Mail className="text-blue-300 flex-shrink-0" size={16} />
                <span className="text-sm">elbouchra.hayadil@gmail.com</span>
              </a>
              
              <a
                href="https://wa.me/212661234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-blue-200 hover:text-white transition-colors duration-200"
              >
                <MessageCircle className="text-blue-300 flex-shrink-0" size={16} />
                <span className="text-sm">+212 6 61 23 45 67</span>
              </a>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-blue-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              © 2025 Association EL BOUCHRA. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}