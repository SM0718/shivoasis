import { React3DCarousel } from './React3DCarousel';

/**
 * Page body for every /services route.
 *
 * React3DCarousel takes over the document scroll through ScrollSmoother, which
 * pulls its content element out of flow and leaves the carousel at zero height.
 * A wrapper sized only by its content therefore collapses to the 60px of
 * padding, and the light #e8e8e3 app shell behind it shows through the pinned
 * scenes as a white wash. Opaque plus min-h-svh keeps the page dark from the
 * first paint, which is the same fix /portfolio carries. The top padding clears
 * the fixed site navbar.
 */
export function ServicesCarouselPage({ pageKey }: { pageKey: string }) {
  return (
    <div className="min-h-svh bg-[#11110f] pt-[3.75rem]">
      <React3DCarousel pageKey={pageKey} />
    </div>
  );
}