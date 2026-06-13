import pg from 'pg';
import { readFileSync } from 'fs';

const password = 'Mietz123@#';
const host = 'db.ojeqrllhjozglemavttr.supabase.co';

const config = {
  user: 'postgres',
  password: password,
  host: host,
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
};

async function main() {
  console.log('Connecting to Supabase database...');
  const client = new pg.Client(config);
  
  try {
    await client.connect();
    console.log('Connected!');

    // Run schema
    const schema = readFileSync('/tmp/supabase-schema.sql', 'utf8');
    console.log('Running schema...');
    await client.query(schema);
    console.log('Schema applied successfully!');

    // Run seed data
    const seed = readFileSync('/tmp/supabase-seed.sql', 'utf8');
    console.log('Running seed data...');
    await client.query(seed);
    console.log('Seed data inserted successfully!');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    console.log('Done.');
  }
}

main();
