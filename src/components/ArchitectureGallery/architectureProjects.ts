import type { ArchitectureProject } from "./types";

/*
 * Local imagery served from /public/landing-pages.
 *
 * The order here is the scroll order on the home page, so it maps to
 * the filenames alphabetically:
 *
 *   1 Architect  -> 2 Construction -> 3 Heritage Design
 *   4 Interior Design -> 5 Planning
 *
 * There are only five source images but the 3D cube draws six faces,
 * so the sixth slot reuses Architect rather than leaving a face empty.
 */

export const architectureProjects: ArchitectureProject[] = [
  {
    id: 1,
    title: "MONOLITH",
    location: "Tokyo, Japan",
    year: "2026",
    category: "Architectural",
    image: "/landing-pages/Architect.png",
  },
  {
    id: 2,
    title: "ATRIUM",
    location: "Copenhagen, Denmark",
    year: "2025",
    category: "Construction",
    image: "/landing-pages/Construction.png",
  },
  {
    id: 3,
    title: "SMALL HOUSE",
    location: "Mexico City, Mexico",
    year: "2025",
    category: "Heritage",
    image: "/landing-pages/Heritage%20Design.png",
  },
  {
    id: 4,
    title: "COURTYARD",
    location: "Lisbon, Portugal",
    year: "2024",
    category: "Interior",
    image: "/landing-pages/Interior%20Design.png",
  },
  {
    id: 5,
    title: "VERTICAL",
    location: "Seoul, South Korea",
    year: "2024",
    category: "Planning",
    image: "/landing-pages/Planning.png",
  },
  {
    id: 6,
    title: "HORIZON",
    location: "Reykjavik, Iceland",
    year: "2023",
    category: "Architectural",
    image: "/landing-pages/Architect.png",
  },
];