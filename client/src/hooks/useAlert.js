import { useState } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showAlert = (message, type = 'success') => {
    setAlert({
      show: true,
      message,
      type
    });
  };

  const hideAlert = () => {
    setAlert({
      show: false,
      message: '',
      type: 'success'
    });
  };

  return {
    alert,
    showAlert,
    hideAlert
  };
};

export default useAlert;
