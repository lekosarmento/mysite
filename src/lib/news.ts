import { XMLParser } from 'fast-xml-parser';

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
};

export async function getAINews(): Promise<NewsItem[]> {
  let allNews: NewsItem[] = [];
  const parser = new XMLParser({ ignoreAttributes: false });

  // Helper para buscar string pura não importando se a Tag tem atributos
  const getText = (node: any) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (typeof node['#text'] === 'string') return node['#text'];
    return '';
  };

  // 1. Fetch Hacker News (JSON - Sem problemas de XML)
  try {
    const res = await fetch('https://hn.algolia.com/api/v1/search_by_date?query="Artificial Intelligence" OR "OpenAI" OR "LLM"&tags=story&hitsPerPage=10', { next: { revalidate: 3600 } });
    const data = await res.json();
    const hnItems = data.hits.map((item: any, id: number) => ({
      id: `hn-${item.objectID || id}`,
      title: item.title || '',
      link: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
      pubDate: item.created_at || new Date().toISOString(),
      contentSnippet: `Pontuação: ${item.points || 0} upvotes. [HackerNews]`,
      source: 'HackerNews AI'
    }));
    allNews = [...allNews, ...hnItems];
  } catch (e) {
    console.error(`Failed HN API`, e);
  }

  // 2. Fetch TechCrunch AI (XML Puro via fast-xml-parser sem dar alertas no Node 22)
  try {
    const res = await fetch('https://techcrunch.com/category/artificial-intelligence/feed/', { next: { revalidate: 3600 } });
    const xml = await res.text();
    const result = parser.parse(xml);
    const channelItems = result?.rss?.channel?.item || [];
    const items = Array.isArray(channelItems) ? channelItems : [channelItems];
    
    const tcItems = items.map((item: any, id: number) => {
      let snippet = getText(item.description);
      snippet = snippet.replace(/<[^>]*>?/gm, ''); // tira HTML
      
      return {
        id: `tc-${id}`,
        title: getText(item.title),
        link: getText(item.link),
        pubDate: item.pubDate || new Date().toISOString(),
        contentSnippet: snippet.substring(0, 200) + '...',
        source: 'TechCrunch'
      };
    });
    allNews = [...allNews, ...tcItems];
  } catch (e) {
    console.error(`Failed TC XML`, e);
  }

  // 3. Fetch The Verge (XML - Precisa filtrar porque o feed deles é tech geral)
  try {
    const res = await fetch('https://www.theverge.com/rss/index.xml', { next: { revalidate: 3600 } });
    const xml = await res.text();
    const result = parser.parse(xml);
    const feedEntries = result?.feed?.entry || [];
    const entries = Array.isArray(feedEntries) ? feedEntries : [feedEntries];

    const aiKeywords = ['AI', 'Artificial Intelligence', 'OpenAI', 'Google', 'Anthropic', 'LLM', 'GPT', 'Claude', 'Agent', 'Gemini'];
    
    const vergeItems = entries
      .filter((item: any) => aiKeywords.some(kw => getText(item.title).toLowerCase().includes(kw.toLowerCase())))
      .map((item: any, id: number) => {
        let snippet = getText(item.content);
        snippet = snippet.replace(/<[^>]*>?/gm, ''); // remove html
        
        // Em feeds Atom, o link geralmente fica nos atributos: <link href="..."/>
        let linkUrl = '';
        if (item.link) {
          if (typeof item.link === 'string') linkUrl = item.link;
          else if (item.link['@_href']) linkUrl = item.link['@_href'];
        }

        return {
          id: `verge-${id}`,
          title: getText(item.title),
          link: linkUrl || item.id || '',
          pubDate: item.updated || item.published || new Date().toISOString(),
          contentSnippet: snippet.substring(0, 200) + '...',
          source: 'The Verge'
        };
      });
    allNews = [...allNews, ...vergeItems];
  } catch (e) {
    console.error(`Failed Verge XML`, e);
  }

  // Ordena globalmente pela data final de publicação de todos eles juntos
  return allNews
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20); // Retorna as 20 mais quentes
}
