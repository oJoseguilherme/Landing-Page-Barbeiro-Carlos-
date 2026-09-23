export interface CardItem {
  imgUrl: string;
  alt?: string;
  title?: string;
  tag?: string;
  linkUrl?: string;
}

interface CardCarouselProps {
  cards: CardItem[];
  speedSeconds?: number;
}

export default function CardCarousel({ cards, speedSeconds = 25 }: CardCarouselProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="marquee-wrapper" aria-label="Galeria contínua de trabalhos e estilo">
      <div className="marquee-track" style={{ "--marquee-duration": `${speedSeconds}s` } as React.CSSProperties}>
        {/* Primeiro grupo */}
        <div className="marquee-group">
          {cards.map((card, index) => {
            const cardContent = (
              <>
                <img
                  src={card.imgUrl}
                  alt={card.alt || card.title || `Trabalho ${index + 1}`}
                  loading="lazy"
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
                key={`group1-${index}`}
                href={card.linkUrl}
                className="marquee-card"
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                {cardContent}
              </a>
            ) : (
              <div key={`group1-${index}`} className="marquee-card">
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Segundo grupo duplicado para efeito infinito sem emendas */}
        <div className="marquee-group" aria-hidden="true">
          {cards.map((card, index) => {
            const cardContent = (
              <>
                <img
                  src={card.imgUrl}
                  alt={card.alt || card.title || `Trabalho ${index + 1}`}
                  loading="lazy"
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
                key={`group2-${index}`}
                href={card.linkUrl}
                className="marquee-card"
                tabIndex={-1}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                {cardContent}
              </a>
            ) : (
              <div key={`group2-${index}`} className="marquee-card">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
