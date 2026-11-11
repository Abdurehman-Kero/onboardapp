import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type || 'info'}`} role="status">
          {toast.type === 'success' && (
            <CheckCircle2 size={18} style={{ color: '#34D399', flexShrink: 0 }} aria-hidden="true" />
          )}
          {toast.type === 'error' && (
            <AlertCircle size={18} style={{ color: '#F87171', flexShrink: 0 }} aria-hidden="true" />
          )}
          {(!toast.type || toast.type === 'info') && (
            <Info size={18} style={{ color: '#60A5FA', flexShrink: 0 }} aria-hidden="true" />
          )}

          <div className="toast-content">{toast.message}</div>

          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
