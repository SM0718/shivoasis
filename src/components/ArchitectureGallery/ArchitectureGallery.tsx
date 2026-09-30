import { useRef, type CSSProperties } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { useGSAP } from "@gsap/react";

import type { ArchitectureProject } from "./types";

import "./ArchitectureGallery.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface ArchitectureGalleryProps {
  projects: ArchitectureProject[];
}

interface CubeRotation {
  rotateX: number;
  rotateY: number;
}

/**
 * Rotation of the actual cube.
 *
 * The cube itself stays a single 3D object.
 * Only its orientation changes.
 */
const CUBE_ROTATIONS: CubeRotation[] = [
  {
    rotateX: 0,
    rotateY: 0,
  },

  {
    rotateX: 0,
    rotateY: -90,
  },

  {
    rotateX: 0,
    rotateY: -180,
  },

  {
    rotateX: 0,
    rotateY: -270,
  },

  {
    rotateX: -90,
    rotateY: -360,
  },

  {
    rotateX: 90,
    rotateY: -360,
  },
];

const FACE_TRANSFORMS = [
  "translateZ(50cqi)",

  "rotateY(90deg) translateZ(50cqi)",

  "rotateY(180deg) translateZ(50cqi)",

  "rotateY(-90deg) translateZ(50cqi)",

  "rotateX(90deg) translateZ(50cqi)",

  "rotateX(-90deg) translateZ(50cqi)",
];

/**
 * Orbit of the cube around the title.
 *
 * The cube starts at the top-left of the text and sweeps 270 degrees
 * clockwise, finishing at the bottom-left of the screen:
 *
 *   top-left -> top -> top-right -> right -> bottom-right -> bottom -> bottom-left
 *
 * That is seven landmarks spread over 270 degrees, so one landmark
 * every 45 degrees. A full 360 loop was the old behaviour, which
 * circled past bottom-left and returned to the start instead of
 * ending there.
 */
const ORBIT_START_ANGLE = Math.PI * 1.25;
const ORBIT_SWEEP = Math.PI * 1.5;

/**
 * How far above the header row the cube is allowed to rise.
 *
 * The plain arc pins its top landmark flush against the header band,
 * which leaves no room to push a face further up. Letting the cube
 * come slightly higher means it passes in front of the top UI, which
 * is what a nudged-up face needs. Lower this to 98 to forbid it.
 */
const CUBE_TOP_ALLOWANCE_DESKTOP = 72;
const CUBE_TOP_ALLOWANCE_MOBILE = 58;

/**
 * Per-face nudges, indexed to match CUBE_ROTATIONS.
 *
 * Each face is only front-facing for a short settled window, so these
 * offsets let a face be pushed toward a particular part of the screen
 * while the arc keeps carrying the cube between them.
 *
 * dx/dy are fractions of the viewport so they hold at any size, and
 * the result is clamped, so pushing a value too far just stops at the
 * edge of the band instead of throwing the cube off-screen.
 *
 * Set an entry to null to leave that face on the plain arc.
 */
const CUBE_ORBIT_NUDGES: ({ dx: number; dy: number } | null)[] = [
  null,
  { dx: 0, dy: -0.02 },
  { dx: 0.015, dy: -0.018 },
  null,
  null,
  null,
];

/**
 * Half-width of a nudge's falloff, as a fraction of the whole scroll.
 * Roughly two thirds of one transition, so the nudge is strongest
 * while that face is square to the camera and gone before the next.
 */
const ORBIT_NUDGE_WIDTH = 0.11;

/**
 * Yaw held while the cube crosses rotationX 0 on its way between the
 * top and bottom faces. Anything large enough to keep every face
 * oblique at the halfway point works; 45 degrees puts the cube
 * exactly on an edge, where no face is square to the camera.
 */
