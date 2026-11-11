/**
 * LaunchBoard API client.
 * This is the ONLY file that interacts with data.
 * Supports both REAL MODE (when VITE_API_URL is configured) and DEMO MODE (in-memory).
 */

const BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
export const DEMO_MODE = !BASE;

export class ApiError extends Error {
  constructor(message, fields = {}) {
    super(message);
    this.name = 'ApiError';
    this.fields = fields;
  }
}

// Global slow request listeners for notifying UI if a backend cold-start takes > 4s
const slowListeners = new Set();
let activeSlowCount = 0;

export function subscribeSlowRequest(listener) {
  slowListeners.add(listener);
  return () => slowListeners.delete(listener);
}

function notifySlow(isSlow) {
  slowListeners.forEach((fn) => {
    try {
      fn(isSlow);
    } catch {
      // ignore
    }
  });
}

function trackRequest(promise) {
  let isDone = false;
  let didNotify = false;

  const timer = setTimeout(() => {
    if (!isDone) {
      didNotify = true;
      activeSlowCount += 1;
      notifySlow(true);
    }
  }, 4000);

  return promise.finally(() => {
    isDone = true;
    clearTimeout(timer);
    if (didNotify) {
      activeSlowCount = Math.max(0, activeSlowCount - 1);
      if (activeSlowCount === 0) {
        notifySlow(false);
      }
    }
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// DEMO MODE IN-MEMORY DATA
// 8 realistic projects built by Ethiopian students
// ==========================================
let inMemoryProjects = [
  {
    id: 1,
    title: 'TenaConnect',
    tagline: 'Telemedicine triage platform connecting rural clinics to urban specialists',
    description:
      'A lightweight web portal allowing rural health extension workers across Ethiopia to log patient vitals, upload diagnostic notes, and schedule asynchronous consultations with medical specialists in Addis Ababa.',
    student_name: 'Selamawit Tadesse',
    cohort: 'Cohort 1',
    category: 'Health',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'WebRTC'],
    github_url: 'https://github.com/example/tenaconnect',
    live_url: 'https://tenaconnect.et',
    status: 'live',
    likes: 42,
    created_at: '2026-10-15T09:30:00.000Z',
  },
  {
    id: 2,
    title: 'ShebaMart',
    tagline: 'B2B marketplace linking traditional Ethiopian weavers to international buyers',
    description:
      'An e-commerce hub tailored for artisanal textile cooperatives in Dorze and Addis Ababa with multi-currency pricing, inventory synchronization, and international courier tracking for Habesha Kemis and Tibeb.',
    student_name: 'Dawit Bekele',
    cohort: 'Cohort 1',
    category: 'E-commerce',
    tech_stack: ['Next.js', 'Express', 'PostgreSQL', 'Stripe'],
    github_url: 'https://github.com/example/sheba-mart',
    live_url: 'https://shebamart.shop',
    status: 'live',
    likes: 29,
    created_at: '2026-10-18T14:15:00.000Z',
  },
  {
    id: 3,
    title: 'FidelQuest',
    tagline: 'Gamified web application helping diaspora children master the Ge\'ez script',
    description:
      'An interactive flashcard and audio tracing game designed to make learning the 200+ Ethiopic Fidel characters fun and memorable through guided stroke challenges and pronunciation tests.',
    student_name: 'Bethlehem Girma',
    cohort: 'Cohort 1',
    category: 'Education',
    tech_stack: ['React', 'TypeScript', 'Web Audio API', 'Canvas'],
    github_url: 'https://github.com/example/fidel-quest',
    live_url: null,
    status: 'building',
    likes: 19,
    created_at: '2026-10-22T11:00:00.000Z',
  },
  {
    id: 4,
    title: 'AnbessaTrack',
    tagline: 'Crowd-sourced real-time transit tracker for Addis Ababa municipal buses',
    description:
      'A community-driven transit map helping daily city commuters forecast arrival intervals and route disruptions across the Anbessa Bus and Light Rail networks through crowd-sourced passenger check-ins.',
    student_name: 'Yohannes Haile',
    cohort: 'Cohort 1',
    category: 'Productivity',
    tech_stack: ['React', 'Leaflet', 'PostgreSQL', 'FastAPI'],
    github_url: 'https://github.com/example/anbessa-track',
    live_url: null,
    status: 'idea',
    likes: 12,
    created_at: '2026-10-26T16:45:00.000Z',
  },
  {
    id: 5,
    title: 'HabeshaRecipes',
    tagline: 'Preserving authentic Ethiopian culinary traditions with metric conversions',
    description:
      'A curated repository of regional culinary recipes from Tigray, Oromia, Amhara, and Sidama, featuring dynamic serving size calculators, spice blend ratios (Berbere, Mitmita), and step-by-step injera fermentation guides.',
    student_name: 'Almaz Kebede',
    cohort: 'Cohort 2',
    category: 'Other',
    tech_stack: ['React', 'Node.js', 'TailwindCSS'],
    github_url: 'https://github.com/example/habesha-recipes',
    live_url: 'https://habesharecipes.app',
    status: 'live',
    likes: 34,
    created_at: '2026-11-01T08:20:00.000Z',
  },
  {
    id: 6,
    title: 'AgriPrice Ethiopia',
    tagline: 'Daily crop price alerts and weather intelligence for smallholder farmers',
    description:
      'A bilingual (Amharic & English) mobile-first platform aggregating teff, coffee, and wheat spot market rates across 12 regional market hubs, combined with satellite rainfall estimates.',
    student_name: 'Henok Tsegaye',
    cohort: 'Cohort 2',
    category: 'Productivity',
    tech_stack: ['Vue', 'Express', 'SQLite', 'Chart.js'],
    github_url: 'https://github.com/example/agri-price-et',
    live_url: null,
    status: 'building',
    likes: 16,
    created_at: '2026-11-03T13:10:00.000Z',
  },
  {
    id: 7,
    title: 'GebetaPlay',
    tagline: 'Multiplayer turn-based Mancala web game with ranked matchmaking',
    description:
      'A digital reimagining of the ancient East African board game Gebeta, featuring real-time multiplayer matchmaking, spectator mode, Amharic trash-talk stickers, and local community tournaments.',
    student_name: 'Martha Assefa',
    cohort: 'Cohort 1',
    category: 'Social',
    tech_stack: ['React', 'WebSockets', 'Node.js', 'Redis'],
    github_url: 'https://github.com/example/gebeta-play',
    live_url: 'https://gebetaplay.com',
    status: 'live',
    likes: 25,
    created_at: '2026-11-06T15:30:00.000Z',
  },
  {
    id: 8,
    title: 'QeneFlow',
    tagline: 'Wax and Gold poetic analysis tool for classical Amharic verse structures',
    description:
      'A computational linguistics exploration workbench providing semantic layering and double-meaning (\'Sem ena Worq\') annotation tools for students studying traditional Ge\'ez and Amharic poetry.',
    student_name: 'Biruk Alemu',
    cohort: 'Cohort 2',
    category: 'Web App',
    tech_stack: ['React', 'Python', 'Flask', 'TypeScript'],
    github_url: 'https://github.com/example/qene-flow',
    live_url: null,
    status: 'building',
    likes: 11,
    created_at: '2026-11-08T10:05:00.000Z',
  },
];

let nextId = 9;

export const VALID_CATEGORIES = [
  'Web App',
  'E-commerce',
  'Education',
  'Health',
  'Social',
  'Productivity',
  'Other',
];

export const VALID_STATUSES = ['idea', 'building', 'live'];

export function validateProjectData(data) {
  const fields = {};

  const title = (data.title || '').trim();
  if (title.length < 3 || title.length > 60) {
    fields.title = 'Title must be between 3 and 60 characters';
  }

  const tagline = (data.tagline || '').trim();
  if (tagline.length < 5 || tagline.length > 100) {
    fields.tagline = 'Tagline must be between 5 and 100 characters';
  }

  const description = (data.description || '').trim();
  if (!description) {
    fields.description = 'Description is required';
  } else if (description.length > 600) {
    fields.description = 'Description must not exceed 600 characters';
  }

  const studentName = (data.student_name || '').trim();
  if (studentName.length < 2 || studentName.length > 60) {
    fields.student_name = 'Your name must be between 2 and 60 characters';
  }

  if (data.student_email && data.student_email.trim()) {
    const email = data.student_email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fields.student_email = 'Please provide a valid email address';
    }
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
    fields.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
  }

  const status = data.status || 'building';
  if (!VALID_STATUSES.includes(status)) {
    fields.status = 'Status must be one of: idea, building, live';
  }

  const githubUrl = (data.github_url || '').trim();
  const githubPattern = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;
  if (!githubUrl || !githubPattern.test(githubUrl)) {
    fields.github_url = 'GitHub URL must look like https://github.com/user/repo';
  }

  const liveUrl = data.live_url ? data.live_url.trim() : '';
  if (status === 'live') {
    if (!liveUrl) {
      fields.live_url = 'A live project requires a live URL';
    } else if (!liveUrl.startsWith('https://')) {
      fields.live_url = 'Live URL must start with https://';
    }
  } else if (liveUrl && !liveUrl.startsWith('https://')) {
    fields.live_url = 'Live URL must start with https://';
  }

  const stack = Array.isArray(data.tech_stack)
    ? data.tech_stack
    : typeof data.tech_stack === 'string'
      ? data.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  if (stack.length === 0) {
    fields.tech_stack = 'Add at least 1 technology tag';
  } else if (stack.length > 8) {
    fields.tech_stack = 'Maximum 8 technology tags allowed';
  } else {
    for (const tag of stack) {
      if (tag.length > 24) {
        fields.tech_stack = `Tag "${tag}" exceeds 24 characters maximum`;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(fields).length === 0,
    fields,
    cleaned: {
      title,
      tagline,
      description,
      student_name: studentName,
      student_email: data.student_email ? data.student_email.trim() : undefined,
      cohort: (data.cohort || 'Cohort 1').trim() || 'Cohort 1',
      category: data.category,
      tech_stack: stack.map((s) => s.trim()),
      github_url: githubUrl,
      live_url: liveUrl || null,
      status,
    },
  };
}

// ==========================================
// EXPORTED API METHODS
// ==========================================

export async function getStats() {
  if (DEMO_MODE) {
    return trackRequest(
      sleep(400).then(() => {
        const total = inMemoryProjects.length;
        const live = inMemoryProjects.filter((p) => p.status === 'live').length;
        const builders = new Set(inMemoryProjects.map((p) => p.student_name.toLowerCase())).size;
        return { total, live, builders };
      })
    );
  }

  return trackRequest(
    fetch(`${BASE}/stats`).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new ApiError(data.error || 'Failed to fetch statistics');
      }
      return res.json();
    })
  );
}

