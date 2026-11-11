import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';
import { validateProjectData } from './validators.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 3.1 Get Overview Statistics
app.get('/stats', async (req, res) => {
  try {
    const sql = `
      SELECT 
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status = 'live' THEN 1 END)::int AS live,
        COUNT(DISTINCT LOWER(TRIM(student_name)))::int AS builders
      FROM projects
    `;
    const { rows } = await query(sql);
    res.json(rows[0] || { total: 0, live: 0, builders: 0 });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// 3.2 List & Filter Projects
app.get('/projects', async (req, res) => {
  try {
    const { search = '', category = '', status = '', sort = 'newest' } = req.query;

    const conditions = [];
    const values = [];

    const queryStr = (search || '').trim();
    if (queryStr) {
      values.push(`%${queryStr}%`);
      const idx = values.length;
      conditions.push(`(
        title ILIKE $${idx} OR
        tagline ILIKE $${idx} OR
        student_name ILIKE $${idx} OR
        EXISTS (SELECT 1 FROM unnest(tech_stack) AS t WHERE t ILIKE $${idx})
      )`);
    }

    if (category && category.toLowerCase() !== 'all') {
      values.push(category);
      conditions.push(`LOWER(category) = LOWER($${values.length})`);
    }

    if (status && status.toLowerCase() !== 'all') {
      values.push(status);
      conditions.push(`LOWER(status) = LOWER($${values.length})`);
    }

    let orderBy = 'created_at DESC';
    if (sort === 'popular') {
      orderBy = 'likes DESC, created_at DESC';
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        id, title, tagline, description, student_name, cohort,
        category, tech_stack, github_url, live_url, status, likes, created_at
      FROM projects
      ${whereClause}
      ORDER BY ${orderBy}
    `;

    const { rows } = await query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error('Error listing projects:', err.message);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// 3.3 Get Single Project by ID
app.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        id, title, tagline, description, student_name, cohort,
        category, tech_stack, github_url, live_url, status, likes, created_at
      FROM projects
      WHERE id = $1
    `;
    const { rows } = await query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching project:', err.message);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// 3.4 Submit a New Project
app.post('/projects', async (req, res) => {
  try {
    const { isValid, fields, cleaned } = validateProjectData(req.body);

    if (!isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        fields,
      });
    }

    const sql = `
      INSERT INTO projects (
        title, tagline, description, student_name, student_email,
        cohort, category, tech_stack, github_url, live_url, status, likes, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, NOW()
      )
      RETURNING id, title, tagline, description, student_name, cohort,
                category, tech_stack, github_url, live_url, status, likes, created_at
    `;

    const values = [
      cleaned.title,
      cleaned.tagline,
      cleaned.description,
      cleaned.student_name,
      cleaned.student_email || null,
      cleaned.cohort,
      cleaned.category,
      cleaned.tech_stack,
      cleaned.github_url,
      cleaned.live_url || null,
      cleaned.status,
    ];

    const { rows } = await query(sql, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating project:', err.message);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// 3.5 Like a Project
app.patch('/projects/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE projects
      SET likes = likes + 1
      WHERE id = $1
      RETURNING id, title, tagline, description, student_name, cohort,
                category, tech_stack, github_url, live_url, status, likes, created_at
    `;
    const { rows } = await query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error liking project:', err.message);
    res.status(500).json({ error: 'Failed to like project' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', service: 'LaunchBoard API', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`LaunchBoard server listening on http://localhost:${PORT}`);
});
