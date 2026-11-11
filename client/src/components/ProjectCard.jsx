import React, { useState } from 'react';
import { Heart, ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { getDeterministicGradient, getInitials, formatDate } from '../utils.js';

const STATUS_LABELS = {
  live: 'Live',
  building: 'Building',
  idea: 'Idea',
};

export default function ProjectCard({
  project,
  isLiked,
  onLike,
  onClick,
  isJustAdded = false,
}) {
  const [animateLike, setAnimateLike] = useState(false);
  const { bg, color } = getDeterministicGradient(project.title);
  const initials = getInitials(project.title);
  const builderInitials = getInitials(project.student_name);

  const displayTags = (project.tech_stack || []).slice(0, 3);
  const extraTagsCount = Math.max(0, (project.tech_stack || []).length - 3);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 240);
    onLike(project.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(project);
    }
  };

  return (
    <article
      className={`project-card ${isJustAdded ? 'just-added' : ''}`}
      onClick={() => onClick(project)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open details for ${project.title}`}
    >
      {/* ── Thumbnail ── */}
      <div
        className="card-thumbnail"
        style={{ background: bg }}
        aria-hidden="true"
      >
        <div className="card-thumbnail-pattern" />
        <span className="thumbnail-initials" style={{ color }}>
          {initials}
        </span>

        {/* Category */}
        <span className="card-category-tag">{project.category}</span>

        {/* Status badge — live ones link directly */}
        {project.status === 'live' && project.live_url ? (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-status-badge status-live card-live-link"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open live site for ${project.title} (opens in new tab)`}
            title={`Open ${project.title} live site`}
          >
            <span className="live-dot" aria-hidden="true" />
            <span>live</span>
            <ExternalLink size={11} aria-hidden="true" className="card-live-icon" />
          </a>
        ) : (
          <span className={`card-status-badge status-${project.status}`}>
            <span>{STATUS_LABELS[project.status] || project.status}</span>
          </span>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{project.title}</h3>
          <ArrowUpRight size={16} className="card-open-arrow" aria-hidden="true" />
        </div>
        <p className="card-tagline" title={project.tagline}>
          {project.tagline}
        </p>

        {/* Tech chips */}
        <div className="card-tech-chips" aria-label="Technology stack">
          {displayTags.map((tech) => (
            <span key={tech} className="tech-chip">
              {tech}
            </span>
          ))}
          {extraTagsCount > 0 && (
            <span className="tech-chip more">+{extraTagsCount} more</span>
          )}
        </div>

        {/* ── Card Footer ── */}
        <div className="card-footer">
          {/* Builder info */}
          <div className="builder-info">
            <div className="builder-avatar" aria-hidden="true">
              {builderInitials}
            </div>
            <div className="builder-meta">
              <span className="builder-name" title={project.student_name}>
                {project.student_name}
              </span>
              <span className="builder-cohort">
                {project.cohort || 'Cohort 1'}
                {project.created_at ? ` · ${formatDate(project.created_at)}` : ''}
              </span>
            </div>
          </div>

          {/* Right side: GitHub shortcut + Like */}
          <div className="card-footer-actions">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-github-btn"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} on GitHub (opens in new tab)`}
                title="View source on GitHub"
              >
                <Github size={15} aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              className={`like-btn ${isLiked ? 'liked' : ''} ${animateLike ? 'popping' : ''}`}
              onClick={handleLikeClick}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.stopPropagation();
                  handleLikeClick(e);
                }
              }}
              aria-pressed={isLiked}
              aria-label={
                isLiked
                  ? `Liked, ${project.likes} total likes`
                  : `Like ${project.title}, ${project.likes} total likes`
              }
              title={isLiked ? 'Already liked' : 'Like this project'}
            >
              <Heart
                size={15}
                className={`like-icon ${animateLike ? 'pop' : ''}`}
                aria-hidden="true"
              />
              <span>{project.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
