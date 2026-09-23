import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  end: number;
  duration?: number;
  padLength?: number;
  className?: string;
}

export function CountUp({ end, duration = 2600, padLength = 2, className }: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.unobserve(element);

          const startTime = performance.now();

          const updateCount = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Curva ease-out cúbica para transição suave
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(easeOut * end);

            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          };

          requestAnimationFrame(updateCount);
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={elementRef} className={className}>
      {String(count).padStart(padLength, "0")}
    </span>
  );
}

export default CountUp;
