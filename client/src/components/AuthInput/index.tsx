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
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-medium mb-1.5 tracking-wide uppercase"
        style={{ color: 'var(--color-text-muted)', letterSpacing: '0.06em' }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
        style={{
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg-subtle)',
          color: 'var(--color-text)',
        }}
        required={required}
      />
    </div>
  );
};

export default AuthInput;
