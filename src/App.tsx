import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import CardCarousel, { type CardItem } from "./components/ui/card-fan-carousel";
import { HighlightedText } from "./components/highlighted-text";
import { CountUp } from "./components/ui/count-up";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INSTAGRAM_URL = "https://www.instagram.com/carlos_alexandre_barbeiro/";
const INSTAGRAM_DM_URL = "https://ig.me/m/carlos_alexandre_barbeiro";

const experienceCards: CardItem[] = [
  {
    imgUrl: "https://images.pexels.com/photos/39559324/pexels-photo-39559324.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Corte degradê masculino refinado e barba desenhada",
    tag: "IDENTIDADE",
    title: "Degradê e Alinhamento",
  },
  {
    imgUrl: "https://images.pexels.com/photos/39559306/pexels-photo-39559306.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Barbeiro executando corte com tesoura e pente de precisão",
    tag: "TÉCNICA",
    title: "Corte na Tesoura",
  },
  {
    imgUrl: "https://images.pexels.com/photos/18503657/pexels-photo-18503657.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Modelagem e desenho de barba masculina com lâmina",
    tag: "CUIDADO",
    title: "Barba Esculpida",
  },
  {
    imgUrl: "https://images.pexels.com/photos/39559261/pexels-photo-39559261.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Finalização de corte masculino com máquina e precisão",
    tag: "PRECISÃO",
    title: "Acabamento Perfeito",
  },
  {
    imgUrl: "https://images.pexels.com/photos/9992819/pexels-photo-9992819.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Textura e detalhamento dos fios na barbearia",
    tag: "TEXTURA",
    title: "Estilo Contemporâneo",
  },
  {
    imgUrl: "https://images.pexels.com/photos/39559325/pexels-photo-39559325.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Homem com visual impecável após atendimento na barbearia",
    tag: "RESULTADO",
    title: "Presença Masculina",
  },
  {
    imgUrl: "https://images.pexels.com/photos/4625621/pexels-photo-4625621.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Atendimento personalizado de cuidado com a barba",
    tag: "RITUAL",
    title: "Experiência Completa",
  },
];

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Contato", href: "#agendamento" },
];

const services = [
  {
    number: "01",
    title: "Corte masculino",
    description: "Cortes personalizados de acordo com o formato do rosto e o estilo pessoal.",
  },
  {
    number: "02",
    title: "Barba",
    description: "Modelagem e acabamento profissional para cada detalhe fazer a diferença.",
  },
  {
    number: "03",
    title: "Alisamento capilar",
    description: "Alinhamento e redução de volume com acabamento natural e fios saudáveis.",
  },
  {
    number: "04",
    title: "Luzes capilares",
    description: "Iluminação e contraste sob medida para valorizar seu corte e seu estilo.",
  },
  {
    number: "05",
    title: "Platinado Global",
    description: "Descoloração e matização de alta precisão para um tom platinado uniforme e marcante.",
  },
];

const portfolio = [
  {
    src: "https://images.pexels.com/photos/39559324/pexels-photo-39559324.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Perfil de um homem com corte degradê e barba bem desenhada",
    title: "Forma e identidade",
    detail: "CORTE MASCULINO",
  },
  {
    src: "https://images.pexels.com/photos/39559306/pexels-photo-39559306.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Barbeiro trabalhando com tesoura e pente nos fios de um cliente",
    title: "Precisão no detalhe",
    detail: "TÉCNICA",
  },
  {
    src: "https://images.pexels.com/photos/18503657/pexels-photo-18503657.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Barbeiro fazendo o acabamento da barba de um cliente",
    title: "Cuidado de perto",
    detail: "BARBA",
  },
  {
    src: "https://images.pexels.com/photos/39559261/pexels-photo-39559261.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Barbeiro utilizando máquina para finalizar um corte masculino",
    title: "O corte certo",
    detail: "ACABAMENTO",
  },
];

