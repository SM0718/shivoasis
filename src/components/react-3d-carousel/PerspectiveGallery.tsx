import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CAROUSEL_IMAGES } from './carouselImages';

import type { CarouselImage } from './carouselImages';

gsap.registerPlugin(ScrollTrigger);

/*
 * The six frames, laid over one another at fixed offsets inside a 3D stage.
 * Positions are percentages, so the composition holds at any viewport size.
 */
const FRAMES: CarouselImage[] = [
  CAROUSEL_IMAGES[0],
  CAROUSEL_IMAGES[1],
  CAROUSEL_IMAGES[2],
  CAROUSEL_IMAGES[3],
  CAROUSEL_IMAGES[4],
  CAROUSEL_IMAGES[5],
];

/*
 * The frame that takes focus. Index 5 is the widest of the six (34% of the
 * stage) and sits top centre, so it is the natural anchor of the composition.
 */
const FOCUS_INDEX = 5;

/*
 * How much of the viewport the focused frame should occupy once it lands, as a
 * fraction of the more constraining axis. Contain fit, so a landscape frame is
 * held back by its width and a portrait one by its height. At 1 the frame runs
 * edge to edge on whichever axis runs out first, with the other axis centred
 * and showing background.
 */
const FOCUS_FILL = 1;

/* Split of the pinned scroll range between settling the scatter and focusing. */
const ACT_SETTLE = 1;
const ACT_FOCUS = 1;

type Focus = {
  scale: number;
  x: number;
  y: number;
};

type PerspectiveGalleryProps = {
  /** Set false under prefers-reduced-motion to skip GSAP entirely. */
  animated: boolean;
};

export function PerspectiveGallery({ animated }: PerspectiveGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animated) return;

      const stage = stageRef.current;

      if (!stage) return;

      const medias = gsap.utils.toArray<HTMLElement>(
        '.r3c-perspective__media',
        stage,
      );

      if (medias.length < 2) return;

      const focusMedia = medias[FOCUS_INDEX];

      if (!focusMedia) return;

      const others = medias.filter((media) => media !== focusMedia);

      /*
       * ---------------------------------------------------------------
       * FOCUS TARGET
       * ---------------------------------------------------------------
       *
       * The frame lands at FOCUS_FILL of the viewport, centred.
       *
       * Measured from offsetLeft/offsetTop/offsetWidth/offsetHeight rather
       * than getBoundingClientRect, because those report the layout box and
       * ignore transforms. Act one below leaves the frames mid scale and act
       * two moves them, so a rect measured at build time would be read against
       * whatever transform happened to be applied, and the frame would land at
       * the wrong size. The media are absolutely positioned inside the frame,
       * which is inset:0 inside a stage, so the frame and the stage share an
       * origin and offsetLeft/offsetTop are already stage relative.
       */
      let focus: Focus | null = null;

      const measureFocus = (): Focus => {
        const scale = Math.min(
          (stage.clientWidth * FOCUS_FILL) / focusMedia.offsetWidth,
          (stage.clientHeight * FOCUS_FILL) / focusMedia.offsetHeight,
        );

        const centreX = focusMedia.offsetLeft + focusMedia.offsetWidth / 2;
        const centreY = focusMedia.offsetTop + focusMedia.offsetHeight / 2;

        return {
          scale,
          x: stage.clientWidth / 2 - centreX,
          y: stage.clientHeight / 2 - centreY,
        };
      };

      const getFocus = () => (focus ??= measureFocus());

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          /*
           * Drops the cached measurement so the function based values below are
           * re measured against the new stage size after a resize.
           */
          onRefresh: () => {
            focus = null;
          },
        },
      });

      /*
       * ---------------------------------------------------------------
       * ACT ONE: the scatter arrives
       * ---------------------------------------------------------------
       *
       * The six frames fade up and settle into their offsets, staggered so the
       * group reads as a composition landing rather than a static collage.
       */
      timeline.fromTo(
        medias,
        { autoAlpha: 0, scale: 0.9 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: ACT_SETTLE,
          ease: 'power2.out',
          stagger: ACT_SETTLE / medias.length,
        },
        0,
      );

      /*
       * ---------------------------------------------------------------
       * ACT TWO: one frame takes focus
       * ---------------------------------------------------------------
       *
       * The chosen frame grows to its measured size and slides to the centre
       * of the stage while the rest shrink and fade out underneath it.
       */
      const focusStart = ACT_SETTLE;

      timeline.to(
        focusMedia,
        {
          scale: () => getFocus().scale,
          x: () => getFocus().x,
          y: () => getFocus().y,
          duration: ACT_FOCUS,
          ease: 'power3.inOut',
        },
        focusStart,
      );

      timeline.to(
        others,
        {
          autoAlpha: 0,
          scale: 0.82,
          duration: ACT_FOCUS,
          ease: 'power2.inOut',
          stagger: 0.05,
        },
        focusStart,
      );
    },
    { scope: sectionRef, dependencies: [animated], revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className="r3c-perspective">
      <div ref={stageRef} className="r3c-perspective__stage">
        <div className="r3c-perspective__wrapper">
          {FRAMES.map((frame, index) => (
            <div key={frame.src} className="r3c-perspective__frame">
              <div
                className={`r3c-perspective__media r3c-perspective__media--${index + 1}`}
              >
                <img src={frame.src} alt={frame.alt} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}