import React from 'react';

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  text: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, loadingText, text }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-3 cursor-pointer relative overflow-hidden"
      style={{
        background: loading
          ? 'var(--color-text-muted)'
          : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))',
        color: '#FFFFFF',
        border: 'none',
        boxShadow: loading ? 'none' : '0 4px 16px rgba(129, 140, 248, 0.3)',
        letterSpacing: '0.02em',
      }}
    >
      {loading ? loadingText : text}
    </button>
  );
};

export default SubmitButton;
