import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Github, Heart, Copy, Check, UserCheck, Calendar, Tag } from 'lucide-react';
import { getDeterministicGradient, getInitials, formatDate } from '../utils.js';

export default function DetailsModal({
  project,
  isOpen,
  onClose,
  isLiked,
  onLike,
}) {
  const [copied, setCopied] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Focus trap, body scroll lock, and Esc to close
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement;
      document.body.classList.add('drawer-open');

      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        } else if (e.key === 'Tab' && dialogRef.current) {
          const focusable = dialogRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('drawer-open');
        previouslyFocusedElementRef.current?.focus?.();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const { bg, color } = getDeterministicGradient(project.title);
  const initials = getInitials(project.title);
  const builderInitials = getInitials(project.student_name);

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('project', project.id);
    navigator.clipboard?.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div className="modal-dialog" ref={dialogRef}>
        {/* Mobile grab handle */}
        <div className="modal-grab-handle" aria-hidden="true" />

        {/* Sticky Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-header-title">Project Details</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            ref={closeBtnRef}
            aria-label="Close project details dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="modal-scroll-body">
          {/* Hero Banner with deterministic gradient */}
          <div className="details-hero-banner" style={{ background: bg }} aria-hidden="true">
            <span className="details-hero-initials" style={{ color }}>
              {initials}
            </span>
          </div>

          {/* Badges row */}
          <div className="details-meta-badges">
            <span className={`card-status-badge status-${project.status}`}>
              {project.status === 'live' && <span className="live-dot" aria-hidden="true" />}
              <span>{project.status}</span>
            </span>
            <span className="card-category-tag" style={{ position: 'static' }}>
              {project.category}
            </span>
            {project.cohort && (
              <span className="details-cohort-badge">
                {project.cohort}
              </span>
            )}
          </div>

          {/* Heading Order: H2 for project title inside modal */}
          <h2 id="modal-project-title" className="details-title">
            {project.title}
          </h2>
          <p className="details-tagline">{project.tagline}</p>

          {/* Meta info row */}
          <div className="details-meta-row">
            {project.created_at && (
              <span className="details-meta-item">
                <Calendar size={13} aria-hidden="true" />
                Submitted {formatDate(project.created_at)}
              </span>
            )}
          </div>

          {/* Section: About */}
          <h3 className="details-section-label">About the project</h3>
          <div className="details-description">{project.description}</div>

          {/* Section: Tech Stack */}
          <h3 className="details-section-label">Technologies used</h3>
          <div className="details-tech-grid" aria-label="Technologies used">
            {(project.tech_stack || []).map((tech) => (
              <span key={tech} className="details-tech-tag">
                <Tag size={11} aria-hidden="true" />
                {tech}
              </span>
            ))}
          </div>

          {/* Section: Builder */}
          <h3 className="details-section-label">Builder profile</h3>
          <div className="details-builder-card">
            <div className="details-builder-left">
              <div className="details-builder-avatar" aria-hidden="true">
                {builderInitials}
              </div>
              <div className="details-builder-meta">
                <div className="details-builder-name">{project.student_name}</div>
                <div className="details-builder-sub">
                  {project.cohort || 'Cohort 1'}
                </div>
              </div>
            </div>
            <UserCheck size={18} style={{ color: 'var(--ink-muted)', flexShrink: 0 }} aria-hidden="true" />
          </div>

          {/* Action Buttons */}
          <div className="details-actions-bar">
            {/* Primary: Visit + GitHub — full width on mobile */}
            <div className="details-primary-actions">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary modal-live-btn"
                  aria-label={`Open live site for ${project.title} (opens in new tab)`}
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  <span>Visit Live Site</span>
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              )}
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                aria-label={`View ${project.title} source on GitHub (opens in new tab)`}
              >
                <Github size={16} aria-hidden="true" />
                <span>View on GitHub</span>
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>

            {/* Secondary: Copy link + Like */}
            <div className="details-utility-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCopyLink}
                aria-label="Copy share link for this project to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={16} style={{ color: 'var(--status-live-text)' }} aria-hidden="true" />
                    <span>Copied link!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} aria-hidden="true" />
                    <span>Copy link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className={`like-btn ${isLiked ? 'liked' : ''} ${animateLike ? 'popping' : ''}`}
                onClick={() => {
                  setAnimateLike(true);
                  setTimeout(() => setAnimateLike(false), 240);
                  onLike(project.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.stopPropagation();
                  }
                }}
                aria-pressed={isLiked}
                aria-label={isLiked ? `Liked, ${project.likes} total likes` : `Like ${project.title}, ${project.likes} total likes`}
              >
                <Heart size={16} className={`like-icon ${animateLike ? 'pop' : ''}`} aria-hidden="true" />
                <span>{project.likes} {project.likes === 1 ? 'like' : 'likes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
