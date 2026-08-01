---
title: "Coloquei um agente de IA na home do meu site"
date: "2026-07-31"
category: "Marketing Digital"
excerpt: "O que eu decidi, o que quebrou e, principalmente, o que eu ainda não sei. Sem número inventado: enquanto a medição não estiver de pé, qualquer resultado que eu publicasse aqui seria enfeite."
---

Tem um agente de IA na página inicial deste site. Ele aparece alguns segundos depois que a página carrega, se apresenta, oferece te guiar pelas onze cenas do portfólio e, no fim, vira um chat que responde como se fosse eu.

Este texto é sobre o que eu decidi para construir isso, o que descobri no caminho, e sobre a parte que quase ninguém publica: o que eu ainda não sei.

Começo por ela, para não enrolar.

## O que eu não vou dizer

Eu não vou dizer aqui que o agente aumentou minha conversão em tantos por cento.

Não porque o número seja ruim. Porque ele não existe. Este site, hoje, não mede quase nada. Não tem funil instrumentado, não tem evento de aceite do convite, não sei quantas pessoas chegam ao chat nem o que perguntam quando chegam.

Eu podia inventar. É a coisa mais fácil do mundo escrever "o engajamento triplicou" num artigo e ninguém checar. Metade dos textos sobre IA que circulam por aí faz exatamente isso, com estatística que não veio de lugar nenhum.

Só que aí eu estaria fazendo o oposto do que digo fazer. Então: construí, está no ar, funciona, e a medição é a próxima coisa a ser feita. Qualquer número antes disso seria decorativo.

## Por que um agente, e não um chat qualquer

O problema que eu queria resolver não era "o site precisa de IA".

Era um problema chato de portfólio: o visitante chega, olha, e não sabe o que olhar. Portfólio bom tem coisa demais. A pessoa rola meia tela, não encontra imediatamente o que veio buscar, e vai embora achando que não tinha.

Recrutador, cliente e curioso querem coisas diferentes do mesmo site. A navegação tradicional obriga os três a caçar. Um agente que pergunta e conduz resolve isso de um jeito que menu nenhum resolve.

Então ele não é um chatbot de suporte encostado no canto. Ele é uma **segunda porta de navegação**, para quem prefere ser levado a procurar.

## As decisões que importaram mais que o modelo

Escolher qual modelo de linguagem usar foi a decisão menos importante do projeto. As que mexeram de verdade na experiência foram outras.

**Quando ele aparece.** Na primeira versão, aparecia junto com a página. É invasivo e some no barulho: a pessoa ainda está entendendo onde caiu. Hoje ele espera a animação de entrada terminar e mais alguns segundos. A pessoa já viu o que é o site antes de alguém falar com ela.

**Ter uma saída óbvia.** Ao lado de "me apresenta" existe "vou explorar sozinho", com o mesmo tamanho e a mesma clareza. Esconder a recusa para forçar o engajamento é o tipo de truque que sobe métrica de curto prazo e derruba a impressão que fica.

**Não bloquear nada.** Ele nunca cobre o conteúdo de forma que impeça a leitura, e nunca trava a rolagem. Se a pessoa ignorar completamente, o site funciona inteiro como se ele não existisse.

**Respeitar quem pediu menos movimento.** Quem configurou o sistema para reduzir animação recebe tudo parado. Vale para acessibilidade e vale para quem só acha animação irritante.

## O que quebrou

Duas coisas, e as duas foram de produto, não de modelo.

A primeira: quando adicionei uma cena nova ao portfólio, o tour precisou continuar coerente. A apresentação percorre as cenas na ordem, e uma cena sem texto de narração cadastrado vira um silêncio esquisito no meio da conversa. É o tipo de defeito que só aparece para quem faz o passeio inteiro, ou seja, para o visitante mais interessado de todos. Hoje tem uma verificação que confere se toda cena tem narração nos três idiomas antes de eu subir qualquer coisa.

A segunda: por um tempo o site quebrava em inglês e espanhol numa parte específica, porque um pedaço do conteúdo só existia em português e o código assumia que existiria sempre. Quem trocava de idioma via a seção sumir. Não é sobre IA, é sobre a regra mais velha de software: conteúdo faltando precisa degradar, não explodir.

## O que eu vou medir

Quatro coisas, nessa ordem:

**Taxa de aceite do convite.** De quem vê, quantos aceitam ser guiados. Se for muito baixa, o problema é o momento ou o texto do convite, não o agente.

**Onde as pessoas param.** O tour tem onze paradas. Saber em qual delas a maioria desiste diz mais sobre o meu portfólio do que sobre o agente. Se todo mundo abandona na cena cinco, o problema é a cena cinco.

**Quantos chegam ao chat.** O tour termina oferecendo conversar. Essa é a passagem de visitante para contato.

**O que perguntam.** Essa é a mais valiosa, e é a que menos parece métrica.

## A parte que ninguém coloca no relatório

Um agente no site é o instrumento de pesquisa mais barato que existe.

Toda pergunta que alguém digita ali é uma dúvida real, escrita com as palavras da pessoa, no momento em que ela está decidindo se vale a pena falar com você. Você não precisa pagar pesquisa, montar grupo focal nem torcer para alguém responder formulário. A objeção chega escrita.

Se dez pessoas perguntarem "quanto custa" antes de qualquer outra coisa, isso significa que a página não está comunicando preço e você tem um problema de site, não de agente. Se perguntarem "você atende empresa do meu tamanho", seu posicionamento está largo demais.

É por isso que eu vou instrumentar isso antes de escrever qualquer sequência sobre resultado. Não pelo número de conversão, que é a parte fácil de contar. Pelo texto das perguntas, que é a parte que muda o site inteiro.

Quando tiver dado real, escrevo a continuação. Com número que existe.
