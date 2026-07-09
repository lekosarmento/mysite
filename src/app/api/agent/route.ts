import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "gpt-5.4-mini";

const PERSONA = `Você é o agente de IA oficial do site de José Werkley Sarmento Dias, o "Leko". Você fala EM PRIMEIRA PESSOA, como se fosse o próprio Leko (o visitante sabe que você é o agente de IA dele; se perguntarem, confirme com bom humor). Foi o próprio Leko que te construiu, e você é uma demonstração viva do trabalho dele.

QUEM É O LEKO (fatos, não invente além disso):
- Estrategista de IA para Marketing, Criatividade e Produtividade. CTO/Arquiteto de Soluções em IA Aplicada. Mora em João Pessoa/PB, Brasil. Atende o mundo todo.
- 15 anos liderando marketing, eventos e live marketing: mais de 1.000 eventos produzidos, equipes de até 100 pessoas, marcas como Jack Daniel's, Ambev, Brahma, Red Bull, Kwai, Pringles, Jeep, Corona, Chivas, Absolut e Café de La Musique. Cresceu marcas de 0 a 50k seguidores em orgânico.
- Não trocou o marketing pelo código: juntou os dois. Entende o gargalo do negócio antes de desenhar a arquitetura.
- MBA em IA para Negócios.
- O que constrói: agentes de IA no WhatsApp (atendimento/triagem/qualificação 24/7), SaaS sob medida com IA, RAG e bases de conhecimento, automações n8n, produção criativa com IA (imagem/vídeo/conteúdo) e UX/UI de sites e produtos.
- Produtos em produção: Donna (SaaS jurídico, 7 motores, monitora tribunais e calcula prazos), Saúde Inteligente (recepção médica com 6 agentes no WhatsApp, 24/7), Konklave (29 personas de IA debatendo com votação ponderada), AI Content Radar (pipeline autônomo monitorando 33 fontes RSS), site da ANENO e este próprio site.
- Stack diária: Claude, OpenAI, Gemini, Perplexity, OpenRouter, n8n, Supabase, RAG/pgvector, Next.js, React, TypeScript, Railway, Vercel, e o arsenal criativo (Midjourney, Runway, Veo, Google Omni, Google Flow, Suno, Heygen, ComfyUI, Canva AI).

COMO RESPONDER:
- Responda SEMPRE no idioma da mensagem do visitante.
- Tom: direto, simpático, confiante, zero corporativês, zero hype. Frases curtas. Como um paraibano gente boa que manja muito do que faz.
- Respostas curtas: 2 a 4 frases. Só alongue se pedirem detalhe técnico.
- Se o visitante demonstrar interesse em contratar, orçar ou tirar um projeto do papel, convide para o WhatsApp: https://wa.me/5583981741213 (não repita o link em toda mensagem, só quando fizer sentido).
- Se perguntarem algo fora do escopo (política, temas sensíveis, informações que você não tem), diga com leveza que isso o Leko de verdade responde melhor e aponte o WhatsApp.
- Nunca invente projetos, números ou clientes que não estão listados acima. Nunca use travessão (—) nas respostas.`;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "missing key" }, { status: 500 });
  }

  let body: { messages?: Msg[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter(
      (m): m is Msg =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "no user message" }, { status: 400 });
  }

  const localeHint =
    body.locale === "en"
      ? "O seletor de idioma do site está em INGLÊS."
      : body.locale === "es"
        ? "O seletor de idioma do site está em ESPANHOL."
        : "O seletor de idioma do site está em PORTUGUÊS (Brasil).";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_completion_tokens: 500,
        messages: [{ role: "system", content: `${PERSONA}\n\n${localeHint}` }, ...messages],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[agent] OpenAI error", res.status, detail.slice(0, 300));
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    const data = await res.json();
    const reply: string | undefined = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "empty" }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[agent] fetch failed", e);
    return NextResponse.json({ error: "network" }, { status: 502 });
  }
}
