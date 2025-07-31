import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  size = 'md'
}) => {
  const { language, toggleLanguage } = useLanguage();

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`
        ${sizeClasses[size]}
        flex items-center gap-1 rounded-lg border transition-all duration-200
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${language === 'en' 
          ? 'bg-gray-50 border-gray-300 hover:bg-gray-100' 
          : 'bg-orange-50 border-orange-300 hover:bg-orange-100'
        }
      `}
      title={language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
    >
      <span className={`font-medium text-xs ${language === 'en' ? 'text-blue-700' : 'text-gray-400'}`}>
        EN
      </span>
      
      <div className={`
        w-6 h-3 bg-gray-300 rounded-full relative transition-all duration-200 
        ${language === 'te' ? 'bg-orange-400' : 'bg-blue-400'}
      `}>
        <div className={`
          absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full 
          transition-transform duration-200 shadow-sm
          ${language === 'te' ? 'translate-x-3' : 'translate-x-0'}
        `} />
      </div>
      
      <span className={`font-medium text-xs ${language === 'te' ? 'text-orange-700' : 'text-gray-400'}`}>
        తె
      </span>
    </button>
  );
};

export default LanguageToggle; 