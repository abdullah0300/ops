import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const LOG_FILE = 'hyper_debug.log';
function log(msg: string) {
  console.log(msg);
  fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function hyperDebug() {
  if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);
  log('STARTING HYPER DEBUG');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    log('Attempting connect...');
    await client.connect();
    log('CONNECTED');

    log('Querying User...');
    const user = await client.query('SELECT id FROM users LIMIT 1');
    log('User found: ' + (user.rows[0]?.id || 'NONE'));

    log('Querying Media...');
    const media = await client.query('SELECT id FROM media LIMIT 1');
    log('Media found: ' + (media.rows[0]?.id || 'NONE'));

    log('Attempting Category DELETE...');
    await client.query("DELETE FROM categories WHERE title = 'Packaging Guides'");
    log('Category deleted (if existed)');

    log('Attempting Category INSERT...');
    const newCat = await client.query("INSERT INTO categories (title, updated_at, created_at) VALUES ('Packaging Guides', NOW(), NOW()) RETURNING id");
    log('Category inserted: ' + newCat.rows[0].id);

    log('Attempting Posts DELETE...');
    await client.query("DELETE FROM posts_rels");
    await client.query("DELETE FROM posts");
    log('Posts cleared');

    log('Attempting Post 1 INSERT...');
    const p1 = await client.query(`
      INSERT INTO posts (title, author_id, hero_image_id, published_at, excerpt, meta_title, meta_description, slug, _status, updated_at, created_at)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING id
    `, ['Test title', user.rows[0].id, media.rows[0].id, 'Excerpt', 'Meta Title', 'Meta Desc', 'test-slug-' + Date.now(), 'published']);
    log('Post 1 inserted: ' + p1.rows[0].id);

    log('FINISHED SUCCESSFULLY');
  } catch (err: any) {
    log('CRITICAL ERROR: ' + err.message);
    if (err.detail) log('DETAIL: ' + err.detail);
    if (err.stack) log('STACK: ' + err.stack);
  } finally {
    await client.end();
    log('CLIENT CLOSED');
  }
}

hyperDebug();
