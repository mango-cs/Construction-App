import type { Language } from '../contexts/LanguageContext';

// Static translations for common UI terms (fast, reliable, offline)
const staticTranslations: Record<string, { te: string }> = {
  // Navigation & General
  'Dashboard': { te: 'డాష్‌బోర్డ్' },
  'Projects': { te: 'ప్రాజెక్టులు' },
  'Progress': { te: 'పురోగతి' },
  'Updates': { te: 'నవీకరణలు' },
  'Admin': { te: 'అడ్మిన్' },
  'Site Head': { te: 'సైట్ హెడ్' },
  'Manager': { te: 'మేనేజర్' },
  'Login': { te: 'లాగిన్' },
  'Logout': { te: 'లాగ్అవుట్' },
  'Settings': { te: 'సెట్టింగ్స్' },
  'Welcome': { te: 'స్వాగతం' },
  'Home': { te: 'హోం' },

  // Project Management
  'Add Project': { te: 'ప్రాజెక్ట్ జోడించండి' },
  'Edit Project': { te: 'ప్రాజెక్ట్ సవరించండి' },
  'Delete Project': { te: 'ప్రాజెక్ట్ తొలగించండి' },
  'Project Name': { te: 'ప్రాజెక్ట్ పేరు' },
  'Location': { te: 'స్థానం' },
  'Current Phase': { te: 'ప్రస్తుత దశ' },
  'Next Action': { te: 'తదుపరి చర్య' },
  'Status': { te: 'స్థితి' },
  'Active': { te: 'చురుకైన' },
  'Completed': { te: 'పూర్తయింది' },
  'On Hold': { te: 'నిలిపివేయబడింది' },
  'Planned Structure': { te: 'ప్రణాళికాబద్ధమైన నిర్మాణం' },

  // Site Head Assignment
  'Site Head Assignment': { te: 'సైట్ హెడ్ కేటాయింపు' },
  'Select Site Head': { te: 'సైట్ హెడ్ ఎంచుకోండి' },
  'Assigned to': { te: 'కేటాయించబడింది' },
  'No site head assigned': { te: 'సైట్ హెడ్ కేటాయించలేదు' },
  'Remove Assignment': { te: 'కేటాయింపు తొలగించండి' },
  'Updating assignment...': { te: 'కేటాయింపు నవీకరించబడుతోంది...' },

  // Progress & Updates
  'percent complete': { te: 'శాతం పూర్తయింది' },
  'Updated': { te: 'నవీకరించబడింది' },
  'Last Updated': { te: 'చివరిసారి నవీకరించబడింది' },
  'View Details': { te: 'వివరాలు చూడండి' },
  'Save': { te: 'సేవ్ చేయండి' },
  'Cancel': { te: 'రద్దు చేయండి' },
  'Loading...': { te: 'లోడ్ అవుతోంది...' },

  // Construction Terms
  'Foundation': { te: 'పునాది' },
  'Roofing': { te: 'కప్పు వేయుట' },
  'Steel Structure': { te: 'ఉక్కు నిర్మాణం' },
  'Basement': { te: 'నేలమాళిగ' },
  'Ground Floor': { te: 'కింది అంతస్తు' },
  'Building': { te: 'భవనం' },
  'Site': { te: 'స్థలం' },
  'Construction': { te: 'నిర్మాణం' },
  'Hospital': { te: 'ఆసుపత్రి' },
  'Hotel': { te: 'హోటల్' },

  // Actions & Buttons
  'Add': { te: 'జోడించండి' },
  'Edit': { te: 'సవరించండి' },
  'Delete': { te: 'తొలగించండి' },
  'Upload': { te: 'అప్‌లోడ్ చేయండి' },
  'Download': { te: 'డౌన్‌లోడ్ చేయండి' },
  'Search': { te: 'వెతకండి' },
  'Filter': { te: 'ఫిల్టర్ చేయండి' },
  'Create': { te: 'సృష్టించండి' },
  'Update': { te: 'నవీకరించండి' },

  // Messages
  'No projects found': { te: 'ప్రాజెక్టులు కనుగొనబడలేదు' },
  'Loading projects...': { te: 'ప్రాజెక్టులు లోడ్ అవుతున్నాయి...' },
  'Failed to load projects': { te: 'ప్రాజెక్టులు లోడ్ చేయడంలో విఫలమైంది' },
  'Project saved successfully': { te: 'ప్రాజెక్ట్ విజయవంతంగా సేవ్ చేయబడింది' },
  'Error saving project': { te: 'ప్రాజెక్ట్ సేవ్ చేయడంలో లోపం' },

  // Time & Dates
  'Today': { te: 'ఈరోజు' },
  'Yesterday': { te: 'నిన్న' },
  'Week': { te: 'వారం' },
  'Month': { te: 'నెల' },
  'Year': { te: 'సంవత్సరం' },

  // Common Words
  'and': { te: 'మరియు' },
  'or': { te: 'లేదా' },
  'of': { te: 'యొక్క' },
  'in': { te: 'లో' },
  'at': { te: 'వద్ద' },
  'for': { te: 'కోసం' },
  'with': { te: 'తో' },
  'by': { te: 'ద్వారా' },
  'from': { te: 'నుండి' },
  'to': { te: 'కు' }
};

// Cache for dynamic translations
const translationCache = new Map<string, string>();

/**
 * Get static translation for common UI terms
 */
export const getStaticTranslation = (text: string, language: Language): string => {
  if (language === 'en') return text;
  
  const translation = staticTranslations[text];
  return translation ? translation.te : text;
};

/**
 * Translate dynamic content using online service (with caching)
 */
export const translateDynamicText = async (text: string, targetLanguage: Language): Promise<string> => {
  if (targetLanguage === 'en') return text;
  if (!text || text.trim() === '') return text;

  // Check cache first
  const cacheKey = `${text}_${targetLanguage}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Using LibreTranslate free service (you can replace with Google Translate API)
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'te',
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error('Translation service unavailable');
    }

    const data = await response.json();
    const translatedText = data.translatedText || text;

    // Cache the translation
    translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  } catch (error) {
    console.warn('Dynamic translation failed, falling back to original text:', error);
    return text;
  }
};

/**
 * Smart translate function that uses static translations for known terms
 * and dynamic translation for unknown content
 */
export const translateText = async (text: string, language: Language): Promise<string> => {
  if (language === 'en') return text;

  // First try static translation
  const staticResult = getStaticTranslation(text, language);
  if (staticResult !== text) {
    return staticResult;
  }

  // Fall back to dynamic translation for unknown terms
  return await translateDynamicText(text, language);
};

/**
 * Batch translate multiple texts efficiently
 */
export const translateBatch = async (texts: string[], language: Language): Promise<string[]> => {
  if (language === 'en') return texts;

  const translations = await Promise.all(
    texts.map(text => translateText(text, language))
  );

  return translations;
};

/**
 * Check if text is likely a construction/project term that should be translated
 */
export const shouldTranslate = (text: string): boolean => {
  // Don't translate URLs, email addresses, or very short strings
  if (text.includes('http') || text.includes('@') || text.length < 2) {
    return false;
  }
  
  // Don't translate numbers only
  if (/^\d+$/.test(text.trim())) {
    return false;
  }

  return true;
}; 