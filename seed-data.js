// Données initiales de la Maestro Cup FC26
// Utilisées uniquement par le panel admin pour initialiser Firestore.

// ⚠️ IMPORTANT : les 16 équipes des poules E, F, G et H ci-dessous sont des
// PLACEHOLDERS (noms/nations/drapeaux à remplacer). Édite-les avec les vraies
// équipes AVANT de cliquer sur "Initialiser les données" dans le panel admin.
// Tu peux changer name / nation / flag librement, mais garde les `id` uniques
// (ou change-les aussi, du moment qu'ils restent uniques et cohérents avec
// les ids utilisés dans RAW_MATCHES ci-dessous).
export const TEAMS = [

    // ---- POULE A (PLACEHOLDER — à renommer) ----
  { id: "fcbridje",      name: "FC Bridje",       nation: "France",            flag: "🇫🇷", poule: "A" },
  { id: "maestroland",   name: "Maestroland",     nation: "France",           flag: "🇫🇷", poule: "A" },
  { id: "booster93",     name: "Booster93",       nation: "France",             flag: "🇫🇷", poule: "A" },
  { id: "fclequipage",   name: "FC L'Équipage",   nation: "France",  flag: "🇫🇷", poule: "A" },
  
  // ---- POULE B (PLACEHOLDER — à renommer) ----
  { id: "planetewrap",   name: "Planète Wrap",    nation: "France",             flag: "🇫🇷", poule: "B" },
  { id: "cakirfc",       name: "Çakir FC",        nation: "France",             flag: "🇫🇷", poule: "B" },
  { id: "fcfranuits",    name: "FC Franuits",     nation: "France",           flag: "🇫🇷", poule: "B" },
  { id: "fc93",          name: "FC93",            nation: "France",            flag: "🇫🇷", poule: "B" },
  
  // ---- POULE C (PLACEHOLDER — à renommer) ----
  { id: "fccoubron",     name: "FC Coubron",      nation: "France",             flag: "🇫🇷", poule: "C" },
  { id: "gazahoodfc",    name: "Gazahood FC",     nation: "France",              flag: "🇫🇷", poule: "C" },
  { id: "kamonlehatay",  name: "Kamon le Hatay",  nation: "France",       flag: "🇫🇷", poule: "C" },
  { id: "skillandchill", name: "Skill and Chill", nation: "France",         flag: "🇫🇷", poule: "C" },
  
  // ---- POULE D (PLACEHOLDER — à renommer) ----
  { id: "mathaxfc",      name: "Mathax FC",       nation: "France",            flag: "🇫🇷", poule: "D" },
  { id: "zgueginofc",    name: "Zguegino FC",     nation: "France",             flag: "🇫🇷", poule: "D" },
  { id: "seven",         name: "7EVEN",           nation: "France",             flag: "🇫🇷", poule: "D" },
  { id: "toyunited",     name: "Toy United",      nation: "France",            flag: "🇫🇷", poule: "D" },

  // ---- POULE E (PLACEHOLDER — à renommer) ----
  { id: "teame1", name: "Équipe E1", nation: "France", flag: "🇫🇷", poule: "E" },
  { id: "teame2", name: "Équipe E2", nation: "France", flag: "🇫🇷", poule: "E" },
  { id: "teame3", name: "Équipe E3", nation: "France", flag: "🇫🇷", poule: "E" },
  { id: "teame4", name: "Équipe E4", nation: "France", flag: "🇫🇷", poule: "E" },

  // ---- POULE F (PLACEHOLDER — à renommer) ----
  { id: "teamf1", name: "Équipe F1", nation: "France", flag: "🇫🇷", poule: "F" },
  { id: "teamf2", name: "Équipe F2", nation: "France", flag: "🇫🇷", poule: "F" },
  { id: "teamf3", name: "Équipe F3", nation: "France", flag: "🇫🇷", poule: "F" },
  { id: "teamf4", name: "Équipe F4", nation: "France", flag: "🇫🇷", poule: "F" },

  // ---- POULE G (PLACEHOLDER — à renommer) ----
  { id: "teamg1", name: "Équipe G1", nation: "France", flag: "🇫🇷", poule: "G" },
  { id: "teamg2", name: "Équipe G2", nation: "France", flag: "🇫🇷", poule: "G" },
  { id: "teamg3", name: "Équipe G3", nation: "France", flag: "🇫🇷", poule: "G" },
  { id: "teamg4", name: "Équipe G4", nation: "France", flag: "🇫🇷", poule: "G" },

  // ---- POULE H (PLACEHOLDER — à renommer) ----
  { id: "teamh1", name: "Équipe H1", nation: "France", flag: "🇫🇷", poule: "H" },
  { id: "teamh2", name: "Équipe H2", nation: "France", flag: "🇫🇷", poule: "H" },
  { id: "teamh3", name: "Équipe H3", nation: "France", flag: "🇫🇷", poule: "H" },
  { id: "teamh4", name: "Équipe H4", nation: "France", flag: "🇫🇷", poule: "H" },
];

