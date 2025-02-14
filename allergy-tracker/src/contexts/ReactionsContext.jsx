import React, { createContext, useContext, useState, useCallback } from 'react';

const ReactionsContext = createContext();

export const useReactions = () => {
  const context = useContext(ReactionsContext);
  if (!context) {
    throw new Error('useReactions must be used within a ReactionsProvider');
  }
  return context;
};

export const ReactionsProvider = ({ children }) => {
  const [shouldRefreshCalendar, setShouldRefreshCalendar] = useState(false);

  const triggerCalendarRefresh = useCallback(() => {
    setShouldRefreshCalendar(prev => !prev);
  }, []);

  const value = {
    shouldRefreshCalendar,
    triggerCalendarRefresh
  };

  return (
    <ReactionsContext.Provider value={value}>
      {children}
    </ReactionsContext.Provider>
  );
};