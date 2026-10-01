import { useEffect, useRef, useState, type ReactNode } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import "./preloader.css";

gsap.registerPlugin(SplitText);

const WORDMARK = "SHIVOASIS";

const TAGLINE = "Architects";

const SHUTTERS = 5;

/*
 * Bounds the reveal so a stalled asset can never trap the page behind
 * the overlay. The loader still waits on real load; this is only a ceiling.
 */
const MIN_DWELL = 1700;
const MAX_WAIT = 6500;

interface PreloaderProps {
  children: ReactNode;
}

export function Preloader({ children }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  /*
   * A ref rather than a local variable, because StrictMode mounts,
   * unmounts, and remounts in development. An effect-scoped guard is
   * recreated on the second pass, which would let the outro play twice.
   */

  const revealedRef = useRef(false);

  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    if (revealedRef.current) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const startedAt = performance.now();

    const ctx = gsap.context(() => {
      const mark = root.querySelector<HTMLElement>(".preloader__mark");

      const counterNode = root.querySelector<HTMLElement>(
        ".preloader__counter-value",
      );

      const finish = () => {
        if (revealedRef.current) return;

        revealedRef.current = true;

        const wait = Math.max(0, MIN_DWELL - (performance.now() - startedAt));

        window.setTimeout(() => {
          const outro = gsap.timeline({
            onComplete: () => setLifted(true),
          });

          outro
            .to(".preloader__panel", {
              opacity: 0,
              duration: 0.32,
              ease: "power2.in",
            })
            .to(
              ".preloader__shutter",
              {
                scaleY: 0,
                duration: 0.86,
                ease: "power4.inOut",
                stagger: { each: 0.07, from: "start" },
              },
              "<0.06",
            )
            .to(".preloader__inner", {
              yPercent: -12,
              opacity: 0,
              duration: 0.5,
              ease: "power3.in",
            }, "<0.1");
        }, wait);
      };

      /*
       * ------------------------------------------------------------
       * REDUCED MOTION
       * ------------------------------------------------------------
       *
       * The overlay still gates the first paint, it just does not
       * animate. Removing it from the flow would show the page twice.
       */

      if (reduced) {
        gsap.set(".preloader__inner", { autoAlpha: 0 });

        if (counterNode) {
          counterNode.textContent = "100";
        }

        finish();

        return;
      }

      /*
       * ------------------------------------------------------------
       * SETUP
       * ------------------------------------------------------------
       */

      let chars: HTMLElement[] = [];

      if (mark) {
        const split = SplitText.create(mark, {
          type: "chars",
          charsClass: "preloader__char",
          aria: "auto",
        });

        chars = split.chars as HTMLElement[];
      }

      gsap.set(chars, { yPercent: 115, opacity: 0 });

      gsap.set([".preloader__meta > *", ".preloader__tagline"], {
        y: 14,
        opacity: 0,
      });

      gsap.set(".preloader__rule-fill", { scaleX: 0, transformOrigin: "left center" });

      gsap.set(".preloader__counter", { opacity: 0 });

      gsap.set(".preloader__blueprint", { opacity: 0, scaleY: 0.2 });

      /*
       * ------------------------------------------------------------
       * INTRO
       * ------------------------------------------------------------
       */

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .to(".preloader__blueprint", {
          opacity: 1,
          scaleY: 1,
          duration: 1.1,
          ease: "power3.out",
        })
        .to(
          chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.055,
          },
          0.15,
        )
        .to(
          [".preloader__meta > *", ".preloader__tagline"],
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.09,
          },
          0.5,
        )
        .to(".preloader__rule-fill", { scaleX: 1, duration: 1.2 }, 0.45)
        .to(".preloader__counter", { opacity: 1, duration: 0.4 }, 0.6);

      /*
       * The shutters hold the screen the whole time, so this only
       * settles them off their resting edge rather than revealing the
       * page behind them.
       */

      gsap.from(".preloader__shutter", {
        scaleY: 1.06,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.05,
      });

      /*
       * ------------------------------------------------------------
       * COUNTER
       * ------------------------------------------------------------
       *
       * Creeps toward 88 while assets are still arriving, then
       * commits to 100 only once the load event actually fires.
       */

      const tally = { value: 0 };

      const paint = () => {
        if (!counterNode) return;

        counterNode.textContent = String(Math.round(tally.value)).padStart(3, "0");
      };

      const trickle = gsap.to(tally, {
        value: 88,
        duration: 4.2,
        ease: "power1.out",
        onUpdate: paint,
      });

      /*
       * ------------------------------------------------------------
       * RELEASE
       * ------------------------------------------------------------
       */

      const release = () => {
        trickle.kill();

        gsap.to(tally, {
          value: 100,
          duration: 0.65,
          ease: "power2.out",
          onUpdate: paint,
          onComplete: finish,
        });
      };

      const onLoad = () => release();

      if (document.readyState === "complete") {
        release();
      } else {
        window.addEventListener("load", onLoad, { once: true });
      }

      const ceiling = window.setTimeout(release, MAX_WAIT);

      return () => {
        window.removeEventListener("load", onLoad);

        window.clearTimeout(ceiling);

        trickle.kill();

        intro.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {children}

      {!lifted ? (
        <div ref={rootRef} className="preloader">
          {/*
            Opaque columns rather than one slab, so the exit reads as
            the screen pulling apart instead of a plain fade.
          */}
          <div className="preloader__shutters" aria-hidden>
            {Array.from({ length: SHUTTERS }, (_, index) => (
              <span className="preloader__shutter" key={index} />
            ))}
          </div>

          <div className="preloader__blueprint" aria-hidden />

          <div className="preloader__inner">
            <div className="preloader__top">
              <span className="preloader__eyebrow">Architecture studio</span>

              <span className="preloader__counter">
                <span className="preloader__counter-value">000</span>
                <span className="preloader__counter-sep">/</span>
                <span>100</span>
              </span>
            </div>

            <div className="preloader__center">
              <span className="preloader__mark">{WORDMARK}</span>

              <span className="preloader__rule" aria-hidden>
                <span className="preloader__rule-fill" />
              </span>

              <span className="preloader__tagline">{TAGLINE}</span>
            </div>

            <div className="preloader__meta">
              <span>Kolkata</span>

              <span>Naoshima</span>

              <span>Reykjavik</span>

              <span>Est. 2014</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}