import React from 'react';
import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="content-wrap">
        <div className="footer-inner">
          <div className="footer-brand">
            <Rocket size={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <span>LaunchBoard</span>
            <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>&bull;</span>
            <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>
              Where bootcamp projects go live.
            </span>
          </div>

          <div className="footer-credits">
            Built live at <strong>NilePixel Bootcamp</strong>. Open to all cohort builders.
          </div>
        </div>
      </div>
    </footer>
  );
}
