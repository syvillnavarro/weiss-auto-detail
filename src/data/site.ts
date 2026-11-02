import cadillacInterior from "../assets/img/cadillac-interior.jpg";
import coatingHome from "../assets/img/coating-home.jpg";
import corvette from "../assets/img/corvette.jpg";
import f150Interior from "../assets/img/f150-interior.jpg";
import f150 from "../assets/img/f150.jpg";
import headlight from "../assets/img/headlight.jpg";
import highlanderInterior from "../assets/img/highlander-interior.jpg";
import silverado from "../assets/img/silverado.jpg";
import wheel from "../assets/img/wheel.jpg";

export const business = {
  name: "Weiss Auto Detail",
  phone: "780-803-9865",
  phoneHref: "tel:7808039865",
  email: "weissautodetailing@gmail.com",
  street: "8047 181 Street NW",
  city: "Edmonton",
  region: "AB",
  postalCode: "T5T 0T4",
  area: "Serving Edmonton & surrounding area",
  facebook: "https://www.facebook.com/WeissAutoDetail",
  instagram: "https://www.instagram.com/weissautodetail/",
  website: "https://www.weissautodetail.com/",
};

export type PackageGroup = "exterior" | "interior" | "ceramic";

export type ServicePackage = {
  id: string;
  name: string;
  group: PackageGroup;
  price: number | null;
  summary: string;
  inclusions: string[];
};

export const packages: ServicePackage[] = [
  {
    id: "silver-exterior",
    name: "Silver Exterior",
    group: "exterior",
    price: 299,
    summary: "Includes full exterior wash, decontamination and one step polish.",
    inclusions: ["Full exterior wash", "Decontamination", "One step polish"],
  },
  {
    id: "gold-exterior",
    name: "Gold Exterior",
    group: "exterior",
    price: 499,
    summary:
      "Includes full exterior wash, decontamination, two step cut and polish. Removes scratches and swirl marks leaving a glossy finish.",
    inclusions: [
      "Full exterior wash",
      "Decontamination",
      "Two step cut and polish",
      "Removes scratches and swirl marks",
    ],
  },
  {
    id: "bronze-interior",
    name: "Bronze Interior",
    group: "interior",
    price: 99,
    summary:
      "Our entry level interior package includes a vacuum, wipe down, protectant, glass cleaning and mat wash.",
    inclusions: ["Vacuum", "Wipe down", "Protectant", "Glass cleaning", "Mat wash"],
  },
  {
    id: "silver-interior",
    name: "Silver Interior",
    group: "interior",
    price: 199,
    summary: "Our silver interior package includes a Bronze Interior plus a shampoo and steam clean.",
    inclusions: ["Everything in Bronze Interior", "Shampoo", "Steam clean"],
  },
  {
    id: "gold-interior",
    name: "Gold Interior",
    group: "interior",
    price: 249,
    summary:
      "Our top interior package, includes a silver interior plus pet hair removal, stain removal and/or mud removal.",
    inclusions: ["Everything in Silver Interior", "Pet hair removal", "Stain removal and/or mud removal"],
  },
  {
    id: "ceramic-coating-auto",
    name: "Ceramic Coating Auto",
    group: "ceramic",
    price: 1000,
    summary: "Ceramic coat application plus polishing.",
    inclusions: ["Polishing", "Ceramic coat application", "Backed by a 7 year warranty"],
  },
  {
    id: "ceramic-wheel-coating",
    name: "Ceramic Wheel Coating",
    group: "ceramic",
    price: 150,
    summary: "Includes full wash, decontamination and ceramic coat application.",
    inclusions: ["Full wash", "Decontamination", "Ceramic coat application"],
  },
  {
    id: "headlight-restoration",
    name: "Headlight Restoration",
    group: "exterior",
    price: 50,
    summary: "Restore your headlights to be clear and bright.",
    inclusions: ["Restores clarity and brightness"],
  },
  {
    id: "ceramic-coating-home",
    name: "Ceramic Coating Home",
    group: "ceramic",
    price: null,
    summary: "Contact for quote.",
    inclusions: [],
  },
];

export const packageById = (id: string) => packages.find((p) => p.id === id);

export const groupLabels: Record<PackageGroup, string> = {
  exterior: "Exterior",
  interior: "Interior",
  ceramic: "Ceramic Coating",
};

export const formatPrice = (price: number | null) =>
  price === null ? "Contact for quote" : `From $${price.toLocaleString("en-CA")}`;

/**
 * One timeline drives the image stage and the HTML copy.
 * Progress values are fractions of the pinned scroll distance.
 */
