import React from 'react';
import '../../pages/Auth.css';

interface AuthFormProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({ icon, title, subtitle, children, footer }) => {
  return (
    <div className="auth-container">
      {/* Background patterns and orbs */}
      <div className="auth-bg-pattern" />
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      {/* Main Card */}
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            {icon}
          </div>
          <h1 className="auth-title">
            {title}
          </h1>
          <p className="auth-subtitle">
            {subtitle}
          </p>
        </div>

        <div className="auth-form-body">
          {children}
        </div>

        <div className="auth-footer">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
