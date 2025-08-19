import React, { createContext, useContext, useState } from 'react';
import Alert from './Alert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Alert 
        message={alert.message} 
        type={alert.type} 
        show={alert.show} 
        onClose={() => setAlert({ show: false, message: '', type: 'success' })} 
      />
    </AlertContext.Provider>
  );
};
