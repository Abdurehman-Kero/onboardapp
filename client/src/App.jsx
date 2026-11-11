import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Toolbar from './components/Toolbar.jsx';
import ProjectGrid from './components/ProjectGrid.jsx';
import DetailsModal from './components/DetailsModal.jsx';
import SubmitDrawer from './components/SubmitDrawer.jsx';
import SlowServerBanner from './components/SlowServerBanner.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import {
  getStats,
  listProjects,
  getProject,
  createProject,
  likeProject,
} from './api.js';
import { getLikedProjectIds, saveLikedProjectId } from './utils.js';

function parseUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get('search') || '',
      category: params.get('category') || 'All',
      status: params.get('status') || 'all',
      sort: params.get('sort') || 'newest',
      projectId: params.get('project') || null,
    };
  } catch {
    return { search: '', category: 'All', status: 'all', sort: 'newest', projectId: null };
  }
}

export default function App() {
  const initialParams = parseUrlParams();

  // Filter & Search states
  const [search, setSearch] = useState(initialParams.search);
  const [category, setCategory] = useState(initialParams.category);
  const [status, setStatus] = useState(initialParams.status);
  const [sort, setSort] = useState(initialParams.sort);

  // Data states
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection & Drawers
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  // Likes tracking
  const [likedIds, setLikedIds] = useState(() => getLikedProjectIds());

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category && category !== 'All') params.set('category', category);
    if (status && status !== 'all' && status !== 'All') params.set('status', status);
    if (sort && sort !== 'newest') params.set('sort', sort);
    if (selectedProject) params.set('project', selectedProject.id);

    const queryString = params.toString();
    const newRelativePath = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, '', newRelativePath);
  }, [search, category, status, sort, selectedProject]);

  // Fetch overview stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch {
      // stats failure is non-fatal
    }
  }, []);

  // Fetch project list
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listProjects({
        search,
        category,
        status,
        sort,
      });
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [search, category, status, sort]);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Deep-link check for ?project=<id>
  const didCheckDeepLink = useRef(false);
  useEffect(() => {
    if (didCheckDeepLink.current) return;
    const { projectId } = parseUrlParams();
    if (projectId) {
      didCheckDeepLink.current = true;
      getProject(projectId)
        .then((project) => {
          setSelectedProject(project);
        })
        .catch(() => {
          // ignore if project not found
        });
    }
  }, []);

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('all');
    setSort('newest');
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    (category && category !== 'All') ||
    (status && status !== 'all' && status !== 'All') ||
    sort !== 'newest';

  // Optimistic Like handler
  const handleLike = async (projectId) => {
    const strId = String(projectId);
    if (likedIds.has(strId)) {
      addToast('You have already liked this project.', 'info');
      return;
    }

    // Optimistically update
    const previousProjects = [...projects];
    const previousSelected = selectedProject ? { ...selectedProject } : null;

    setLikedIds((prev) => {
      const next = new Set(prev);
      next.add(strId);
      return next;
    });

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, likes: p.likes + 1 } : p))
    );

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => ({ ...prev, likes: prev.likes + 1 }));
    }

    try {
      const updated = await likeProject(projectId);
      saveLikedProjectId(projectId);
      // Synchronize with server response
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, likes: updated.likes } : p))
      );
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject((prev) => ({ ...prev, likes: updated.likes }));
      }
    } catch {
      // Rollback
      setProjects(previousProjects);
      if (previousSelected) setSelectedProject(previousSelected);
      setLikedIds((prev) => {
        const next = new Set(prev);
        next.delete(strId);
        return next;
      });
      addToast('Could not save like. Please try again.', 'error');
    }
  };

  // Submit Project handler
  const handleSubmitSuccess = async (newProjectData) => {
    const created = await createProject(newProjectData);

    // Prepend to visible list
    setProjects((prev) => [created, ...prev]);

    // Highlight animation on new card
    setJustAddedId(created.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 3000);

    // Close drawer
    setIsSubmitOpen(false);

    // Success notification
    addToast(`"${created.title}" was submitted successfully!`, 'success');

    // Update stats count
    fetchStats();
  };

  return (
    <div className="app-container">
      {/* Accessible Skip to Main Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Cold start banner */}
      <SlowServerBanner />

      {/* Header */}
      <Header onOpenSubmit={() => setIsSubmitOpen(true)} />

      {/* Main Content */}
      <main id="main-content" tabIndex="-1">
        <Hero stats={stats} onOpenSubmit={() => setIsSubmitOpen(true)} />

        <div className="content-wrap">
          <Toolbar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            totalResults={projects.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <ProjectGrid
            projects={projects}
            isLoading={isLoading}
            error={error}
            likedIds={likedIds}
            onLike={handleLike}
            onSelectProject={(project) => setSelectedProject(project)}
            justAddedId={justAddedId}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            onRetry={fetchProjects}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Centered Details Modal Popup */}
      <DetailsModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        isLiked={selectedProject ? likedIds.has(String(selectedProject.id)) : false}
        onLike={handleLike}
      />

      <SubmitDrawer
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {/* Accessible Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
