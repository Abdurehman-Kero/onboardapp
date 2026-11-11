import React, { useEffect, useRef, useState } from 'react';
import { X, Loader2, Plus, AlertCircle } from 'lucide-react';
import { VALID_CATEGORIES, VALID_STATUSES, validateProjectData } from '../api.js';

export default function SubmitDrawer({ isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    student_name: '',
    student_email: '',
    cohort: 'Cohort 1',
    category: 'Web App',
    status: 'building',
    github_url: '',
    live_url: '',
    tech_stack: ['React', 'JavaScript'],
  });

  const [techInput, setTechInput] = useState('');
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const panelRef = useRef(null);
  const titleInputRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement;
      document.body.classList.add('drawer-open');

      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        } else if (e.key === 'Tab' && panelRef.current) {
          const focusable = panelRef.current.querySelectorAll(
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

  if (!isOpen) return null;

  const runFieldValidation = (field, currentData = formData) => {
    const { fields } = validateProjectData(currentData);
    setErrors((prev) => {
      const next = { ...prev };
      if (fields[field]) {
        next[field] = fields[field];
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      runFieldValidation(name, updated);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runFieldValidation(field);
  };

  const handleStatusChange = (newStatus) => {
    const updated = { ...formData, status: newStatus };
    setFormData(updated);
    if (touched.status || touched.live_url) {
      runFieldValidation('live_url', updated);
    }
  };

  // Tech tags handling
  const addTechTag = (rawTag) => {
    const tag = rawTag.trim();
    if (!tag) return;
    if (tag.length > 24) {
      setErrors((prev) => ({ ...prev, tech_stack: 'Tag cannot exceed 24 characters' }));
      return;
    }
    if (formData.tech_stack.length >= 8) {
      setErrors((prev) => ({ ...prev, tech_stack: 'Maximum 8 technology tags allowed' }));
      return;
    }
    if (!formData.tech_stack.includes(tag)) {
      const updatedStack = [...formData.tech_stack, tag];
      const updated = { ...formData, tech_stack: updatedStack };
      setFormData(updated);
      setTechInput('');
      runFieldValidation('tech_stack', updated);
    } else {
      setTechInput('');
    }
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTechTag(techInput);
    } else if (e.key === 'Backspace' && !techInput && formData.tech_stack.length > 0) {
      const updatedStack = formData.tech_stack.slice(0, -1);
      const updated = { ...formData, tech_stack: updatedStack };
      setFormData(updated);
      runFieldValidation('tech_stack', updated);
    }
  };

  const removeTechTag = (tagToRemove) => {
    const updatedStack = formData.tech_stack.filter((t) => t !== tagToRemove);
    const updated = { ...formData, tech_stack: updatedStack };
    setFormData(updated);
    runFieldValidation('tech_stack', updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const allTouched = {
      title: true,
      tagline: true,
      description: true,
      student_name: true,
      category: true,
      status: true,
      github_url: true,
      live_url: true,
      tech_stack: true,
    };
    setTouched(allTouched);

    const { isValid, fields, cleaned } = validateProjectData(formData);
    if (!isValid) {
      setErrors(fields);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitSuccess(cleaned);
      setFormData({
        title: '',
        tagline: '',
        description: '',
        student_name: '',
        student_email: '',
        cohort: 'Cohort 1',
        category: 'Web App',
        status: 'building',
        github_url: '',
        live_url: '',
        tech_stack: ['React'],
      });
      setErrors({});
      setTouched({});
    } catch (err) {
      if (err.fields && Object.keys(err.fields).length > 0) {
        setErrors(err.fields);
      }
      setServerError(err.message || 'Failed to submit project. Please check the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-drawer-title"
    >
      <div className="drawer-panel" ref={panelRef}>
        {/* Mobile grab handle */}
        <div className="drawer-grab-handle" aria-hidden="true" />

        {/* Header */}
        <div className="drawer-header">
          <h2 id="submit-drawer-title" className="drawer-header-title">
            Submit Your Project
          </h2>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close submit project drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body with generous bottom safe area padding */}
        <div className="drawer-scroll-body">
          {serverError && (
            <div className="form-server-error-banner" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="submit-form" noValidate>
            {/* Title */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="title" className="form-label">
                  Project title <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <span className="char-counter">{formData.title.length}/60</span>
              </div>
              <input
                id="title"
                name="title"
                type="text"
                ref={titleInputRef}
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                placeholder="e.g. TenaConnect, ShebaMart"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => handleBlur('title')}
                maxLength={60}
                required
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <div id="title-error" className="field-error-message">
                  {errors.title}
                </div>
              )}
            </div>

            {/* Tagline */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="tagline" className="form-label">
                  Tagline <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <span
                  className={`char-counter ${
                    formData.tagline.length > 90 ? 'limit-near' : ''
                  }`}
                >
                  {formData.tagline.length}/100
                </span>
              </div>
              <input
                id="tagline"
                name="tagline"
                type="text"
                className={`form-input ${errors.tagline ? 'has-error' : ''}`}
                placeholder="One catchy sentence describing what it does"
                value={formData.tagline}
                onChange={handleChange}
                onBlur={() => handleBlur('tagline')}
                maxLength={100}
                required
                aria-invalid={!!errors.tagline}
                aria-describedby={errors.tagline ? 'tagline-error' : undefined}
              />
              {errors.tagline && (
                <div id="tagline-error" className="field-error-message">
                  {errors.tagline}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="description" className="form-label">
                  Description <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <span
                  className={`char-counter ${
                    formData.description.length > 550 ? 'limit-near' : ''
                  }`}
                >
                  {formData.description.length}/600
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                placeholder="Detail the problem solved, architecture, or unique features..."
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur('description')}
                maxLength={600}
                rows={4}
                required
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'desc-error' : undefined}
              />
              {errors.description && (
                <div id="desc-error" className="field-error-message">
                  {errors.description}
                </div>
              )}
            </div>

            {/* Builder Name & Email Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-16)' }}>
              <div className="form-group">
                <label htmlFor="student_name" className="form-label">
                  Your name <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input
                  id="student_name"
                  name="student_name"
                  type="text"
                  className={`form-input ${errors.student_name ? 'has-error' : ''}`}
                  placeholder="e.g. Selamawit Tadesse"
                  value={formData.student_name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('student_name')}
                  maxLength={60}
                  required
                />
                {errors.student_name && (
                  <div className="field-error-message">{errors.student_name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="student_email" className="form-label">
                  Email <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>(Optional)</span>
                </label>
                <input
                  id="student_email"
                  name="student_email"
                  type="email"
                  className={`form-input ${errors.student_email ? 'has-error' : ''}`}
                  placeholder="you@example.com"
                  value={formData.student_email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('student_email')}
                />
                <span className="form-helper-text">Never shown publicly</span>
                {errors.student_email && (
                  <div className="field-error-message">{errors.student_email}</div>
                )}
              </div>
            </div>

            {/* Cohort & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-16)' }}>
              <div className="form-group">
                <label htmlFor="cohort" className="form-label">
                  Cohort
                </label>
                <input
                  id="cohort"
                  name="cohort"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cohort 1"
                  value={formData.cohort}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {VALID_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Segmented */}
            <div className="form-group">
              <label className="form-label" id="status-group-label">
                Development status <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <div
                className="segmented-control"
                role="radiogroup"
                aria-labelledby="status-group-label"
                style={{ width: '100%' }}
              >
                {VALID_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    style={{ flex: 1, textTransform: 'capitalize' }}
                    className={`segment-btn ${formData.status === st ? 'active' : ''}`}
                    onClick={() => handleStatusChange(st)}
                    role="radio"
                    aria-checked={formData.status === st}
                    tabIndex={formData.status === st ? 0 : -1}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* GitHub URL */}
            <div className="form-group">
              <label htmlFor="github_url" className="form-label">
                GitHub repository URL <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                id="github_url"
                name="github_url"
                type="url"
                className={`form-input ${errors.github_url ? 'has-error' : ''}`}
                placeholder="https://github.com/username/project-repo"
                value={formData.github_url}
                onChange={handleChange}
                onBlur={() => handleBlur('github_url')}
                required
              />
              {errors.github_url && (
                <div className="field-error-message">{errors.github_url}</div>
              )}
            </div>

            {/* Live URL */}
            {formData.status === 'live' && (
              <div className="form-group">
                <label htmlFor="live_url" className="form-label">
                  Live deployment URL <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input
                  id="live_url"
                  name="live_url"
                  type="url"
                  className={`form-input ${errors.live_url ? 'has-error' : ''}`}
                  placeholder="https://yourproject.app"
                  value={formData.live_url}
                  onChange={handleChange}
                  onBlur={() => handleBlur('live_url')}
                  required
                />
                <span className="form-helper-text">Must start with https://</span>
                {errors.live_url && (
                  <div className="field-error-message">{errors.live_url}</div>
                )}
              </div>
            )}

            {/* Tech Stack Chip Input */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="tech-tag-input" className="form-label">
                  Tech stack <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <span className="char-counter">{formData.tech_stack.length}/8 tags</span>
              </div>
              <div
                className={`tech-tag-input-container ${isTagInputFocused ? 'focused' : ''} ${
                  errors.tech_stack ? 'has-error' : ''
                }`}
                onClick={() => document.getElementById('tech-tag-input')?.focus()}
              >
                {formData.tech_stack.map((tag) => (
                  <span key={tag} className="tag-badge">
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="tag-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTechTag(tag);
                      }}
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {formData.tech_stack.length < 8 && (
                  <input
                    id="tech-tag-input"
                    type="text"
                    className="tag-text-input"
                    placeholder={
                      formData.tech_stack.length === 0
                        ? 'Type tag and press Enter or comma...'
                        : 'Add more...'
                    }
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    onFocus={() => setIsTagInputFocused(true)}
                    onBlur={() => {
                      setIsTagInputFocused(false);
                      if (techInput) addTechTag(techInput);
                      handleBlur('tech_stack');
                    }}
                  />
                )}
              </div>
              <span className="form-helper-text">
                Press Enter or comma to add a chip. Backspace removes the last.
              </span>
              {errors.tech_stack && (
                <div className="field-error-message">{errors.tech_stack}</div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="form-footer-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" aria-hidden="true" />
                    <span>Submitting project...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
                    <span>Submit project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
