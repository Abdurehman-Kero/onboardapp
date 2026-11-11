import React from 'react';
import { Rocket, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="content-wrap">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-brand-logo" aria-hidden="true">
                <Rocket size={16} />
              </div>
              <span className="footer-brand-name">LaunchBoard</span>
            </div>
            <p className="footer-brand-desc">
              The official student project showcase for NilePixel Bootcamp —
              where Ethiopian tech talent goes live.
            </p>
          </div>

          {/* Links */}
          <div className="footer-links-col">
            <div className="footer-link-group">
              <div className="footer-link-heading">Platform</div>
              <a href="#gallery" className="footer-link">Browse Projects</a>
              <a href="#about" className="footer-link">About</a>
            </div>
            <div className="footer-link-group">
              <div className="footer-link-heading">Community</div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <Github size={14} aria-hidden="true" />
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <Twitter size={14} aria-hidden="true" />
                Twitter / X
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-credits">
            Built live at <strong>NilePixel Bootcamp</strong>. Open to all cohort builders.
          </span>
          <span className="footer-copy">
            © {new Date().getFullYear()} LaunchBoard
          </span>
        </div>
      </div>
    </footer>
  );
}
