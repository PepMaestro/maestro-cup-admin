// Données initiales de la Maestro Cup FC26
// Utilisées uniquement par le panel admin pour initialiser Firestore.

import { MODE } from "./tournament-config.js";
import { BRACKET_DEF } from "./logic.js"; // plus besoin de le dupliquer ici

// ---------------- MODE 32 ÉQUIPES (8 poules) ----------------
// ⚠️ IMPORTANT : les 16 équipes des poules E, F, G et H ci-dessous sont des
// PLACEHOLDERS (noms/nations/drapeaux à remplacer). Édite-les avec les vraies
// équipes AVANT de cliquer sur "Initialiser les données" dans le panel admin.
const TEAMS_32 = [

  // ---- POULE A (PLACEHOLDER — à renommer) ----
  { id: "fcbridje",      name: "MrcommuFc",       nation: "France",            flag: "🇫🇷", poule: "A" },
  { id: "maestroland",   name: "Samcro 241",     nation: "France",           flag: "🇫🇷", poule: "A" },
  { id: "booster93",     name: "MGA Esport",       nation: "France",             flag: "🇫🇷", poule: "A" },
  { id: "fclequipage",   name: "Neuille FC",   nation: "France",  flag: "🇫🇷", poule: "A" },

  // ---- POULE B (PLACEHOLDER — à renommer) ----
  { id: "planetewrap",   name: "LartisteeFC",    nation: "France",             flag: "🇫🇷", poule: "B" },
  { id: "cakirfc",       name: "Us Forza",        nation: "France",             flag: "🇫🇷", poule: "B" },
  { id: "fcfranuits",    name: "Dvrrel FC",     nation: "France",           flag: "🇫🇷", poule: "B" },
  { id: "fc93",          name: "Crampons troués Fc",            nation: "France",            flag: "🇫🇷", poule: "B" },

  // ---- POULE C (PLACEHOLDER — à renommer) ----
  { id: "fccoubron",     name: "JOMANGO FC",      nation: "France",             flag: "🇫🇷", poule: "C" },
  { id: "gazahoodfc",    name: "FC Bridje",     nation: "France",              flag: "🇫🇷", poule: "C" },
  { id: "kamonlehatay",  name: "MNE FC",  nation: "France",       flag: "🇫🇷", poule: "C" },
  { id: "skillandchill", name: "Feignon", nation: "France",         flag: "🇫🇷", poule: "C" },

  // ---- POULE D (PLACEHOLDER — à renommer) ----
  { id: "mathaxfc",      name: "SC PHANTOM",       nation: "France",            flag: "🇫🇷", poule: "D" },
  { id: "zgueginofc",    name: "Wafflepopiz",     nation: "France",             flag: "🇫🇷", poule: "D" },
  { id: "seven",         name: "Monoc FC",           nation: "France",             flag: "🇫🇷", poule: "D" },
  { id: "toyunited",     name: "USMénétrol",      nation: "France",            flag: "🇫🇷", poule: "D" },

  // ---- POULE E (PLACEHOLDER — à renommer) ----
  { id: "teame1", name: "Maestro Land", nation: "France", flag: "🇫🇷", poule: "E" },
  { id: "teame2", name: "JayjayFC", nation: "France", flag: "🇫🇷", poule: "E" },
  { id: "teame3", name: "La league78", nation: "France", flag: "🇫🇷", poule: "E" },
  { id: "teame4", name: "Parara STP", nation: "France", flag: "🇫🇷", poule: "E" },

  // ---- POULE F (PLACEHOLDER — à renommer) ----
  { id: "teamf1", name: "FC ariouls", nation: "France", flag: "🇫🇷", poule: "F" },
  { id: "teamf2", name: "Saha Ftourek", nation: "France", flag: "🇫🇷", poule: "F" },
  { id: "teamf3", name: "Colmar fc", nation: "France", flag: "🇫🇷", poule: "F" },
  { id: "teamf4", name: "scdr3891", nation: "France", flag: "🇫🇷", poule: "F" },

  // ---- POULE G (PLACEHOLDER — à renommer) ----
  { id: "teamg1", name: "CapaCold FC", nation: "France", flag: "🇫🇷", poule: "G" },
  { id: "teamg2", name: "Fc OPS", nation: "France", flag: "🇫🇷", poule: "G" },
  { id: "teamg3", name: "Toy United", nation: "France", flag: "🇫🇷", poule: "G" },
  { id: "teamg4", name: "bvball", nation: "France", flag: "🇫🇷", poule: "G" },

  // ---- POULE H (PLACEHOLDER — à renommer) ----
  { id: "teamh1", name: "XI Babinski", nation: "France", flag: "🇫🇷", poule: "H" },
  { id: "teamh2", name: "Lùstrage FC", nation: "France", flag: "🇫🇷", poule: "H" },
  { id: "teamh3", name: "7EVEN", nation: "France", flag: "🇫🇷", poule: "H" },
  { id: "teamh4", name: "sixseven fcb", nation: "France", flag: "🇫🇷", poule: "H" },
];

