import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      {/* 168px Thumbnail matching real card anatomy */}
      <div className="skeleton-thumb">
        <div className="skeleton-badge-status" />
        <div className="skeleton-badge-category" />
        <div className="skeleton-shimmer" />
      </div>

      {/* 24px Body matching real card padding */}
      <div className="skeleton-body">
        {/* Title */}
        <div className="skeleton-line title" />

        {/* 2-line Tagline */}
        <div className="skeleton-line tagline" />
        <div className="skeleton-line tagline-short" />

        {/* Tech Chips */}
        <div className="skeleton-chips-row">
          <div className="skeleton-chip" style={{ width: '58px' }} />
          <div className="skeleton-chip" style={{ width: '72px' }} />
          <div className="skeleton-chip" style={{ width: '64px' }} />
        </div>

        {/* Footer matching real card 44px like button and 32px avatar */}
        <div className="skeleton-footer">
          <div className="skeleton-builder">
            <div className="skeleton-avatar" />
            <div className="skeleton-meta">
              <div className="skeleton-line builder-name" />
              <div className="skeleton-line builder-cohort" />
            </div>
          </div>
          <div className="skeleton-like-pill" />
        </div>
      </div>
    </div>
  );
}
