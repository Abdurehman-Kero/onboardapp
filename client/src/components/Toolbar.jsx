import React, { useEffect, useRef, useState } from 'react';
import { Search, X, ChevronDown, RotateCcw } from 'lucide-react';
import { VALID_CATEGORIES } from '../api.js';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Building', value: 'building' },
  { label: 'Idea', value: 'idea' },
];

export default function Toolbar({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  sort,
  setSort,
  totalResults,
  onResetFilters,
  hasActiveFilters,
}) {
  const [localSearch, setLocalSearch] = useState(search);
  const statusRefs = useRef([]);
  const categoryRefs = useRef([]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, search, setSearch]);

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearch('');
  };

  const categories = ['All', ...VALID_CATEGORIES];

  // Keyboard navigation for Status Segmented Control (Arrow keys, Home, End)
  const handleStatusKeyDown = (e, index) => {
    let targetIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % STATUS_OPTIONS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + STATUS_OPTIONS.length) % STATUS_OPTIONS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = STATUS_OPTIONS.length - 1;
    }

    if (targetIndex !== null) {
      const nextOpt = STATUS_OPTIONS[targetIndex];
      setStatus(nextOpt.value);
      statusRefs.current[targetIndex]?.focus();
    }
  };

  // Keyboard navigation for Category Chips (Arrow keys, Home, End)
  const handleCategoryKeyDown = (e, index) => {
    let targetIndex = null;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = (index + 1) % categories.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = (index - 1 + categories.length) % categories.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = categories.length - 1;
    }

    if (targetIndex !== null) {
      const nextCat = categories[targetIndex];
      setCategory(nextCat);
      categoryRefs.current[targetIndex]?.focus();
      categoryRefs.current[targetIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  };

  return (
    <section id="gallery" className="toolbar-section" aria-labelledby="gallery-heading">
      {/* Structural Heading: H2 for Gallery */}
      <h2 id="gallery-heading" className="sr-only">
        Project Showcase &amp; Filters
      </h2>

      <div className="toolbar-primary-row">
        {/* Search input with label & clear button */}
        <div className="search-box">
          <label htmlFor="project-search-input" className="sr-only">
            Search projects by title, builder, or technology
          </label>
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            id="project-search-input"
            type="text"
            className="search-input"
            placeholder="Search projects, builders, tech stack..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClearSearch}
              aria-label="Clear search input"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Status segmented control & Sort dropdown */}
        <div className="toolbar-controls-right">
          <div
            className="segmented-control"
            role="radiogroup"
            aria-label="Filter projects by development status"
          >
            {STATUS_OPTIONS.map((opt, i) => {
              const isSelected = status === opt.value;
              return (
                <button
                  key={opt.value}
                  ref={(el) => (statusRefs.current[i] = el)}
                  type="button"
                  className={`segment-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setStatus(opt.value)}
                  onKeyDown={(e) => handleStatusKeyDown(e, i)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="sort-wrap">
            <label htmlFor="sort-select" className="sr-only">
              Sort projects
            </label>
            <select
              id="sort-select"
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort projects"
            >
              <option value="newest">Newest first</option>
              <option value="popular">Most liked</option>
            </select>
            <ChevronDown size={14} className="sort-arrow" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Category scrollable chips with arrow navigation & roving tabIndex */}
      <div
        className="category-chips-row"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {categories.map((cat, i) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              ref={(el) => (categoryRefs.current[i] = el)}
              type="button"
              className={`category-chip ${isSelected ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              onKeyDown={(e) => handleCategoryKeyDown(e, i)}
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Count & Quick Reset indicator */}
      <div className="results-count-bar" aria-live="polite">
        <span>
          Showing {totalResults} {totalResults === 1 ? 'project' : 'projects'}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="active-filter-notice"
            onClick={onResetFilters}
            aria-label="Reset all active filters to view all projects"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </section>
  );
}
