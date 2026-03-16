import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const LEXICAL_1 = JSON.stringify({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'In the competitive world of retail, packaging is more than just a container—it\'s a brand statement. Custom Mylar bags have emerged as the gold standard for businesses looking to combine functionality with premium aesthetics. But what makes them so special?', version: 1 }] },
    ]
  }
});

const LEXICAL_2 = JSON.stringify({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'As regulations around product safety tighten, especially in industries like pharmaceuticals and legalized cannabis, child-resistant (CR) packaging has moved from optional to mandatory. But safety doesn\'t have to mean boring.', version: 1 }] },
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
    console.log('--- CONNECTED ---');

    // 1. Find a valid user
    const users = await client.query('SELECT id FROM users LIMIT 1');
    if (users.rows.length === 0) throw new Error('No users found to set as author');
    const authorId = users.rows[0].id;
    console.log('Using Author ID:', authorId);

    // 2. Find valid media
    const media = await client.query('SELECT id FROM media LIMIT 2');
    if (media.rows.length === 0) throw new Error('No media found for hero images');
    const img1 = media.rows[0].id;
    const img2 = media.rows[1] ? media.rows[1].id : img1;
    console.log('Using Image IDs:', img1, img2);

    // 3. Find/Create Category
    await client.query(`INSERT INTO categories (title, updated_at, created_at) VALUES ('Packaging Guides', NOW(), NOW()) ON CONFLICT DO NOTHING;`);
    const catRes = await client.query(`SELECT id FROM categories WHERE title = 'Packaging Guides'`);
    const catId = catRes.rows[0].id;
    console.log('Using Category ID:', catId);

    // 4. Insert Posts
    await client.query('BEGIN');

    console.log('Inserting Post 1...');
    const p1 = await client.query(`
      INSERT INTO posts (title, author_id, hero_image_id, published_at, excerpt, content, meta_title, meta_description, slug, _status, updated_at, created_at)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING id
    `, [
      'The Ultimate Guide to Custom Mylar Bags: Why Your Brand Needs High-Barrier Packaging',
      authorId, img1, 
      'Discover why custom mylar bags are the industry standard for food, cannabis, and retail packaging.',
      LEXICAL_1,
      'Ultimate Guide to Custom Mylar Bags | Online Packaging Store',
      'Learn everything about custom mylar bags, barrier technology, and why your brand needs premium printed packaging.',
      'ultimate-mylar-bags-guide-v2',
      'published'
    ]);

    console.log('Inserting Post 2...');
    const p2 = await client.query(`
      INSERT INTO posts (title, author_id, hero_image_id, published_at, excerpt, content, meta_title, meta_description, slug, _status, updated_at, created_at)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING id
    `, [
      'Why Child-Resistant Mylar Bags are Essential for Your Brand Safety',
      authorId, img2,
      'Safety meets style. Explore the importance of child-resistant packaging.',
      LEXICAL_2,
      'Essential Child-Resistant Mylar Bags | Online Packaging Store',
      'Discover the importance of compliant, child-resistant Mylar bag packaging.',
      'child-resistant-mylar-safety-v2',
      'published'
    ]);

    const p1Id = p1.rows[0].id;
    const p2Id = p2.rows[0].id;

    console.log('Setting relationships...');
    await client.query(`INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)`, [p1Id, catId]);
    await client.query(`INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)`, [p2Id, catId]);

    await client.query('COMMIT');
    console.log('--- SEEDING COMPLETE ---');

    const check = await client.query('SELECT count(*) FROM posts');
    console.log('POSTS IN DB:', check.rows[0].count);

  } catch (err) {
    console.error('CRITICAL ERROR DURING SEEDING:', err);
    try { await client.query('ROLLBACK'); } catch (e) {}
  } finally {
    await client.end();
  }
}

seed();
