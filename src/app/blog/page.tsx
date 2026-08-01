import Link from 'next/link';
import { getAllPosts, BlogPost } from '@/lib/blog';
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-bg-secondary)] border border-border-subtle transition-all duration-500 hover:border-text-primary hover:-translate-y-2 dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(15,15,15,0.05)] h-full flex flex-col">
        {/* Holographic Header Card Block */}
        <div className="w-full h-48 bg-[#0F0F0F] relative overflow-hidden flex items-center justify-center border-b border-border-subtle">
          <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(181,103,63,0.07)] to-[rgba(139,92,246,0.05)] mix-blend-overlay"></div>
          <span className="font-mono text-[90px] text-[rgba(255,255,255,0.02)] font-bold tracking-tighter absolute -right-4 -bottom-8 select-none">LEKO</span>
        </div>
        
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-accent-cyan bg-[rgba(181,103,63,0.07)] px-3 py-1 rounded-full border border-[rgba(181,103,63,0.18)]">
              {post.category || 'ARTIGO'}
            </span>
            <span className="font-mono text-[10px] uppercase text-text-muted">
              {new Date(post.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </span>
          </div>
          <h2 className="text-xl font-medium text-text-primary mb-3 group-hover:text-accent-cyan transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-[14px] text-text-secondary leading-relaxed line-clamp-3 mt-auto">
            {post.excerpt || post.content.substring(0, 120) + '...'}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full relative">
      <Navbar />

      <div className="w-full min-h-screen pt-36 pb-24 px-6 md:px-10 bg-bg-primary">
        <div className="max-w-[1240px] mx-auto">
          <div className="mb-20">
            <h1 className="font-light text-5xl md:text-7xl tracking-tight mb-4 text-text-primary">
              Log de <span className="italic text-accent-cyan">Transmissão</span>
            </h1>
            <p className="font-mono text-[12px] uppercase tracking-[2px] text-text-muted">
              {posts.length} TRANSMISSÕES DECODIFICADAS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
            
            {posts.length === 0 && (
               <div className="col-span-3 p-12 border border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-4xl mb-4">📡</span>
                  <p className="text-body text-text-secondary mb-4">O banco de dados local está vazio. Nenhuma transmissão injetada ainda.</p>
                  <Link href="/admin" className="font-mono text-[12px] uppercase text-accent-cyan tracking-widest border-b border-accent-cyan pb-1 hover:text-text-primary">
                    Acessar Painel de Automação
                  </Link>
               </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
