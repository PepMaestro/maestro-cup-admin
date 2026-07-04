// Données initiales de la Maestro Cup FC26
// Utilisées uniquement par le panel admin pour initialiser Firestore.

export const TEAMS = [
  { id: "fcbridje",      name: "FC Bridje",       nation: "Paraguay",            flag: "🇵🇾", poule: "A" },
  { id: "maestroland",   name: "Maestroland",     nation: "Australie",           flag: "🇦🇺", poule: "A" },
  { id: "booster93",     name: "Booster93",       nation: "Algérie",             flag: "🇩🇿", poule: "A" },
  { id: "fclequipage",   name: "FC L'Équipage",   nation: "République tchèque",  flag: "🇨🇿", poule: "A" },

  { id: "planetewrap",   name: "Planète Wrap",    nation: "Islande",             flag: "🇮🇸", poule: "B" },
  { id: "cakirfc",       name: "Çakir FC",        nation: "Ukraine",             flag: "🇺🇦", poule: "B" },
  { id: "fcfranuits",    name: "FC Franuits",     nation: "Indonésie",           flag: "🇮🇩", poule: "B" },
  { id: "fc93",          name: "FC93",            nation: "Autriche",            flag: "🇦🇹", poule: "B" },

  { id: "fccoubron",     name: "FC Coubron",      nation: "Croatie",             flag: "🇭🇷", poule: "C" },
  { id: "gazahoodfc",    name: "Gazahood FC",     nation: "Panama",              flag: "🇵🇦", poule: "C" },
  { id: "kamonlehatay",  name: "Kamon le Hatay",  nation: "Côte d'Ivoire",       flag: "🇨🇮", poule: "C" },
  { id: "skillandchill", name: "Skill and Chill", nation: "Ouzbékistan",         flag: "🇺🇿", poule: "C" },

  { id: "mathaxfc",      name: "Mathax FC",       nation: "Belgique",            flag: "🇧🇪", poule: "D" },
  { id: "zgueginofc",    name: "Zguegino FC",     nation: "Irlande",             flag: "🇮🇪", poule: "D" },
  { id: "seven",         name: "7EVEN",           nation: "Espagne",             flag: "🇪🇸", poule: "D" },
  { id: "toyunited",     name: "Toy United",      nation: "Colombie",            flag: "🇨🇴", poule: "D" },
];

// Heures par défaut des créneaux d'une journée (1er match 19h, puis +30min).
// Modifiable ensuite depuis le panel admin.
const SLOT_TIMES = ["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"];

// order = position du match dans la journée (0 à 7), sert à déterminer l'heure.
const RAW_MATCHES = {
  j1: [
    ["A", "fcbridje", "maestroland"],
    ["A", "booster93", "fclequipage"],
    ["B", "planetewrap", "cakirfc"],
    ["B", "fcfranuits", "fc93"],
    ["C", "fccoubron", "gazahoodfc"],
    ["C", "kamonlehatay", "skillandchill"],
    ["D", "mathaxfc", "zgueginofc"],
    ["D", "seven", "toyunited"],
  ],
  j2: [
    ["A", "fcbridje", "booster93"],
    ["A", "maestroland", "fclequipage"],
    ["B", "planetewrap", "fcfranuits"],
    ["B", "cakirfc", "fc93"],
    ["C", "fccoubron", "kamonlehatay"],
    ["C", "gazahoodfc", "skillandchill"],
    ["D", "mathaxfc", "seven"],
    ["D", "zgueginofc", "toyunited"],
  ],
  j3: [
    ["A", "fcbridje", "fclequipage"],
    ["A", "maestroland", "booster93"],
    ["B", "planetewrap", "fc93"],
    ["B", "cakirfc", "fcfranuits"],
    ["C", "fccoubron", "skillandchill"],
    ["C", "gazahoodfc", "kamonlehatay"],
    ["D", "mathaxfc", "toyunited"],
    ["D", "zgueginofc", "seven"],
  ],
};

export function buildMatches() {
  const matches = [];
  Object.entries(RAW_MATCHES).forEach(([journee, list]) => {
    list.forEach((m, idx) => {
      matches.push({
        id: `${journee}-${m[0].toLowerCase()}${Math.floor(idx / 2) + 1 + (idx % 2 === 0 ? 0 : 0)}-${idx}`,
        journee,
        poule: m[0],
        order: idx,
        time: SLOT_TIMES[idx],
        teamA: m[1],
        teamB: m[2],
        scoreA: null,
        scoreB: null,
        status: "upcoming", // upcoming | live | finished
      });
    });
  });
  return matches;
}

// Structure de l'arbre de phase finale (calculée dynamiquement à partir des classements)
export const BRACKET_DEF = {
  qf1: { label: "Quart de finale 1", from: [["A", 1], ["B", 2]] },
  qf2: { label: "Quart de finale 2", from: [["C", 1], ["D", 2]] },
  qf3: { label: "Quart de finale 3", from: [["B", 1], ["A", 2]] },
  qf4: { label: "Quart de finale 4", from: [["D", 1], ["C", 2]] },
  sf1: { label: "Demi-finale 1", from: [["qf1"], ["qf2"]] },
  sf2: { label: "Demi-finale 2", from: [["qf3"], ["qf4"]] },
  final: { label: "Finale", from: [["sf1"], ["sf2"]] },
};