const instagramPhotos = [
  {
    src: "https://images.pexels.com/photos/9992819/pexels-photo-9992819.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Detalhe de um corte de cabelo sendo realizado na barbearia",
  },
  {
    src: "https://images.pexels.com/photos/39559325/pexels-photo-39559325.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Perfil de um homem com corte masculino moderno",
  },
  {
    src: "https://images.pexels.com/photos/4625621/pexels-photo-4625621.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Cliente recebendo cuidados de barba na barbearia",
  },
];


function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const galleryOpenerRef = useRef<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [whatsAppNoticeOpen, setWhatsAppNoticeOpen] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const hero = gsap.timeline({ defaults: { ease: "power2.out" } });
      hero
        .fromTo(
          ".hero-media",
          { clipPath: "inset(5% 0% 0% 0%)", opacity: 0.2 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.35 }
        )
        .fromTo(".hero-image", { scale: 1.055 }, { scale: 1, duration: 2.15, ease: "power1.out" }, 0)
        .fromTo(".hero-shade", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.2)
        .fromTo(
          ".hero-kicker, .hero-title, .hero-subtitle",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.13 },
          0.62
        )
        .fromTo(
          ".hero-actions a",
          { opacity: 0, y: 13, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          1.1
        );

      gsap.to(".hero-image", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 1.3 },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 27 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          }
        );
      });


      gsap.fromTo(
        ".manifesto-line",
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 32 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          y: 0,
          duration: 1.05,
          ease: "power3.out",
          stagger: 0.16,
          scrollTrigger: { trigger: ".manifesto-heading", start: "top 80%", once: true },
        }
      );
    },
    { scope: rootRef }
  );

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastState = "";

    const updateHeader = () => {
      const scrolled = window.scrollY > 30;
      const mobile = window.innerWidth <= 900;
      const nextState = `${scrolled}-${mobile}`;
      if (nextState === lastState) return;
      lastState = nextState;
      header.classList.toggle("is-scrolled", scrolled);
      gsap.to(header, {
        height: scrolled ? (mobile ? 68 : 74) : mobile ? 80 : 96,
        backgroundColor: scrolled ? "rgba(5, 27, 23, 0.9)" : "rgba(5, 27, 23, 0)",
        boxShadow: scrolled ? "0 10px 32px rgba(0, 0, 0, 0.1)" : "0 0 0 rgba(0, 0, 0, 0)",
        duration: prefersReducedMotion() ? 0 : 0.48,
        ease: "power2.out",
        overwrite: true,
      });
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
      gsap.killTweensOf(header);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        ".mobile-menu-link",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.055, ease: "power2.out" }
      );
    }
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const galleryIsOpen = activeImage !== null;
  useEffect(() => {
    if (!galleryIsOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightboxCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
      if (event.key === "ArrowRight") setActiveImage((current) => (current === null ? null : (current + 1) % portfolio.length));
      if (event.key === "ArrowLeft") setActiveImage((current) => (current === null ? null : (current - 1 + portfolio.length) % portfolio.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
      galleryOpenerRef.current?.focus();
    };
  }, [galleryIsOpen]);

  useEffect(() => {
    if (!whatsAppNoticeOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWhatsAppNoticeOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [whatsAppNoticeOpen]);

  const animateService = (event: MouseEvent<HTMLAnchorElement>, entering: boolean) => {
    if (prefersReducedMotion()) return;
    const number = event.currentTarget.querySelector(".service-index");
    const arrow = event.currentTarget.querySelector(".service-arrow");
    if (number) {
      animate(number, {
        translateX: entering ? 7 : 0,
        color: entering ? "#a8804d" : "#8a8c82",
        duration: 360,
        ease: "out(3)",
      });
    }
    if (arrow) {
      animate(arrow, {
        translateX: entering ? 4 : 0,
        translateY: entering ? -4 : 0,
        duration: 360,
        ease: "out(3)",
      });
    }
  };

  const openGallery = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    galleryOpenerRef.current = event.currentTarget;
    setActiveImage(index);
  };

  return (
    <div className="site-shell" ref={rootRef}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className={`site-header${menuOpen ? " is-menu-open" : ""}`} ref={headerRef}>
        <div className="header-inner content-width">
          <a className="brand-lockup" href="#inicio" aria-label="Carlos Alexandre Barbeiro, ir para o início" onClick={() => setMenuOpen(false)}>
            <span>CARLOS ALEXANDRE</span>
            <small>BARBEIRO</small>
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map((item) => (
              <a href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>

          <a className="header-book" href="#agendamento">
            AGENDAR <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={25} strokeWidth={1.5} /> : <Menu size={25} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-menu" id="menu-mobile" aria-label="Navegação mobile">
          <div className="mobile-menu-inner content-width">
            {navigation.map((item, index) => (
              <a className="mobile-menu-link" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
              </a>
            ))}
            <a className="mobile-menu-book mobile-menu-link" href="#agendamento" onClick={() => setMenuOpen(false)}>
              Agendar horário <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}

      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <picture className="hero-picture">
              <source media="(max-width: 700px)" srcSet="/images/hero-mobile.jpg" />
              <img className="hero-image" src="/images/hero-barber.jpg" alt="" fetchPriority="high" />
            </picture>
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content content-width">
            <p className="hero-kicker">BARBEIRO <span /> PALMAS, TO</p>
            <h1 className="hero-title" id="hero-title">CARLOS<br /><em>ALEXANDRE.</em></h1>
            <p className="hero-subtitle">Estilo é identidade.</p>
          </div>
          <div className="hero-actions">
            <a href="#agendamento">AGENDAR <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" /></a>
            <a href="#trabalhos">TRABALHOS <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="experience section-pad" id="experiencia" aria-labelledby="experience-title">
          <div className="content-width experience-layout">
            <div className="experience-header" data-reveal>
              <p className="section-kicker kicker-center">
                <span className="kicker-line" /> 01 / A EXPERIÊNCIA <span className="kicker-line" />
              </p>
              <h2 className="section-title experience-title" id="experience-title">
                NÃO É APENAS<br />
                <em>
                  <HighlightedText from="left" inView={true} delay={0.2} highlightClassName="about-highlight-bg">
                    UM CORTE.
                  </HighlightedText>
                </em>
              </h2>
            </div>

            {/* Carrossel Marquee contínuo e infinito */}
            <div className="experience-carousel-slot" id="experience-carousel-slot" data-reveal>
              <CardCarousel cards={experienceCards} speedSeconds={25} />
            </div>

            <div className="experience-footer" data-reveal>
              <p className="experience-description">
                Cada etapa importa. Do primeiro olhar ao último detalhe, tudo é pensado para você sair sendo ainda mais você.
              </p>
              <a className="experience-book-btn" href="#agendamento">
                AGENDAR HORÁRIO <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="about section-pad" id="sobre" aria-labelledby="about-title">
          <div className="content-width about-grid">
            <div className="about-copy">
              <p className="section-kicker" data-reveal><span className="kicker-line" /> 02 / SOBRE</p>
              <h2 className="section-title about-title" id="about-title" data-reveal>
                PRECISÃO EM<br />
                <em>
                  <HighlightedText from="left" inView={true} delay={0.2} highlightClassName="about-highlight-bg">
                    CADA DETALHE.
                  </HighlightedText>
                </em>
              </h2>
              <p className="about-description" data-reveal>
                Cada corte carrega uma identidade. O objetivo é entender o estilo de cada cliente e transformar técnica, experiência e cuidado em um resultado que realmente combine com ele.
              </p>
              <div className="about-facts" data-reveal>
                <div className="about-years">
                  <strong>
                    <CountUp end={8} duration={2600} className="about-years-number" />
                    <sup>+</sup>
                  </strong>
                  <span className="about-years-label">ANOS DE<br />EXPERIÊNCIA</span>
                </div>
                <p>BARBEIRO PROFISSIONAL<br /><span>PALMAS, TO</span></p>
              </div>
              <div className="about-action" data-reveal>
                <a className="about-book-btn" href="#agendamento">
                  AGENDAR HORÁRIO <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="about-visual" data-reveal>
              <img src="/images/about-barber.jpg" alt="Barbeiro concentrado no corte de cabelo de um cliente" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="services section-pad" id="servicos" aria-labelledby="services-title">
          <div className="content-width">
            <div className="section-intro services-intro">
              <div>
                <p className="section-kicker dark-kicker" data-reveal><span className="kicker-line" /> 03 / O QUE FAÇO</p>
                <h2 className="section-title dark-title" id="services-title" data-reveal>SERVIÇOS</h2>
              </div>
            </div>
            <div className="services-list">
              {services.map((service) => (
                <a
                  className="service-item"
                  href="#agendamento"
                  key={service.number}
                  onMouseEnter={(event) => animateService(event, true)}
                  onMouseLeave={(event) => animateService(event, false)}
                  aria-label={`${service.title}. Ir para agendamento`}
                >
                  <span className="service-index">{service.number}</span>
                  <div className="service-info"><h3>{service.title}</h3><p>{service.description}</p></div>
                  <ArrowUpRight className="service-arrow" size={26} strokeWidth={1.2} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="portfolio section-pad" id="trabalhos" aria-labelledby="portfolio-title">
          <div className="content-width">
            <div className="section-intro portfolio-intro">
              <div>
                <p className="section-kicker" data-reveal><span className="kicker-line" /> 04 / TRABALHOS</p>
                <h2 className="section-title" id="portfolio-title" data-reveal>SEU ESTILO.<br /><em>NOSSA ASSINATURA.</em></h2>
              </div>
              <p className="intro-note" data-reveal>Uma expressão única em cada detalhe.</p>
            </div>
            <div className="portfolio-grid" aria-label="Galeria de inspiração de cortes e barbas">
              {portfolio.map((image, index) => (
                <button
                  className={`portfolio-tile portfolio-tile-${index + 1}`}
                  type="button"
                  key={image.src}
                  onClick={(event) => openGallery(index, event)}
                  aria-label={`Ampliar imagem ${index + 1}: ${image.title}`}
                >
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <span className="portfolio-tile-shade" aria-hidden="true" />
                  <span className="portfolio-caption"><span>{String(index + 1).padStart(2, "0")} / {image.detail}</span><strong>{image.title}</strong></span>
                  <ArrowUpRight className="portfolio-open" size={22} strokeWidth={1.3} aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="portfolio-disclaimer">Imagens editoriais ilustrativas. Portfólio autoral em atualização.</p>
          </div>
        </section>

        <section className="manifesto section-pad" aria-labelledby="manifesto-title">
          <div className="content-width manifesto-inner">
            <p className="section-kicker" data-reveal><span className="kicker-line" /> MAIS QUE APARÊNCIA</p>
            <h2 className="manifesto-heading" id="manifesto-title">
              <span className="manifesto-line">GRANDES HISTÓRIAS</span>
              <span className="manifesto-line">COMEÇAM QUANDO</span>
              <span className="manifesto-line">VOCÊ DECIDE</span>
              <span className="manifesto-line"><em>OCUPAR O SEU LUGAR.</em></span>
            </h2>
          </div>
        </section>

        <section className="instagram-section section-pad" id="instagram" aria-labelledby="instagram-title">
          <div className="content-width">
            <div className="section-intro instagram-intro">
              <div>
                <p className="section-kicker dark-kicker" data-reveal><span className="kicker-line" /> 05 / NO INSTAGRAM</p>
                <h2 className="section-title dark-title" id="instagram-title" data-reveal>ACOMPANHE<br /><em>O TRABALHO.</em></h2>
              </div>
              <div className="instagram-contact" data-reveal>
                <p>@carlos_alexandre_barbeiro</p>
                <a className="line-button dark-button" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  VER NO INSTAGRAM <ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="instagram-images">
              {instagramPhotos.map((photo, index) => (
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" key={photo.src} aria-label={`Abrir Instagram, foto ${index + 1}`}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <span aria-hidden="true"><Camera size={22} strokeWidth={1.5} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="booking section-pad" id="agendamento" aria-labelledby="booking-title">
          <div className="content-width booking-inner">
            <p className="section-kicker" data-reveal><span className="kicker-line" /> 06 / AGENDAMENTO</p>
            <h2 className="section-title booking-title" id="booking-title" data-reveal>SEU PRÓXIMO<span className="booking-mobile-break"><br /></span> CORTE<br /><em>COMEÇA AQUI.</em></h2>
            <div className="booking-bottom" data-reveal>
              <div><p>Escolha seu horário e venha viver uma experiência diferente.</p><span>PALMAS, TO</span></div>
              <a className="booking-cta" href={INSTAGRAM_DM_URL} target="_blank" rel="noreferrer" aria-label="Agendar horário pelo direct do Instagram">
                AGENDAR HORÁRIO <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="content-width">
          <div className="footer-top">
            <div><p>CARLOS ALEXANDRE BARBEIRO</p><h2>ESTILO É <em>IDENTIDADE.</em></h2></div>
            <a href="#inicio" aria-label="Voltar ao início">VOLTAR AO TOPO <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
          </div>
          <div className="footer-bottom">
            <span>PALMAS, TOCANTINS</span>
            <nav aria-label="Links de contato">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
              <button type="button" onClick={() => setWhatsAppNoticeOpen(true)}>WhatsApp</button>
              <a href="#agendamento">Agendamento</a>
            </nav>
            <span>© {new Date().getFullYear()} CARLOS ALEXANDRE</span>
          </div>
        </div>
      </footer>

      {activeImage !== null && (
        <div className="lightbox-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveImage(null); }}>
          <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Imagem ${activeImage + 1} de ${portfolio.length}: ${portfolio[activeImage].title}`}>
            <button className="lightbox-close" type="button" onClick={() => setActiveImage(null)} ref={lightboxCloseRef} aria-label="Fechar galeria"><X size={24} strokeWidth={1.4} /></button>
            <img src={portfolio[activeImage].src} alt={portfolio[activeImage].alt} />
            <div className="lightbox-bottom">
              <div><span>{String(activeImage + 1).padStart(2, "0")} / {String(portfolio.length).padStart(2, "0")}</span><p>{portfolio[activeImage].title}</p></div>
              <div className="lightbox-controls">
                <button type="button" onClick={() => setActiveImage((activeImage - 1 + portfolio.length) % portfolio.length)} aria-label="Imagem anterior"><ChevronLeft size={22} strokeWidth={1.4} /></button>
                <button type="button" onClick={() => setActiveImage((activeImage + 1) % portfolio.length)} aria-label="Próxima imagem"><ChevronRight size={22} strokeWidth={1.4} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {whatsAppNoticeOpen && (
        <div className="contact-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setWhatsAppNoticeOpen(false); }}>
          <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title">
            <button type="button" className="contact-close" onClick={() => setWhatsAppNoticeOpen(false)} aria-label="Fechar aviso"><X size={20} /></button>
            <span className="section-kicker">CONTATO</span>
            <h2 id="contact-dialog-title">Vamos conversar?</h2>
            <p>O número de WhatsApp ainda não foi informado. Para agendar agora, fale diretamente pelo Instagram.</p>
            <a className="line-button" href={INSTAGRAM_DM_URL} target="_blank" rel="noreferrer" onClick={() => setWhatsAppNoticeOpen(false)}>ABRIR DIRECT <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      )}
    </div>
  );
}