/*
 * ---------------------------------------------------------------------------
 * CAROUSEL IMAGERY
 * ---------------------------------------------------------------------------
 *
 * The upstream demo pointed at ./i1.jpg ... ./i8.jpg but those files never made
 * it into the folder. They are downloaded from Pexels now and imported through
 * the bundler rather than referenced from a public path, so Vite can hash and
 * optimise them and TypeScript can guarantee the URL is spelled right.
 *
 * All eight are used by Pexels' free licence, which allows commercial use and
 * needs no attribution. Credits are kept here anyway.
 *
 *   i1  Steve Johnson .... pexels.com/photo/323780  contemporary home, Poole
 *   i2  Hutomo Abrianto ... pexels.com/photo/5570230 modern living room
 *   i3  Josh Riemer ...... pexels.com/photo/271667  floor plan on paper
 *   i4  Craig McGowan .... pexels.com/photo/259588  stone house in trees
 *   i5  Vecislavas Popa .. pexels.com/photo/1643383 living room + kitchen
 *   i6  Saroj Pal ........ pexels.com/photo/325185  towers in fog
 *   i7  Jason Briscoe .... pexels.com/photo/1080721 modern kitchen
 *   i8  Lerone Pieters ... pexels.com/photo/157811  high rise, black + white
 */

import i1 from './images/i1.jpg';
import i2 from './images/i2.jpg';
import i3 from './images/i3.jpg';
import i4 from './images/i4.jpg';
import i5 from './images/i5.jpg';
import i6 from './images/i6.jpg';
import i7 from './images/i7.jpg';
import i8 from './images/i8.jpg';

export type CarouselImage = {
  src: string;
  alt: string;
};

/**
 * The eight frames the two scenes draw from.
 *
 * Every scene maps onto this by index rather than importing its own copy, so
 * the whole component ships eight images no matter how many routes use it.
 */
export const CAROUSEL_IMAGES: CarouselImage[] = [
  { src: i1, alt: 'Contemporary home with glazed balconies' },
  { src: i2, alt: 'Modern living room in daylight' },
  { src: i3, alt: 'Architectural floor plan drawing' },
  { src: i4, alt: 'Stone house framed by trees' },
  { src: i5, alt: 'Open living room and kitchen' },
  { src: i6, alt: 'Towers rising through fog' },
  { src: i7, alt: 'Kitchen island in natural light' },
  { src: i8, alt: 'High rise facade in black and white' },
];

export const getCarouselImage = (index: number): CarouselImage =>
  CAROUSEL_IMAGES[index % CAROUSEL_IMAGES.length];