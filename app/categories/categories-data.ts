
export type TournamentCategory = {
  slug: string;
  title: string;
  shortTitle: string;
  type: "Singles" | "Doubles" | "Mixed Doubles";
  description: string;
  format: string;
  participants: string;
  teamSize: string;
  eligibility: string;
  highlights: string[];
};

export const tournamentCategories: TournamentCategory[] = [
  {
    slug: "mens-singles",
    title: "Men's Singles",
    shortTitle: "Men's Singles",
    type: "Singles",
    description:
      "Individual competition focused on skill, movement, consistency and match strategy.",
    format: "Individual entry",
    participants: "1 player",
    teamSize: "1 player per entry",
    eligibility: "Male students; final eligibility to be confirmed by the organisers.",
    highlights: [
      "Individual player registration",
      "Player-wise match results",
      "Fixtures and match schedule",
      "Set-wise scores when published",
    ],
  },
  {
    slug: "mens-doubles",
    title: "Men's Doubles",
    shortTitle: "Men's Doubles",
    type: "Doubles",
    description:
      "A team event where coordination, court coverage and tactical teamwork matter.",
    format: "Team entry",
    participants: "2 players",
    teamSize: "2 players per team",
    eligibility: "Male student teams; final eligibility to be confirmed by the organisers.",
    highlights: [
      "Two-player team entry",
      "Partner information",
      "Team fixtures and results",
      "Set-wise scores when published",
    ],
  },
  {
    slug: "womens-singles",
    title: "Women's Singles",
    shortTitle: "Women's Singles",
    type: "Singles",
    description:
      "An individual event celebrating precision, agility and competitive spirit.",
    format: "Individual entry",
    participants: "1 player",
    teamSize: "1 player per entry",
    eligibility: "Female students; final eligibility to be confirmed by the organisers.",
    highlights: [
      "Individual player registration",
      "Player-wise match results",
      "Fixtures and match schedule",
      "Set-wise scores when published",
    ],
  },
  {
    slug: "womens-doubles",
    title: "Women's Doubles",
    shortTitle: "Women's Doubles",
    type: "Doubles",
    description:
      "A doubles competition built around teamwork, communication and court awareness.",
    format: "Team entry",
    participants: "2 players",
    teamSize: "2 players per team",
    eligibility: "Female student teams; final eligibility to be confirmed by the organisers.",
    highlights: [
      "Two-player team entry",
      "Partner information",
      "Team fixtures and results",
      "Set-wise scores when published",
    ],
  },
  {
    slug: "mixed-doubles",
    title: "Mixed Doubles",
    shortTitle: "Mixed Doubles",
    type: "Mixed Doubles",
    description:
      "A team event combining complementary playing styles, communication and smart tactics.",
    format: "Team entry",
    participants: "2 players",
    teamSize: "2 players per team",
    eligibility: "Mixed student teams; composition and eligibility to be confirmed by the organisers.",
    highlights: [
      "Two-player team entry",
      "Partner information",
      "Team fixtures and results",
      "Set-wise scores when published",
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return tournamentCategories.find((category) => category.slug === slug);
}
