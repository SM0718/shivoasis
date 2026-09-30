import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

import type { ArchitectureProject } from "./architectureProjects";

import { preloadImages } from "./preloadImages";

import "./architecture-carousel.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

interface ArchitectureCarouselProps {
  projects: ArchitectureProject[];
}

interface CarouselTimeline {
  timeline: gsap.core.Timeline;
  scrollTrigger?: ScrollTrigger;
}

const ArchitectureCarousel = ({ projects }: ArchitectureCarouselProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);

  const smootherRef = useRef<ScrollSmoother | null>(null);

  const timelineMap = useRef(new Map<string, CarouselTimeline>());

  const splitMap = useRef(new Map<HTMLElement, SplitText>());

  const isAnimatingRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let mounted = true;

    const ctx = gsap.context(() => {
      const initialize = async () => {
        await preloadImages(".grid__item-image");

        if (!mounted) {
          return;
        }

        setIsReady(true);

        /*
         * --------------------------------------------------
         * SCROLL SMOOTHER
         * --------------------------------------------------
         */

        const smoother = ScrollSmoother.create({
          smooth: 1,
          effects: true,
          normalizeScroll: true,
          content: "#smooth-content",
        });

        smootherRef.current = smoother;

        /*
         * --------------------------------------------------
         * HELPERS
         * --------------------------------------------------
         */

        const getCarouselCellTransforms = (
          count: number,
          radius: number,
        ): string[] => {
          const angleStep = 360 / count;

          return Array.from({ length: count }, (_, index) => {
            const angle = index * angleStep;

            return `rotateY(${angle}deg) translateZ(${radius}px)`;
          });
        };

        /*
         * --------------------------------------------------
         * SETUP CAROUSEL CELLS
         * --------------------------------------------------
         */

        const setupCarouselCells = (carousel: HTMLElement) => {
          const scene = carousel.closest(".scene") as HTMLElement | null;

          if (!scene) {
            return;
          }

          const radius = Number.parseFloat(scene.dataset.radius || "") || 500;

          const cells =
            carousel.querySelectorAll<HTMLElement>(".carousel__cell");

          const transforms = getCarouselCellTransforms(cells.length, radius);

          cells.forEach((cell, index) => {
            cell.style.transform = transforms[index];
          });
        };

        /*
         * --------------------------------------------------
         * CHARACTER ANIMATION
         * --------------------------------------------------
         */

        const animateChars = (
          chars: HTMLElement[],
          direction: "in" | "out" = "in",
          options: gsap.TweenVars = {},
        ) => {
          if (!chars.length) {
            return;
          }

          const visible = direction === "in";

          gsap.fromTo(
            chars,
            {
              autoAlpha: visible ? 0 : 1,
            },
            {
              autoAlpha: visible ? 1 : 0,
              duration: 0.02,
              ease: "none",
              stagger: {
                each: 0.04,
                from: visible ? "start" : "end",
              },
              ...options,
            },
          );
        };

        /*
         * --------------------------------------------------
         * SPLIT TEXT
         * --------------------------------------------------
         */

        const initTextsSplit = () => {
          const elements = root.querySelectorAll<HTMLElement>(
            ".scene__title span, .preview__title span, .preview__close",
          );

          elements.forEach((element) => {
            const existing = splitMap.current.get(element);

            if (existing) {
              existing.revert();
            }

            const split = SplitText.create(element, {
              type: "chars",
              charsClass: "char",
              autoSplit: true,
            });

            splitMap.current.set(element, split);
          });
        };

        /*
         * --------------------------------------------------
         * SCROLL ANIMATION
         * --------------------------------------------------
         */

        const createScrollAnimation = (
          carousel: HTMLElement,
          projectId: string,
        ) => {
          const scene = carousel.closest(".scene") as HTMLElement | null;

          if (!scene) {
            return;
          }

          const cards = carousel.querySelectorAll<HTMLElement>(".card");

          const titleSpan =
            scene.querySelector<HTMLElement>(".scene__title span");

          const split = titleSpan ? splitMap.current.get(titleSpan) : undefined;

          const chars = (split?.chars as HTMLElement[]) || [];

          const timeline = gsap.timeline({
            defaults: {
              ease: "sine.inOut",
            },

            scrollTrigger: {
              trigger: scene,

              start: "top bottom",

              end: "bottom top",

              scrub: true,
            },
          });

          timeline
            .fromTo(
              carousel,
              {
                rotationY: 0,
              },
              {
                rotationY: -180,
              },
              0,
            )

            .fromTo(
              carousel,
              {
                rotationZ: 3,
                rotationX: 3,
              },
              {
                rotationZ: -3,
                rotationX: -3,
              },
              0,
            )

            .fromTo(
              cards,
              {
                filter: "brightness(250%)",
              },
              {
                filter: "brightness(80%)",
                ease: "power3",
              },
              0,
            )

            .fromTo(
              cards,
              {
                rotationZ: 10,
              },
              {
                rotationZ: -10,
                ease: "none",
              },
              0,
            );

          if (chars.length) {
            animateChars(chars, "in", {
              scrollTrigger: {
                trigger: scene,
                start: "top center",
                toggleActions: "play none none reverse",
              },
            });
          }

          timelineMap.current.set(projectId, {
            timeline,
            scrollTrigger: timeline.scrollTrigger || undefined,
          });
        };

        /*
         * --------------------------------------------------
         * ROTATION CALCULATION
         * --------------------------------------------------
         */

        const getInterpolatedRotation = (progress: number) => ({
          rotationY: gsap.utils.interpolate(0, -180, progress),

          rotationX: gsap.utils.interpolate(3, -3, progress),

          rotationZ: gsap.utils.interpolate(3, -3, progress),
        });

        /*
         * --------------------------------------------------
         * GRID ITEM IN
         * --------------------------------------------------
         */

        const animateGridItemIn = (
          element: HTMLElement,
          dx: number,
          dy: number,
          rotationY: number,
          delay: number,
        ) => {
          gsap.fromTo(
            element,
            {
              transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,

              autoAlpha: 0,

              y: dy * 0.5,

              scale: 0.5,

              rotationY,
            },

            {
              y: 0,

              scale: 1,

              rotationY: 0,

              autoAlpha: 1,

              duration: 0.4,

              ease: "sine",

              delay: delay + 0.1,
            },
          );

          gsap.fromTo(
            element,
            {
              z: -3500,
            },
            {
              z: 0,

              duration: 0.3,

              ease: "expo",

              delay,
            },
          );
        };

        /*
         * --------------------------------------------------
         * GRID ITEM OUT
         * --------------------------------------------------
         */

        const animateGridItemOut = (
          element: HTMLElement,
          dx: number,
          dy: number,
          rotationY: number,
          delay: number,
          isLast: boolean,
          onComplete?: () => void,
        ) => {
          gsap.to(element, {
            startAt: {
              transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
            },

            y: dy * 0.4,

            rotationY,

            scale: 0.4,

            autoAlpha: 0,

            duration: 0.4,

            ease: "sine.in",

            delay,
          });

          gsap.to(element, {
            z: -3500,

            duration: 0.4,

            ease: "expo.in",

            delay: delay + 0.9,

            onComplete: isLast ? onComplete : undefined,
          });
        };

        /*
         * --------------------------------------------------
         * GRID ITEMS
         * --------------------------------------------------
         */

        const animateGridItems = ({
          items,
          centerX,
          centerY,
          direction = "in",
          onComplete,
        }: {
          items: NodeListOf<HTMLElement>;
          centerX: number;
          centerY: number;
          direction?: "in" | "out";
          onComplete?: () => void;
        }) => {
          const itemData = Array.from(items).map((element) => {
            const rect = element.getBoundingClientRect();

            const elementCenterX = rect.left + rect.width / 2;

            const elementCenterY = rect.top + rect.height / 2;

            const dx = centerX - elementCenterX;

            const dy = centerY - elementCenterY;

            const dist = Math.hypot(dx, dy);

            const isLeft = elementCenterX < centerX;

            return {
              element,
              dx,
              dy,
              dist,
              isLeft,
            };
          });

          if (!itemData.length) {
            onComplete?.();
            return;
          }

          const maxDist = Math.max(...itemData.map((item) => item.dist));

          const totalStagger = 0.025 * (itemData.length - 1);

          let latestDelay = -1;

          let latestItem: (typeof itemData)[number] | null = null;

          /*
           * A for...of rather than forEach so the assignments to
           * latestItem sit in the linear control flow. Assigned only
           * inside a callback, TypeScript still sees it as null at the
           * guard below and narrows the whole block to never.
           */

          for (const { element, dx, dy, dist, isLeft } of itemData) {
            const normalized = maxDist ? dist / maxDist : 0;

            const exponential = Math.pow(
              direction === "in" ? 1 - normalized : normalized,
              1,
            );

            const delay = exponential * totalStagger;

            const rotationY = isLeft ? 100 : -100;

            if (direction === "in") {
              animateGridItemIn(element, dx, dy, rotationY, delay);
            } else {
              if (delay > latestDelay) {
                latestDelay = delay;

                latestItem = {
                  element,
                  dx,
                  dy,
                  dist,
                  isLeft,
                };
              }

              animateGridItemOut(
                element,
                dx,
                dy,
                rotationY,
                delay,
                false,
                onComplete,
              );
            }
          }

          if (direction === "out" && latestItem) {
            const rotationY = latestItem.isLeft ? 100 : -100;

            animateGridItemOut(
              latestItem.element,
              latestItem.dx,
              latestItem.dy,
              rotationY,
              latestDelay,
              true,
              onComplete,
            );
          }
        };

        /*
         * --------------------------------------------------
         * PREVIEW IN
         * --------------------------------------------------
         */

        const animatePreviewGridIn = (preview: HTMLElement) => {
          const items = preview.querySelectorAll<HTMLElement>(".grid__item");

          gsap.set(items, {
            clearProps: "all",
          });

          animateGridItems({
            items,

            centerX: window.innerWidth / 2,

            centerY: window.innerHeight / 2,

            direction: "in",
          });
        };

        /*
         * --------------------------------------------------
         * PREVIEW OUT
         * --------------------------------------------------
         */

        const animatePreviewGridOut = (preview: HTMLElement) => {
          const items = preview.querySelectorAll<HTMLElement>(".grid__item");

          animateGridItems({
            items,

            centerX: window.innerWidth / 2,

            centerY: window.innerHeight / 2,

            direction: "out",

            onComplete: () => {
              gsap.set(preview, {
                pointerEvents: "none",

                autoAlpha: 0,
              });
            },
          });
        };

        /*
         * --------------------------------------------------
         * PREVIEW TEXT
         * --------------------------------------------------
         */

        const animatePreviewTexts = (
          preview: HTMLElement,
          direction: "in" | "out",
        ) => {
          const elements = preview.querySelectorAll<HTMLElement>(
            ".preview__title span, .preview__close",
          );

          elements.forEach((element) => {
            const split = splitMap.current.get(element);

            const chars = (split?.chars as HTMLElement[]) || [];

            animateChars(chars, direction);
          });
        };

        /*
         * --------------------------------------------------
         * SCROLL LOCK
         * --------------------------------------------------
         */

        const preventScroll = (event: Event) => {
          event.preventDefault();
        };

        const preventArrowScroll = (event: KeyboardEvent) => {
          const keys = [
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
            " ",
          ];

          if (keys.includes(event.key)) {
            event.preventDefault();
          }
        };

        const lockUserScroll = () => {
          window.addEventListener("wheel", preventScroll, { passive: false });

          window.addEventListener("touchmove", preventScroll, {
            passive: false,
          });

          window.addEventListener("keydown", preventArrowScroll);
        };

        const unlockUserScroll = () => {
          window.removeEventListener("wheel", preventScroll);

          window.removeEventListener("touchmove", preventScroll);

          window.removeEventListener("keydown", preventArrowScroll);
        };

        /*
         * --------------------------------------------------
         * ACTIVATE PREVIEW
         * --------------------------------------------------
         */

        const activatePreview = (event: MouseEvent) => {
          event.preventDefault();

          if (isAnimatingRef.current) {
            return;
          }

          isAnimatingRef.current = true;

          const title = event.currentTarget as HTMLElement;

          const scene = title.closest(".scene") as HTMLElement | null;

          if (!scene) {
            isAnimatingRef.current = false;

            return;
          }

          const carousel = scene.querySelector<HTMLElement>(".carousel");

          const projectId = scene.dataset.projectId;

          if (!carousel || !projectId) {
            isAnimatingRef.current = false;

            return;
          }

          const project = projects.find((item) => item.id === projectId);

          if (!project) {
            isAnimatingRef.current = false;

            return;
          }

          const cards = carousel.querySelectorAll<HTMLElement>(".card");

          const titleSpan = title.querySelector<HTMLElement>("span");

          const chars = titleSpan
            ? ((splitMap.current.get(titleSpan)?.chars || []) as HTMLElement[])
            : [];

          const preview = root.querySelector<HTMLElement>(
            `#preview-${project.id}`,
          );

          if (!preview) {
            isAnimatingRef.current = false;

            return;
          }

          const sceneWrapper =
            root.querySelector<HTMLElement>(".scene-wrapper");

          if (!sceneWrapper) {
            isAnimatingRef.current = false;

            return;
          }

          const offsetTop = scene.getBoundingClientRect().top + window.scrollY;

          const targetY =
            offsetTop - window.innerHeight / 2 + scene.offsetHeight / 2;

          ScrollTrigger.getAll().forEach((trigger) => {
            trigger.disable(false);
          });

          const timeline = gsap.timeline({
            defaults: {
              duration: 1.5,
              ease: "power2.inOut",
            },

            onComplete: () => {
              isAnimatingRef.current = false;

              ScrollTrigger.getAll().forEach((trigger) => {
                trigger.enable();
              });

              const sceneTimeline = timelineMap.current.get(projectId);

              sceneTimeline?.scrollTrigger?.scroll(targetY);
            },
          });

          timeline

            .to(window, {
              onStart: () => {
                lockUserScroll();
              },

              onComplete: () => {
                unlockUserScroll();

                smootherRef.current?.paused(true);
              },

              scrollTo: {
                y: targetY,
                autoKill: true,
              },
            })

            .to(
              chars,
              {
                autoAlpha: 0,

                duration: 0.02,

                ease: "none",

                stagger: {
                  each: 0.04,
                  from: "end",
                },
              },
              0,
            )

            .to(
              carousel,
              {
                rotationX: 90,

                rotationY: -360,

                z: -2000,
              },
              0,
            )

            .to(
              carousel,
              {
                duration: 2.5,

                ease: "power3.inOut",

                z: 1500,

                rotationZ: 270,

                onComplete: () => {
                  gsap.set(sceneWrapper, {
                    autoAlpha: 0,
                  });
                },
              },
              0.7,
            )

            .to(
              cards,
              {
                rotationZ: 0,
              },
              0,
            )

            .add(() => {
              gsap.set(preview, {
                pointerEvents: "auto",
                autoAlpha: 1,
              });

              animatePreviewGridIn(preview);

              animatePreviewTexts(preview, "in");
            }, "<+=1.9");
        };

        /*
         * --------------------------------------------------
         * DEACTIVATE PREVIEW
         * --------------------------------------------------
         */

        const deactivatePreview = (event: MouseEvent) => {
          event.preventDefault();

          if (isAnimatingRef.current) {
            return;
          }

          isAnimatingRef.current = true;

          const button = event.currentTarget as HTMLElement;

          const preview = button.closest(".preview") as HTMLElement | null;

          if (!preview) {
            isAnimatingRef.current = false;

            return;
          }

          const projectId = preview.dataset.projectId;

          if (!projectId) {
            isAnimatingRef.current = false;

            return;
          }

          const scene = root.querySelector<HTMLElement>(
            `.scene[data-project-id="${projectId}"]`,
          );

          const carousel = scene?.querySelector<HTMLElement>(".carousel");

          if (!scene || !carousel) {
            isAnimatingRef.current = false;

            return;
          }

          const cards = carousel.querySelectorAll<HTMLElement>(".card");

          const titleSpan =
            scene.querySelector<HTMLElement>(".scene__title span");

          const chars = titleSpan
            ? ((splitMap.current.get(titleSpan)?.chars || []) as HTMLElement[])
            : [];

          animatePreviewTexts(preview, "out");

          animatePreviewGridOut(preview);

          const sceneWrapper =
            root.querySelector<HTMLElement>(".scene-wrapper");

          if (sceneWrapper) {
            gsap.set(sceneWrapper, {
              autoAlpha: 1,
            });
          }

          const progress = 0.5;

          const { rotationX, rotationY, rotationZ } =
            getInterpolatedRotation(progress);

          gsap
            .timeline({
              delay: 0.7,

              defaults: {
                duration: 1.3,
                ease: "expo",
              },

              onComplete: () => {
                smootherRef.current?.paused(false);

                isAnimatingRef.current = false;
              },
            })

            .fromTo(
              chars,
              {
                autoAlpha: 0,
              },
              {
                autoAlpha: 1,

                duration: 0.02,

                ease: "none",

                stagger: {
                  each: 0.04,
                  from: "start",
                },
              },
            )

            .fromTo(
              carousel,
              {
                z: -550,

                rotationX,

                rotationY: -720,

                rotationZ,

                yPercent: 300,
              },
              {
                rotationY,

                yPercent: 0,
              },
              0,
            )

            .fromTo(
              cards,
              {
                autoAlpha: 0,
              },
              {
                autoAlpha: 1,
              },
              0.3,
            );
        };

        /*
         * --------------------------------------------------
         * INITIALIZE
         * --------------------------------------------------
         */

        initTextsSplit();

        const carousels = root.querySelectorAll<HTMLElement>(".carousel");

        carousels.forEach((carousel) => {
          setupCarouselCells(carousel);

          const scene = carousel.closest(".scene") as HTMLElement | null;

          const projectId = scene?.dataset.projectId;

          if (projectId) {
            createScrollAnimation(carousel, projectId);
          }
        });

        const titleElements =
          root.querySelectorAll<HTMLElement>(".scene__title");

        titleElements.forEach((title) => {
          title.addEventListener("click", activatePreview);
        });

        const closeButtons =
          root.querySelectorAll<HTMLElement>(".preview__close");

        closeButtons.forEach((button) => {
          button.addEventListener("click", deactivatePreview);
        });

        const handleResize = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);

        ScrollTrigger.refresh();

        /*
         * --------------------------------------------------
         * CLEANUP
         * --------------------------------------------------
         */

        return () => {
          window.removeEventListener("resize", handleResize);

          titleElements.forEach((title) => {
            title.removeEventListener("click", activatePreview);
          });

          closeButtons.forEach((button) => {
            button.removeEventListener("click", deactivatePreview);
          });

          unlockUserScroll();

          timelineMap.current.forEach(({ timeline }) => {
            timeline.kill();
          });

          timelineMap.current.clear();

          splitMap.current.forEach((split) => {
            split.revert();
          });

          splitMap.current.clear();

          smootherRef.current?.kill();

          smootherRef.current = null;

          ScrollTrigger.getAll().forEach((trigger) => {
            trigger.kill();
          });
        };
      };

      initialize();
    }, root);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, [projects]);

  return (
    <div
      ref={rootRef}
      className={`architecture-carousel ${isReady ? "is-ready" : "is-loading"}`}
    >
      <div id="smooth-content" className="smooth-content">
        <main className="scene-wrapper">
          {projects.map((project, projectIndex) => (
            <section
              key={project.id}
              className="scene"
              data-project-id={project.id}
              data-radius={project.radius ?? 500}
            >
              <h2 className="scene__title" data-speed="0.7">
                <button
                  type="button"
                  className="scene__title-button"
                  aria-label={`View ${project.title} project`}
                >
                  <span>{project.title}</span>

                  <small>{project.location}</small>
                </button>
              </h2>

              <div className="carousel" aria-hidden="true">
                {project.images.map((image, imageIndex) => (
                  <div
                    className="carousel__cell"
                    key={`${project.id}-${imageIndex}`}
                  >
                    <div
                      className="card"
                      style={
                        {
                          "--img": `url(${image.src})`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="card__face card__face--front">
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading={projectIndex < 2 ? "eager" : "lazy"}
                          draggable={false}
                        />
                      </div>

                      <div className="card__face card__face--back">
                        <img
                          src={image.src}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="scene__meta">
                <span>{String(projectIndex + 1).padStart(2, "0")}</span>

                <span>{project.category}</span>

                <span>{project.year}</span>
              </div>
            </section>
          ))}
        </main>
      </div>

      {/*
        Kept outside #smooth-content on purpose. ScrollSmoother transforms the
        content wrapper, and a transform on an ancestor creates a new
        containing block for position: fixed descendants. Leaving the previews
        in there made each overlay resolve inset: 0 / height: 100% against the
        full 5400px document instead of the viewport, so the overlay rendered
        as a tall black sheet with the images squeezed into the first screen.
      */}
      <div className="previews">
          {projects.map((project) => (
            <section
              key={`preview-${project.id}`}
              id={`preview-${project.id}`}
              className="preview"
              data-project-id={project.id}
              aria-hidden="true"
            >
              <div className="preview__header">
                <div>
                  <span className="preview__index">{project.year}</span>

                  <h2 className="preview__title">
                    <span>{project.title}</span>
                  </h2>

                  <p className="preview__location">{project.location}</p>
                </div>

                <button type="button" className="preview__close">
                  CLOSE
                </button>
              </div>

              <div className="grid">
                {/* the expanded view carries a longer, separate set */}
                {(project.previewImages ?? project.images).map(
                  (image, index) => (
                    <figure
                      className="grid__item"
                      key={`${project.id}-grid-${index}`}
                    >
                      <div
                        className="grid__item-image"
                        style={
                          {
                            backgroundImage: `url(${image.src})`,
                          } as React.CSSProperties
                        }
                      />

                      <figcaption className="grid__item-caption">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </figcaption>
                    </figure>
                  ),
                )}
              </div>

              <p className="preview__description">{project.description}</p>
            </section>
          ))}
      </div>
    </div>
  );
};

export default ArchitectureCarousel;