export async function listProjects({ search = '', category = '', status = '', sort = 'newest' } = {}) {
  if (DEMO_MODE) {
    return trackRequest(
      sleep(400).then(() => {
        let results = [...inMemoryProjects];

        const query = (search || '').trim().toLowerCase();
        if (query) {
          results = results.filter((p) => {
            const matchTitle = p.title.toLowerCase().includes(query);
            const matchTagline = p.tagline.toLowerCase().includes(query);
            const matchStudent = p.student_name.toLowerCase().includes(query);
            const matchStack = p.tech_stack.some((tech) => tech.toLowerCase().includes(query));
            return matchTitle || matchTagline || matchStudent || matchStack;
          });
        }

        if (category && category !== 'All') {
          results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        }

        if (status && status !== 'All' && status !== 'all') {
          results = results.filter((p) => p.status.toLowerCase() === status.toLowerCase());
        }

        if (sort === 'popular') {
          results.sort((a, b) => b.likes - a.likes || new Date(b.created_at) - new Date(a.created_at));
        } else {
          // newest
          results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        // Return a fresh clone without any internal fields
        return results.map((p) => ({ ...p, tech_stack: [...p.tech_stack] }));
      })
    );
  }

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'All') params.set('category', category);
  if (status && status !== 'All' && status !== 'all') params.set('status', status);
  if (sort) params.set('sort', sort);

  const url = `${BASE}/projects${params.toString() ? `?${params.toString()}` : ''}`;
  return trackRequest(
    fetch(url).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new ApiError(data.error || 'Failed to list projects');
      }
      return res.json();
    })
  );
}

