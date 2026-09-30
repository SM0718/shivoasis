export type PageMeta = {
  label: string;
  value: string;
};

export type PageContent = {
  eyebrow: string;
  title: string;
  lede: string;
  body: string[];
  meta: PageMeta[];
};

export const PAGES = {
  services: {
    eyebrow: "Services",
    title: "What we do",
    lede: "Four disciplines, one continuous argument between weight and light.",
    body: [
      "We take a project from first sketch to the last weathered surface. The same team that sets the structural grid signs off on the reveal depth of a shadow gap.",
      "Every commission is scoped in-house. Nothing is subcontracted away from the studio that drew it.",
    ],
    meta: [
      { label: "Disciplines", value: "04" },
      { label: "Lead time", value: "18–36 months" },
    ],
  },
  "services/architectural-design": {
    eyebrow: "Services / Architectural Design",
    title: "Architectural design",
    lede: "Load paths resolved before form is drawn.",
    body: [
      "We begin with the structure. Footings, cores and spans are settled before a single elevation is composed, so the building carries its own weight honestly rather than disguising it.",
      "Plans are then rotated until the sun lands exactly once a day, and only once, on the surface we want it to.",
    ],
    meta: [
      { label: "RIBA stage", value: "0–7" },
      { label: "Typical span", value: "Up to 18m" },
    ],
  },
  "services/interior-design": {
    eyebrow: "Services / Interior Design",
    title: "Interior design",
    lede: "Rooms tuned for the silence between two people talking.",
    body: [
      "Thermal mass, deep reveals and honest materials. We specify oak, lime plaster and board-formed concrete that improve with handling rather than degrading into it.",
      "Acoustics are treated as a finish, not an afterthought. The room you hear is the room we drew.",
    ],
    meta: [
      { label: "Palette", value: "8–12 materials" },
      { label: "Acoustic target", value: "RC 30" },
    ],
  },
  "services/design-construction": {
    eyebrow: "Services / Design & Construction",
    title: "Design & construction",
    lede: "The drawing and the site are the same conversation.",
    body: [
      "We stay on site through construction. Site presence is not oversight for its own sake — it is how a detail survives contact with the people actually building it.",
      "Tolerances are agreed at concept stage and defended through to handover.",
    ],
    meta: [
      { label: "Contract type", value: "Design & build" },
      { label: "Site presence", value: "Weekly" },
    ],
  },
  "services/conservation-heritage": {
    eyebrow: "Services / Conservation & Heritage Design",
    title: "Conservation & heritage",
    lede: "Repair first, replace last, and never both by accident.",
    body: [
      "We survey, record and stabilise before touching anything. Historic fabric is repaired with matching mortar and breathable finishes so the repair stops the decay instead of sealing it in.",
      "Listing status is treated as a design brief, not a restriction.",
    ],
    meta: [
      { label: "Heritage grade", value: "I–II" },
      { label: "Survey method", value: "Photogrammetric" },
    ],
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "",
    lede: "Built, consented, and standing in weather.",
    body: [
      "A cross-section of current and completed work across housing, cultural and civic commissions.",
      "Projects are listed by stage of consent so you can see where each one sits in its life.",
    ],
    meta: [
      { label: "Live projects", value: "11" },
      { label: "Completed", value: "14" },
    ],
  },
  "portfolio/planning-applications": {
    eyebrow: "Portfolio / Planning Applications",
    title: "Planning applications",
    lede: "Consent is a design problem, not a paperwork problem.",
    body: [
      "We prepare and submit full planning applications, design and access statements, heritage assessments and visualisations in support of consent.",
      "Most of our projects are approved at committee without amendment.",
    ],
    meta: [
      { label: "Submitted", value: "38" },
      { label: "Approved unamended", value: "31" },
    ],
  },
  "portfolio/conservation-heritage": {
    eyebrow: "Portfolio / Conservation & Heritage",
    title: "Conservation & heritage",
    lede: "Listed fabric, quietly brought back into use.",
    body: [
      "Case studies of listed buildings and conservation areas: repairs, reversions, and the arguments that won them.",
      "Each entry records what was replaced, what was retained, and what we argued for at committee.",
    ],
    meta: [
      { label: "Listed entries", value: "07" },
      { label: "Conservation areas", value: "03" },
    ],
  },
  about: {
    eyebrow: "About",
    title: "The studio",
    lede: "An architecture practice working between the structural and the serene.",
    body: [
      "Shivoasis was founded in 2014 on a single rule: a building should look better after ten years of weather than it did on the day it was handed over.",
      "We are a studio of twenty-two architects, engineers and conservators across Kolkata, Naoshima and Reykjavik.",
    ],
    meta: [
      { label: "Founded", value: "2014" },
      { label: "People", value: "22" },
      { label: "Studios", value: "03" },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Start a project",
    lede: "Commissions for 2027 are now open.",
    body: [
      "Send us the site, the brief, and the constraint you think is impossible. We will tell you whether it is.",
      "We take on a limited number of commissions each year so that a partner remains on every project from the first sketch to handover.",
    ],
    meta: [
      { label: "Email", value: "studio@shivoasis.arch" },
      { label: "Response", value: "Within 5 days" },
    ],
  },
} satisfies Record<string, PageContent>;

export type PageKey = keyof typeof PAGES;

export function getPage(key: PageKey): PageContent {
  return PAGES[key];
}
