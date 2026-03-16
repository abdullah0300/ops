import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const LEXICAL_1 = JSON.stringify({
  root: {
    type: 'root',
    children: [
      { type: 'paragraph', children: [{ type: 'text', text: 'In the competitive world of retail, packaging is more than just a container—it\'s a brand statement. Custom Mylar bags have emerged as the gold standard for businesses looking to combine functionality with premium aesthetics. But what makes them so special?' }] },
    ]
  }
});

const LEXICAL_2 = JSON.stringify({
  root: {
    type: 'root',
    children: [
      { type: 'paragraph', children: [{ type: 'text', text: 'Safety meets premium design with ASTM-compliant child-resistant packaging. Discover how Online Packaging Store provides the best secure and beautiful Mylar bags.' }] },
    ]
  }
});

async function definitiveSeed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected');

    // Clean slates
    await client.query("DELETE FROM posts_rels");
    await client.query("DELETE FROM posts");
    await client.query("DELETE FROM categories WHERE title = 'Packaging Guides'");

    // 1. Category
    const cat = await client.query("INSERT INTO categories (title, updated_at, created_at) VALUES ('Packaging Guides', NOW(), NOW()) RETURNING id");
    const cid = cat.rows[0].id;

    // 2. Post 1
    const p1 = await client.query(`
      INSERT INTO posts (
        title, slug, _status, author_id, hero_image_id, 
        published_at, updated_at, created_at,
        excerpt, content, meta_title, meta_description
      ) VALUES ($1, $2, $3, 1, 63, NOW(), NOW(), NOW(), $4, $5, $6, $7)
      RETURNING id
    `, [
      'The Ultimate Guide to Custom Mylar Bags: Performance & Branding',
      'ultimate-mylar-bags-guide',
      'published',
      'Discover why high-barrier Mylar bags are the industry standard for premium product protection.',
      LEXICAL_1,
      'Ultimate Guide to Custom Mylar Bags | Online Packaging Store',
      'Learn about Mylar barrier technology and premium printing.'
    ]);

    // 3. Post 2
    const p2 = await client.query(`
      INSERT INTO posts (
        title, slug, _status, author_id, hero_image_id, 
        published_at, updated_at, created_at,
        excerpt, content, meta_title, meta_description
      ) VALUES ($1, $2, $3, 1, 60, NOW(), NOW(), NOW(), $4, $5, $6, $7)
      RETURNING id
    `, [
      'Compliance & Safety: Why Child-Resistant Mylar Bags Matter',
      'child-resistant-mylar-bags',
      'published',
      'Safety meets premium design with ASTM-compliant child-resistant packaging.',
      LEXICAL_2,
      'Child-Resistant Mylar Bags & Safety | Online Packaging Store',
      'Discover compliant, secure, and beautiful child-resistant Mylar packaging.'
    ]);

    const p1id = p1.rows[0].id;
    const p2id = p2.rows[0].id;

    // 4. Link Categories
    await client.query("INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)", [p1id, cid]);
    await client.query("INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)", [p2id, cid]);

    console.log('SUCCESS: Seeded 2 definitive posts.');

  } catch (err: any) {
    console.error('ERROR:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
  } finally {
    await client.end();
  }
}

definitiveSeed();
