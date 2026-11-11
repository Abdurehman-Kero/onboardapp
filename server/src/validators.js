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

