import React from 'react';
import ProjectCard from './ProjectCard.jsx';
import SkeletonCard from './SkeletonCard.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorState from './ErrorState.jsx';

export default function ProjectGrid({
  projects,
  isLoading,
  error,
  likedIds,
  onLike,
  onSelectProject,
  justAddedId,
  onResetFilters,
  hasActiveFilters,
  onRetry,
}) {
  if (error && projects.length === 0) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (isLoading && projects.length === 0) {
    return (
      <div className="project-grid" aria-busy="true" aria-label="Loading projects">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && projects.length === 0) {
    return <EmptyState onClearFilters={onResetFilters} isFiltered={hasActiveFilters} />;
  }

  return (
    <div className="project-grid" role="region" aria-label="Projects list">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isLiked={likedIds.has(String(project.id))}
          onLike={onLike}
          onClick={onSelectProject}
          isJustAdded={justAddedId === project.id}
        />
      ))}
    </div>
  );
}
