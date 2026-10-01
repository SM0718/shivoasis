import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";

import "./chroma-grid.css";

/*
 * Chroma Grid, from React Bits (https://reactbits.dev/components/chroma-grid).
 * A grid of tiles held in greyscale by two masked backdrop-filter layers;
 * moving the pointer reveals full colour in a radius around the cursor.
 *
 * Typed port of the published JS/CSS version. The library's inline `demo`
 * array of pravatar avatars was dropped: every call site passes `items`, so
 * the demo could only ever surface as unintended placeholder faces.
 */

export interface ChromaItem {
  image: string;
  title: string;
  subtitle?: string;
  alt?: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  location?: string;
}

export interface ChromaGridProps {
  items: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

export const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fadeRef = useRef<HTMLDivElement | null>(null);
  const setX = useRef<((value: number) => void) | null>(null);
  const setY = useRef<((value: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;

    if (!el) {
      return;
    }

    // gsap.quickSetter is typed as returning a bare Function.
    const xSetter = gsap.quickSetter(el, "--x", "px") as (value: number) => void;
    const ySetter = gsap.quickSetter(el, "--y", "px") as (value: number) => void;

    setX.current = xSetter;
    setY.current = ySetter;

    const { width, height } = el.getBoundingClientRect();

    pos.current = { x: width / 2, y: height / 2 };

    xSetter(pos.current.x);
    ySetter(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;

    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();

    moveTo(event.clientX - rect.left, event.clientY - rect.top);

    gsap.to(fadeRef.current, {
      opacity: 0,
      duration: 0.25,
      overwrite: true,
    });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((item, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(item.url)}
          style={
            {
              "--card-border": item.borderColor || "transparent",
              "--card-gradient": item.gradient,
              cursor: item.url ? "pointer" : "default",
            } as CSSProperties
          }
        >
          <div className="chroma-img-wrapper">
            <img src={item.image} alt={item.alt ?? item.title} loading="lazy" />
          </div>

          <footer className="chroma-info">
            <h3 className="name">{item.title}</h3>

            {item.handle && <span className="handle">{item.handle}</span>}

            {item.subtitle && <p className="role">{item.subtitle}</p>}

            {item.location && <span className="location">{item.location}</span>}
          </footer>
        </article>
      ))}

      <div className="chroma-overlay" />

      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
