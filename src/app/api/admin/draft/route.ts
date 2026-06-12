import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-missing',
});

// Fase 1: Apenas GERA o texto (não salva em lugar nenhum)
export async function POST(req: Request) {
  try {
    const { newsTitle, newsSnippet, newsSource, customPrompt } = await req.json();

    if (!newsTitle && !customPrompt) {
      return NextResponse.json({ error: 'Faltam dados da notícia ou tema' }, { status: 400 });
    }

    const contextBlock = customPrompt 
      ? `TEMA DO ARTIGO AUTORAL: ${customPrompt}` 
      : `NOTÍCIA DE REFERÊNCIA:\nTítulo: "${newsTitle}"\nFonte: ${newsSource}\nResumo: "${newsSnippet}"`;

    const prompt = `Atue como Leko Sarmento, CTO visionário e Arquiteto de Software focado em automação, IAs Autônomas e Produção de Mega Eventos.
Leia/Analise o seguinte contexto e construa um artigo técnico de opinião.
${contextBlock}

Escreva um post de blog (3 a 5 parágrafos médios, linguagem incisiva, hiper-competitiva e técnica) sobre esse tema e como isso afeta a arquitetura de sistemas ou tomada de decisões de negócios modernos. 
Sua visão primordial: A IA não é o futuro, é a infraestrutura de hoje. Quem não for agressivo na adoção vai desaparecer. Mantenha o texto limpo, sem firulas.

FORMATO ESTRITAMENTE OBRIGATÓRIO (Você DEVE retornar todo o artigo dentro de UM ARQUIVO MARKDOWN com FRONTMATTER yaml, contendo title, category e excerpt. NADA ALÉM DO BLOCO MARKDOWN É PERMITIDO.):

---
title: "Título Genial Aqui"
date: "YYYY-MM-DD"
category: "Inteligência Artificial"
excerpt: "Uma ou duas frases de impacto resumindo a provocação do texto."
---

Corpo do texto com markdown forte aqui, parágrafos bem espaçados.
`;

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [{ role: 'user', content: prompt }],
    });

    let markdownResponse = completion.choices[0].message.content || '';
    
    if (markdownResponse.startsWith('```markdown')) {
      markdownResponse = markdownResponse.replace(/^```markdown\n*/, '').replace(/\n*```$/, '');
    }
    markdownResponse = markdownResponse.trim();

    const dateStr = new Date().toISOString().split('T')[0];
    const finalMd = markdownResponse.replace(/date:\s*"[^"]*"/, `date: "${dateStr}"`);

    // Retorna o rascunho inteiro para a tela do Front-End (O usuário poderá editar!)
    return NextResponse.json({ draft: finalMd });

  } catch (error) {
    console.error('Draft Error:', error);
    return NextResponse.json({ error: 'Falha letal na comunicação com o OpenRouter.' }, { status: 500 });
  }
}
