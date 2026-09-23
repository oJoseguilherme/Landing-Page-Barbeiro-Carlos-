# PROMPT FINAL - SITE PREMIUM PARA CARLOS ALEXANDRE BARBEIRO

Crie um site institucional de página única para **Carlos Alexandre Barbeiro**, profissional em Palmas/TO. O resultado deve parecer uma marca pessoal premium, não um template de barbearia. A sensação desejada é de barbearia contemporânea, editorial de moda masculina e fotografia cinematográfica.

**Prioridade visual:** fotografia > identidade > interação > informação. Use verde petróleo e verde profundo como base, branco para contraste, quase preto em áreas de respiro e dourado/champagne apenas em detalhes. Evite neon, gradientes decorativos, excesso de cards, efeitos chamativos e elementos espalhados pelas bordas.

## Estrutura

Organize a página nesta ordem: Hero, Sobre, Serviços, Trabalhos, Experiência, Frase de impacto, Instagram, Agendamento e Footer. A navegação deve usar âncoras com rolagem suave. Cada seção deve ter um objetivo claro, um título forte e texto breve. Preserve uma content-safe zone com largura máxima e margens generosas, inclusive em telas grandes.

## Header e Hero

- Header discreto com a assinatura "CARLOS ALEXANDRE / BARBEIRO", links Início, Sobre, Serviços, Trabalhos, Experiência e Contato, além de um pequeno botão AGENDAR. Começa transparente; ao rolar, fica mais baixo, com fundo escuro translúcido, blur e sombra sutil. Anime a transição com GSAP. No mobile, use menu hamburger acessível.
- Hero de aproximadamente 100vh, com fotografia profissional ocupando toda a largura e sendo o elemento dominante. Mostre o barbeiro trabalhando, um corte ou um detalhe real do ofício. Nunca use imagem em card, layout dividido em duas colunas, colagem ou adesivos sobre a foto. Use somente um overlay escuro muito leve para legibilidade.
- Faça "CARLOS ALEXANDRE" ser o sinal de marca principal, acompanhado apenas de "BARBEIRO / PALMAS, TO" e "Estilo é identidade.". O texto deve ser editorial e secundário à fotografia.
- Posicione AGENDAR e TRABALHOS como controles pequenos e tocáveis no canto inferior direito. No desktop, mantenha cerca de 24-40px de respiro; no mobile, 16-24px à direita e 20-28px embaixo, incluindo safe area. Use bordas finas, fundo semitransparente, blur e um detalhe dourado no botão principal. Não cubra o rosto ou o corte.
- Faça a entrada do Hero com GSAP na ordem imagem, overlay, texto e botões: clip-path/opacity, escala de 1.05 para 1 e deslocamentos mínimos. Adicione parallax lento e sutil à imagem com ScrollTrigger. Disponibilize um enquadramento vertical específico no mobile.

## Conteúdo

- **Sobre:** título "PRECISÃO EM CADA DETALHE.". Texto: "Cada corte carrega uma identidade. O objetivo é entender o estilo de cada cliente e transformar técnica, experiência e cuidado em um resultado que realmente combine com ele." Inclua uma foto editorial, "8+ anos de experiência", "Barbeiro profissional" e "Palmas, TO" em composição com espaço negativo e linhas finas.
- **Serviços:** título "SERVIÇOS" e apoio "Cuidado, precisão e estilo.". Inclua Corte masculino ("Cortes personalizados de acordo com o formato do rosto e estilo pessoal."), Barba ("Modelagem e acabamento profissional."), Corte + barba ("Experiência completa de cuidado masculino.") e Acabamento ("Detalhamento e finalização para manter o visual impecável."). Prefira linhas editoriais ou cards interativos extremamente minimalistas. No hover, desloque pouco, revele uma linha dourada e anime número ou seta com Anime.js. Cada serviço deve levar ao agendamento.
- **Trabalhos:** título "SEU ESTILO, NOSSA ASSINATURA.". Crie uma galeria assimétrica organizada, com fotos de cortes, barba e execução. No hover, aproxime a imagem suavemente e revele uma legenda discreta. Ao clicar, abra um lightbox elegante com navegação anterior/próximo, fechamento por Escape e controles acessíveis. Não apresente fotos ilustrativas como trabalhos reais de Carlos; substitua-as pelas fotos autorais quando disponíveis.
- **Experiência:** título "NÃO É APENAS UM CORTE.". Mostre 01 Consulta (entender o estilo e preferência do cliente), 02 Precisão (execução cuidadosa de cada detalhe), 03 Acabamento (finalização e detalhes) e 04 Resultado (um visual pensado para você). Revele os passos de forma progressiva com GSAP e ScrollTrigger.
- **Frase de impacto:** "GRANDES HISTÓRIAS / COMEÇAM QUANDO / VOCÊ DECIDE / OCUPAR O SEU LUGAR.". Use tipografia serifada editorial, muito espaço negativo e revelação discreta com opacity, clip-path e translateY.
- **Instagram:** título "ACOMPANHE O TRABALHO", o perfil @carlos_alexandre_barbeiro, uma pequena seleção visual e o link VER NO INSTAGRAM. Evite uma parede de fotos.
- **Agendamento:** título "SEU PRÓXIMO CORTE COMEÇA AQUI.", texto "Escolha seu horário e venha viver uma experiência diferente.", botão AGENDAR HORÁRIO e localização Palmas, TO. Use um canal de contato real. Caso o número de WhatsApp não tenha sido informado, não invente um: encaminhe o agendamento para o direct do Instagram e sinalize a ausência do número com clareza.
- **Footer:** marca, Palmas/Tocantins, "ESTILO É IDENTIDADE.", links Instagram, WhatsApp e Agendamento, com bastante respiro visual.

## Direção de design e implementação

Combine uma fonte serifada ou display editorial nos títulos com uma sans-serif moderna nos textos. Use GSAP como motor principal para Hero, header, parallax, revelações e ScrollTrigger. Reserve Anime.js para microinterações funcionais como números, linhas, setas e hovers. Componentes inspirados no 21st.dev devem ser totalmente customizados para a marca.

O site precisa funcionar em desktop, notebook, tablet e smartphone: fotos bem enquadradas, menu mobile, galeria adaptada, alvos de toque confortáveis e nenhum overflow horizontal. Respeite `prefers-reduced-motion`. Faça lazy loading das imagens fora do Hero, priorize transform e opacity nas animações e evite efeitos que prejudiquem a performance. Use HTML semântico, foco visível e textos alternativos adequados.

**Critério final:** ao abrir a página, o usuário deve perceber primeiro o trabalho do profissional e sentir que está diante de uma experiência de cuidado e estilo precisa, sofisticada e pessoal.