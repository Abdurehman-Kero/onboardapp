import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Flame } from 'lucide-react';

function useCountUp(endValue, duration = 220) {
  const [count, setCount] = useState(0);
  const hasCountedOnceRef = useRef(false);

  useEffect(() => {
    if (endValue === null || endValue === undefined || endValue === 0) return;

    // Honor prefers-reduced-motion immediately
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || hasCountedOnceRef.current) {
      setCount(endValue);
      hasCountedOnceRef.current = true;
      return;
    }

    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easedProgress * endValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        hasCountedOnceRef.current = true;
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration]);

  return count;
}

export default function Hero({ stats, onOpenSubmit }) {
  const totalCount = useCountUp(stats?.total ?? 0);
  const liveCount = useCountUp(stats?.live ?? 0);
  const buildersCount = useCountUp(stats?.builders ?? 0);

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="content-wrap">
        <div className="hero-main">
          <div className="hero-tagline-badge">
            <Flame size={14} aria-hidden="true" />
            <span>NilePixel Cohort Showcase</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            Where bootcamp projects go live.
          </h1>

          <p className="hero-subhead">
            A public showcase celebrating student developers. Explore real applications, inspect repositories, and back upcoming talent.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-primary btn-hero-primary"
              onClick={onOpenSubmit}
            >
              <span>Submit your project</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <a
              href="#gallery"
              className="btn-secondary btn-hero-secondary"
            >
              Explore gallery
            </a>
          </div>

          <div className="hero-stats-grid" role="region" aria-label="Showcase statistics">
            <div className="stat-tile">
              <div className="stat-number">{stats ? totalCount : '—'}</div>
              <div className="stat-label">Projects Submitted</div>
            </div>
            <div className="stat-tile">
              <div className="stat-number" style={{ color: 'var(--status-live-text)' }}>
                {stats ? liveCount : '—'}
              </div>
              <div className="stat-label">Live In Production</div>
            </div>
            <div className="stat-tile">
              <div className="stat-number">{stats ? buildersCount : '—'}</div>
              <div className="stat-label">Active Builders</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
