import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';

import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ParallaxSections } from './ParallaxSections';
import { PerspectiveGallery } from './PerspectiveGallery';
import { getServiceScenes } from './serviceScenes';

import './react-3d-carousel.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/*
 * ScrollSmoother owns the document scroll while this component is mounted and
 * ArchitectureCarousel owns it on /portfolio. Both wrap their content in a
 * #smooth-wrapper, so two live instances would nest and fight over the same
 * scrollbar. Tracking the live one here lets a services route take over from
 * an unfinished smoother as well as hand it back cleanly.
 */
let activeSmoother: ScrollSmoother | null = null;

function ScrollCue({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="r3c-cue-section" aria-hidden>
      <p className="r3c-cue">
        {label}
        {icon}
      </p>
    </div>
  );
}

type React3DCarouselProps = {
  /** Page key from lib/pages, used to pick the pinned section copy. */
  pageKey: string;
};

/*
 * Reading order, top to bottom:
 *
 *   1. scroll on cue
 *   2. the six frame scatter arriving
 *   3. one frame pulling to focus
 *   4. the pinned section wipes
 *   5. scroll back cue
 */
export function React3DCarousel({ pageKey }: React3DCarouselProps) {
  /*
   * Read once rather than per render: the preference does not change mid
   * session, and reading it during render would desync the class the markup
   * is built from against the effect that decides whether GSAP runs.
   */
  const [animated] = useState(
    () =>
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const scenes = useMemo(() => getServiceScenes(pageKey), [pageKey]);

  useLayoutEffect(() => {
    if (!animated) return;

    const content = document.getElementById('r3c-smooth-content');

    if (!content) return;

    activeSmoother?.kill();

    const smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: true,
      content: '#r3c-smooth-content',
    });

    activeSmoother = smoother;

    /*
     * The smoother resizes the document after it attaches, which leaves the
     * pinned scenes measuring against the pre attach viewport.
     */
    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener('resize', refresh);

    return () => {
      window.removeEventListener('resize', refresh);

      smoother.kill();

      if (activeSmoother === smoother) {
        activeSmoother = null;
      }

      ScrollTrigger.refresh();
    };
  }, [animated]);

  return (
    <div className={`r3c-root ${animated ? '' : 'r3c-root--static'}`}>
      <div id="r3c-smooth-content" className="r3c-smooth-content">
        <ScrollCue label="Scroll on" icon={<ArrowDown aria-hidden />} />

        <PerspectiveGallery animated={animated} />

        <div className="r3c-buffer" aria-hidden />

        <ParallaxSections scenes={scenes} animated={animated} />

        <ScrollCue label="Scroll back" icon={<ArrowUp aria-hidden />} />
      </div>
    </div>
  );
}

export default React3DCarousel;