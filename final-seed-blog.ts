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
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'When you opt for custom printing on your Mylar bags, you\'re investing in high-resolution, full-bleed graphics that can capture your brand\'s essence. From matte finishes to spot UV and metallic effects, the possibilities are endless.', version: 1 }] },
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'At Online Packaging Store, we specialize in helping brands transition from generic packaging to world-class custom printed Mylar bags. Our direct-print technology ensures vibrant colors and durable finishes that won\'t peel or fade.', version: 1 }] },
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'Whether you need stand-up pouches, flat bags, or custom-shaped packaging, understanding the technical specifications of your Mylar material is crucial. Barrier layers like aluminum foil or EVOH can be added to provide even higher protection against oxygen and moisture.', version: 1 }] }
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
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'At Online Packaging Store, we believe that compliance should never compromise your brand\'s visual appeal. Our CR Mylar bags are fully customizable, allowing you to incorporate safety features seamlessly into your design.', version: 1 }] },
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'Beyond compliance, using child-resistant packaging sends a strong message to your customers: you care about their safety and the safety of their families. This trust is foundational for long-term brand loyalty.', version: 1 }] },
      { type: 'paragraph', format: 'start', indent: 0, version: 1, children: [{ type: 'text', text: 'Choosing the right CR packaging partner is key. You need a supplier who understands the nuances of local regulations and can provide the necessary certification for your packaging. We pride ourselves on being the world leader in both safety and style for premium Mylar bags.', version: 1 }] }
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
    console.log('Connected to database.');

    // Start Transaction
    await client.query('BEGIN');

    // 1. Create Category
    console.log('Inserting category...');
    await client.query(`INSERT INTO categories (title, updated_at, created_at) VALUES ('Packaging Guides', NOW(), NOW()) ON CONFLICT DO NOTHING;`);
    const catRes = await client.query(`SELECT id FROM categories WHERE title = 'Packaging Guides'`);
    if (catRes.rows.length === 0) throw new Error('Failed to create category');
    const catId = catRes.rows[0].id;
    console.log('Category ID:', catId);

    // 2. Insert Post 1
    console.log('Inserting Post 1...');
    const post1 = await client.query(`
      INSERT INTO posts (title, author_id, hero_image_id, published_at, excerpt, content, meta_title, meta_description, slug, _status, updated_at, created_at)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id
    `, [
      'The Ultimate Guide to Custom Mylar Bags: Why Your Brand Needs High-Barrier Packaging',
      1, 63, 
      'Discover why custom mylar bags are the industry standard for food, cannabis, and retail packaging. Learn about barrier technology, custom printing, and brand elevation.',
      LEXICAL_1,
      'Ultimate Guide to Custom Mylar Bags | Online Packaging Store',
      'Learn everything about custom mylar bags, barrier technology, and why your brand needs premium printed packaging.',
      'ultimate-mylar-bags-guide',
      'published'
    ]);
    const p1Id = post1.rows[0].id;
    console.log('Post 1 ID:', p1Id);

    // 3. Insert Post 2
    console.log('Inserting Post 2...');
    const post2 = await client.query(`
      INSERT INTO posts (title, author_id, hero_image_id, published_at, excerpt, content, meta_title, meta_description, slug, _status, updated_at, created_at)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id
    `, [
      'Why Child-Resistant Mylar Bags are Essential for Your Brand Safety',
      1, 60,
      'Safety meets style. Explore the importance of child-resistant packaging and how Online Packaging Store leads the way in compliant, beautiful Mylar bags.',
      LEXICAL_2,
      'Essential Child-Resistant Mylar Bags | Online Packaging Store',
      'Discover the importance of compliant, child-resistant Mylar bag packaging for your brand safety and customer trust.',
      'child-resistant-mylar-safety',
      'published'
    ]);
    const p2Id = post2.rows[0].id;
    console.log('Post 2 ID:', p2Id);

    // 4. Relationships
    console.log('Setting relationships...');
    await client.query(`INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)`, [p1Id, catId]);
    await client.query(`INSERT INTO posts_rels (parent_id, path, categories_id) VALUES ($1, 'categories', $2)`, [p2Id, catId]);

    // Commit Transaction
    await client.query('COMMIT');
    console.log('COMMITTED SUCCESS.');

    // FINAL CHECK
    const finalCheck = await client.query('SELECT count(*) FROM posts');
    console.log('TOTAL POSTS NOW:', finalCheck.rows[0].count);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
