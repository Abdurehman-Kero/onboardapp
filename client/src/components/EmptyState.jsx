import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({ onClearFilters, isFiltered = true }) {
  return (
    <div className="state-container empty-state-card" role="status">
      <div className="state-illustration" aria-hidden="true">
        <SearchX size={32} />
      </div>
      <h3 className="state-title">No projects found</h3>
      <p className="state-desc">
        {isFiltered
          ? "No student projects match your current filters. Try relaxing your search terms or resetting the category and status filters."
          : 'No projects have been published yet. Be the very first student developer to launch your work on LaunchBoard!'}
      </p>
      {isFiltered && (
        <button
          type="button"
          className="btn-primary"
          onClick={onClearFilters}
          aria-label="Clear all filters to view all projects"
        >
          <RotateCcw size={16} aria-hidden="true" />
          <span>Clear all filters</span>
        </button>
      )}
    </div>
  );
}
