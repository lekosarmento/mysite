import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CommentsSection } from '@/components/blog/CommentsSection';
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ShareModal } from '@/components/blog/ShareModal';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post não encontrado — Leko Sarmento' };
  }

  return {
    title: `${post.title} — Leko Sarmento`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: ['Leko Sarmento'],
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: ['/og-image.png'],
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full relative">
      <Navbar />

      <article className="w-full min-h-screen pt-36 pb-20 px-6 md:px-10 bg-bg-primary selection:bg-[#00D4FF] selection:text-black">
        <div className="max-w-[760px] mx-auto">
          
          <Link href="/blog" className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest text-text-muted hover:text-text-primary mb-12 transition-colors">
            <span className="mr-2">←</span> Voltar ao Log
          </Link>
          
          <header className="mb-14 border-b border-border-subtle pb-14">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 w-full">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[2px] text-accent-cyan bg-[rgba(0,212,255,0.05)] px-4 py-2 rounded-full border border-[rgba(0,212,255,0.1)]">
                  {post.category || 'ARTIGO'}
                </span>
                <span className="font-mono text-[12px] uppercase text-text-muted">
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <ShareModal 
                postTitle={post.title} 
                postCategory={post.category || 'ARTIGO'} 
                postExcerpt={post.excerpt || ''} 
                postSlug={slug} 
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-text-primary tracking-tight leading-[1.15] mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Tailwind Typography Injection supporting Light & Dark themes dynamically */}
          <div className="prose dark:prose-invert prose-lg max-w-none 
                          prose-headings:text-text-primary prose-headings:font-medium prose-headings:tracking-tight 
                          prose-p:text-text-secondary prose-p:leading-loose 
                          prose-a:text-accent-cyan hover:prose-a:text-text-primary prose-a:underline-offset-4
                          prose-strong:text-text-primary prose-strong:font-semibold
                          prose-li:text-text-secondary prose-ul:list-disc
                          prose-blockquote:border-l-accent-cyan prose-blockquote:bg-[rgba(0,212,255,0.02)] prose-blockquote:py-1">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          
          <footer className="mt-24 pt-12 border-t border-border-subtle flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase text-text-muted">FIM DA TRANSMISSÃO</span>
              <span className="font-mono text-[11px] text-text-secondary font-medium">Escrito por José Werkley</span>
          </footer>

          {/* Dynamic and persistent feedback log */}
          <CommentsSection slug={slug} />
        </div>
      </article>

      <Footer />
    </main>
  );
}
