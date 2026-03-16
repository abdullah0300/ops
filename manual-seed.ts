import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function finalSeed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected');

    const uid = 1;
    const mid1 = 63;
    const mid2 = 60;
    const cid = 10;

    // 1. Ensure Category with ID 10
    await client.query("DELETE FROM categories WHERE id = 10 OR title = 'Packaging Guides'");
    await client.query("INSERT INTO categories (id, title, updated_at, created_at) VALUES (10, 'Packaging Guides', NOW(), NOW())");

    // 2. Clear Posts
    await client.query("DELETE FROM posts_rels");
    await client.query("DELETE FROM posts");

    // 3. Post 1
    const p1 = await client.query(`
      INSERT INTO posts (id, title, slug, _status, author_id, hero_image_id, published_at, updated_at, created_at, excerpt, content, meta_title, meta_description)
      VALUES (1, 'The Ultimate Guide to Custom Mylar Bags: Performance & Branding', 'ultimate-mylar-guide', 'published', $1, $2, NOW(), NOW(), NOW(), $3, $4, $5, $6)
      RETURNING id
    `, [uid, mid1, 'Discover why high-barrier Mylar bags are the industry standard.', '{}', 'Mylar Guide | Online Packaging Store', 'Mylar guide']);

    // 4. Post 2
    const p2 = await client.query(`
      INSERT INTO posts (id, title, slug, _status, author_id, hero_image_id, published_at, updated_at, created_at, excerpt, content, meta_title, meta_description)
      VALUES (2, 'Compliance & Safety: Why Child-Resistant Mylar Bags Matter', 'cr-mylar-safety', 'published', $1, $2, NOW(), NOW(), NOW(), $3, $4, $5, $6)
      RETURNING id
    `, [uid, mid2, 'Safety meets premium design with ASTM-compliant packaging.', '{}', 'Safety & Mylar | Online Packaging Store', 'Safety guide']);

    // 5. Rel
    await client.query("INSERT INTO posts_rels (parent_id, path, categories_id) VALUES (1, 'categories', 10)");
    await client.query("INSERT INTO posts_rels (parent_id, path, categories_id) VALUES (2, 'categories', 10)");

    console.log('SUCCESS');

  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await client.end();
  }
}

finalSeed();
