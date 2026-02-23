import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // A dummy translation function that simply returns the key.
  // This prevents crashes in components that still call t('some.text')
  const t = (key) => {
    return key; 
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// This hook prevents "Module not found" errors in your other components
export const useLanguage = () => useContext(LanguageContext);