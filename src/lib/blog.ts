import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
};

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const fileNames = fs.readdirSync(contentDirectory);
  
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        category: data.category || 'Geral',
        excerpt: data.excerpt || '',
        content,
      };
    });

  return allPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      category: data.category || 'Geral',
      excerpt: data.excerpt || '',
      content,
    };
  } catch (e) {
    console.error("Error reading post:", e);
    return null;
  }
}
