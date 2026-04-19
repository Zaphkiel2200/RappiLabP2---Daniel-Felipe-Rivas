import React from 'react';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({ id, label, type, placeholder, value, onChange, required }) => {
  return (
    <div className="auth-input-group">
      <label
        htmlFor={id}
        className="auth-label"
      >
        {label}
      </label>
      <div className="auth-input-wrapper">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="auth-input"
          required={required}
        />
      </div>
    </div>
  );
};

export default AuthInput;