export async function getProject(id) {
  if (DEMO_MODE) {
    return trackRequest(
      sleep(400).then(() => {
        const found = inMemoryProjects.find((p) => String(p.id) === String(id));
        if (!found) {
          throw new ApiError('Project not found');
        }
        return { ...found, tech_stack: [...found.tech_stack] };
      })
    );
  }

  return trackRequest(
    fetch(`${BASE}/projects/${id}`).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new ApiError(data.error || 'Project not found');
      }
      return res.json();
    })
  );
}

export async function createProject(data) {
  // Pre-validate in both modes to provide instant, consistent feedback
  const { isValid, fields, cleaned } = validateProjectData(data);

  if (DEMO_MODE) {
    return trackRequest(
      sleep(400).then(() => {
        if (!isValid) {
          throw new ApiError('Validation failed', fields);
        }

        const newProject = {
          id: nextId++,
          title: cleaned.title,
          tagline: cleaned.tagline,
          description: cleaned.description,
          student_name: cleaned.student_name,
          cohort: cleaned.cohort,
          category: cleaned.category,
          tech_stack: cleaned.tech_stack,
          github_url: cleaned.github_url,
          live_url: cleaned.live_url,
          status: cleaned.status,
          likes: 0,
          created_at: new Date().toISOString(),
        };

        // Prepend to in-memory store
        inMemoryProjects.unshift(newProject);
        return { ...newProject, tech_stack: [...newProject.tech_stack] };
      })
    );
  }

  if (!isValid) {
    throw new ApiError('Validation failed', fields);
  }

  return trackRequest(
    fetch(`${BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleaned),
    }).then(async (res) => {
      if (!res.ok) {
        const resData = await res.json().catch(() => ({}));
        throw new ApiError(resData.error || 'Failed to create project', resData.fields || {});
      }
      return res.json();
    })
  );
}

export async function likeProject(id) {
  if (DEMO_MODE) {
    return trackRequest(
      sleep(300).then(() => {
        const index = inMemoryProjects.findIndex((p) => String(p.id) === String(id));
        if (index === -1) {
          throw new ApiError('Project not found');
        }
        const updated = {
          ...inMemoryProjects[index],
          likes: inMemoryProjects[index].likes + 1,
        };
        inMemoryProjects[index] = updated;
        return { ...updated, tech_stack: [...updated.tech_stack] };
      })
    );
  }

  return trackRequest(
    fetch(`${BASE}/projects/${id}/like`, {
      method: 'PATCH',
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new ApiError(data.error || 'Failed to like project');
      }
      return res.json();
    })
  );
}
