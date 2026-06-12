import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-missing',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Site Leko',
  },
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is missing' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet', 
      messages: [
        { 
          role: 'system', 
          content: `Você é um robô de banco de dados que escreve artigos precisos sobre Tecnologia e Produção de Eventos. 
          VOCÊ DEVE RETORNAR ESTRITAMENTE UM OBJETO JSON VÁLIDO NESSA EXATA ESTRUTURA:
          { 
            "title": "String com o título chamativo", 
            "slug": "string-do-titulo-separada-por-hifens", 
            "body": "String com o artigo extenso de no mínimo 3 parágrafos e sem formatações Markdown (apenas texto limpo e quebras de linha duplas)." 
          }
          NUNCA RESPONDA NADA ALÉM DO OBJETO JSON. NÃO COLOQUE CRAZES (\`\`\`). NÃO ESCREVA BOM DIA.`
        },
        { 
          role: 'user', 
          content: `TEMA DO ARTIGO: ${prompt}` 
        }
      ],
    });

    const aiResponse = completion.choices[0].message.content || '{}';
    // Clean potential markdown blocks surrounding JSON
    const cleanJsonStr = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanJsonStr);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate JSON text' }, { status: 500 });
  }
}
