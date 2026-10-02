import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import "./AboutPageAnimation.css";
import { preloadFonts } from "./utils";

gsap.registerPlugin(ScrollTrigger);

/** Mirrors a char's index around the centre of its word (0 at the edges, max at the middle). */
const getSymmetricFactor = (position: number, total: number) => {
  const half = Math.ceil(total / 2);
  return position < half
    ? position
    : half - Math.abs(Math.floor(total / 2) - position) - 1;
};

export function AboutPageAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let rafId: number | null = null;

    container.classList.add("about-page", "demo-2", "loading");

    // Scoped to this component only (idempotent for already-split elements)
    Splitting({ target: container.querySelectorAll("[data-splitting]") });

    const getTitles = (effect: number) =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          `.content__title[data-splitting][data-effect${effect}]`,
        ),
      );

    const lenis = new Lenis({ lerp: 0.2 });
    lenis.on("scroll", () => ScrollTrigger.update());

    const scrollFn = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(scrollFn);
    };
    rafId = requestAnimationFrame(scrollFn);

    // gsap.context scopes every tween/ScrollTrigger to this component and reverts them on cleanup
    const ctx = gsap.context(() => {
      getTitles(16).forEach((title) => {
        gsap.fromTo(
          title,
          { transformOrigin: "0% 50%", rotate: 3 },
          {
            ease: "none",
            rotate: 0,
            scrollTrigger: {
              trigger: title,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          title.querySelectorAll(".word"),
          { willChange: "opacity", opacity: 0.1 },
          {
            ease: "none",
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: title,
              start: "top bottom-=20%",
              end: "center top+=20%",
              scrub: true,
            },
          },
        );
      });

      getTitles(17).forEach((title) => {
        gsap.set(title.querySelectorAll(".word"), { perspective: 1000 });
        gsap.fromTo(
          title.querySelectorAll(".char"),
          {
            willChange: "opacity, transform",
            opacity: 0,
            rotateX: () => gsap.utils.random(-120, 120),
            z: () => gsap.utils.random(-200, 200),
          },
          {
            ease: "none",
            opacity: 1,
            rotateX: 0,
            z: 0,
            stagger: 0.02,
            scrollTrigger: {
              trigger: title,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      getTitles(18).forEach((title) => {
        gsap.set(title.querySelectorAll(".word"), { perspective: 1000 });
        gsap.fromTo(
          title.querySelectorAll(".char"),
          { willChange: "opacity, transform", opacity: 0.2, z: -800 },
          {
            ease: "back.out(1.2)",
            opacity: 1,
            z: 0,
            stagger: 0.04,
            scrollTrigger: {
              trigger: title,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      getTitles(19).forEach((title) => {
        gsap.set(title.querySelectorAll(".word"), { perspective: 1000 });
        gsap.fromTo(
          title.querySelectorAll(".char"),
          {
            willChange: "opacity, transform",
            transformOrigin: "50% 0%",
            opacity: 0,
            rotationX: -90,
            z: -200,
          },
          {
            ease: "power1",
            opacity: 1,
            stagger: 0.05,
            rotationX: 0,
            z: 0,
            scrollTrigger: {
              trigger: title,
              start: "center bottom",
              end: "bottom top+=20%",
              scrub: true,
            },
          },
        );
      });

      getTitles(20).forEach((title) => {
        gsap.set(title.querySelectorAll(".word"), { perspective: 1000 });
        gsap.fromTo(
          title.querySelectorAll(".char"),
          {
            willChange: "opacity, transform",
            transformOrigin: "50% 100%",
            opacity: 0,
            rotationX: 90,
          },
          {
            ease: "power4",
            opacity: 1,
            stagger: { each: 0.03, from: "random" },
            rotationX: 0,
            scrollTrigger: {
              trigger: title,
              start: "center bottom",
              end: "bottom top+=20%",
              scrub: true,
            },
          },
        );
      });

      getTitles(21).forEach((title) => {
        title.querySelectorAll<HTMLElement>(".word").forEach((word) => {
          gsap.set(word, { perspective: 2000 });
          gsap.fromTo(
            word.querySelectorAll(".char"),
            {
              willChange: "opacity, transform",
              opacity: 0,
              y: (
                index: number,
                _target: unknown,
                targets: ArrayLike<unknown>,
              ) => -40 * Math.abs(index - targets.length / 2),
              z: () => gsap.utils.random(-1500, -600),
              rotationX: () => gsap.utils.random(-500, -200),
            },
            {
              ease: "power1.inOut",
              opacity: 1,
              y: 0,
              z: 0,
              rotationX: 0,
              stagger: { each: 0.06, from: "center" },
              scrollTrigger: {
                trigger: word,
                start: "top bottom",
                end: "top top+=15%",
                scrub: true,
              },
            },
          );
        });
      });

      getTitles(22).forEach((title) => {
        title.querySelectorAll<HTMLElement>(".word").forEach((word) => {
          const chars = word.querySelectorAll(".char");
          const charsTotal = chars.length;
          const half = Math.ceil(charsTotal / 2);
          gsap.set(word, { perspective: 1000 });
          gsap.fromTo(
            chars,
            {
              willChange: "transform, filter",
              x: (position: number) =>
                gsap.utils.mapRange(
                  0,
                  half,
                  -200,
                  200,
                  getSymmetricFactor(position, charsTotal),
                ),
              y: (position: number) =>
                gsap.utils.mapRange(
                  0,
                  half,
                  -50,
                  50,
                  getSymmetricFactor(position, charsTotal),
                ),
              rotationZ: (position: number) => {
                const factor = getSymmetricFactor(position, charsTotal);
                return position < charsTotal / 2
                  ? gsap.utils.mapRange(0, half, -30, 0, factor)
                  : gsap.utils.mapRange(0, half, 0, 30, factor);
              },
              rotationY: (position: number) => {
                const factor = getSymmetricFactor(position, charsTotal);
                return position < charsTotal / 2
                  ? gsap.utils.mapRange(0, half, 60, 0, factor)
                  : gsap.utils.mapRange(0, half, 0, -60, factor);
              },
              filter: "blur(20px)",
            },
            {
              ease: "power2.inOut",
              x: 0,
              y: 0,
              rotationZ: 0,
              rotationY: 0,
              scale: 1,
              filter: "blur(0px)",
              scrollTrigger: {
                trigger: word,
                start: "top bottom+=40%",
                end: "top top+=15%",
                scrub: true,
              },
            },
          );
        });
      });

      getTitles(23).forEach((title) => {
        title.querySelectorAll<HTMLElement>(".word").forEach((word) => {
          const chars = word.querySelectorAll(".char");
          const charsTotal = chars.length;
          const half = Math.ceil(charsTotal / 2);
          gsap.set(word, { perspective: 1000 });
          chars.forEach((char, position) => {
            const factor = getSymmetricFactor(position, charsTotal);
            gsap.fromTo(
              char,
              {
                willChange: "transform, filter",
                transformOrigin: "50% 50%",
                scale: gsap.utils.mapRange(0, half, 0.5, 2.1, factor),
                y: gsap.utils.mapRange(0, half, 0, 60, factor),
                rotation:
                  position < charsTotal / 2
                    ? gsap.utils.mapRange(0, half, -4, 0, factor)
                    : gsap.utils.mapRange(0, half, 0, 4, factor),
                filter: "blur(12px) opacity(0)",
              },
              {
                ease: "power2.inOut",
                y: 0,
                rotation: 0,
                scale: 1,
                filter: "blur(0px) opacity(1)",
                scrollTrigger: {
                  trigger: word,
                  start: "top bottom+=40%",
                  end: "top top+=15%",
                  scrub: true,
                },
              },
            );
          });
        });
      });
    }, container);

    const loadFonts = async () => {
      try {
        await preloadFonts("cvn8slu");
      } catch {
        // ignore font preload failures
      }
      if (cancelled) return;
      container.classList.remove("loading");
      // layout may shift once fonts load / loading state clears
      ScrollTrigger.refresh();
    };
    loadFonts();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis.destroy();
      ctx.revert();
      container.classList.remove("about-page", "demo-2", "loading");
    };
  }, []);

  return (
    <div ref={containerRef}>
      <main>
        <div className="frame"></div>
        <div className="intro">
          <h1 className="intro__title">
            <span className="intro__title-pre">About</span>
            <span className="intro__title-sub">
              Shivoasis
              <sup>
                <small>Studio</small>
              </sup>
            </span>
          </h1>
          <span className="intro__info">
            Crafting spaces where structure meets serenity
          </span>
        </div>
        <div className="content">
          <h2
            className="content__title content__title--left"
            data-splitting
            data-effect16
          >
            <p className="font-small">
              At Shivoasis, we believe architecture is not just about buildings—it's about creating environments that stand the test of time. Founded on the principle that a structure should look even better after a decade of weathering, our studio approaches every project with patience, precision, and purpose. We blend structural honesty with quiet elegance, crafting spaces that feel both grounded and serene.
            </p>
          </h2>
        </div>
        <div className="content">
          <h2 className="content__title" data-splitting data-effect17>
            <span>Thoughtful</span>
            <span>Design</span>
          </h2>
        </div>
        <div className="content">
          <p>
            Our work is rooted in a deep respect for materials, light, and context. From structural grids to the smallest shadow gap, every detail is considered with intention. We believe that true beauty emerges when form follows function, and when craftsmanship takes precedence over compromise.
          </p>
        </div>
        <div className="content">
          <h2 className="content__title" data-splitting data-effect18>
            <span className="font-16 font-upper">Built to Last</span>
            <span className="font-16 font-upper">Designed to Inspire</span>
          </h2>
        </div>
        <div className="content">
          <p>
            We take a holistic approach to architecture—bridging design and construction under one roof. By keeping the entire process in-house, we ensure continuity from the first sketch to the final handover. This allows us to maintain the integrity of our vision while responding thoughtfully to the realities of building.
          </p>
        </div>
        <div className="content">
          <h2 className="content__title" data-splitting data-effect19>
            <span className="font-21 font-upper">Form</span>
            <span className="font-21 font-upper">Function</span>
          </h2>
        </div>
        <div className="content">
          <p>
            Our studio values restraint over excess. We favor honest materials—concrete, wood, lime plaster, and stone—that age gracefully with time. These elements work in harmony with light, climate, and landscape to create spaces that feel timeless rather than trend-driven.
          </p>
        </div>
        <div className="content">
          <h2 className="content__title" data-splitting data-effect20>
            <span className="font-22 font-upper">Quiet</span>
            <span className="font-12 font-upper">Luxury</span>
          </h2>
        </div>
        <div className="content">
          <p>
            For us, luxury lies in silence, proportion, and craftsmanship. It's found in the quality of light at a certain hour, the weight of a solid door, or the calmness of a space that has been carefully resolved down to its essentials.
          </p>
        </div>
        <div className="content content--full">
          <h2 className="content__title" data-splitting data-effect21>
            <span className="font-20">Timeless</span>
            <span className="font-18">Spaces</span>
          </h2>
        </div>
        <div className="content">
          <p>
            We design with longevity in mind. Our buildings are meant to evolve with their occupants and weather gracefully over decades. Sustainability isn't an afterthought—it's embedded in how we choose materials, orient buildings, and minimize waste through thoughtful detailing.
          </p>
        </div>
        <div className="content content--full">
          <h2 className="content__title" data-splitting data-effect22>
            <span className="font-23 font-upper">Rooted</span>
            <span className="font-upper font-16">in</span>
            <span className="font-upper font-23">Place</span>
          </h2>
        </div>
        <div className="content">
          <p>
            Every site has its own story—its topography, light, climate, and history. We listen carefully to these cues, allowing the landscape to inform our designs. The result is architecture that feels naturally embedded in its surroundings rather than imposed upon them.
          </p>
        </div>
        <div className="content content--full">
          <h2 className="content__title" data-splitting data-effect23>
            <span className="font-upper font-22">Crafted</span>
            <span className=" font-upper font-20">With</span>
            <span className=" font-upper font-18">Care</span>
          </h2>
        </div>
        <div className="content">
          <p>
            Our team brings together architects, engineers, and craftspeople who share a commitment to excellence. We value collaboration, patience, and the pursuit of perfection in even the smallest details. It's this dedication that brings our projects to life with integrity.
          </p>
        </div>
        <div className="content content--full">
          <h2 className="content__title" data-splitting data-effect24>
            <span className="font-15 font-upper">Our Vision</span>
          </h2>
        </div>
        <div className="content">
          <p>
            To create architecture that feels inevitable—spaces that belong to their place, serve their purpose, and inspire for generations to come. We aim to shape environments that bring clarity, calm, and a sense of belonging to those who experience them.
          </p>
        </div>
        <div className="content">
          <h2
            className="content__title content__title--left"
            data-splitting
            data-effect25
          >
            <span className="font-13 font-medium font-height-medium">
              We design with empathy
              <br />
              Creating spaces that feel human
              <br />
              Rooted in purpose and place
              <br />
              Built to endure through time
              <br />
            </span>
          </h2>
        </div>
        <div className="content content--full">
          <h2 className="content__title" data-splitting data-effect26>
            <span className="font-upper font-19">Balanced</span>
            <span className="font-upper font-23">Proportion</span>
          </h2>
        </div>
        <div className="content">
          <p>
            Every line, plane, and volume in our work is carefully calibrated. We believe harmony comes from restraint—finding the perfect balance between weight and light, solid and void, structure and space.
          </p>
        </div>
        <div className="content">
          <h2 className="content__title" data-splitting data-effect27>
            <span className="font-upper font-19 font-medium">
              From concept to completion, we stay hands-on throughout the process, ensuring our designs are realized with precision and care.
            </span>
          </h2>
        </div>
        <div className="content content--full">
          <h2 className="content__title" data-splitting data-effect28>
            <span className="font-12 font-medium">Legacy</span>
          </h2>
        </div>
        <div className="content">
          <p>
            We design not just for today, but for generations to come. Our buildings are crafted to endure—leaving behind a quiet legacy of thoughtful architecture that continues to inspire long after we're gone.
          </p>
        </div>
        <div className="content">
          <h2 className="content__title" data-splitting data-effect29>
            <span className="font-upper">Precision</span>
            <span className="font-upper">Through</span>
            <span className="font-upper">Patience</span>
            <span className="font-upper">Always</span>
          </h2>
        </div>
        <div className="content">
          <p>
            At Shivoasis, discipline and patience guide every decision we make. It's this unwavering commitment to craft that allows us to create spaces of lasting beauty, purpose, and serenity.
          </p>
        </div>
      </main>
    </div>
  );
}
