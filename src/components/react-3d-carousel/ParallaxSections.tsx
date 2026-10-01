import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { CarouselScene } from './serviceScenes';

gsap.registerPlugin(ScrollTrigger);

/* Full height box, then collapsed to a zero height line along the top edge. */
const CLIP_OPEN = 'polygon(0 0, 0 100%, 100% 100%, 100% 0)';
const CLIP_CLOSED = 'polygon(0 0, 0 0%, 100% 0%, 100% 0)';

type ParallaxSectionsProps = {
  scenes: CarouselScene[];
  /** Set false under prefers-reduced-motion to skip GSAP entirely. */
  animated: boolean;
};

export function ParallaxSections({ scenes, animated }: ParallaxSectionsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animated) return;

      const stage = stageRef.current;

      if (!stage) return;

      const panels = gsap.utils.toArray<HTMLElement>('.r3c-scene', stage);
      const stackFrames = gsap.utils.toArray<HTMLElement>(
        '.r3c-parallax__stack-frame',
        stage,
      );

      if (panels.length < 2 || stackFrames.length < 2) return;

      /*
       * The last panel is the one still standing once the timeline ends, so
       * it is never clipped closed. Everything above it starts fully open
       * and wipes shut to reveal the layer beneath.
       */
      const closing = (elements: HTMLElement[]) => elements.slice(0, -1);

      closing(panels).forEach((panel) => {
        gsap.set(panel, { clipPath: CLIP_OPEN });
      });

      closing(stackFrames).forEach((frame) => {
        gsap.set(frame, { clipPath: CLIP_OPEN });
      });

      const scrollTrigger = {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        invalidateOnRefresh: true,
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          ...scrollTrigger,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      closing(panels).forEach((panel) => {
        timeline.to(panel, { clipPath: CLIP_CLOSED, ease: 'none' });
      });

      /*
       * The square crop runs on its own trigger, off the same scroll range
       * but with a catch-up scrub so the two reveals are not welded
       * together. It is not pinned: the stage already is.
       */
      const stackTimeline = gsap.timeline({
        scrollTrigger: { ...scrollTrigger, scrub: 1 },
      });

      closing(stackFrames).forEach((frame) => {
        stackTimeline.to(frame, { clipPath: CLIP_CLOSED, ease: 'none' });
      });
    },
    { scope: sectionRef, dependencies: [scenes, animated], revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className="r3c-parallax">
      <div ref={stageRef} className="r3c-parallax__stage">
        {scenes.map((scene, index) => (
          <article
            key={`${scene.title}-${index}`}
            className="r3c-scene"
            style={{ zIndex: scenes.length - index }}
          >
            <div className="r3c-scene__backdrop">
              <img src={scene.image.src} alt="" aria-hidden />
            </div>

            <div className="r3c-scene__panel">
              <h2 className="font-display r3c-scene__title">{scene.title}</h2>

              <ul className="r3c-scene__lines">
                {scene.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <div className="r3c-parallax__stack">
          {scenes.map((scene, index) => (
            <div
              key={`${scene.image.src}-${index}`}
              className="r3c-parallax__stack-frame"
              style={{ zIndex: scenes.length - index }}
            >
              <img src={scene.image.src} alt={scene.image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}