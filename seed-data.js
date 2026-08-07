import { MODE } from "./tournament-config.js";
import { BRACKET_DEF } from "./logic.js"; // plus besoin de le dupliquer ici

// ---------------- MODE 32 ÉQUIPES (8 poules) ----------------
const TEAMS_32 = [
  // ---- POULE A ----
  { id: "fcbridje",      name: "MrcommuFc",   nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "maestroland",   name: "Samcro 241",  nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "booster93",     name: "MGA Esport",  nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "fclequipage",   name: "Neuille FC",  nation: "France", flag: "🇫🇷", poule: "A" },
  // ... (garde tout ce que tu as déjà pour B à H, inchangé) ...
];

const RAW_MATCHES_32 = {
  j1: [ /* ... tout ce que tu as déjà pour j1, 8 poules ... */ ],
  j2: [ /* ... idem j2 ... */ ],
  j3: [ /* ... idem j3 ... */ ],
};

// ---------------- MODE 16 ÉQUIPES (4 poules) ----------------
const TEAMS_16 = [
  // ---- POULE A ----
  { id: "t16-a1", name: "Équipe A1", nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "t16-a2", name: "Équipe A2", nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "t16-a3", name: "Équipe A3", nation: "France", flag: "🇫🇷", poule: "A" },
  { id: "t16-a4", name: "Équipe A4", nation: "France", flag: "🇫🇷", poule: "A" },
  // ---- POULE B ----
  { id: "t16-b1", name: "Équipe B1", nation: "France", flag: "🇫🇷", poule: "B" },
  { id: "t16-b2", name: "Équipe B2", nation: "France", flag: "🇫🇷", poule: "B" },
  { id: "t16-b3", name: "Équipe B3", nation: "France", flag: "🇫🇷", poule: "B" },
  { id: "t16-b4", name: "Équipe B4", nation: "France", flag: "🇫🇷", poule: "B" },
  // ---- POULE C ----
  { id: "t16-c1", name: "Équipe C1", nation: "France", flag: "🇫🇷", poule: "C" },
  { id: "t16-c2", name: "Équipe C2", nation: "France", flag: "🇫🇷", poule: "C" },
  { id: "t16-c3", name: "Équipe C3", nation: "France", flag: "🇫🇷", poule: "C" },
  { id: "t16-c4", name: "Équipe C4", nation: "France", flag: "🇫🇷", poule: "C" },
  // ---- POULE D ----
  { id: "t16-d1", name: "Équipe D1", nation: "France", flag: "🇫🇷", poule: "D" },
  { id: "t16-d2", name: "Équipe D2", nation: "France", flag: "🇫🇷", poule: "D" },
  { id: "t16-d3", name: "Équipe D3", nation: "France", flag: "🇫🇷", poule: "D" },
  { id: "t16-d4", name: "Équipe D4", nation: "France", flag: "🇫🇷", poule: "D" },
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

// Heure de coup d'envoi de chaque journée (inchangé, commun aux deux modes)
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
        status: "upcoming",
      });
    });
  });
  return matches;
}

// BRACKET_DEF n'est plus défini ici : il vient de logic.js (généré dynamiquement)
export { BRACKET_DEF };
