import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateText, getStaticTranslation, shouldTranslate } from '../services/translationService';

interface UseTranslationReturn {
  t: (text: string) => string; // Static/instant translation
  tAsync: (text: string) => Promise<string>; // Async translation for dynamic content
  tSync: (text: string) => string; // Synchronous translation (static only)
  language: string;
  isTranslating: boolean;
}

export const useTranslation = (): UseTranslationReturn => {
  const { language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);

  // Static/instant translation (for UI elements)
  const t = useCallback((text: string): string => {
    if (!text || !shouldTranslate(text)) return text;
    return getStaticTranslation(text, language);
  }, [language]);

  // Synchronous translation (static only)
  const tSync = useCallback((text: string): string => {
    if (!text || !shouldTranslate(text)) return text;
    return getStaticTranslation(text, language);
  }, [language]);

  // Async translation for dynamic content
  const tAsync = useCallback(async (text: string): Promise<string> => {
    if (!text || !shouldTranslate(text)) return text;
    
    setIsTranslating(true);
    try {
      const result = await translateText(text, language);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  return {
    t,
    tAsync,
    tSync,
    language,
    isTranslating
  };
};

// Hook for translating arrays of text
export const useTranslationBatch = () => {
  const { language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);

  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (language === 'en') return texts;
    
    setIsTranslating(true);
    try {
      const translations = await Promise.all(
        texts.map(text => translateText(text, language))
      );
      return translations;
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  return {
    translateBatch,
    isTranslating,
    language
  };
}; 