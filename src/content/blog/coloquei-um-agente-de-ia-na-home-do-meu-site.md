---
title: "Coloquei um agente de IA na home do meu site"
date: "2026-07-31"
category: "Marketing Digital"
excerpt: "Três visitantes diferentes contratam o mesmo site para trabalhos diferentes, e a navegação tradicional obriga os três a caçar. O que eu construí, o que quebrou, e por que eu não vou te mostrar número nenhum."
---

Tem um agente de IA na página inicial deste site. Ele aparece alguns segundos depois que a página carrega, se apresenta, oferece te guiar pelas onze cenas do portfólio e, no fim, vira um chat que responde como se fosse eu.

Este texto é sobre o que eu decidi para construir isso, o que quebrou no caminho, e sobre a parte que quase ninguém publica: o que eu ainda não sei.

Começo por ela, porque ela é o motivo de este texto existir.

## O que eu não vou dizer

Eu não vou dizer que o agente aumentou minha conversão em tantos por cento.

Não porque o número seja ruim. Porque ele não existe. Este site, hoje, não mede quase nada. Não tem funil instrumentado, não registra aceite do convite, não sei quantas pessoas chegam ao chat nem o que perguntam quando chegam.

Eu podia inventar. É a coisa mais fácil do mundo escrever "o engajamento triplicou" e ninguém checar. Uma parte considerável do conteúdo sobre IA que circula faz exatamente isso, com estatística que não veio de lugar nenhum e que ninguém consegue rastrear até uma fonte.

E aqui está o cálculo que quase todo mundo faz errado: o número inventado te dá uma leitura. A ausência dele te dá as próximas dez. Credibilidade é o único ativo composto do marketing de conteúdo, e ele é destruído por um único número que alguém consegue derrubar.

Então: construí, está no ar, funciona, a medição é a próxima coisa a ser feita, e qualquer resultado que eu publicasse antes disso seria enfeite.

## O problema real não era "o site precisa de IA"

Era um problema de portfólio que existe desde antes de existir IA.

Recrutador, cliente e curioso chegam no mesmo endereço querendo coisas diferentes. O recrutador quer cargo, tempo e resultado. O cliente quer saber se você resolve o problema dele e quanto custa. O curioso quer ver bonito.

Clayton Christensen popularizou uma forma útil de olhar para isso: as pessoas não compram um produto, elas o contratam para fazer um trabalho. Três visitantes contratam o mesmo site para três trabalhos incompatíveis, e a navegação tradicional responde a todos com o mesmo menu, obrigando os três a caçar.

Portfólio bom tem coisa demais. A pessoa rola meia tela, não encontra imediatamente o que veio buscar, e vai embora com a impressão de que não tinha.

O agente não é um chatbot de suporte encostado no canto. Ele é uma **segunda porta de navegação**: existe para quem prefere ser levado a procurar. A porta antiga continua aberta, e a maioria vai continuar usando ela.

## As decisões que importaram mais que o modelo

Escolher qual modelo de linguagem usar foi a decisão menos importante do projeto inteiro. As que mudaram a experiência foram todas de produto.

**Quando ele aparece.** Na primeira versão, aparecia junto com a página. É invasivo e ainda por cima ineficaz: a pessoa está entendendo onde caiu e qualquer coisa que fale com ela vira ruído. Hoje ele espera a animação de entrada terminar e mais alguns segundos. A pessoa já formou uma primeira impressão antes de alguém puxar assunto.

**Ter uma saída óbvia.** Ao lado de "me apresenta" existe "vou explorar sozinho", com o mesmo tamanho e o mesmo peso visual. Esconder a recusa para forçar engajamento é o tipo de truque que sobe métrica de curto prazo e derruba a impressão que fica. É a versão digital do vendedor que se planta na frente da porta.

**Não bloquear nada.** Ele nunca cobre o conteúdo de forma que impeça a leitura e nunca trava a rolagem. Se a pessoa ignorar completamente, o site funciona inteiro como se ele não existisse. Essa é a diferença entre uma segunda porta e um pedágio.

