import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Menu,
  MessageCircle,
  Play,
  X,
} from "lucide-react";

import CardCarousel, { type CardItem } from "./components/ui/card-fan-carousel";
import { HighlightedText } from "./components/highlighted-text";
import { CountUp } from "./components/ui/count-up";
import { trackBookingClick } from "./utils/analytics";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INSTAGRAM_URL = "https://www.instagram.com/carlos_alexandre_barbeiro/";
const WHATSAPP_URL = "https://wa.me/559492047863?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20agendar%20um%20hor%C3%A1rio!";

const services = [
  {
    id: "corte",
    number: "01",
    title: "Corte",
    tag: "01 • VISAGISMO & PRECISÃO",
    description: "Corte — estilo e acabamento personalizado.",
    imgUrl: "/images/corte.webp",
    alt: "Corte degradê masculino refinado e barba desenhada pelo barbeiro Carlos Alexandre",
  },
  {
    id: "barba",
    number: "02",
    title: "Barba",
    tag: "02 • TOALHA QUENTE & NAVALHA",
    description: "Barba — modelagem e acabamento para um visual alinhado.",
    imgUrl: "/images/barba.webp",
    alt: "Modelagem e desenho de barba masculina com toalha quente e lâmina",
  },
  {
    id: "alisado",
    number: "03",
    title: "Alisado Capilar",
    tag: "03 • ALINHAMENTO & BRILHO",
    description: "Alisado Capilar — tratamento e acabamento para fios mais alinhados.",
    imgUrl: "/images/alisamentoCapilar.webp",
    alt: "Trabalho de alisamento capilar masculino com acabamento e brilho",
  },
  {
    id: "luzes",
    number: "04",
    title: "Luzes Capilares",
    tag: "04 • ILUMINAÇÃO SOB MEDIDA",
    description: "Luzes Capilares — iluminação e personalização do visual.",
    imgUrl: "/images/luzesCapilares.webp",
    alt: "Textura e iluminação de mechas e luzes capilares masculinas",
  },
  {
    id: "platinado",
    number: "05",
    title: "Platinado Global",
    tag: "05 • TOM UNIFORME & IMPACTO",
    description: "Platinado Global — transformação completa com acabamento profissional.",
    imgUrl: "/images/platinadoGlobal.webp",
    alt: "Platinado global masculino de alto impacto e tom uniforme",
  },
];

