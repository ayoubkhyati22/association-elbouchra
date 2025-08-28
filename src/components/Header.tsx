import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Languages, Home, Users, Activity, UserPlus, Calendar, Mail, FileText, BookOpen } from 'lucide-react';
import { useLanguage, languages } from '../contexts/LanguageContext';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();

  const navigationItems = [
    { key: 'home', href: 'home', icon: Home },
    { key: 'identification', href: 'identification', icon: FileText },
    { key: 'articles', href: 'articles', icon: BookOpen },
    { key: 'members', href: 'members', icon: Users },
    { key: 'activities', href: 'activities', icon: Activity },
    { key: 'membership', href: 'membership', icon: UserPlus },
    { key: 'program', href: 'program', icon: Calendar },
    { key: 'contact', href: 'contact', icon: Mail }
  ];

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (language: any) => {
    setLanguage(language);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handlePageChange('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <img 
              src="/assets/logo-ass.png" 
              alt="Logo EL BOUCHRA" 
              className="w-10 h-10 object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handlePageChange(item.href)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <item.icon size={16} />
                <span>{t(`nav.${item.key}`)}</span>
              </button>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
              >
                <Languages size={16} />
                <span className="text-sm">{currentLanguage.code.toUpperCase()}</span>
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language)}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        currentLanguage.code === language.code
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shop Button */}
            <button
              onClick={() => handlePageChange('shop')}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">{t('nav.shop')}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handlePageChange(item.href)}
                  className={`flex items-center space-x-2 text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentPage === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{t(`nav.${item.key}`)}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}