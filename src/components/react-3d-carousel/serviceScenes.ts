/*
 * ---------------------------------------------------------------------------
 * PINNED SECTION CONTENT
 * ---------------------------------------------------------------------------
 *
 * The second half of the carousel is three stacked, full bleed sections that
 * wipe into each other while a smaller square crop crossfades beside them.
 *
 * Each one wants a short title and a handful of uppercase facts, which is a
 * different shape to the paragraphs in lib/pages.ts, so the copy lives here
 * rather than being reshaped at render time. The keys match the PageKey of the
 * route that renders them.
 */

import { getCarouselImage, type CarouselImage } from './carouselImages';

export type CarouselScene = {
  title: string;
  lines: string[];
  image: CarouselImage;
};

export const SERVICE_SCENES: Record<string, CarouselScene[]> = {
  services: [
    {
      title: 'One studio, four disciplines',
      lines: [
        'First sketch to last weathered surface',
        'Nothing subcontracted away',
        'Structural grid signed off by the same hand',
      ],
      image: getCarouselImage(1),
    },
    {
      title: 'Scoped in house',
      lines: [
        'Four disciplines, one argument',
        'Between weight and light',
        'The team that drew it builds it',
      ],
      image: getCarouselImage(0),
    },
    {
      title: 'Eighteen to thirty six months',
      lines: [
        'Lead time, not deadline',
        'Consent held in parallel with design',
        'A partner stays on every commission',
      ],
      image: getCarouselImage(7),
    },
  ],

  'services/architectural-design': [
    {
      title: 'Structure first',
      lines: [
        'Footings, cores and spans before elevations',
        'RIBA stage 0 to 7',
        'Spans resolved up to 18m',
      ],
      image: getCarouselImage(0),
    },
    {
      title: 'Plans rotated to the sun',
      lines: [
        'Daylight lands once a day, on purpose',
        'Load paths carry honestly',
        'No form disguising its own weight',
      ],
      image: getCarouselImage(6),
    },
    {
      title: 'The building admits it',
      lines: [
        'Shadow gaps drawn to a reveal depth',
        'Structure legible from the street',
        'Weathering treated as a finish',
      ],
      image: getCarouselImage(7),
    },
  ],

  'services/interior-design': [
    {
      title: 'Rooms tuned for silence',
      lines: [
        'Acoustics specified as a finish',
        'Thermal mass over thin partitions',
        'Target acoustic rating RC 30',
      ],
      image: getCarouselImage(1),
    },
    {
      title: 'Eight to twelve materials',
      lines: [
        'Oak, lime plaster, board formed concrete',
        'Specified to improve with handling',
        'Nothing that degrades into wear',
      ],
      image: getCarouselImage(4),
    },
    {
      title: 'The room you hear',
      lines: [
        'Deep reveals over applied trim',
        'Absorption placed at the listener',
        'Acoustics drawn, not retrofitted',
      ],
      image: getCarouselImage(5),
    },
  ],

  'services/design-construction': [
    {
      title: 'One conversation',
      lines: [
        'Drawing and site, not two handovers',
        'Design and build contract',
        'On site every week',
      ],
      image: getCarouselImage(6),
    },
    {
      title: 'Tolerances agreed at concept',
      lines: [
        'Defended through to handover',
        'Site presence is not oversight',
        'Detail survives the people building it',
      ],
      image: getCarouselImage(3),
    },
    {
      title: 'Nothing deferred',
      lines: [
        'Reveals set out before the pour',
        'Services drawn with the structure',
        'Snagging closed on site, not in a list',
      ],
      image: getCarouselImage(2),
    },
  ],

  'services/conservation-heritage': [
    {
      title: 'Survey before touch',
      lines: [
        'Record and stabilise first',
        'Photogrammetric survey method',
        'Heritage grade I to II',
      ],
      image: getCarouselImage(2),
    },
    {
      title: 'Repair, then replace',
      lines: [
        'Matching mortar, breathable finishes',
        'The repair stops the decay',
        'Never sealing moisture in',
      ],
      image: getCarouselImage(3),
    },
    {
      title: 'Listing as a brief',
      lines: [
        'Grade I to II fabric',
        'Conservation areas argued at committee',
        'What was replaced, and what was kept',
      ],
      image: getCarouselImage(5),
    },
  ],
};

/**
 * Every /services route renders three scenes so the wipe always has two
 * closures to play out. Anything unlisted falls back to the overview.
 */
export const getServiceScenes = (pageKey: string): CarouselScene[] =>
  SERVICE_SCENES[pageKey] ?? SERVICE_SCENES.services;