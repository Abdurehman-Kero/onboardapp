import React, { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setRetrying(false), 240);
    }
  };

  return (
    <div className="state-container error-state-card" role="alert">
      <div className="state-illustration error-illustration" aria-hidden="true">
        <AlertCircle size={32} />
      </div>
      <h3 className="state-title">Unable to connect to LaunchBoard</h3>
      <p className="state-desc">
        {message || 'A network hiccup interrupted communication with the server. Please check your connection and retry.'}
      </p>
      {onRetry && (
        <button
          type="button"
          className="btn-secondary"
          onClick={handleRetry}
          disabled={retrying}
          aria-label="Retry loading projects"
        >
          <RefreshCw size={16} className={retrying ? 'spinner-icon' : ''} aria-hidden="true" />
          <span>{retrying ? 'Connecting...' : 'Try again'}</span>
        </button>
      )}
    </div>
  );
}
