"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Linkedin, Instagram, Copy, Download, X, Check } from "lucide-react";

interface ShareModalProps {
  postTitle: string;
  postCategory: string;
  postExcerpt: string;
  postSlug: string;
}

export function ShareModal({ postTitle, postCategory, postExcerpt, postSlug }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const postUrl = typeof window !== "undefined" ? `${window.location.origin}/blog/${postSlug}` : "";

  // Dedicated LinkedIn Copy text
  const linkedinCopyText = `Acabei de ler uma reflexão provocativa no blog do José Werkley sobre "${postTitle}".

Um dilema real sobre soberania cognitiva e o avanço dos monopólios de IA de fronteira no mercado de infraestrutura global. Vale a leitura e a reflexão crítica.

Confira o link completo aqui: ${postUrl}

#InteligenciaArtificial #Tecnologia #SoberaniaCognitiva #CTO`;

  const copyToClipboard = (text: string, isLink = false) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  // Helper to wrap text on Canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
  };

  // Canvas Image Generation with customized, transparent tech illustrations
  const generateImage = (type: "linkedin" | "story" | "feed") => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Define dimensions based on sharing requirements
    let width = 1200;
    let height = 628;

    if (type === "story") {
      width = 1080;
      height = 1920;
    } else if (type === "feed") {
      width = 1080;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    // Helper to draw concentric tech radar rings
    const drawRadar = (cx: number, cy: number, maxR: number) => {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 124, 163, 0.05)";
      ctx.lineWidth = 1;
      for (let r = 80; r <= maxR; r += 120) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.setLineDash([4, 12]);
        ctx.beginPath();
        ctx.arc(cx, cy, r + 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    };

    // Helper to draw procedurally generated neural networks
    const drawNeuralNetwork = (cx: number, cy: number, radius: number, nodeCount: number) => {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 124, 163, 0.05)";
      ctx.fillStyle = "rgba(0, 124, 163, 0.07)";
      ctx.lineWidth = 1;

      const nodes: { x: number; y: number; size: number }[] = [];
      // Consistent pseudo-random math for stable drawing
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i * 17.3) % (Math.PI * 2);
        const dist = ((i * 43.7) % 1) * radius;
        nodes.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          size: ((i * 29.5) % 4) + 2
        });
      }

      // Draw connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < radius * 0.5) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodeCount; i++) {
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // 1. Draw premium light mode background
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(0, 0, width, height);

    // 2. Draw border
    ctx.strokeStyle = "rgba(0, 124, 163, 0.15)";
    ctx.lineWidth = width * 0.015;
    ctx.strokeRect(width * 0.02, width * 0.02, width - width * 0.04, height - width * 0.04);

    // 3. Draw a subtle cybernetic grid in the background
    ctx.strokeStyle = "rgba(0, 124, 163, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 4. Draw abstract tech illustrations (a little transparent and relevant)
    if (type === "linkedin") {
      drawNeuralNetwork(width - 250, height / 2 - 50, 200, 25);
      drawRadar(width - 250, height / 2 - 50, 180);
    } else if (type === "story") {
      drawNeuralNetwork(width / 2, 750, 300, 35);
      drawRadar(width / 2, 750, 280);
    } else if (type === "feed") {
      drawNeuralNetwork(width - 250, height - 250, 240, 25);
      drawRadar(width - 250, height - 250, 220);
    }

    // 5. Render graphics depending on the platform type
    if (type === "linkedin") {
      // Category Badge
      ctx.fillStyle = "rgba(0, 124, 163, 0.06)";
      ctx.strokeStyle = "rgba(0, 124, 163, 0.2)";
      ctx.lineWidth = 1;
      
      const categoryText = `[ ${postCategory.toUpperCase()} ]`;
      ctx.font = "bold 13px monospace";
      const textWidth = ctx.measureText(categoryText).width;
      
      // Draw rounded rectangle
      ctx.beginPath();
      ctx.roundRect(80, 80, textWidth + 30, 32, 16);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#007CA3";
      ctx.fillText(categoryText, 95, 101);

      // Title
      ctx.fillStyle = "#0F0F0F";
      ctx.font = "300 42px sans-serif";
      wrapText(ctx, postTitle, 80, 220, 1040, 52);

      // Footer branding (Removed leko.ai)
      ctx.fillStyle = "#71717A";
      ctx.font = "500 13px monospace";
      ctx.fillText("JOSÉ WERKLEY", 80, 530);

      // Glowing badge
      ctx.fillStyle = "#007CA3";
      ctx.beginPath();
      ctx.arc(1100, 525, 6, 0, Math.PI * 2);
      ctx.fill();

    } else if (type === "story") {
      // Story Header
      ctx.fillStyle = "rgba(0, 124, 163, 0.06)";
      ctx.strokeStyle = "rgba(0, 124, 163, 0.2)";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 110, 180, 220, 40, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#007CA3";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("✦ NOVO ARTIGO NO BLOG", width / 2, 204);

      // Main big Title centered
      ctx.fillStyle = "#0F0F0F";
      ctx.font = "300 58px sans-serif";
      ctx.textAlign = "center";
      wrapText(ctx, postTitle, width / 2, 450, 900, 75);

      // Excerpt preview box
      ctx.fillStyle = "rgba(15, 15, 15, 0.02)";
      ctx.strokeStyle = "rgba(15, 15, 15, 0.06)";
      ctx.beginPath();
      ctx.roundRect(100, 950, width - 200, 280, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#3F3F46";
      ctx.font = "italic 32px sans-serif";
      ctx.textAlign = "left";
      wrapText(ctx, `"${postExcerpt}"`, 140, 1020, width - 280, 48);

      // Footer stickers invites
      ctx.fillStyle = "rgba(0, 124, 163, 0.08)";
      ctx.strokeStyle = "rgba(0, 124, 163, 0.25)";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 250, 1420, 500, 72, 36);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#007CA3";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText("TOQUE PARA CONFERIR  ↓", width / 2, 1464);

      // Branding bottom (Removed leko.ai)
      ctx.fillStyle = "#71717A";
      ctx.font = "14px monospace";
      ctx.fillText("JOSÉ WERKLEY", width / 2, 1720);

    } else if (type === "feed") {
      // Category Badge
      ctx.fillStyle = "rgba(0, 124, 163, 0.06)";
      ctx.strokeStyle = "rgba(0, 124, 163, 0.2)";
      ctx.beginPath();
      ctx.roundRect(100, 120, 200, 36, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#007CA3";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`[ ${postCategory.toUpperCase()} ]`, 120, 142);

      // Large central Title
      ctx.fillStyle = "#0F0F0F";
      ctx.font = "300 52px sans-serif";
      wrapText(ctx, postTitle, 100, 320, 880, 68);

      // Quote marker
      ctx.fillStyle = "#007CA3";
      ctx.font = "90px Georgia";
      ctx.fillText("“", 100, 650);

      // Small quote text
      ctx.fillStyle = "#3F3F46";
      ctx.font = "300 28px sans-serif";
      wrapText(ctx, postExcerpt, 100, 720, 880, 42);

      // Footer branding (Removed leko.ai)
      ctx.fillStyle = "#71717A";
      ctx.font = "500 13px monospace";
      ctx.fillText("JOSÉ WERKLEY", 100, 950);

      // Glowing accent
      ctx.fillStyle = "#007CA3";
      ctx.beginPath();
      ctx.arc(970, 945, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Convert canvas to image and trigger download
    const link = document.createElement("a");
    link.download = `leko-site-arte-${type}-${postSlug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };


  return (
    <div className="inline-block">
      {/* Trigger Button - subtle and visible but not exaggeratedly large */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[1.5px] px-4 py-2 rounded-full border border-border-subtle text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-all duration-300 cursor-pointer"
        aria-label="Compartilhar post"
      >
        <Share2 size={13} />
        <span>Compartilhar</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[rgba(0,0,0,0.65)] backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[650px] bg-[var(--color-bg-secondary)] border border-border-subtle rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 z-10 select-none text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-h3 text-text-primary tracking-tight font-medium">Kit de Compartilhamento</h3>
                  <p className="text-[11px] font-mono text-text-muted uppercase tracking-[1px] mt-1">
                    Gere artes automatizadas e textos de impacto
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-text-muted hover:text-text-primary border border-border-subtle cursor-pointer hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {/* 1. Link Sharing */}
                <div className="p-4 bg-[rgba(15,15,15,0.02)] dark:bg-[rgba(255,255,255,0.01)] border border-border-subtle rounded-xl flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] text-text-secondary truncate max-w-[70%]">{postUrl}</span>
                  <button
                    onClick={() => copyToClipboard(postUrl, true)}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1px] px-3.5 py-2 rounded bg-text-primary text-bg-primary hover:bg-accent-cyan hover:text-black transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedLink ? "Copiado" : "Copiar Link"}</span>
                  </button>
                </div>

                {/* 2. LinkedIn Post Helper */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase text-text-muted tracking-wider flex items-center gap-1">
                      <Linkedin size={11} className="text-accent-cyan" />
                      <span>Sugestão de texto para LinkedIn</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(linkedinCopyText)}
                      className="flex items-center gap-1 text-[10px] font-mono text-accent-cyan hover:underline cursor-pointer"
                    >
                      {copiedText ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedText ? "Copiado!" : "Copiar Texto"}</span>
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={linkedinCopyText}
                    className="w-full h-32 bg-[rgba(15,15,15,0.03)] dark:bg-[rgba(255,255,255,0.02)] border border-border-subtle rounded-lg p-3 text-[12px] font-sans text-text-secondary leading-relaxed outline-none"
                  />
                </div>

                {/* 3. Automatic Artwork Generators */}
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-muted tracking-wider mb-3 block">
                    ✦ Gerador de Imagens com Design System
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* LinkedIn Artwork */}
                    <button
                      onClick={() => generateImage("linkedin")}
                      className="flex flex-col items-center justify-center p-4 border border-border-subtle rounded-xl hover:border-accent-cyan hover:bg-accent-cyan/5 transition-all text-center cursor-pointer group"
                    >
                      <Linkedin size={22} className="text-text-secondary group-hover:text-accent-cyan transition-colors mb-2" />
                      <span className="font-sans text-[13px] text-text-primary font-medium">Post LinkedIn</span>
                      <span className="font-mono text-[9px] text-text-muted mt-1 uppercase">1200 x 628 px</span>
                      <div className="flex items-center gap-1 font-mono text-[9px] text-accent-cyan mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={10} />
                        <span>Baixar PNG</span>
                      </div>
                    </button>

                    {/* Instagram Story */}
                    <button
                      onClick={() => generateImage("story")}
                      className="flex flex-col items-center justify-center p-4 border border-border-subtle rounded-xl hover:border-accent-cyan hover:bg-accent-cyan/5 transition-all text-center cursor-pointer group"
                    >
                      <Instagram size={22} className="text-text-secondary group-hover:text-accent-cyan transition-colors mb-2" />
                      <span className="font-sans text-[13px] text-text-primary font-medium">Story Instagram</span>
                      <span className="font-mono text-[9px] text-text-muted mt-1 uppercase">1080 x 1920 px</span>
                      <div className="flex items-center gap-1 font-mono text-[9px] text-accent-cyan mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={10} />
                        <span>Baixar PNG</span>
                      </div>
                    </button>

                    {/* Instagram Feed */}
                    <button
                      onClick={() => generateImage("feed")}
                      className="flex flex-col items-center justify-center p-4 border border-border-subtle rounded-xl hover:border-accent-cyan hover:bg-accent-cyan/5 transition-all text-center cursor-pointer group"
                    >
                      <Instagram size={22} className="text-text-secondary group-hover:text-accent-cyan transition-colors mb-2" />
                      <span className="font-sans text-[13px] text-text-primary font-medium">Feed Instagram</span>
                      <span className="font-mono text-[9px] text-text-muted mt-1 uppercase">1080 x 1080 px</span>
                      <div className="flex items-center gap-1 font-mono text-[9px] text-accent-cyan mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={10} />
                        <span>Baixar PNG</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
