import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

function createPool() {
  const rawUrl = process.env.DATABASE_URL || process.env.database_url;
  if (!rawUrl) {
    console.warn('⚠️ DATABASE_URL is not set. Database operations will fail.');
    return new Pool();
  }

  try {
    const parsed = new URL(rawUrl);
    const decodedPassword = decodeURIComponent(parsed.password);
    const host = parsed.hostname;

    // Supabase direct URLs (db.<ref>.supabase.co) only have IPv6 DNS records.
    // For IPv4 compatibility, route through the Supabase connection pooler in eu-west-1.
    if (host.startsWith('db.') && host.endsWith('.supabase.co')) {
      const projectRef = host.replace(/^db\./, '').replace(/\.supabase\.co$/, '');
      return new Pool({
        host: 'aws-0-eu-west-1.pooler.supabase.com',
        port: 5432,
        user: `postgres.${projectRef}`,
        password: decodedPassword,
        database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'postgres',
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 8000,
      });
    }

    return new Pool({
      connectionString: rawUrl,
      password: decodedPassword,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });
  } catch (err) {
    console.error('Error parsing DATABASE_URL:', err.message);
    return new Pool({
      connectionString: rawUrl,
      ssl: { rejectUnauthorized: false },
    });
  }
}

export const pool = createPool();

export async function query(text, params) {
  return pool.query(text, params);
}

