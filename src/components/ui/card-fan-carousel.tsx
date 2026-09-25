import { useEffect, useRef, useMemo } from "react";

export interface CardItem {
  id?: string;
  number?: string;
  imgUrl: string;
  alt?: string;
  title?: string;
  tag?: string;
  description?: string;
  linkUrl?: string;
}

interface CardCarouselProps {
  cards: CardItem[];
  speedSeconds?: number;
  pauseDuration?: number; // 8000ms (8 segundos)
  targetService?: { id: string; timestamp: number } | null;
}

// 7 repetições dos 5 serviços = 35 cards na esteira contínua
const REPEAT_SETS = 7;

// Função de suavização cúbica para a navegação suave até o card clicado
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function CardCarousel({
  cards,
  speedSeconds = 32,
  pauseDuration = 8000,
  targetService,
}: CardCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Array circular repetido para garantir esteira infinita sem limites físicos
  const allCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    const list: Array<{ card: CardItem; virtualKey: string }> = [];
    for (let s = 0; s < REPEAT_SETS; s++) {
      cards.forEach((card, idx) => {
        list.push({
          card,
          virtualKey: `set-${s}-card-${card.id || idx}`,
        });
      });
    }
    return list;
  }, [cards]);

  // Refs de estado para a animação 60fps sem re-renders
  const animRef = useRef<number | null>(null);
  const currentXRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const isManualNavigatingRef = useRef<boolean>(false);
  const lastActiveCardRef = useRef<HTMLElement | null>(null);
  const oneSetWidthRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const autoTimersRef = useRef<number[]>([]);
  const manualNavTimersRef = useRef<number[]>([]);
  const manualAnimIdRef = useRef<number | null>(null);

  interface CardCacheItem {
    element: HTMLElement;
    centerOffset: number;
  }

  const cardItemsRef = useRef<CardCacheItem[]>([]);
  const wrapperWidthRef = useRef<number>(0);

  // Atualiza métricas e cache de posições dos cards (sem leituras repetitivas de layout)
  const updateMetrics = () => {
    if (!trackRef.current || !wrapperRef.current || !cards || cards.length === 0) return;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    wrapperWidthRef.current = wrapper.clientWidth;

    const cardEls = track.querySelectorAll<HTMLElement>(".marquee-card");
    if (cardEls.length === 0) return;

    const items: CardCacheItem[] = [];
    for (let i = 0; i < cardEls.length; i++) {
      const el = cardEls[i];
      items.push({
        element: el,
        centerOffset: el.offsetLeft + el.offsetWidth / 2,
      });
    }
    cardItemsRef.current = items;

    if (cardEls.length > cards.length) {
      const firstInSet0 = cardEls[0];
      const firstInSet1 = cardEls[cards.length];
      if (firstInSet0 && firstInSet1) {
        oneSetWidthRef.current = firstInSet1.offsetLeft - firstInSet0.offsetLeft;
      }
    }
  };

  // 1. Loop contínuo infinito e detecção de imagem no centro
  useEffect(() => {
    if (!cards || cards.length === 0 || !wrapperRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const wrapper = wrapperRef.current;

    // Mede a largura e posições iniciais
    const timer1 = setTimeout(() => {
      updateMetrics();
      const setWidth = oneSetWidthRef.current;
      // Inicia posicionado no meio da repetição para ter margem infinita para ambos os lados
      if (currentXRef.current === 0 && setWidth > 0) {
        currentXRef.current = -setWidth * 2;
        track.style.transform = `translate3d(${currentXRef.current}px, 0, 0)`;
      }
    }, 80);

    const timer2 = setTimeout(updateMetrics, 300);

    if (document.fonts) {
      document.fonts.ready.then(updateMetrics);
    }

    const onResize = () => {
      updateMetrics();
    };
    window.addEventListener("resize", onResize);

    const checkAndMoveLoop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const oneSetWidth = oneSetWidthRef.current;

      // Executa o movimento automático contínuo
      if (
        !isPausedRef.current &&
        !isManualNavigatingRef.current &&
        oneSetWidth > 0
      ) {
        // Velocidade linear constante (exatamente igual ao marquee original)
        const speed = oneSetWidth / speedSeconds;
        let newX = currentXRef.current - speed * dt;

        // Normalização cíclica imperceptível: mantém a esteira sempre na zona central
        while (newX <= -oneSetWidth * 4) {
          newX += oneSetWidth;
        }
        while (newX >= -oneSetWidth * 1.5) {
          newX -= oneSetWidth;
        }

        currentXRef.current = newX;
        track.style.transform = `translate3d(${newX}px, 0, 0)`;

        // Detecção 100% matemática sem forçar reflows no navegador (0 lag / 0 gargalo)
        const wrapperCenter = (wrapperWidthRef.current || wrapper.clientWidth) / 2;
        const items = cardItemsRef.current;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const cardCenter = newX + item.centerOffset;
          const dist = cardCenter - wrapperCenter;

          // Ignora cards fora da área visível
          if (cardCenter < -100 || cardCenter > (wrapperWidthRef.current || wrapper.clientWidth) + 100) {
            continue;
          }

          // Se for o card que acabou de sair do centro, espera ele se afastar
          if (item.element === lastActiveCardRef.current) {
            if (Math.abs(dist) > 45) {
              lastActiveCardRef.current = null;
            }
            continue;
          }

          // Quando a imagem chega exatamente ao centro
          if (Math.abs(dist) <= 3.5) {
            isPausedRef.current = true;
            const card = item.element;

            // 1. CARROSSEL INTEIRO PARA COMPLETAMENTE
            // 2. IMAGEM CENTRAL AUMENTA SUAVEMENTE
            card.classList.add("is-active-center");

            // A imagem volta suavemente ao tamanho normal sincronizada com o fim da pausa
            const t1 = window.setTimeout(() => {
              card.classList.remove("is-active-center");
            }, pauseDuration - 550);

            // Carrossel retoma a rotação imediatamente sem hesitação
            const t2 = window.setTimeout(() => {
              lastActiveCardRef.current = card;
              lastTimeRef.current = null; // Reinicia delta de tempo zerado para partida suave imediata
              isPausedRef.current = false;
            }, pauseDuration);

            autoTimersRef.current.push(t1, t2);
            break;
          }
        }
      }

      animRef.current = requestAnimationFrame(checkAndMoveLoop);
    };

    animRef.current = requestAnimationFrame(checkAndMoveLoop);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      autoTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [cards, speedSeconds, pauseDuration]);

  // 2. Navegação manual ao clicar em qualquer serviço na aba Serviços:
  // Localiza a ocorrência do serviço no loop infinito e desliza suavemente até o centro
  useEffect(() => {
    if (!targetService || !wrapperRef.current || !trackRef.current || !cards || cards.length === 0) return;

    // Cancela animações e timers anteriores se houver novo clique
    if (manualAnimIdRef.current) {
      cancelAnimationFrame(manualAnimIdRef.current);
      manualAnimIdRef.current = null;
    }
    manualNavTimersRef.current.forEach((t) => clearTimeout(t));
    manualNavTimersRef.current = [];
    autoTimersRef.current.forEach((t) => clearTimeout(t));
    autoTimersRef.current = [];

    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!oneSetWidthRef.current) updateMetrics();
    const oneSetWidth = oneSetWidthRef.current;

    // Pausa a rotação automática enquanto navega manualmente
    isManualNavigatingRef.current = true;
    isPausedRef.current = true;

    // Remove destaque de cards anteriores
    const prevActive = track.querySelectorAll(".is-active-center");
    prevActive.forEach((c) => c.classList.remove("is-active-center"));

    // Se a esteira estiver nos extremos, normaliza imperceptivelmente para o centro antes de calcular
    if (oneSetWidth > 0) {
      let normalizedX = currentXRef.current;
      while (normalizedX <= -oneSetWidth * 4) {
        normalizedX += oneSetWidth;
      }
      while (normalizedX >= -oneSetWidth * 1.5) {
        normalizedX -= oneSetWidth;
      }
      if (normalizedX !== currentXRef.current) {
        currentXRef.current = normalizedX;
        track.style.transform = `translate3d(${normalizedX}px, 0, 0)`;
      }
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const screenCenter = wrapperRect.left + wrapperRect.width / 2;

    // Encontra todos os cards correspondentes a esse serviço na esteira contínua
    const matchingCards = track.querySelectorAll<HTMLElement>(
      `.marquee-card[data-service-id="${targetService.id}"]`
    );

    if (matchingCards.length === 0) {
      isManualNavigatingRef.current = false;
      isPausedRef.current = false;
      return;
    }

    // Escolhe a ocorrência à direita do centro mais próxima de chegar (fluxo natural para a esquerda)
    let chosenCard: HTMLElement | null = null;
    let minPositiveDist = Infinity;

    for (let i = 0; i < matchingCards.length; i++) {
      const card = matchingCards[i];
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = cardCenter - screenCenter;

      if (dist >= 15 && dist < minPositiveDist) {
        minPositiveDist = dist;
        chosenCard = card;
      }
    }

    // Fallback de segurança se nenhuma estiver >= 15px à frente
    if (!chosenCard) {
      let minAbsDist = Infinity;
      for (let i = 0; i < matchingCards.length; i++) {
        const card = matchingCards[i];
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - screenCenter);
        if (dist < minAbsDist) {
          minAbsDist = dist;
          chosenCard = card;
        }
      }
      if (chosenCard) {
        const rect = chosenCard.getBoundingClientRect();
        minPositiveDist = (rect.left + rect.width / 2) - screenCenter;
      }
    }

    if (!chosenCard) {
      isManualNavigatingRef.current = false;
      isPausedRef.current = false;
      return;
    }

    const activeCard = chosenCard;
    const startX = currentXRef.current;
    const targetX = startX - minPositiveDist;
    const duration = 1150; // 1.15 segundos para deslizar suavemente até o centro
    const startTime = performance.now();

    const animateToTarget = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const currentPosition = startX + (targetX - startX) * eased;
      currentXRef.current = currentPosition;
      track.style.transform = `translate3d(${currentPosition}px, 0, 0)`;

      if (progress < 1) {
        manualAnimIdRef.current = requestAnimationFrame(animateToTarget);
      } else {
        manualAnimIdRef.current = null;
        // A imagem do serviço selecionado chegou exatamente ao centro:
        // 1. CARROSSEL PARA COMPLETAMENTE NO CENTRO
        // 2. A IMAGEM CENTRAL SELECIONADA AUMENTA SUAVEMENTE
        activeCard.classList.add("is-active-center");

        // Permanece ampliada durante o período de destaque
        const t1 = window.setTimeout(() => {
          activeCard.classList.remove("is-active-center");
        }, pauseDuration - 550);

        // Depois dos 8 segundos, retoma a rotação contínua imediatamente sem gargalo
        const t2 = window.setTimeout(() => {
          lastActiveCardRef.current = activeCard;
          lastTimeRef.current = null; // Reinicia delta de tempo zerado para partida suave imediata
          isPausedRef.current = false;
          isManualNavigatingRef.current = false;
        }, pauseDuration);

        manualNavTimersRef.current.push(t1, t2);
      }
    };

    manualAnimIdRef.current = requestAnimationFrame(animateToTarget);

    return () => {
      if (manualAnimIdRef.current) cancelAnimationFrame(manualAnimIdRef.current);
      manualNavTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [targetService, cards, pauseDuration]);

  if (!cards || cards.length === 0) return null;

  return (
    <div
      ref={wrapperRef}
      className="marquee-wrapper"
      aria-label="Galeria contínua de trabalhos e estilo"
    >
      <div ref={trackRef} className="marquee-track">
        {allCards.map((item, index) => {
          const card = item.card;
          const cardContent = (
            <>
              <img
                src={card.imgUrl}
                alt={card.alt || card.title || `Trabalho ${index + 1}`}
                loading={index < 8 ? "eager" : "lazy"}
                className="marquee-card-image"
              />
              <div className="marquee-card-shade" aria-hidden="true" />
              {(card.tag || card.title) && (
                <div className="marquee-card-info">
                  {card.tag && <span className="marquee-card-tag">{card.tag}</span>}
                  {card.title && <strong className="marquee-card-title">{card.title}</strong>}
                </div>
              )}
            </>
          );

          return card.linkUrl ? (
            <a
              key={item.virtualKey}
              href={card.linkUrl}
              data-service-id={card.id}
              className="marquee-card"
              target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              {cardContent}
            </a>
          ) : (
            <div
              key={item.virtualKey}
              data-service-id={card.id}
              className="marquee-card"
            >
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
