"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  name: string;
  email: string;
  text: string;
  date: string;
}

export function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.comments)) {
          setComments(data.comments);
        }
      })
      .catch((err) => console.error("Erro ao carregar comentários:", err));
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar comentário");

      setComments((prev) => [...prev, data.comment]);
      setName("");
      setEmail("");
      setText("");
      setSuccess(true);
      setShowForm(false);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-20 border-t border-border-subtle pt-16 select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h3 className="text-h3 text-text-primary tracking-tight font-medium">Repercussão da Transmissão</h3>
          <p className="text-[12px] text-text-muted font-mono mt-1 uppercase tracking-[0.5px]">
            {comments.length} {comments.length === 1 ? "opinião registrada" : "opiniões registradas"}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="font-mono text-[11px] uppercase tracking-[1.5px] px-6 py-2.5 rounded-full border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 transition-all duration-[400ms] cursor-pointer"
        >
          {showForm ? "Fechar Painel" : "✨ Expressar Opinião"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 p-6 md:p-8 bg-[var(--color-bg-secondary)] border border-[rgba(0,212,255,0.15)] rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.02)]"
          >
            <h4 className="text-[13px] font-mono uppercase text-accent-cyan tracking-wider mb-6">✦ Nova Contribuição</h4>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase text-text-muted tracking-wider">Seu Nome *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos M."
                    className="w-full bg-[rgba(15,15,15,0.03)] dark:bg-[rgba(255,255,255,0.02)] border border-border-subtle rounded-lg p-3 text-[14px] text-text-primary outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase text-text-muted tracking-wider">Seu E-mail * (não será exibido)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@exemplo.com"
                    className="w-full bg-[rgba(15,15,15,0.03)] dark:bg-[rgba(255,255,255,0.02)] border border-border-subtle rounded-lg p-3 text-[14px] text-text-primary outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase text-text-muted tracking-wider">Sua Reflexão *</label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escreva sua opinião crítica ou reflexão sobre o artigo..."
                  className="w-full bg-[rgba(15,15,15,0.03)] dark:bg-[rgba(255,255,255,0.02)] border border-border-subtle rounded-lg p-4 text-[14px] text-text-primary outline-none focus:border-accent-cyan transition-colors resize-none leading-relaxed"
                />
              </div>

              {error && (
                <div className="font-mono text-[11px] text-accent-warm border border-accent-warm/20 bg-accent-warm/5 px-4 py-2.5 rounded-lg">
                  ⚠ ERRO DO SISTEMA: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto font-mono text-[11px] uppercase tracking-[1.5px] px-8 py-3.5 rounded-lg bg-text-primary text-bg-primary hover:bg-accent-cyan hover:text-black transition-all duration-[400ms] cursor-pointer disabled:opacity-50 text-center font-semibold"
              >
                {loading ? "Processando Transmissão..." : "Transmitir Opinião"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 font-mono text-[11px] text-accent-cyan border border-accent-cyan/20 bg-accent-cyan/5 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            ✓ CONEXÃO BEM-SUCEDIDA: Sua opinião foi registrada com sucesso e já está integrada no log público!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 md:p-6 bg-[rgba(15,15,15,0.01)] dark:bg-[rgba(255,255,255,0.01)] border border-border-subtle rounded-xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent-cyan/10 flex items-center justify-center font-mono text-[11px] font-semibold text-accent-cyan border border-accent-cyan/20 select-none">
                  {comment.name.substring(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[14px] text-text-primary font-medium">{comment.name}</span>
                  <span className="font-mono text-[9px] uppercase text-text-muted mt-0.5 tracking-wider">
                    {new Date(comment.date).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(comment.date).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[14px] text-text-secondary leading-relaxed pl-11 whitespace-pre-line">
              {comment.text}
            </p>
          </motion.div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10 border border-dashed border-border-subtle rounded-2xl">
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-[1px]">Nenhuma transmissão registrada neste log ainda.</p>
            <p className="text-[12px] text-text-secondary mt-2">Seja o primeiro a expressar sua opinião sobre este dilema.</p>
          </div>
        )}
      </div>
    </section>
  );
}
