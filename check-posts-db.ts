import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkPosts() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const posts = await client.query('SELECT id, title FROM posts');
    console.log('Post Count:', posts.rows.length);
    console.table(posts.rows);

    const categories = await client.query('SELECT id, title FROM categories');
    console.log('Category Count:', categories.rows.length);
    console.table(categories.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
checkPosts();
