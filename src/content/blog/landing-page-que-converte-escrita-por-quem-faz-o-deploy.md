---
title: "Landing page que converte, escrita por quem também faz o deploy"
date: "2026-07-31"
category: "Marketing Digital"
excerpt: "A conversão não morre na headline. Morre nas passagens de bastão, onde a decisão volta a ser tomada por alguém que nunca viu o briefing. Quem sobe a página no ar é o último editor da sua copy."
---

O processo padrão de uma landing page é mais ou menos assim. Alguém escreve a copy num documento. Alguém desenha no Figma. Alguém implementa. Alguém sobe. E aí a página converte menos do que devia, e o time se reúne para discutir headline.

Quase nunca é a headline.

Eu passei quinze anos do lado do marketing e hoje escrevo o código do que eu desenho. A travessia me deixou com uma conclusão desconfortável para os dois lados: **as decisões que mais mexem em conversão não aparecem no documento de copy nem no arquivo de design. Elas aparecem na implementação, tomadas por alguém que normalmente nunca viu o briefing e não foi convidado para a discussão sobre objetivo.**

Quem sobe a página no ar é o último editor do seu texto, mesmo sem escrever uma palavra.

## A conversão morre nas costuras

Toda passagem de bastão perde intenção. Não por incompetência: por compressão.

O estrategista sabia por que a prova social vinha antes do preço. Isso virou uma ordem de blocos no Figma. O designer sabia por que o botão era daquele tamanho. Isso virou uma classe de CSS. O desenvolvedor recebeu uma tela e um prazo, e resolveu os cem problemas que ninguém antecipou usando o único critério que tinha em mãos: fazer parecer com a imagem.

Nenhum desses cem problemas estava no briefing. Vários deles decidem se a página converte.

É a mesma lógica que Melvin Conway descreveu em 1968 para software: o produto que sai reproduz a estrutura de comunicação de quem o produziu. Uma landing feita por quatro áreas que não conversam vira uma experiência com quatro emendas visíveis, e o visitante sente cada uma como hesitação.

## O que só aparece quando você mesmo sobe a página

**O peso real no 4G.** No Figma tudo carrega instantaneamente. No celular do seu cliente, no meio da rua, não. Neste site, os quatro vídeos que mostram os produtos rodando somam 264 kilobytes no total. Não é acaso, é orçamento: cada peça foi cortada e comprimida até caber. Entregue o mesmo Figma sem esse orçamento e aquilo vira quatro arquivos de vários megabytes, e a página perde gente antes do primeiro parágrafo.

**A ordem em que as coisas chegam.** Quem implementa decide, muitas vezes sem perceber, o que carrega primeiro. Se a imagem de fundo vem antes do texto, você tem uma tela bonita e muda por dois segundos. Em 1982, pesquisadores da IBM identificaram o que ficou conhecido como limiar de Doherty: abaixo de cerca de 400 milissegundos de resposta, a pessoa entra num estado de uso fluido; acima disso, a atenção começa a vazar. Dois segundos de tela muda são cinco vezes esse limiar.

**O botão que foge do dedo.** Imagem sem largura e altura declaradas faz a página pular enquanto carrega. A pessoa vai tocar no botão e ele se move no exato instante do toque. O Google mede isso, chama de Cumulative Layout Shift e usa como sinal de qualidade de página. Seu cliente não sabe o nome, só sabe que o site é ruim.

**O parágrafo que vira parede.** Um texto de 235 caracteres ocupa três linhas confortáveis no desktop e seis linhas apertadas no telefone. Quem só vê o documento de copy não enxerga esse problema, porque no documento todo parágrafo tem a mesma cara.

## Seis decisões de implementação que são decisões de marketing

Coisas que eu faço e que nunca estiveram num briefing:

**1. Imagem estática como poster de todo vídeo.** O bloco aparece completo mesmo que o vídeo nunca carregue. Quem está numa conexão ruim vê conteúdo, não um retângulo cinza. Isso não é detalhe técnico: é a diferença entre comunicar ou não comunicar para a parcela do seu público com pior conexão, que costuma ser a maior.

**2. Nada baixa antes da hora.** Vídeo só começa a carregar quando entra na tela, e só toca o que está visível. Quatro vídeos tocando ao mesmo tempo esquentam o aparelho e queimam bateria. A pessoa não escreve para reclamar, ela vai embora.

**3. Dimensões declaradas em toda imagem.** Contra o botão que foge.

**4. Movimento é opcional.** Quem configurou o sistema para reduzir animação recebe a página parada. Vale para acessibilidade e vale para a parte do seu público que simplesmente acha animação irritante.

**5. O texto é escrito para caber, não para agradar em documento.** Você para de escrever o parágrafo perfeito e começa a escrever o parágrafo que não empurra o botão para baixo da dobra num iPhone.

**6. A promessa vem antes do contexto.** Porque o contexto pode ficar na segunda tela e a promessa não pode.

## O corte que ninguém quer fazer

Quando enxuguei este site, o ganho maior não veio de deixar as frases mais curtas.

Veio de perceber que a mesma ideia estava sendo contada cinco vezes, em seções diferentes, com palavras diferentes. A abertura dizia. A seção "sobre" repetia. A seção de diferenciais repetia de novo. O bloco para recrutadores repetia mais uma vez.

Cortei o texto de abertura de 235 para 118 caracteres. Não por estética: era o texto mais longo da página, a primeira coisa que qualquer pessoa lia, e quatro quintos dele era informação que apareceria de novo mais abaixo.

Repetir a mesma mensagem em lugares diferentes não reforça, cansa. Reforço é dizer a mesma coisa de ângulos diferentes; entulho é dizer a mesma coisa com sinônimos. A diferença entre os dois é sutil no documento e brutal na leitura.

## O mínimo honesto de medição

Página no ar sem medição é opinião com CSS.

O mínimo: quantos chegam, quantos rolam até a oferta, quantos clicam, quantos completam. Quatro números, abertos por origem de tráfego. Com isso você já sabe se o problema é anúncio, promessa ou oferta, e para de brigar sobre headline sem dado.

E o mínimo de integridade: não invente número para a página parecer melhor. Contador de visita inflado, prova social fabricada, depoimento genérico assinado por "João S.". Quem é do ramo percebe na hora, e o que você ganha em impressão perde em confiança, que é a única moeda que faz um desconhecido comprar de você.

## "Então marketing precisa aprender a programar?"

Não. E essa conclusão seria a leitura preguiçosa deste texto.

O ponto não é que você deva escrever o código. É que **implementação não é a etapa em que a sua estratégia é executada. É a etapa em que ela é decidida de novo**, por outra pessoa, com outras prioridades e sem acesso ao motivo de nada.

O que muda o resultado é participar dessa etapa. Estar na sala quando as decisões forem tomadas, saber o que perguntar, entender a resposta e ter opinião sobre ela. Perguntar quanto pesa a página. Perguntar o que carrega primeiro. Abrir no seu celular, no 4G, longe do escritório, antes de aprovar.

Nada disso exige saber programar. Exige parar de tratar "subir a página" como o momento em que o trabalho de marketing terminou.

É o momento em que ele começa a valer.
