// src/components/ui/button.jsx
import React from 'react';

export const Button = ({ children, ...props }) => {
  return (
    <button {...props} className="custom-button">
      {children}
    </button>
  );
};
