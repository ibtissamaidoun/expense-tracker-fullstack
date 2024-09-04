// src/components/ui/input.jsx
import React from 'react';

export const Input = React.forwardRef((props, ref) => {
  return (
    <input ref={ref} {...props} className="custom-input" />
  );
});