const experienceCards: CardItem[] = services.map((s) => ({
  id: s.id,
  number: s.number,
  title: s.title,
  tag: s.tag,
  description: s.description,
  imgUrl: s.imgUrl,
  alt: s.alt,
  linkUrl: WHATSAPP_URL,
}));

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#agendamento" },
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
    src: "/images/capaVideo1.webp",
    alt: "Corte e acabamento de alta precisão por Carlos Alexandre Barbeiro",
    url: "https://www.instagram.com/p/DdHVnZDpxk7/",
  },
  {
    src: "/images/capaVideo2.webp",
    alt: "Estilo e modelagem de barba profissional por Carlos Alexandre Barbeiro",
    url: "https://www.instagram.com/p/Dc56mJAOWld/",
  },
  {
    src: "/images/capaVideo3.webp",
    alt: "Transformação e cuidado visual por Carlos Alexandre Barbeiro",
    url: "https://www.instagram.com/p/Dc118kIuAKc/",
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
  const [targetService, setTargetService] = useState<{ id: string; timestamp: number } | null>(null);

  const handleSelectService = (serviceId: string) => {
    setTargetService({ id: serviceId, timestamp: Date.now() });

    const carouselSlot =
      document.getElementById("experience-carousel-slot") ||
      document.getElementById("experiencia");
    if (carouselSlot) {
      carouselSlot.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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
          ".hero-kicker, .hero-title",
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

  const animateService = (event: MouseEvent<HTMLElement>, entering: boolean) => {
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

          <a className="header-book" href="#agendamento" onClick={() => trackBookingClick("header")}>
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
            <a className="mobile-menu-book mobile-menu-link" href="#agendamento" onClick={() => { trackBookingClick("mobile_menu"); setMenuOpen(false); }}>
              Agendar horário <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}

      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <video
              className="hero-video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/images/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content content-width">
            <p className="hero-kicker">BARBEIRO <span /> PALMAS, TO</p>
            <h1 className="hero-title" id="hero-title">CARLOS<br /><em>ALEXANDRE.</em></h1>
          </div>
          <div className="hero-actions">
            <a href="#agendamento" onClick={() => trackBookingClick("hero")}>AGENDAR <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" /></a>
            <a href="#localizacao">LOCALIZAÇÃO <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" /></a>
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
                  <HighlightedText from="left" inView={true} delay={0.2} highlightClassName="experience-highlight-bg">
                    UM CORTE.
                  </HighlightedText>
                </em>
              </h2>
            </div>

            {/* Carrossel Marquee contínuo e infinito */}
            <div className="experience-carousel-slot" id="experience-carousel-slot" data-reveal>
              <CardCarousel
                cards={experienceCards}
                speedSeconds={12}
                pauseDuration={8000}
                targetService={targetService}
              />
            </div>

            <div className="experience-footer" data-reveal>
              <p className="experience-description">
                Cada etapa importa. Do primeiro olhar ao último detalhe, tudo é pensado para você sair sendo ainda mais você.
              </p>
              <a className="experience-book-btn" href="#agendamento" onClick={() => trackBookingClick("experience")}>
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
                    <CountUp end={8} duration={900} className="about-years-number" />
                    <sup>+</sup>
                  </strong>
                  <span className="about-years-label">ANOS DE<br />EXPERIÊNCIA</span>
                </div>
                <p>BARBEIRO PROFISSIONAL<br /><span>PALMAS, TO</span></p>
              </div>
              <div className="about-action" data-reveal>
                <a className="about-book-btn" href="#agendamento" onClick={() => trackBookingClick("about")}>
                  AGENDAR HORÁRIO <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="about-visual-wrapper" data-reveal>
              <div className="about-visual">
                <img src="/images/barbeiro.webp" alt="Carlos Alexandre Barbeiro em atendimento profissional em Palmas, TO" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="servicos" aria-labelledby="services-title">
          <div className="content-width">
            <div className="section-intro services-intro">
              <div>
                <p className="section-kicker dark-kicker" data-reveal><span className="kicker-line" /> 03 / O QUE FAÇO</p>
                <h2 className="section-title dark-title" id="services-title" data-reveal>
                  <em>
                    <HighlightedText from="left" inView={true} delay={0.2} highlightClassName="services-highlight-bg">
                      SERVIÇOS
                    </HighlightedText>
                  </em>
                </h2>
              </div>
            </div>
            <div className="services-list">
              {services.map((service) => (
                <button
                  type="button"
                  className="service-item"
                  key={service.number}
                  onClick={() => handleSelectService(service.id)}
                  onMouseEnter={(event) => animateService(event, true)}
                  onMouseLeave={(event) => animateService(event, false)}
                  aria-label={`${service.title}. Ver no carrossel de experiência`}
                >
                  <span className="service-index">{service.number}</span>
                  <div className="service-info">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-action-hint">
                    <span className="service-hint-badge">Ver experiência</span>
                    <ArrowUpRight className="service-arrow" size={26} strokeWidth={1.2} aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO LOCALIZAÇÃO COM MAPA DARK MODE PREMIUM */}
        <section className="location-section section-pad" id="localizacao" aria-labelledby="location-title">
          <div className="content-width">
            <div className="section-intro location-intro">
              <div>
                <p className="section-kicker" data-reveal><span className="kicker-line" /> 04 / LOCALIZAÇÃO</p>
                <h2 className="section-title" id="location-title" data-reveal>
                  ONDE ESTAMOS.<br />
                  <em>
                    <HighlightedText from="left" inView={true} delay={0.2} highlightClassName="location-highlight-bg">
                      FÁCIL ACESSO.
                    </HighlightedText>
                  </em>
                </h2>
              </div>
            </div>

            <div className="map-wrapper" data-reveal>
              <iframe
                title="Localização Barbearia Toledo em Palmas - TO"
                src="https://maps.google.com/maps?q=-10.1939695,-48.3329488&t=&z=17&ie=UTF8&output=embed"
                className="map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-overlay" aria-hidden="true" />

              {/* Ponteiro Vermelho Oficial e Vibrante */}
              <a
                className="map-pin-overlay"
                href="https://maps.google.com/maps?ftid=0x9324cb005feacb21:0x37a0ae01b09f5824"
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir Barbearia Toledo no Google Maps"
              >
                <div className="map-pin-tooltip">
                  <span className="map-pin-tooltip-dot" />
                  BARBEARIA TOLEDO
                </div>
                <svg className="map-pin-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5z" />
                </svg>
                <div className="map-pin-pulse" />
                <div className="map-pin-dot" />
              </a>

              <div className="map-card">
                {/* Foto da Barbearia / Fachada */}
                <div className="map-card-thumb">
                  <img
                    src="/images/barbearia.webp"
                    alt="Espaço da Barbearia em Palmas/TO"
                    loading="lazy"
                  />
                  <span className="map-card-thumb-badge">BARBEARIA EXCLUSIVA</span>
                </div>

                <div className="map-card-header">
                  <span className="map-badge-icon">
                    <MapPin size={14} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="map-badge-tag">202 SUL — PALMAS, TO</span>
                </div>
                <strong className="map-card-address">
                  AV. SIQUEIRA CAMPOS, CONJ 1 LOTE 13, SALA 1
                </strong>
                <p className="map-card-sub">
                  ACSU-SE 20 (202 Sul) • Plano Diretor Sul, Palmas - TO • CEP 77020-450
                </p>
                <a
                  className="map-card-link"
                  href="https://maps.google.com/maps?ftid=0x9324cb005feacb21:0x37a0ae01b09f5824"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir rota no Google Maps"
                >
                  COMO CHEGAR <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="instagram-section section-pad" id="instagram" aria-labelledby="instagram-title">
          <div className="content-width">
            <div className="section-intro instagram-intro">
              <div>
                <p className="section-kicker dark-kicker" data-reveal><span className="kicker-line" /> 05 / NO INSTAGRAM</p>
                <h2 className="section-title dark-title" id="instagram-title" data-reveal>
                  ACOMPANHE<br />
                  <em>
                    <HighlightedText from="left" inView={true} delay={0.2} highlightClassName="services-highlight-bg">
                      O TRABALHO.
                    </HighlightedText>
                  </em>
                </h2>
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
                <a
                  href={photo.url || INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  key={photo.src}
                  aria-label={`Abrir vídeo do Instagram, publicação ${index + 1}`}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <div className="insta-card-shade" aria-hidden="true" />
                  
                  {/* Badge superior estilo Reels */}
                  <div className="insta-card-badge">
                    <Play size={10} fill="currentColor" aria-hidden="true" />
                    <span>REELS</span>
                  </div>

                  {/* Play central interativo com efeito vidro */}
                  <span className="insta-play-hover" aria-hidden="true">
                    <Play size={22} fill="currentColor" />
                  </span>

                  {/* Rodapé com arroba oficial */}
                  <div className="insta-card-footer">
                    <span>@carlos_alexandre_barbeiro</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="booking section-pad" id="agendamento" aria-labelledby="booking-title">
          <div className="content-width booking-inner">
            <p className="section-kicker" data-reveal><span className="kicker-line" /> 06 / AGENDAMENTO</p>
            <h2 className="section-title booking-title" id="booking-title" data-reveal>
              SEU PRÓXIMO<span className="booking-mobile-break"><br /></span> CORTE<br />
              <em>
                <HighlightedText from="left" inView={true} delay={0.2} highlightClassName="booking-highlight-bg">
                  COMEÇA AQUI.
                </HighlightedText>
              </em>
            </h2>
            <div className="booking-bottom" data-reveal>
              <div><span>202 SUL • PALMAS, TO</span></div>
              <a className="booking-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={() => trackBookingClick("booking_section")} aria-label="Agendar horário pelo WhatsApp">
                AGENDAR HORÁRIO <ArrowUpRight size={20} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-width">
          {/* Grid Principal com 4 Colunas e Breathing Room Generoso */}
          <div className="footer-grid">
            {/* Coluna 1: Marca */}
            <div className="footer-col footer-col-brand">
              <a className="footer-brand" href="#inicio" aria-label="Carlos Alexandre Barbeiro, ir para o início">
                <span className="footer-brand-title">CARLOS ALEXANDRE</span>
                <span className="footer-brand-sub">BARBEIRO</span>
              </a>
              <p className="footer-brand-desc">
                Cortes de alta precisão, visagismo e atendimento exclusivo. Cada detalhe pensado para valorizar sua identidade e estilo no coração de Palmas.
              </p>
              <div className="footer-social-links">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-icon"
                  aria-label="Instagram de Carlos Alexandre"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackBookingClick("footer_whatsapp_icon")}
                  className="footer-social-icon"
                  aria-label="WhatsApp de Carlos Alexandre"
                >
                  <MessageCircle size={18} strokeWidth={1.4} />
                </a>
                <a
                  href="https://maps.google.com/maps?ftid=0x9324cb005feacb21:0x37a0ae01b09f5824"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-icon"
                  aria-label="Localização no Google Maps"
                >
                  <MapPin size={18} strokeWidth={1.4} />
                </a>
              </div>
            </div>

            {/* Coluna 2: Navegação */}
            <div className="footer-col footer-col-nav">
              <h3 className="footer-col-title">NAVEGAÇÃO</h3>
              <ul className="footer-nav-list">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="footer-nav-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3: Contato */}
            <div className="footer-col footer-col-contact">
              <h3 className="footer-col-title">CONTATO</h3>
              <div className="footer-contact-info">
                <div className="footer-info-item">
                  <span className="footer-info-label">WhatsApp</span>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackBookingClick("footer_whatsapp_link")}
                    className="footer-text-btn"
                  >
                    Conversar no WhatsApp
                  </a>
                </div>
                <div className="footer-info-item">
                  <span className="footer-info-label">Instagram</span>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-text-link"
                  >
                    @carlos_alexandre_barbeiro
                  </a>
                </div>
                <div className="footer-info-item">
                  <span className="footer-info-label">Agendamento Online</span>
                  <a
                    href="#agendamento"
                    className="footer-text-link"
                    onClick={() => trackBookingClick("footer")}
                  >
                    Reservar horário exclusivo
                  </a>
                </div>
              </div>
            </div>

            {/* Coluna 4: Atendimento */}
            <div className="footer-col footer-col-location">
              <h3 className="footer-col-title">ATENDIMENTO</h3>
              <div className="footer-location-info">
                <div className="footer-info-item">
                  <strong className="footer-place-name">BARBEARIA TOLEDO</strong>
                  <p className="footer-address-line">ACSU-SE 20 (202 Sul), Av. Siqueira Campos</p>
                  <p className="footer-address-line">Conj. 1, Lote 13, Sala 1 — Palmas, TO</p>
                </div>
                <div className="footer-hours-box">
                  <span className="footer-hours-badge">HORÁRIO DE FUNCIONAMENTO</span>
                  <div className="footer-hours-schedule">
                    <div className="footer-schedule-row">
                      <span>Segunda a Sexta</span>
                      <strong>09:00–12:00 • 13:30–20:00</strong>
                    </div>
                    <div className="footer-schedule-row">
                      <span>Sábado</span>
                      <strong>09:00–16:00</strong>
                    </div>
                    <div className="footer-schedule-row">
                      <span>Domingo</span>
                      <em>Fechado</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Inferior (Bottom Bar) com Breathing Room Generoso */}
          <div className="footer-bottom-bar">
            <span className="footer-copyright">
              © {new Date().getFullYear()} CARLOS ALEXANDRE — TODOS OS DIREITOS RESERVADOS.
            </span>
            <a href="#inicio" className="footer-back-to-top" aria-label="Voltar ao início da página">
              VOLTAR AO TOPO ↑
            </a>
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
            <span className="section-kicker">CONTATO & AGENDAMENTO</span>
            <h2 id="contact-dialog-title">Clica aqui e venha ser feliz!</h2>
            <p>Atendimento exclusivo e de alta precisão. Inicie sua conversa pelo WhatsApp oficial ou garanta seu horário com antecedência.</p>
            <div className="contact-dialog-actions">
              <a
                className="contact-booking-btn"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackBookingClick("modal_agendamento");
                  setWhatsAppNoticeOpen(false);
                }}
              >
                AGENDAR HORÁRIO <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}