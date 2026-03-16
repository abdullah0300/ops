import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const LEXICAL_1 = JSON.stringify({
  root: {
    type: 'root',
    children: [
      { type: 'paragraph', children: [{ type: 'text', text: 'In the competitive world of retail, packaging is more than just a container—it\'s a brand statement. Custom Mylar bags have emerged as the gold standard for businesses looking to combine functionality with premium aesthetics. But what makes them so special?' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Mylar, or BoPET (Biaxially-oriented polyethylene terephthalate), is known for its high tensile strength, chemical stability, and most importantly, its gas and aroma barrier properties. This makes it ideal for products that need to stay fresh, such as coffee, dried fruits, and cannabis.' }] },
    ]
  }
});

const LEXICAL_2 = JSON.stringify({
  root: {
    type: 'root',
    children: [
      { type: 'paragraph', children: [{ type: 'text', text: 'As regulations around product safety tighten, especially in industries like pharmaceuticals and legalized cannabis, child-resistant (CR) packaging has moved from optional to mandatory. But safety doesn\'t have to mean boring.' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Child-resistant Mylar bags are designed with specialized locking mechanisms, such as press-to-close zippers or pinch-and-pull openings, that require a certain level of dexterity and strength to open. These are rigorously tested to ensure they meet ASTM D3475 standards.' }] },
    ]
  }
});

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected');

    // 1. Get IDs
    const user = await client.query('SELECT id FROM users LIMIT 1');
    const media_mylar = await client.query("SELECT id FROM media WHERE url LIKE '%mylar%' LIMIT 1");
    const media_cr = await client.query("SELECT id FROM media WHERE url LIKE '%child%' LIMIT 1");
    
    const uid = user.rows[0].id;
    const mid1 = media_mylar.rows[0]?.id || 1;
    const mid2 = media_cr.rows[0]?.id || mid1;

    // 2. Category
    await client.query("INSERT INTO categories (title, updated_at, created_at) VALUES ('Packaging Guides', NOW(), NOW()) ON CONFLICT DO NOTHING");
    const cat = await client.query("SELECT id FROM categories WHERE title = 'Packaging Guides'");
    const cid = cat.rows[0].id;

    // 3. Delete old ones
    await client.query("DELETE FROM posts_rels");
    await client.query("DELETE FROM posts");

    // 4. Insert Post 1
    console.log('Inserting Post 1...');
    const p1 = await client.query(`
      INSERT INTO posts (
        title, slug, _status, author_id, hero_image_id, 
        published_at, updated_at, created_at,
        excerpt, content, meta_title, meta_description
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), $6, $7, $8, $9)
      RETURNING id
    `, [
      'The Ultimate Guide to Custom Mylar Bags: Performance & Branding',
      'ultimate-mylar-bags-guide-2026',
      'published', uid, mid1,
      'Discover why high-barrier Mylar bags are the industry standard for premium product protection.',
      LEXICAL_1,
      'Ultimate Guide to Custom Mylar Bags | Online Packaging Store',
      'Learn about Mylar barrier technology and premium printing for your brand.'
    ]);

    // 5. Insert Post 2
    console.log('Inserting Post 2...');
    const p2 = await client.query(`
      INSERT INTO posts (
        title, slug, _status, author_id, hero_image_id, 
        published_at, updated_at, created_at,
        excerpt, content, meta_title, meta_description
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), $6, $7, $8, $9)
      RETURNING id
    `, [
      'Compliance & Safety: Why Child-Resistant Mylar Bags Matter',
      'child-resistant-mylar-safety-2026',
      'published', uid, mid2,
      'Safety meets premium design. Explore the benefits of ASTM-compliant child-resistant packaging.',
      LEXICAL_2,
      'Child-Resistant Mylar Bags & Safety | Online Packaging Store',
      'Discover compliant, secure, and beautiful child-resistant Mylar packaging solutions.'
    ]);

    // 6. Relationships
    const p1id = p1.rows[0].id;
    const p2id = p2.rows[0].id;
    await client.query("INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)", [p1id, cid]);
    await client.query("INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)", [p2id, cid]);

    console.log('SUCCESS: Seeded 2 Mylar blog posts.');

  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await client.end();
  }
}

seed();
