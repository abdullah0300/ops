import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function freshSeed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected');

    const user = await client.query('SELECT id FROM users LIMIT 1');
    const media = await client.query('SELECT id FROM media LIMIT 1');
    if (!user.rows[0] || !media.rows[0]) throw new Error('Missing user or media');

    const uid = user.rows[0].id;
    const mid = media.rows[0].id;
    const ts = Date.now();

    console.log('Inserting post...');
    const res = await client.query(`
      INSERT INTO posts (
        title, slug, _status, author_id, hero_image_id, 
        published_at, updated_at, created_at,
        excerpt, meta_title, meta_description
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), $6, $7, $8)
      RETURNING id
    `, [
      'Fresh Mylar Bag Insights ' + ts,
      'mylar-insights-' + ts,
      'published',
      uid,
      mid,
      'Freshly seeded excerpt for mylar bag enthusiasts.',
      'Mylar Bag Insights | Online Packaging Store',
      'The best source for mylar bag printing news.'
    ]);

    console.log('SUCCESS: Post ID ' + res.rows[0].id);

  } catch (err: any) {
    console.error('ERROR:', err.message);
    if (err.detail) console.error('DETAIL:', err.detail);
  } finally {
    await client.end();
  }
}

freshSeed();
