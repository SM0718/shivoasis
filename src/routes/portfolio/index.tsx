import { createFileRoute } from '@tanstack/react-router'

import ArchitectureCarousel from '@/components/ArchitectureProjects/ArchitectureCarousel'

import { architectureProjects } from '@/components/ArchitectureProjects/architectureProjects'

export const Route = createFileRoute('/portfolio/')({
  component: PortfolioProjects,
})

/*
 * ---------------------------------------------------------------------------
 * PREVIOUS PORTFOLIO UI — kept for reference, not rendered.
 *
 * It used the CompleteShelfLandingPage recipe from @designcodeio/threeui,
 * which is a fixed-height landing page rather than a scroll-driven one, so
 * it needed its own stylesheet and a viewport-clamped wrapper:
 *
 *   import { CompleteShelfLandingPage } from '@designcodeio/threeui'
 *   import '@designcodeio/threeui/style.css'
 *
 *   function PortfolioShelf() {
 *     return (
 *       <div className="bg-[#dfdfdf] pt-[3.75rem]">
 *         <div className="h-[calc(100dvh-3.75rem)] w-full">
 *           <CompleteShelfLandingPage
 *             className="h-full w-full"
 *             headingFont="geist"
 *             bodyFont="inter"
 *             headingWeight="600"
 *             bodyWeight="400"
 *             headingSize={60}
 *             bodySize={12}
 *             headingLetterSpacing={0.02}
 *             primaryColor="#1a1a1a"
 *           />
 *         </div>
 *       </div>
 *     )
 *   }
 * ---------------------------------------------------------------------------
 */

/**
 * ArchitectureCarousel is a full scroll-driven page built on ScrollSmoother, so
 * it is not height-clamped the way the shelf recipe was. The top padding is
 * kept from the previous version to clear the fixed site navbar.
 *
 * The wrapper carries the dark background and a full viewport height, and both
 * are load bearing. ScrollSmoother transforms #smooth-content out of flow,
 * which leaves .architecture-carousel at zero height, so a wrapper sized only
 * by its content collapsed to the 60px of padding. The app shell behind it is a
 * light #e8e8e3, so that shell then filled the viewport and showed through
 * between the scenes as a white wash until you scrolled. Opaque plus min-h-svh
 * keeps the page dark from the very first paint.
 */
function PortfolioProjects() {
  return (
    <div className="min-h-svh bg-[#11110f] pt-[3.75rem]">
      <ArchitectureCarousel projects={architectureProjects} />
    </div>
  )
}
