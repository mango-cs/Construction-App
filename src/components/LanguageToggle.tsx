import React from 'react';
import { Languages, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '', 
  showLabel = false,
  size = 'md'
}) => {
  const { language, toggleLanguage } = useLanguage();

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-600 flex items-center gap-1">
          <Globe className={iconSizes[size]} />
          Language:
        </span>
      )}
      
      <button
        onClick={toggleLanguage}
        className={`
          ${sizeClasses[size]}
          flex items-center gap-2 rounded-lg border-2 transition-all duration-200
          hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          ${language === 'en' 
            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
            : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
          }
        `}
        title={language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
      >
        <Languages className={iconSizes[size]} />
        
        <div className="flex items-center gap-1">
          <span className={`font-medium ${language === 'en' ? 'text-blue-800' : 'text-gray-500'}`}>
            EN
          </span>
          
          <div className={`
            w-8 h-4 bg-gray-300 rounded-full relative transition-all duration-200 
            ${language === 'te' ? 'bg-orange-400' : 'bg-blue-400'}
          `}>
            <div className={`
              absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full 
              transition-transform duration-200 shadow-sm
              ${language === 'te' ? 'translate-x-4' : 'translate-x-0'}
            `} />
          </div>
          
          <span className={`font-medium ${language === 'te' ? 'text-orange-800' : 'text-gray-500'}`}>
            తె
          </span>
        </div>
      </button>
      
      {language === 'te' && (
        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
          ✨ Telugu Active
        </div>
      )}
    </div>
  );
};

export default LanguageToggle; 