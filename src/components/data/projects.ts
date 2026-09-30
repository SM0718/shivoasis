export interface WorkImage {
  src: string;
  alt: string;
}

export interface WorkVideo {
  poster: string;
  mp4: string;
  webm?: string;
}

export interface WorkLine {
  text: string;
  accent?: string;
  accentClass?: string;
}

export interface WorkProject {
  id: string;
  image: WorkImage;
  videos: WorkVideo[];
  title: WorkLine[];
  subtitle: string[];
}

export interface HeroData {
  image: WorkImage;
  lines: WorkLine[];
}

const photo = (id: string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const VIDEO_A =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const VIDEO_B = "https://www.w3schools.com/html/mov_bbb.mp4";

export const HERO: HeroData = {
  image: {
    src: photo("21415155", 2400),
    alt: "Board formed concrete residence in low afternoon light",
  },
  lines: [
    { text: "Concrete" },
    { text: "Meets", accent: "Light", accentClass: "hero_accent" },
    { text: "Structure" },
  ],
};

export const PROJECTS: WorkProject[] = [
  {
    id: "work-01",
    image: {
      src: photo("21415155", 2400),
      alt: "Monsoon House exterior with deep shaded thresholds",
    },
    videos: [
      {
        poster: photo("21415155", 2400),
        mp4: VIDEO_A,
      },
    ],
    title: [
      { text: "Monsoon" },
      { text: "House", accent: "Residence", accentClass: "work_accent" },
    ],
    subtitle: ["Kolkata, India", "Residential", "2026"],
  },
  {
    id: "work-02",
    image: {
      src: photo("35115180", 2400),
      alt: "Courtyard Residence atrium in Copenhagen",
    },
    videos: [
      {
        poster: photo("35115180", 2400),
        mp4: VIDEO_B,
      },
    ],
    title: [
      { text: "Courtyard" },
      { text: "Residence" },
    ],
    subtitle: ["Copenhagen, Denmark", "Residential", "2025"],
  },
  {
    id: "work-03",
    image: {
      src: photo("28993989", 2400),
      alt: "Small house facade in Mexico City",
    },
    videos: [
      {
        poster: photo("28993989", 2400),
        mp4: VIDEO_A,
      },
    ],
    title: [
      { text: "Small" },
      { text: "House" },
    ],
    subtitle: ["Mexico City, Mexico", "Residential", "2025"],
  },
  {
    id: "work-04",
    image: {
      src: photo("18891783", 2400),
      alt: "Hospitality courtyard with layered planting in Lisbon",
    },
    videos: [
      {
        poster: photo("18891783", 2400),
        mp4: VIDEO_B,
      },
    ],
    title: [
      { text: "Court" },
      { text: "Hotel" },
    ],
    subtitle: ["Lisbon, Portugal", "Hospitality", "2024"],
  },
  {
    id: "work-05",
    image: {
      src: photo("18267934", 2400),
      alt: "Vertical commercial facade in Seoul",
    },
    videos: [
      {
        poster: photo("18267934", 2400),
        mp4: VIDEO_A,
      },
    ],
    title: [
      { text: "Vertical" },
      { text: "Block" },
    ],
    subtitle: ["Seoul, South Korea", "Commercial", "2024"],
  },
  {
    id: "work-06",
    image: {
      src: photo("34062660", 2400),
      alt: "Cultural building against a northern horizon in Reykjavik",
    },
    videos: [
      {
        poster: photo("34062660", 2400),
        mp4: VIDEO_B,
      },
    ],
    title: [
      { text: "Horizon" },
      { text: "House" },
    ],
    subtitle: ["Reykjavik, Iceland", "Cultural", "2023"],
  },
];
