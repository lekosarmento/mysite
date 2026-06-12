import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Fase 2: Recebe o Markdown (revisado pelo Humano) e salva de fato no Disco
export async function POST(req: Request) {
  try {
    const { markdown } = await req.json();

    if (!markdown) {
      return NextResponse.json({ error: 'Operação cancelada: Nenhum texto enviado.' }, { status: 400 });
    }

    // Extrai o título do yaml para usar como nome do arquivo gerado
    const titleMatch = markdown.match(/title:\s*"([^"]+)"/);
    const generatedTitle = titleMatch ? titleMatch[1] : `Post-${Date.now()}`;
    const slug = slugify(generatedTitle);

    const contentDir = path.join(process.cwd(), 'src/content/blog');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    const filePath = path.join(contentDir, `${slug}.md`);
    
    // Escreve direto no Hard Drive local
    fs.writeFileSync(filePath, markdown, 'utf8');

    return NextResponse.json({ success: true, slug, title: generatedTitle });
  } catch (error) {
    console.error('Publish Error:', error);
    return NextResponse.json({ error: 'Falha letal ao escrever o arquivo no disco.' }, { status: 500 });
  }
}