**Respeitar quem pediu menos movimento.** Quem configurou o sistema operacional para reduzir animação recebe tudo parado. Vale para acessibilidade e vale para quem só acha animação irritante.

Repare que nenhuma dessas decisões tem a ver com inteligência artificial. Todas têm a ver com respeitar o visitante, que é o mesmo assunto de sempre.

## O que quebrou

Duas coisas, e as duas foram de produto, não de modelo.

**A primeira.** Quando adicionei uma cena nova ao portfólio, a apresentação precisou continuar coerente. O tour percorre as cenas na ordem, e uma cena sem narração cadastrada vira um silêncio esquisito no meio da conversa. É o tipo de defeito que só aparece para quem faz o passeio inteiro, ou seja, para o visitante mais interessado que você tem. Hoje existe uma verificação que confere se toda cena tem narração nos três idiomas antes de qualquer publicação.

**A segunda.** Por um tempo o site quebrava em inglês e espanhol numa parte específica, porque um pedaço do conteúdo só existia em português e o código assumia que existiria sempre. Quem trocava de idioma via a seção sumir. Não tem nada a ver com IA: é a regra mais antiga de software, a de que conteúdo faltando precisa degradar em vez de explodir.

Conto as duas porque a conversa pública sobre agentes é quase toda sobre o modelo, e na prática o modelo é a parte que menos dá trabalho.

## O que eu vou medir, e por que nessa ordem

**Taxa de aceite do convite.** De quem vê, quantos aceitam ser guiados. Se for muito baixa, o problema é o momento ou o texto do convite, não o agente. Vale testar as duas coisas antes de culpar a ideia.

**Onde as pessoas param.** O tour tem onze paradas. Saber em qual delas a maioria desiste diz mais sobre o meu portfólio do que sobre o agente. Se todo mundo abandona na cena cinco, o problema é a cena cinco, e nenhum modelo de linguagem conserta isso.

**Quantos chegam ao chat.** O tour termina oferecendo conversar. É a passagem de visitante para contato, e a única etapa que se parece com conversão.

**O que perguntam.** Essa é a mais valiosa, e é a que menos parece métrica.

## A parte que não cabe no relatório

Um agente no site é o instrumento de pesquisa mais barato que existe.

Toda pergunta digitada ali é uma dúvida real, escrita com as palavras da pessoa, no momento exato em que ela decide se vale a pena falar com você. Você não paga pesquisa, não monta grupo focal, não torce para alguém responder formulário. A objeção chega escrita, datada e no vocabulário do cliente.

Isso tem nome em pesquisa de mercado: voz do cliente. A diferença é que aqui ela não é coletada em ambiente artificial, com a pessoa sabendo que está sendo estudada, o que é justamente onde a pesquisa tradicional mais distorce.

E o que se faz com isso é mais importante que a taxa de conversão:

Se dez pessoas perguntam "quanto custa" antes de qualquer outra coisa, você não tem um problema de agente. Tem um problema de site, que não está comunicando faixa de preço, e provavelmente um problema de anúncio, que está atraindo gente fora da faixa.

Se perguntam "você atende empresa do meu tamanho", seu posicionamento está largo demais e você está pagando para conversar com quem nunca vai comprar.

Se perguntam a mesma coisa que já está escrita na terceira seção, aquela seção não está sendo lida, e nenhuma reescrita de texto resolve o que é problema de hierarquia visual.

Em todos os casos, a resposta certa não é ajustar o agente. É consertar o site, e usar o agente como sensor.

## O que eu faria diferente

Instrumentaria antes de lançar.

Não porque o lançamento tenha sido ruim, mas porque rodei semanas com o instrumento de pesquisa mais barato do mundo ligado e o gravador desligado. As perguntas que as pessoas fizeram nesse período não voltam.

É um erro comum e caro: tratar medição como fase dois de um projeto que já está no ar. Medição não é fase dois. É parte do que se constrói, porque é a única coisa que transforma uma aposta em aprendizado.

Quando eu tiver dado real, escrevo a continuação. Com número que existe, e com o link para conferir.