// order = position du match dans la journée, sert uniquement de repère d'affichage.
// Pour chaque poule de 4 équipes [t1, t2, t3, t4], le planning round-robin est toujours :
//   j1: t1-t2, t3-t4
//   j2: t1-t3, t2-t4
//   j3: t1-t4, t2-t3
// (chaque équipe joue les 3 autres une fois, réparties sur 3 journées)
const RAW_MATCHES_32 = {
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

// ---------------- MODE 16 ÉQUIPES (4 poules) ----------------
// PLACEHOLDER — édite ces 16 équipes (noms/nations/drapeaux) avant d'utiliser
// ce mode. Garde les `id` uniques (ou change-les, du moment qu'ils restent
// cohérents avec RAW_MATCHES_16 ci-dessous).
const TEAMS_16 = [
  // ---- POULE A ----
  { id: "t16-a1", name: "FC Bridje", nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "t16-a2", name: "MATA FOOT A", nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "t16-a3", name: "Fc Ops", nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "t16-a4", name: "Samcro241", nation: "France", flag: "🇫🇷", poule: "A" },
  // ---- POULE B ----
  { id: "t16-b1", name: "Maestroland", nation: "France", flag: "🇫🇷", poule: "B" },
  { id: "t16-b2", name: "Mr commu fc", nation: "France", flag: "🇫🇷", poule: "B" },
  { id: "t16-b3", name: "Monoc FC", nation: "France", flag: "🇫🇷", poule: "B" },
  { id: "t16-b4", name: "Mr commu fc 2", nation: "France", flag: "🇫🇷", poule: "B" },
  // ---- POULE C ----
  { id: "t16-c1", name: "FC muslim 92", nation: "France", flag: "🇫🇷", poule: "C" },
  { id: "t16-c2", name: "Lùstrage FC", nation: "France", flag: "🇫🇷", poule: "C" },
  { id: "t16-c3", name: "Fc secteur 382", nation: "France", flag: "🇫🇷", poule: "C" },
  { id: "t16-c4", name: "PFC MTP 1994", nation: "France", flag: "🇫🇷", poule: "C" },
  // ---- POULE D ----
  { id: "t16-d1", name: "JAYJAY AS", nation: "France", flag: "🇫🇷", poule: "D" },
  { id: "t16-d2", name: "FC GONTRAN", nation: "France", flag: "🇫🇷", poule: "D" },
  { id: "t16-d3", name: "Lùstrage FC 2", nation: "France", flag: "🇫🇷", poule: "D" },
  { id: "t16-d4", name: "Mata foot fcc", nation: "France", flag: "🇫🇷", poule: "D" },
];

// Même principe round-robin que pour le mode 32 : pour chaque poule [t1,t2,t3,t4]
//   j1: t1-t2, t3-t4 | j2: t1-t3, t2-t4 | j3: t1-t4, t2-t3
const RAW_MATCHES_16 = {
  j1: [
    ["A", "t16-a1", "t16-a2"], ["A", "t16-a3", "t16-a4"],
    ["B", "t16-b1", "t16-b2"], ["B", "t16-b3", "t16-b4"],
    ["C", "t16-c1", "t16-c2"], ["C", "t16-c3", "t16-c4"],
    ["D", "t16-d1", "t16-d2"], ["D", "t16-d3", "t16-d4"],
  ],
  j2: [
    ["A", "t16-a1", "t16-a3"], ["A", "t16-a2", "t16-a4"],
    ["B", "t16-b1", "t16-b3"], ["B", "t16-b2", "t16-b4"],
    ["C", "t16-c1", "t16-c3"], ["C", "t16-c2", "t16-c4"],
    ["D", "t16-d1", "t16-d3"], ["D", "t16-d2", "t16-d4"],
  ],
  j3: [
    ["A", "t16-a1", "t16-a4"], ["A", "t16-a2", "t16-a3"],
    ["B", "t16-b1", "t16-b4"], ["B", "t16-b2", "t16-b3"],
    ["C", "t16-c1", "t16-c4"], ["C", "t16-c2", "t16-c3"],
    ["D", "t16-d1", "t16-d4"], ["D", "t16-d2", "t16-d3"],
  ],
};

// ---------------- Sélection selon MODE ----------------
export const TEAMS = MODE === "16" ? TEAMS_16 : TEAMS_32;
const RAW_MATCHES = MODE === "16" ? RAW_MATCHES_16 : RAW_MATCHES_32;

// Heure de coup d'envoi de chaque journée : tous les matchs d'une même
// journée démarrent en même temps (ils se jouent en parallèle sur des
// consoles différentes), pas les uns après les autres.
export const JOURNEE_TIMES = { j1: "21:00", j2: "21:25", j3: "21:50" };

// Heures de la phase finale — les clés hf1-hf8 restent définies mais ne sont
// simplement pas utilisées si MODE === "16" (pas d'erreur, juste ignorées).
export const BRACKET_TIMES = {
  hf1: "22:20", hf2: "22:20", hf3: "22:20", hf4: "22:20",
  hf5: "22:20", hf6: "22:20", hf7: "22:20", hf8: "22:20",
  qf1: "22:45", qf2: "22:45", qf3: "22:45", qf4: "22:45",
  sf1: "23:10", sf2: "23:10",
  final: "23:35",
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

// BRACKET_DEF n'est plus défini ici : il vient de logic.js (généré dynamiquement
// à partir du nombre de poules en config).
export { BRACKET_DEF };
