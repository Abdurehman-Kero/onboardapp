import React from 'react';
import { Plus, Rocket } from 'lucide-react';
import { DEMO_MODE } from '../api.js';

export default function Header({ onOpenSubmit }) {
  return (
    <header className="app-header">
      <div className="content-wrap">
        <div className="header-inner">
          <a href="#" className="brand-link" aria-label="LaunchBoard Home">
            <div className="brand-logo" aria-hidden="true">
              <Rocket size={18} />
            </div>
            <div className="brand-text-group">
              <span className="brand-name">LaunchBoard</span>
              {DEMO_MODE && (
                <span className="demo-pill" title="Serving local demo data with simulated latency">
                  Demo data
                </span>
              )}
            </div>
          </a>

          <div className="header-actions">
            <button
              type="button"
              className="btn-primary btn-header-submit"
              onClick={onOpenSubmit}
              aria-label="Submit project to LaunchBoard"
            >
              <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
              <span className="submit-label-desktop">Submit project</span>
              <span className="submit-label-mobile">Submit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