export type Scene = {
  packageId: string;
  image: string;
  alt: string;
  objectPosition: string;
  hold: [number, number];
  note?: string;
};

export type ShowcaseGroup = {
  id: PackageGroup;
  intro: string;
  scenes: Scene[];
};

/** Each group pins for its own scroll distance; all three share these holds. */
const HOLDS: [number, number][] = [
  [0, 0.25],
  [0.37, 0.63],
  [0.75, 1],
];

const withHolds = (scenes: Omit<Scene, "hold">[]): Scene[] =>
  scenes.map((scene, i) => ({ ...scene, hold: HOLDS[i] }));

export const showcaseGroups: ShowcaseGroup[] = [
  {
    id: "exterior",
    intro: "Show your pride for your ride, from a one step polish to a two step cut and polish.",
    scenes: withHolds([
      {
        packageId: "silver-exterior",
        image: corvette,
        alt: "Blue Corvette with glossy paint",
        objectPosition: "40% 55%",
      },
      {
        packageId: "gold-exterior",
        image: f150,
        alt: "Red Ford F-150 with polished paint reflecting the trees",
        objectPosition: "42% 50%",
      },
      {
        packageId: "headlight-restoration",
        image: headlight,
        alt: "Headlight before restoration on the left, cloudy and cracked, and after on the right, clear",
        objectPosition: "50% 50%",
      },
    ]),
  },
  {
    id: "interior",
    intro: "From seasonal touchups to extensive restorations, we have a package that will suit your needs!",
    scenes: withHolds([
      {
        packageId: "bronze-interior",
        image: highlanderInterior,
        alt: "Clean Toyota Highlander interior with light leather seats",
        objectPosition: "50% 55%",
      },
      {
        packageId: "silver-interior",
        image: f150Interior,
        alt: "Ford F-150 interior with clean carpets and leather seats",
        objectPosition: "50% 60%",
      },
      {
        packageId: "gold-interior",
        image: cadillacInterior,
        alt: "Cadillac interior with clean leather seats",
        objectPosition: "50% 55%",
      },
    ]),
  },
  {
    id: "ceramic",
    intro: "Ceramic coating adds protection and a gloss that wax and sprays can't beat. Backed by a 7 year warranty.",
    scenes: withHolds([
      {
        packageId: "ceramic-coating-auto",
        image: silverado,
        alt: "Blue Chevrolet Silverado with a deep gloss",
        objectPosition: "55% 55%",
      },
      {
        packageId: "ceramic-wheel-coating",
        image: wheel,
        alt: "Chrome wheel and dressed tire",
        objectPosition: "50% 45%",
      },
      {
        packageId: "ceramic-coating-home",
        image: coatingHome,
        alt: "Bright bathroom with glass shower screen and tile",
        objectPosition: "35% 50%",
        note: "Illustrative photo",
      },
    ]),
  },
];

export const SHOWCASE_FPS = 30;
export const SHOWCASE_FRAMES = 300;

/** The copy switches at the midpoint of each transition. */
export const sceneIndexAt = (scenes: Scene[], progress: number) => {
  for (let i = scenes.length - 1; i > 0; i--) {
    const switchAt = (scenes[i - 1].hold[1] + scenes[i].hold[0]) / 2;
    if (progress >= switchAt) return i;
  }
  return 0;
};

/** Where to scroll so a package is centred in its hold. */
export const sceneTarget = (scenes: Scene[], index: number) => {
  const [start, end] = scenes[index].hold;
  if (index === 0) return 0.08;
  if (index === scenes.length - 1) return Math.min(0.92, (start + end) / 2);
  return (start + end) / 2;
};

export type Review = { quote: string; when: string; about: string };

export const reviews: Review[] = [
  {
    quote:
      "Before coating they completed a full paint correction, removed any minor scratches or swirl marks. I found the pricing to be very competitive with top quality results! Austin was very upfront about the process, communicating and documenting the process.",
    when: "September 2022",
    about: "Paint correction and ceramic coating",
  },
  {
    quote:
      "Austin did a great job on my 7-year-old Toyota 4Runner. I just wish I had it done sooner. It’s cleaner than when I first bought it new. Bonus he got the dog smell out!",
    when: "June 2021",
    about: "Full detail",
  },
  {
    quote:
      "The carpeted trunk space had sawdust embedded through out and it looks like I've replaced it. The attention to detail was great and the price was very fair for the work done.",
    when: "May 2024",
    about: "Interior",
  },
  {
    quote:
      "He didn't just clean, wash and wax my truck, but he removed all then winter rust flakes, and let me know how to maintain and prolong my original paint.",
    when: "July 2020",
    about: "Truck detail",
  },
];
