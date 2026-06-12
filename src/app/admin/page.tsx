import { getAINews } from '@/lib/news';
import { AdminClient } from './AdminClient';
import { SectionLabel } from '@/components/ui/SectionLabel';

// Server Component: fetches data securely and renders the UI
export default async function AdminPage() {
  const news = await getAINews();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-32 px-6 md:px-10 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel>Local Command Center</SectionLabel>
        <h1 className="text-h1 mt-4 mb-4">Leko AI Director</h1>
        <p className="text-body text-text-secondary mb-16 max-w-3xl">
          Painel Operacional <strong>(Localhost Only)</strong>. Selecione as pautas globais de IA rastreadas via RSS abaixo ou declare um tema manual. O OpenRouter redigirá o artigo autoral e salvará o arquivo puro (<code>.md</code>) diretamente no seu código. O Next.js renderizará o artigo ao vivo no instante que o arquivo nascer.
        </p>

        <AdminClient news={news} />
      </div>
    </div>
  );
}
