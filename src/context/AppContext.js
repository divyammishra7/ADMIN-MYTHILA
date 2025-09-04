import React, { createContext, useContext, useState } from 'react';
import AddItem from '../components/AddItem';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentComponent, setCurrentComponent] = useState(<AddItem />);

  const value = {
    currentComponent,
    setCurrentComponent
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
