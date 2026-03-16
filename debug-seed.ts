import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function debugSeed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('1. DB Connected');

    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('posts', 'categories', 'users', 'media')");
    console.log('2. Tables found:', tables.rows.map(r => r.table_name).join(', '));

    console.log('3. Fetching User...');
    const users = await client.query('SELECT id, email FROM users LIMIT 1');
    console.log('   User ID:', users.rows[0]?.id);
    if (!users.rows[0]) throw new Error('No user found');

    console.log('4. Fetching Media...');
    const media = await client.query('SELECT id, url FROM media LIMIT 2');
    console.log('   Media IDs:', media.rows.map(r => r.id).join(', '));
    if (!media.rows[0]) throw new Error('No media found');

    console.log('5. Handling Category...');
    await client.query("INSERT INTO categories (title, updated_at, created_at) VALUES ('Packaging Guides', NOW(), NOW()) ON CONFLICT DO NOTHING");
    const cat = await client.query("SELECT id FROM categories WHERE title = 'Packaging Guides'");
    console.log('   Category ID:', cat.rows[0]?.id);
    if (!cat.rows[0]) throw new Error('Category not found/created');

    console.log('6. Inserting Post 1...');
    try {
      const p1 = await client.query(`
        INSERT INTO posts (title, author_id, hero_image_id, published_at, excerpt, meta_title, meta_description, slug, _status, updated_at, created_at)
        VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING id
      `, [
        'SEO Test Post 1', users.rows[0].id, media.rows[0].id, 
        'Excerpt', 'Meta Title', 'Meta Desc', 'seo-test-1-' + Date.now(), 'published'
      ]);
      console.log('   Post 1 ID:', p1.rows[0].id);
    } catch (e: any) {
      console.error('   FAILED Post 1:', e.message);
      if (e.detail) console.error('   Detail:', e.detail);
    }

    console.log('7. Final count...');
    const count = await client.query('SELECT count(*) FROM posts');
    console.log('   TOTAL POSTS:', count.rows[0].count);

  } catch (err: any) {
    console.error('DIAGNOSTIC CRASH:', err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    await client.end();
  }
}

debugSeed();
