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
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'Mylar, or BoPET (Biaxially-oriented polyethylene terephthalate), is known for its high tensile strength, chemical stability, and most importantly, its gas and aroma barrier properties. This makes it ideal for products that need to stay fresh, such as coffee, dried fruits, and cannabis.', version: 1 }] },
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
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'Child-resistant Mylar bags are designed with specialized locking mechanisms, such as press-to-close zippers or pinch-and-pull openings, that require a certain level of dexterity and strength to open. These are rigorously tested to ensure they meet ASTM D3475 standards.', version: 1 }] },
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
    console.log('Connected to DB');

    // 1. Get IDs
    const userRes = await client.query('SELECT id FROM users LIMIT 1');
    const mediaRes = await client.query('SELECT id FROM media LIMIT 2');
    
    if (userRes.rows.length === 0) throw new Error('No users');
    if (mediaRes.rows.length === 0) throw new Error('No media');

    const authorId = userRes.rows[0].id;
    const img1 = mediaRes.rows[0].id;
    const img2 = mediaRes.rows[1]?.id || img1;

    // 2. Ensure Category
    let catId;
    const checkCat = await client.query("SELECT id FROM categories WHERE title = 'Packaging Guides'");
    if (checkCat.rows.length > 0) {
      catId = checkCat.rows[0].id;
    } else {
      const newCat = await client.query("INSERT INTO categories (title, updated_at, created_at) VALUES ('Packaging Guides', NOW(), NOW()) RETURNING id");
      catId = newCat.rows[0].id;
    }
    console.log('Category ID:', catId);

    // 3. Clear existing posts to avoid slug conflicts if any
    await client.query("DELETE FROM posts_rels");
    await client.query("DELETE FROM posts");

    // 4. Insert Post 1
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
      'ultimate-mylar-bags-guide',
      'published'
    ]);

    // 5. Insert Post 2
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
      'child-resistant-mylar-safety',
      'published'
    ]);

    const p1Id = p1.rows[0].id;
    const p2Id = p2.rows[0].id;

    // 6. Relationships
    await client.query(`INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)`, [p1Id, catId]);
    await client.query(`INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)`, [p2Id, catId]);

    console.log('Successfully seeded 2 blog posts.');
    const check = await client.query('SELECT count(*) FROM posts');
    console.log('COUNT:', check.rows[0].count);

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await client.end();
  }
}

seed();
