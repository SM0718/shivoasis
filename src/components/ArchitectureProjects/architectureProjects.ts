export interface ArchitectureImage {
  src: string;
  alt: string;
}

export interface ArchitectureProject {
  id: string;
  title: string;
  location: string;
  year: string;
  category: string;
  description: string;
  radius?: number;
  images: ArchitectureImage[];
  previewImages?: ArchitectureImage[];
}

export const architectureProjects: ArchitectureProject[] = [
  {
    id: "project-01",
    title: "Monsoon House",
    location: "Kolkata, India",
    year: "2026",
    category: "Residential",
    description: "A climate-responsive residence built around courtyards, filtered daylight and deep shaded thresholds.",
    images: [
      {
        src: "https://images.pexels.com/photos/21415155/pexels-photo-21415155.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House view 1",
      },
      {
        src: "https://images.pexels.com/photos/11831530/pexels-photo-11831530.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House view 2",
      },
      {
        src: "https://images.pexels.com/photos/12514995/pexels-photo-12514995.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House view 3",
      },
      {
        src: "https://images.pexels.com/photos/13848642/pexels-photo-13848642.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House view 4",
      },
    ],
    previewImages: [
      {
        src: "https://images.pexels.com/photos/260046/pexels-photo-260046.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 1",
      },
      {
        src: "https://images.pexels.com/photos/2793444/pexels-photo-2793444.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 2",
      },
      {
        src: "https://images.pexels.com/photos/3137047/pexels-photo-3137047.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 3",
      },
      {
        src: "https://images.pexels.com/photos/3137050/pexels-photo-3137050.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 4",
      },
      {
        src: "https://images.pexels.com/photos/3137066/pexels-photo-3137066.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 5",
      },
      {
        src: "https://images.pexels.com/photos/3935327/pexels-photo-3935327.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 6",
      },
      {
        src: "https://images.pexels.com/photos/4015825/pexels-photo-4015825.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 7",
      },
      {
        src: "https://images.pexels.com/photos/4328661/pexels-photo-4328661.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Monsoon House preview 8",
      },
    ],
  },
  {
    id: "project-02",
    title: "Courtyard Residence",
    location: "Jaipur, India",
    year: "2026",
    category: "Residential",
    description: "A sequence of walled gardens that pulls monsoon light deep into a narrow urban plot.",
    images: [
      {
        src: "https://images.pexels.com/photos/35115180/pexels-photo-35115180.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence view 1",
      },
      {
        src: "https://images.pexels.com/photos/14998153/pexels-photo-14998153.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence view 2",
      },
      {
        src: "https://images.pexels.com/photos/15285869/pexels-photo-15285869.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence view 3",
      },
      {
        src: "https://images.pexels.com/photos/16600110/pexels-photo-16600110.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence view 4",
      },
    ],
    previewImages: [
      {
        src: "https://images.pexels.com/photos/5838960/pexels-photo-5838960.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 1",
      },
      {
        src: "https://images.pexels.com/photos/6120151/pexels-photo-6120151.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 2",
      },
      {
        src: "https://images.pexels.com/photos/6266122/pexels-photo-6266122.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 3",
      },
      {
        src: "https://images.pexels.com/photos/6957083/pexels-photo-6957083.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 4",
      },
      {
        src: "https://images.pexels.com/photos/7078411/pexels-photo-7078411.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 5",
      },
      {
        src: "https://images.pexels.com/photos/7245554/pexels-photo-7245554.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 6",
      },
      {
        src: "https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 7",
      },
      {
        src: "https://images.pexels.com/photos/7698865/pexels-photo-7698865.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Courtyard Residence preview 8",
      },
    ],
  },
  {
    id: "project-03",
    title: "Concrete House",
    location: "Mexico City, Mexico",
    year: "2025",
    category: "Residential",
    description: "Board-formed concrete planes folded around a sheltered terrace and a single heavy stair.",
    images: [
      {
        src: "https://images.pexels.com/photos/28993989/pexels-photo-28993989.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House view 1",
      },
      {
        src: "https://images.pexels.com/photos/1662159/pexels-photo-1662159.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House view 2",
      },
      {
        src: "https://images.pexels.com/photos/16738231/pexels-photo-16738231.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House view 3",
      },
      {
        src: "https://images.pexels.com/photos/17729218/pexels-photo-17729218.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House view 4",
      },
    ],
    previewImages: [
      {
        src: "https://images.pexels.com/photos/8590444/pexels-photo-8590444.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 1",
      },
      {
        src: "https://images.pexels.com/photos/8645063/pexels-photo-8645063.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 2",
      },
      {
        src: "https://images.pexels.com/photos/9408172/pexels-photo-9408172.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 3",
      },
      {
        src: "https://images.pexels.com/photos/9484215/pexels-photo-9484215.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 4",
      },
      {
        src: "https://images.pexels.com/photos/9623574/pexels-photo-9623574.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 5",
      },
      {
        src: "https://images.pexels.com/photos/10263246/pexels-photo-10263246.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 6",
      },
      {
        src: "https://images.pexels.com/photos/11012837/pexels-photo-11012837.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 7",
      },
      {
        src: "https://images.pexels.com/photos/11605718/pexels-photo-11605718.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Concrete House preview 8",
      },
    ],
  },
  {
    id: "project-04",
    title: "Forest Pavilion",
    location: "Kyoto, Japan",
    year: "2025",
    category: "Hospitality",
    description: "A low pavilion that borrows its section from the trees it sits between.",
    images: [
      {
        src: "https://images.pexels.com/photos/18891783/pexels-photo-18891783.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion view 1",
      },
      {
        src: "https://images.pexels.com/photos/1816031/pexels-photo-1816031.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion view 2",
      },
      {
        src: "https://images.pexels.com/photos/1824392/pexels-photo-1824392.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion view 3",
      },
      {
        src: "https://images.pexels.com/photos/18272058/pexels-photo-18272058.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion view 4",
      },
    ],
    previewImages: [
      {
        src: "https://images.pexels.com/photos/12277631/pexels-photo-12277631.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 1",
      },
      {
        src: "https://images.pexels.com/photos/12303547/pexels-photo-12303547.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 2",
      },
      {
        src: "https://images.pexels.com/photos/13821521/pexels-photo-13821521.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 3",
      },
      {
        src: "https://images.pexels.com/photos/14764274/pexels-photo-14764274.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 4",
      },
      {
        src: "https://images.pexels.com/photos/14898025/pexels-photo-14898025.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 5",
      },
      {
        src: "https://images.pexels.com/photos/15153700/pexels-photo-15153700.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 6",
      },
      {
        src: "https://images.pexels.com/photos/15257886/pexels-photo-15257886.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 7",
      },
      {
        src: "https://images.pexels.com/photos/15404875/pexels-photo-15404875.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Forest Pavilion preview 8",
      },
    ],
  },
  {
    id: "project-05",
    title: "Urban Retreat",
    location: "Seoul, South Korea",
    year: "2024",
    category: "Residential",
    description: "A rooftop volume carved out of the city, trading the street for a private horizon.",
    images: [
      {
        src: "https://images.pexels.com/photos/18267934/pexels-photo-18267934.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat view 1",
      },
      {
        src: "https://images.pexels.com/photos/1870768/pexels-photo-1870768.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat view 2",
      },
      {
        src: "https://images.pexels.com/photos/20111365/pexels-photo-20111365.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat view 3",
      },
      {
        src: "https://images.pexels.com/photos/20213634/pexels-photo-20213634.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat view 4",
      },
    ],
    previewImages: [
      {
        src: "https://images.pexels.com/photos/15631447/pexels-photo-15631447.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 1",
      },
      {
        src: "https://images.pexels.com/photos/15845452/pexels-photo-15845452.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 2",
      },
      {
        src: "https://images.pexels.com/photos/15886917/pexels-photo-15886917.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 3",
      },
      {
        src: "https://images.pexels.com/photos/16370880/pexels-photo-16370880.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 4",
      },
      {
        src: "https://images.pexels.com/photos/16598063/pexels-photo-16598063.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 5",
      },
      {
        src: "https://images.pexels.com/photos/16628710/pexels-photo-16628710.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 6",
      },
      {
        src: "https://images.pexels.com/photos/16812645/pexels-photo-16812645.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 7",
      },
      {
        src: "https://images.pexels.com/photos/16827933/pexels-photo-16827933.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Urban Retreat preview 8",
      },
    ],
  },
  {
    id: "project-06",
    title: "Light House",
    location: "Reykjavik, Iceland",
    year: "2024",
    category: "Hospitality",
    description: "A guesthouse calibrated to the low northern light and the dark months around it.",
    images: [
      {
        src: "https://images.pexels.com/photos/34062660/pexels-photo-34062660.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House view 1",
      },
      {
        src: "https://images.pexels.com/photos/20273065/pexels-photo-20273065.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House view 2",
      },
      {
        src: "https://images.pexels.com/photos/20583717/pexels-photo-20583717.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House view 3",
      },
      {
        src: "https://images.pexels.com/photos/24531672/pexels-photo-24531672.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House view 4",
      },
    ],
    previewImages: [
      {
        src: "https://images.pexels.com/photos/17546810/pexels-photo-17546810.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 1",
      },
      {
        src: "https://images.pexels.com/photos/17719781/pexels-photo-17719781.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 2",
      },
      {
        src: "https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 3",
      },
      {
        src: "https://images.pexels.com/photos/18621865/pexels-photo-18621865.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 4",
      },
      {
        src: "https://images.pexels.com/photos/18856044/pexels-photo-18856044.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 5",
      },
      {
        src: "https://images.pexels.com/photos/18988761/pexels-photo-18988761.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 6",
      },
      {
        src: "https://images.pexels.com/photos/19164602/pexels-photo-19164602.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 7",
      },
      {
        src: "https://images.pexels.com/photos/19394434/pexels-photo-19394434.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Light House preview 8",
      },
    ],
  },
];
