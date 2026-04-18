import React from 'react';

interface AuthFormProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({ icon, title, subtitle, children, footer }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-20"
        style={{
          background: 'var(--color-primary)',
          top: '-10%',
          right: '-5%',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-15"
        style={{
          background: 'var(--color-accent)',
          bottom: '-10%',
          left: '-5%',
        }}
      />

      <div
        className="animate-fade-in w-full max-w-sm mx-4 relative"
        style={{
          background: 'var(--color-surface)',
          borderRadius: '20px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 40px var(--color-shadow-lg), 0 0 0 1px var(--color-border-subtle)',
          padding: '44px 36px',
        }}
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light))',
              border: '1px solid var(--color-border)',
            }}
          >
            {icon}
          </div>
          <h1
            className="text-2xl font-bold mb-1.5"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
          >
            {title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        </div>

        {children}

        <div className="text-center text-sm mt-7" style={{ color: 'var(--color-text-muted)' }}>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
