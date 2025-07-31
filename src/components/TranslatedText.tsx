import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslatedTextProps {
  children: string | React.ReactNode;
  className?: string;
  fallback?: string;
  static?: boolean; // Use only static translations (faster)
  dynamic?: boolean; // Force dynamic translation
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  className = '',
  fallback = '',
  static: useStaticOnly = false,
  dynamic: forceDynamic = false
}) => {
  const { t, tAsync, language } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Convert children to string if it's not already
  const originalText = React.isValidElement(children) ? '' : String(children || '');

  useEffect(() => {
    const translateContent = async () => {
      if (!originalText) {
        setTranslatedText(fallback);
        return;
      }

      // For English or non-translatable content, return as-is
      if (language === 'en') {
        setTranslatedText(originalText);
        return;
      }

      // Use static translation only
      if (useStaticOnly) {
        const staticResult = t(originalText);
        setTranslatedText(staticResult);
        return;
      }

      // Try static first, then dynamic if different or forced
      const staticResult = t(originalText);
      
      if (!forceDynamic && staticResult !== originalText) {
        setTranslatedText(staticResult);
        return;
      }

      // Use dynamic translation
      setIsLoading(true);
      try {
        const dynamicResult = await tAsync(originalText);
        setTranslatedText(dynamicResult);
      } catch (error) {
        console.warn('Translation failed, using fallback:', error);
        setTranslatedText(staticResult || originalText);
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [originalText, language, t, tAsync, useStaticOnly, forceDynamic, fallback]);

  // If children is a React element, we can't translate it
  if (React.isValidElement(children)) {
    return <>{children}</>;
  }

  return (
    <span className={`${className} ${isLoading ? 'opacity-70' : ''}`}>
      {isLoading && (
        <span className="inline-block w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-1" />
      )}
      {translatedText || originalText}
    </span>
  );
};

// Convenience component for static-only translations (UI elements)
export const T: React.FC<{ children: string; className?: string }> = ({ children, className }) => (
  <TranslatedText static className={className}>
    {children}
  </TranslatedText>
);

// Convenience component for dynamic translations (user content)
export const TD: React.FC<{ children: string; className?: string }> = ({ children, className }) => (
  <TranslatedText dynamic className={className}>
    {children}
  </TranslatedText>
);

export default TranslatedText; 