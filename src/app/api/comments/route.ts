import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to sanitize slug to prevent path traversal
function sanitizeSlug(slug: string) {
  return slug.replace(/[^a-z0-9_-]/gi, '');
}

// Unique bucket namespace for Leko's comments to ensure high-performance persistent storage
const PROD_DB_URL = "https://kvdb.io/Jc9qQW8Wq4wqlKeko/comments_";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = sanitizeSlug(searchParams.get('slug') || '');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let comments: any[] = [];

    // 1. Local development: read from local JSON file
    if (process.env.NODE_ENV === 'development') {
      const filePath = path.join(process.cwd(), 'src/content/comments', `${slug}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        comments = JSON.parse(fileContent);
      }
    } else {
      // 2. Production: read from persistent kvdb.io
      try {
        const res = await fetch(`${PROD_DB_URL}${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          if (text) {
            comments = JSON.parse(text);
          }
        }
      } catch (err) {
        console.error("Error reading production comments:", err);
      }
    }

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error in GET /api/comments:', error);
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { slug, name, email, text } = await req.json();

    if (!slug || !name || !email || !text) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    // Validate email structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    const cleanSlug = sanitizeSlug(slug);
    const newComment = {
      id: `comment_${Date.now()}`,
      name: name.substring(0, 80).trim(),
      email: email.toLowerCase().trim(),
      text: text.substring(0, 1000).trim(),
      date: new Date().toISOString(),
    };

    let comments: any[] = [];

    // 1. Local development: save to local JSON file
    if (process.env.NODE_ENV === 'development') {
      const contentDir = path.join(process.cwd(), 'src/content/comments');
      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
      }

      const filePath = path.join(contentDir, `${cleanSlug}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        comments = JSON.parse(fileContent);
      }

      comments.push(newComment);
      fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');
    } else {
      // 2. Production: save to persistent kvdb.io
      try {
        const getRes = await fetch(`${PROD_DB_URL}${cleanSlug}`, { cache: 'no-store' });
        if (getRes.ok) {
          const currentText = await getRes.text();
          if (currentText) {
            comments = JSON.parse(currentText);
          }
        }
      } catch (err) {
        console.error("Error reading production comments during write:", err);
      }

      comments.push(newComment);

      // Save back to kvdb.io using a simple fetch POST
      const putRes = await fetch(`${PROD_DB_URL}${cleanSlug}`, {
        method: 'POST',
        body: JSON.stringify(comments),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!putRes.ok) {
        throw new Error('Failed to save to production comments database');
      }
    }

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar comentário.' }, { status: 500 });
  }
}
