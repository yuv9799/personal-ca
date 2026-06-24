import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [userProfile, setUserProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isOnboarded') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const updateProfile = (profileData) => {
    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const completeOnboarding = (profileData) => {
    setUserProfile(profileData);
    setIsOnboarded(true);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    localStorage.setItem('isOnboarded', 'true');
  };

  const resetProfile = () => {
    setUserProfile(null);
    setIsOnboarded(false);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isOnboarded');
  };

  const value = {
    darkMode,
    toggleDarkMode,
    userProfile,
    updateProfile,
    completeOnboarding,
    resetProfile,
    isOnboarded,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};