// Heure de coup d'envoi de chaque journée : tous les matchs d'une même
// journée démarrent en même temps (ils se jouent en parallèle sur des
// consoles différentes), pas les uns après les autres.
export const JOURNEE_TIMES = { j1: "21:00", j2: "21:25", j3: "21:50" };

// Heures de la phase finale (également communes à tous les matchs du tour).
// Un tour de huitièmes de finale a été ajouté avant les quarts (32 équipes -> 16 qualifiés).
export const BRACKET_TIMES = {
  hf1: "22:20", hf2: "22:20", hf3: "22:20", hf4: "22:20",
  hf5: "22:20", hf6: "22:20", hf7: "22:20", hf8: "22:20",
  qf1: "22:45", qf2: "22:45", qf3: "22:45", qf4: "22:45",
  sf1: "23:10", sf2: "23:10",
  final: "23:35",
};

// order = position du match dans la journée, sert uniquement de repère d'affichage.
// Pour chaque poule de 4 équipes [t1, t2, t3, t4], le planning round-robin est toujours :
//   j1: t1-t2, t3-t4
//   j2: t1-t3, t2-t4
//   j3: t1-t4, t2-t3
// (chaque équipe joue les 3 autres une fois, réparties sur 3 journées)
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
    ["E", "teame1", "teame2"],
    ["E", "teame3", "teame4"],
    ["F", "teamf1", "teamf2"],
    ["F", "teamf3", "teamf4"],
    ["G", "teamg1", "teamg2"],
    ["G", "teamg3", "teamg4"],
    ["H", "teamh1", "teamh2"],
    ["H", "teamh3", "teamh4"],
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
    ["E", "teame1", "teame3"],
    ["E", "teame2", "teame4"],
    ["F", "teamf1", "teamf3"],
    ["F", "teamf2", "teamf4"],
    ["G", "teamg1", "teamg3"],
    ["G", "teamg2", "teamg4"],
    ["H", "teamh1", "teamh3"],
    ["H", "teamh2", "teamh4"],
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
    ["E", "teame1", "teame4"],
    ["E", "teame2", "teame3"],
    ["F", "teamf1", "teamf4"],
    ["F", "teamf2", "teamf3"],
    ["G", "teamg1", "teamg4"],
    ["G", "teamg2", "teamg3"],
    ["H", "teamh1", "teamh4"],
    ["H", "teamh2", "teamh3"],
  ],
};

export function buildMatches() {
  const matches = [];
  Object.entries(RAW_MATCHES).forEach(([journee, list]) => {
    list.forEach((m, idx) => {
      matches.push({
        id: `${journee}-${m[0].toLowerCase()}-${idx}`,
        journee,
        poule: m[0],
        order: idx,
        time: JOURNEE_TIMES[journee],
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
// 8 poules -> 16 qualifiés -> un tour de huitièmes de finale a été ajouté avant les quarts.
export const BRACKET_DEF = {
  hf1: { label: "Huitième de finale 1", from: [["A", 1], ["B", 2]] },
  hf2: { label: "Huitième de finale 2", from: [["C", 1], ["D", 2]] },
  hf3: { label: "Huitième de finale 3", from: [["E", 1], ["F", 2]] },
  hf4: { label: "Huitième de finale 4", from: [["G", 1], ["H", 2]] },
  hf5: { label: "Huitième de finale 5", from: [["B", 1], ["A", 2]] },
  hf6: { label: "Huitième de finale 6", from: [["D", 1], ["C", 2]] },
  hf7: { label: "Huitième de finale 7", from: [["F", 1], ["E", 2]] },
  hf8: { label: "Huitième de finale 8", from: [["H", 1], ["G", 2]] },
  qf1: { label: "Quart de finale 1", from: [["hf1"], ["hf2"]] },
  qf2: { label: "Quart de finale 2", from: [["hf3"], ["hf4"]] },
  qf3: { label: "Quart de finale 3", from: [["hf5"], ["hf6"]] },
  qf4: { label: "Quart de finale 4", from: [["hf7"], ["hf8"]] },
  sf1: { label: "Demi-finale 1", from: [["qf1"], ["qf2"]] },
  sf2: { label: "Demi-finale 2", from: [["qf3"], ["qf4"]] },
  final: { label: "Finale", from: [["sf1"], ["sf2"]] },
};
