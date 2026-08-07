// Logique de classement et de phase finale — partagée par le site public et le panel admin.

import { POULES } from "./tournament-config.js";
export { POULES };

// Génère automatiquement le bracket (huitièmes/quarts/demies/finale) à partir
// du nombre de poules en config (tournament-config.js).
const ROUND_NAMES = {
  16: ["hf", "qf", "sf", "final"],
  8:  ["qf", "sf", "final"],
};

const ROUND_LABELS = {
  hf: "Huitième de finale", qf: "Quart de finale",
  sf: "Demi-finale", final: "Finale",
};

export function generateBracketDef(poules) {
  const nQualified = poules.length * 2;
  const rounds = ROUND_NAMES[nQualified];
  if (!rounds) throw new Error(`Nombre de poules non supporté: ${poules.length}`);

  const def = {};

  const firstRound = rounds[0];
  let firstRoundKeys = [];
  for (let i = 0; i < poules.length; i += 2) {
    const [pA, pB] = [poules[i], poules[i + 1]];
    const key1 = `${firstRound}${firstRoundKeys.length + 1}`;
    def[key1] = { label: `${ROUND_LABELS[firstRound]} ${firstRoundKeys.length + 1}`, from: [[pA, 1], [pB, 2]] };
    firstRoundKeys.push(key1);

    const key2 = `${firstRound}${firstRoundKeys.length + 1}`;
    def[key2] = { label: `${ROUND_LABELS[firstRound]} ${firstRoundKeys.length + 1}`, from: [[pB, 1], [pA, 2]] };
    firstRoundKeys.push(key2);
  }

  let prevKeys = firstRoundKeys;
  for (let r = 1; r < rounds.length; r++) {
    const roundName = rounds[r];
    const newKeys = [];
    for (let i = 0; i < prevKeys.length; i += 2) {
      const key = roundName === "final" ? "final" : `${roundName}${newKeys.length + 1}`;
      def[key] = {
        label: roundName === "final" ? "Finale" : `${ROUND_LABELS[roundName]} ${newKeys.length + 1}`,
        from: [[prevKeys[i]], [prevKeys[i + 1]]],
      };
      newKeys.push(key);
    }
    prevKeys = newKeys;
  }

  return def;
}

export const BRACKET_DEF = generateBracketDef(POULES);

// ---- Nouveau bloc à ajouter ici ----
const ROUND_ORDER = [
  { prefix: "hf", title: "Huitièmes de finale" },
  { prefix: "qf", title: "Quarts de finale" },
  { prefix: "sf", title: "Demi-finales" },
  { prefix: "final", title: "Finale" },
];

// Déduit dynamiquement les tours réellement présents dans un BRACKET_DEF donné
// (utile pour l'affichage admin, qui n'a pas à savoir combien de tours il y a).
export function getBracketRounds(bracketDef) {
  const keys = Object.keys(bracketDef);
  return ROUND_ORDER
    .map(({ prefix, title }) => ({
      title,
      keys: keys.filter((k) => k.startsWith(prefix)).sort(),
    }))
    .filter((r) => r.keys.length > 0);
}
// ---- Fin du nouveau bloc ----

/**
 * Calcule le classement d'une poule à partir des matchs terminés.
 * ...
 */
export function computeStandings(teams, matches) {
  // ... inchangé, tout le reste du fichier ne bouge pas
