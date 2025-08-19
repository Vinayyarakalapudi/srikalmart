import React, { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`alert alert-${type} ${show ? 'show' : ''}`}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        <button className="alert-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Alert;
