import { NextResponse } from "next/server";

/**
 * Contador de visitas do rodapé.
 *
 * Esta rota já somou um offset fixo de 2450 ao número real, partiu de uma
 * semente de 2140 e, quando a API externa caía, **simulava** cerca de nove
 * visitas por hora para o número continuar subindo. Ou seja: o número exibido
 * não era o número de visitas.
 *
 * Isso foi removido. Um site que se apresenta como "sem hype, só operação" não
 * pode inflar a própria métrica de vaidade, e quem publica dado inventado uma
 * vez perde o direito de ser levado a sério nas outras.
 *
 * Regra atual: devolve o valor real, ou `null`. O rodapé simplesmente não
 * mostra nada quando vem `null`, que é melhor do que mostrar um número falso.
 */
export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch("https://api.counterapi.dev/v1/werkley-site/visits/up", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`CounterAPI respondeu ${res.status}`);

    const data = await res.json();
    if (typeof data?.value === "number") {
      return NextResponse.json({ count: data.value });
    }

    throw new Error("CounterAPI devolveu payload sem `value` numérico");
  } catch (err) {
    console.error("Contador de visitas indisponível:", err);
    return NextResponse.json({ count: null });
  }
}