const CUBE_HALF_TURN_YAW = 45;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface CubeOrbit {
  radiusX: number;
  radiusY: number;
  yOffset: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Measures the orbit once per refresh rather than on every scroll
 * frame, so reading offsetWidth does not force a reflow 60 times a
 * second.
 */
const getCubeOrbit = (wrapper: HTMLDivElement): CubeOrbit => {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  /*
   * Mirrors the header/footer offsets in this stylesheet so the cube
   * never slides underneath the fixed navbar or the bottom UI. The
   * extra 12px is slack for the silhouette, which grows slightly past
   * the element box while the cube is mid-rotation.
   */
  const topInset = isMobile ? 84 : 98;
  const bottomInset = isMobile ? 76 : 92;

  const topAllowance = isMobile
    ? CUBE_TOP_ALLOWANCE_MOBILE
    : CUBE_TOP_ALLOWANCE_DESKTOP;

  const cubeSize =
    wrapper.offsetWidth ||
    Math.min(window.innerWidth * 0.3, window.innerHeight * 0.3);

  const bandTop = topInset;
  const bandBottom = window.innerHeight - bottomInset;

  /*
   * The arc is built on the full band so nudges have somewhere to go,
   * while the clamp below is what actually keeps the cube on-screen.
   */

  const reachTop = Math.min(bandTop, topAllowance);

  const radiusX = Math.max(0, (window.innerWidth - cubeSize) / 2);

  const radiusY = Math.max(0, (bandBottom - reachTop - cubeSize) / 2);

  /*
   * The band is not vertically centred in the viewport, so the orbit
   * has to be nudged down or up to stay inside it.
   */
  const yOffset = (reachTop + bandBottom) / 2 - window.innerHeight / 2;

  return {
    radiusX,
    radiusY,
    yOffset,

    /*
     * Bounds are offsets from the viewport centre. The
     * xPercent/yPercent centring already cancels the half-size shift,
     * so the element's centre lands on vw/2 + x, which puts the usable
     * range at exactly +/- radius and lets a nudge push right up to
     * the edge instead of shoving the orbit sideways.
     */
    minX: -radiusX,
    maxX: radiusX,
    minY: yOffset - radiusY,
    maxY: yOffset + radiusY,
  };
};

const getCubeOrbitPosition = (progress: number, orbit: CubeOrbit) => {
  const angle = ORBIT_START_ANGLE + progress * ORBIT_SWEEP;

  return {
    x: Math.cos(angle) * orbit.radiusX,

    y: orbit.yOffset + Math.sin(angle) * orbit.radiusY,
  };
};

/**
 * Sum of every face nudge that is in range at this progress.
 */
const getCubeOrbitNudge = (progress: number, facePhase: number[]) => {
  let x = 0;
  let y = 0;

  CUBE_ORBIT_NUDGES.forEach((nudge, index) => {
    if (!nudge) return;

    const at = facePhase[index];

    if (at === undefined) return;

    const distance = Math.abs(progress - at);

    if (distance >= ORBIT_NUDGE_WIDTH) return;

    const falloff = smoothstep(1 - distance / ORBIT_NUDGE_WIDTH);

    x += nudge.dx * falloff * window.innerWidth;
    y += nudge.dy * falloff * window.innerHeight;
  });

  return { x, y };
};

export function ArchitectureGallery({ projects }: ArchitectureGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const backgroundRefs = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);

  const cubeRef = useRef<HTMLDivElement>(null);
  const cubeWrapperRef = useRef<HTMLDivElement>(null);

  const setBackgroundRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      backgroundRefs.current[index] = el;
    }
  };

  const setTitleRef = (el: HTMLHeadingElement | null, index: number) => {
    if (el) {
      titleRefs.current[index] = el;
    }
  };

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;

      const backgrounds = backgroundRefs.current;
      const titles = titleRefs.current;

      if (!backgrounds.length || !titles.length) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * ---------------------------------------------------------
       * CUBE WRAPPER CENTRING
       * ---------------------------------------------------------
       */

      let orbit: CubeOrbit = {
        radiusX: 0,
        radiusY: 0,
        yOffset: 0,
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
      };

      /*
       * Scroll progress at which each face finishes rotating to square
       * with the camera. Filled in once the timeline exists, because
       * its real duration depends on how the staggered title tweens
       * land, so it is measured rather than assumed.
       */
      let facePhase: number[] = [];

      if (cubeWrapperRef.current) {
        /*
         * GSAP composes translate(xPercent%, yPercent%) with
         * translate3d(x, y, z), so the centring is percentage based
         * and stays put while x/y drive the orbit.
         */

        gsap.set(cubeWrapperRef.current, {
          xPercent: -50,
          yPercent: -50,
        });

        orbit = getCubeOrbit(cubeWrapperRef.current);
      }

      const applyOrbit = (progress: number) => {
        if (!cubeWrapperRef.current) {
          return;
        }

        const position = getCubeOrbitPosition(progress, orbit);

        const nudge = getCubeOrbitNudge(progress, facePhase);

        gsap.set(cubeWrapperRef.current, {
          x: clamp(position.x + nudge.x, orbit.minX, orbit.maxX),

          y: clamp(position.y + nudge.y, orbit.minY, orbit.maxY),
        });
      };

      /*
       * Seeding this matters: onUpdate is scroll driven, so without a
       * seed the cube parks dead centre until the first scroll event.
       */

      applyOrbit(0);

      /*
       * ---------------------------------------------------------
       * REDUCED MOTION
       * ---------------------------------------------------------
       */

      if (prefersReducedMotion) {
        backgrounds.forEach((background, index) => {
          gsap.set(background, {
            opacity: index === 0 ? 1 : 0,
          });
        });

        titles.forEach((title, index) => {
          gsap.set(title, {
            opacity: index === 0 ? 1 : 0,
          });
        });

        if (cubeWrapperRef.current) {
          gsap.set(cubeWrapperRef.current, {
            x: 0,
            y: 0,
          });
        }

        return;
      }

      /*
       * ---------------------------------------------------------
       * INITIAL BACKGROUND STATE
       * ---------------------------------------------------------
       */

      backgrounds.forEach((background, index) => {
        gsap.set(background, {
          opacity: index === 0 ? 1 : 0,
          zIndex: projects.length - index,
        });
      });

      /*
       * ---------------------------------------------------------
       * SPLIT PROJECT TITLES
       * ---------------------------------------------------------
       */

      const splitInstances: SplitText[] = [];

      const titleWords: HTMLElement[][] = [];

      titles.forEach((title, index) => {
        const split = SplitText.create(title, {
          type: "words",
          mask: "words",
          wordsClass: "architecture-word",
          aria: "auto",
        });

        splitInstances.push(split);

        titleWords[index] = split.words as HTMLElement[];

        gsap.set(split.words, {
          yPercent: index === 0 ? 0 : 100,
          opacity: index === 0 ? 1 : 0,
        });
      });

      /*
       * ---------------------------------------------------------
       * INITIAL CUBE STATE
       * ---------------------------------------------------------
       */

      if (cubeRef.current) {
        gsap.set(cubeRef.current, {
          rotationX: CUBE_ROTATIONS[0].rotateX,
          rotationY: CUBE_ROTATIONS[0].rotateY,
        });
      }

      /*
       * ---------------------------------------------------------
       * MASTER SCROLL TIMELINE
       * ---------------------------------------------------------
       */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: "bottom bottom",

          scrub: 0.8,

          invalidateOnRefresh: true,

          /*
           * Re-measures on resize, and also covers the very first
           * refresh so the orbit is never drawn from a stale radius.
           */

          onRefresh: (self) => {
            if (!cubeWrapperRef.current) {
              return;
            }

            orbit = getCubeOrbit(cubeWrapperRef.current);

            applyOrbit(self.progress);
          },

          onUpdate: (self) => applyOrbit(self.progress),
        },
      });

      /*
       * Each transition follows the tutorial's structure:
       *
       * TEXT OUT
       * IMAGE FADE
       * TEXT IN
       *
       * + CUBE ROTATION
       * + CUBE MOVEMENT
       */

      const transitionDuration = 1.3;
      const transitionGap = 0.2;

      for (let index = 0; index < projects.length - 1; index++) {
        const nextIndex = index + 1;

        const start = index * (transitionDuration + transitionGap);

        /*
         * Keeps every background above the incoming one for the whole
         * transition. Without this the outgoing layer pops to the back
         * mid-fade and the new image shows through as a flash.
         */

        timeline.set(
          backgrounds[index],
          {
            zIndex: projects.length - index,
          },
          start,
        );

        /*
         * -------------------------------------------------------
         * CURRENT TITLE OUT
         * -------------------------------------------------------
         */

        timeline.to(
          titleWords[index],
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.4,
            stagger: 0.12,
            ease: "none",
          },
          start,
        );

        /*
         * -------------------------------------------------------
         * BACKGROUND TRANSITION
         * -------------------------------------------------------
         */

        timeline.to(
          backgrounds[index],
          {
            opacity: 0,
            duration: 0.5,
            ease: "none",
          },
          start + 0.4,
        );

        timeline.fromTo(
          backgrounds[nextIndex],
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
            ease: "none",
          },
          start + 0.4,
        );

        timeline.set(
          backgrounds[nextIndex],
          {
            zIndex: projects.length - nextIndex,
          },
          start + 0.4,
        );

        /*
         * -------------------------------------------------------
         * NEXT TITLE IN
         * -------------------------------------------------------
         */

        timeline.fromTo(
          titleWords[nextIndex],
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
          },
          start + 0.6,
        );

        /*
         * -------------------------------------------------------
         * CUBE ROTATION
         * -------------------------------------------------------
         */

        if (cubeRef.current) {
          const current = CUBE_ROTATIONS[index % CUBE_ROTATIONS.length];

          const next = CUBE_ROTATIONS[nextIndex % CUBE_ROTATIONS.length];

          /*
           * The top and bottom faces sit 180 degrees apart, so
           * tweening rotationX straight from one to the other drags
           * the cube through rotationX 0 while rotationY sits at 0,
           * and that is exactly the first face's orientation. The
           * first image then flashes back on screen square to the
           * camera, out of order, between the fifth and sixth.
           *
           * Both ends are pinned to rotationY 0 or the correct face
           * would not be square to the camera, so the fix is a
           * waypoint that holds a 45 degree yaw while the cube
           * crosses rotationX 0. It tumbles through an edge instead
           * of presenting a face.
           */

          const isHalfTurn = Math.abs(next.rotateX - current.rotateX) === 180;

          if (isHalfTurn) {
            timeline.to(
              cubeRef.current,
              {
                keyframes: [
                  {
                    rotationX: (current.rotateX + next.rotateX) / 2,

                    rotationY: next.rotateY - CUBE_HALF_TURN_YAW,

                    duration: transitionDuration / 2,

                    ease: "none",
                  },

                  {
                    rotationX: next.rotateX,

                    rotationY: next.rotateY,

                    duration: transitionDuration / 2,

                    ease: "none",
                  },
                ],
              },

              start,
            );
          } else {
            timeline.to(
              cubeRef.current,
              {
                rotationX: next.rotateX,

                rotationY: next.rotateY,

                duration: transitionDuration,

                ease: "none",
              },

              start,
            );
          }
        }
      }

      /*
       * Face i reaches its final rotation when the tween that brought
       * it round ends, which is (i - 1) transitions along plus one
       * transition duration. Face 0 is already square at the start.
       */

      const timelineDuration = timeline.duration() || 1;

      facePhase = CUBE_ROTATIONS.map((_, index) =>
        clamp(
          ((index - 1) * (transitionDuration + transitionGap) +
            transitionDuration) /
            timelineDuration,
          0,
          1,
        ),
      );

      applyOrbit(0);

      /*
       * ---------------------------------------------------------
       * CLEANUP
       * ---------------------------------------------------------
       */

      return () => {
        splitInstances.forEach((split) => {
          split.revert();
        });
      };
    },
    {
      scope: sectionRef,
      dependencies: [projects],
      revertOnUpdate: true,
    },
  );

  return (
    <section ref={sectionRef} className="architecture-gallery">
      <div ref={viewportRef} className="architecture-gallery__viewport">
        {/* -------------------------------------------------- */}
        {/* BACKGROUND PROJECTS */}
        {/* -------------------------------------------------- */}

        <div className="architecture-gallery__backgrounds">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => setBackgroundRef(el, index)}
              className="architecture-gallery__background"
            >
              <img
                src={project.image}
                alt={project.title}
                className="architecture-gallery__background-image"
              />

              <div className="architecture-gallery__overlay" />

              <div className="architecture-gallery__project-info">
                <span>{project.category}</span>

                <span>{project.location}</span>

                <span>{project.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* -------------------------------------------------- */}
        {/* PROJECT TITLES */}
        {/* -------------------------------------------------- */}

        <div className="architecture-gallery__titles">
          {projects.map((project, index) => (
            <h2
              key={project.id}
              ref={(el) => setTitleRef(el, index)}
              className="architecture-gallery__title"
              aria-label={project.title}
            >
              {project.title}
            </h2>
          ))}
        </div>

        {/* -------------------------------------------------- */}
        {/* 3D CUBE */}
        {/* -------------------------------------------------- */}

        <div
          ref={cubeWrapperRef}
          className="architecture-gallery__cube-wrapper"
        >
          <div ref={cubeRef} className="architecture-gallery__cube">
            {projects.slice(0, 6).map((project, index) => (
              <div
                key={project.id}
                className={`architecture-gallery__cube-face architecture-gallery__cube-face--${index + 1}`}
                style={
                  {
                    "--face-transform":
                      FACE_TRANSFORMS[index % FACE_TRANSFORMS.length],
                  } as CSSProperties
                }
              >
                <img src={project.image} alt="" aria-hidden="true" />

                <div className="architecture-gallery__cube-face-number">
                  0{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* TOP UI */}
        {/* -------------------------------------------------- */}

        <div className="architecture-gallery__header">
          <div className="architecture-gallery__brand">ATELIER</div>

          <div className="architecture-gallery__label">SELECTED WORKS</div>

          <div className="architecture-gallery__count">
            {projects.length.toString().padStart(2, "0")} PROJECTS
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* BOTTOM UI */}
        {/* -------------------------------------------------- */}

        <div className="architecture-gallery__footer">
          <span>SCROLL TO EXPLORE</span>

          <div className="architecture-gallery__line">
            <span />
          </div>

          <span>2023 — 2026</span>
        </div>

        {/* -------------------------------------------------- */}
        {/* GRAIN */}
        {/* -------------------------------------------------- */}

        <div className="architecture-gallery__grain" />

        {/* -------------------------------------------------- */}
        {/* VIGNETTE */}
        {/* -------------------------------------------------- */}

        <div className="architecture-gallery__vignette" />
      </div>
    </section>
  );
}
