/**
 * LaunchBoard UI & Data Utility Functions
 */

// Safe localStorage helper for tracking liked projects
const LIKES_KEY = 'launchboard_liked_projects_v1';

export function getLikedProjectIds() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch {
    return new Set();
  }
}

export function saveLikedProjectId(id) {
  try {
    const current = getLikedProjectIds();
    current.add(String(id));
    localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // ignore quota or privacy errors
  }
}

// Generate 1-2 letter initials for a project title
export function getInitials(title = '') {
  const clean = title.trim();
  if (!clean) return 'LB';

  // Check if title has camelCase or PascalCase (e.g. "TenaConnect" -> "TC", "ShebaMart" -> "SM")
  const capitalMatches = clean.match(/[A-Z]/g);
  if (capitalMatches && capitalMatches.length >= 2) {
    return (capitalMatches[0] + capitalMatches[1]).toUpperCase();
  }

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

// Deterministic soft gradient selection tailored to the warm, confident brand palette
const PALETTES = [
  {
    bg: 'linear-gradient(135deg, #FFF0E6 0%, #FED7AA 100%)',
    color: '#9A3412',
  },
  {
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    color: '#92400E',
  },
  {
    bg: 'linear-gradient(135deg, #E6F6EF 0%, #A7F3D0 100%)',
    color: '#065F46',
  },
  {
    bg: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
    color: '#6B21A8',
  },
  {
    bg: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    color: '#0369A1',
  },
  {
    bg: 'linear-gradient(135deg, #F1ECE6 0%, #E5DDD5 100%)',
    color: '#574E45',
  },
  {
    bg: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)',
    color: '#9F1239',
  },
  {
    bg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
    color: '#5B21B6',
  },
];

export function getDeterministicGradient(title = '') {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

// Format ISO string to readable publication date
export function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}
