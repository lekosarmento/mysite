"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { NewsItem } from '@/lib/news';

export function AdminClient({ news }: { news: NewsItem[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loadingCustom, setLoadingCustom] = useState(false);
  
  // States of the Draft UI
  const [draftContent, setDraftContent] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Calls the DRAfter (Fase 1)
  const handleGenerateNews = async (item: NewsItem) => {
    setLoadingId(item.id);
    try {
      const res = await fetch('/api/admin/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsTitle: item.title,
          newsSnippet: item.contentSnippet,
          newsSource: item.source
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setDraftContent(data.draft);
      window.scrollTo(0, 0); // Sobe pro topo para o Leko revisar
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleGenerateCustom = async () => {
    if (!customPrompt) return;
    setLoadingCustom(true);
    try {
      const res = await fetch('/api/admin/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customPrompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setDraftContent(data.draft);
      setCustomPrompt("");
      window.scrollTo(0, 0);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setLoadingCustom(false);
    }
  };

  // Fase 2: Publicador Final
  const handlePublish = async () => {
    if (!draftContent) return;
    setIsPublishing(true);
    
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: draftContent })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      alert(`✓ SUCESSO ABSOLUTO!\nArtigo "${data.title}" publicado e salvo puramente em src/content/blog/${data.slug}.md!\n\nEle já está ao vivo no Blog.`);
      setDraftContent(null);
    } catch (err: any) {
      alert(`Erro no Publish Final: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  }

  // --- RENDERING LAYER --- //
  
  // Se existe um rascunho na memória, exibe O MODO DE REVISÃO (Human-in-the-loop)
  if (draftContent !== null) {
      return (
        <div className="max-w-[1000px] mx-auto animate-in fade-in zoom-in-95 duration-500">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-h2 text-accent-cyan">Revisão Editorial Leko</h2>
              <Button variant="ghost" onClick={() => setDraftContent(null)}>
                 ← Descartar Rascunho
              </Button>
           </div>
           
           <p className="text-text-secondary mb-6 leading-relaxed">
             A Inteligência Artificial redigiu o artigo abaixo em Markdown nativo. Você tem o controle final. Edite qualquer parágrafo, mude o título ou altere o resumo. Quando estiver satisfeito, aperte Confirmar. O código salvará isso no disco do seu repositório.
           </p>
           
           <textarea 
             autoFocus
             value={draftContent}
             onChange={e => setDraftContent(e.target.value)}
             className="w-full h-[600px] bg-[#0A0A0A] border border-border-hover rounded-xl p-6 text-[15px] font-mono text-text-primary outline-none focus:border-accent-cyan transition-colors mb-8 resize-y shadow-inner leading-loose"
           />
           
           <div className="flex gap-4 justify-end">
              <Button 
                variant="fill" 
                className="w-full md:w-auto px-12 !py-4 text-lg bg-white text-black hover:bg-accent-cyan transition-colors"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? "Escrevendo Arquivo Local..." : "✓ CONFIRMAR E PUBLICAR NO SITE"}
              </Button>
           </div>
        </div>
      )
  }

  // Se não há rascunho, exibe o Painel Normal de Notícias
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <h2 className="text-h3 border-b border-border-subtle pb-6 text-text-primary">Global AI Radar (RSS)</h2>
        <div className="flex flex-col gap-6">
          {news.map(item => (
            <div key={item.id} className="p-6 bg-[var(--color-bg-secondary)] border border-border-subtle rounded-xl flex flex-col items-start gap-4 hover:border-text-primary transition-colors">
              <div>
                <span className="font-mono text-[10px] uppercase text-accent-cyan tracking-wider">{item.source} • {new Date(item.pubDate).toLocaleDateString()}</span>
                <h3 className="text-h4 mt-2 mb-2 text-text-primary">{item.title}</h3>
                <p className="text-[14px] text-text-muted line-clamp-3">{item.contentSnippet}</p>
              </div>
              <Button 
                onClick={() => handleGenerateNews(item)}
                disabled={loadingId !== null}
                variant="ghost"
                className="!text-[12px] !px-4 !py-2 mt-2"
              >
                {loadingId === item.id ? "Analisando e Redigindo..." : "✨ Gerar Artigo Leko sobre isso"}
              </Button>
            </div>
          ))}
          {news.length === 0 && (
             <p className="text-text-muted">Procurando no mar da internet... Nenhuma notícia mapeada ainda.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 sticky top-32">
        <div className="p-6 bg-[#000] border border-[rgba(0,212,255,0.3)] rounded-2xl shadow-[0_0_80px_rgba(0,212,255,0.05)]">
          <h2 className="text-[13px] font-mono uppercase text-[#00D4FF] tracking-wider mb-4">✦ Roteirização Manual</h2>
          <p className="text-[14px] text-text-secondary mb-6 leading-relaxed">
            Teve um insight de engenharia que não está nas notícias agressivas de hoje? Despeje qualquer ideia aqui e a IA converte num Markdown oficial formatado.
          </p>
          <textarea 
            rows={5}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ex: Como a curadoria humana em Festivais está sendo substituída por agentes preditivos de dados..."
            className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg p-5 text-[14px] text-text-primary outline-none focus:border-[#00D4FF] transition-colors mb-6 resize-none"
          />
          <Button 
            variant="fill" 
            className="w-full justify-center !bg-[#00D4FF] !text-black !py-4 hover:scale-[1.02]"
            onClick={handleGenerateCustom}
            disabled={loadingCustom || !customPrompt}
          >
            {loadingCustom ? "Compilando Sistema..." : "Roteirizar Insight Direto"}
          </Button>
        </div>
      </div>
    </div>
  );
}
