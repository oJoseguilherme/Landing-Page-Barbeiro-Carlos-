import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type HighlightFrom = "left" | "right" | "top" | "bottom";

export interface HighlightedTextProps {
  children: ReactNode;
  className?: string;
  highlightClassName?: string;
  from?: HighlightFrom;
  delay?: number;
  duration?: number;
  inView?: boolean;
  once?: boolean;
}

const getTranslateStyle = (from: HighlightFrom, isVisible: boolean) => {
  if (isVisible) {
    return { transform: "translate(0, 0)", opacity: 1 };
  }
  switch (from) {
    case "left":
      return { transform: "translateX(-100%)", opacity: 0.3 };
    case "right":
      return { transform: "translateX(100%)", opacity: 0.3 };
    case "top":
      return { transform: "translateY(-100%)", opacity: 0.3 };
    case "bottom":
    default:
      return { transform: "translateY(100%)", opacity: 0.3 };
  }
};

export function HighlightedText({
  children,
  className,
  highlightClassName,
  from = "left",
  delay = 0,
  duration = 1.15,
  inView = true,
  once = true,
}: HighlightedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(!inView);

  useEffect(() => {
    if (!inView) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, once]);

  const animStyle = getTranslateStyle(from, isVisible);

  return (
    <span
      ref={containerRef}
      className={cn(
        "relative inline-block overflow-hidden align-baseline px-[0.18em] -mx-[0.18em] py-[0.04em] rounded-[2px]",
        className
      )}
    >
      {/* Faixa deslizante de destaque */}
      <span
        aria-hidden="true"
        className={cn(
          "highlight-slide absolute inset-0 z-0 pointer-events-none rounded-[2px]",
          highlightClassName || "bg-[rgba(195,165,121,0.28)] border-b-[2px] border-[#c3a579]"
        )}
        style={{
          ...animStyle,
          transition: `transform ${duration}s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s, opacity 0.5s ease ${delay}s`,
          willChange: "transform",
        }}
      />
      {/* Texto com z-index para ficar acima do highlight */}
      <span className="relative z-10">{children}</span>
    </span>
  );
}

export default HighlightedText;
