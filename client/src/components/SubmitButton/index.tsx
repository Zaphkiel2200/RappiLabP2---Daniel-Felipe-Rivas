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
      className="auth-submit-btn"
    >
      {loading ? (
        <>
          <div className="auth-spinner" />
          <span>{loadingText}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default SubmitButton;
