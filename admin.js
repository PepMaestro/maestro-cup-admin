import { firebaseConfig } from "./firebase-config.js";
import { buildBracketView, BRACKET_DEF } from "./logic.js";
import { TEAMS as SEED_TEAMS, buildMatches, BRACKET_TIMES } from "./seed-data.js";
import { WEBHOOK_URL, POULE_DISCORD } from "./discord-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, updateDoc, setDoc, getDoc, getDocs, writeBatch, deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const POLL_INTERVAL_MS = 60_000;

let TEAMS = [];
let MATCHES = [];
let BRACKET = {};
let META = { tournamentActive: false };
let currentJournee = "j1";
let pollTimer = null;

/* ---------------- Auth ---------------- */
const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");
const userEmailEl = document.getElementById("user-email");

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
    logoutBtn.style.display = "inline-block";
    refreshBtn.style.display = "inline-block";
    userEmailEl.textContent = user.email;
    startPolling();
  } else {
    loginScreen.style.display = "flex";
    appScreen.style.display = "none";
    logoutBtn.style.display = "none";
    refreshBtn.style.display = "none";
    userEmailEl.textContent = "";
    stopPolling();
  }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");
  errEl.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    errEl.textContent = "Connexion impossible : vérifie l'email et le mot de passe.";
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));
refreshBtn.addEventListener("click", () => fetchAll());

/* ---------------- Tabs ---------------- */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

/* ---------------- Polling (au lieu du temps réel) ----------------
   Le panel admin est utilisé par une seule personne : on interroge Firestore
   toutes les 60 secondes, plus un bouton "Rafraîchir" pour forcer une mise à
   jour immédiate. Chaque action (score, statut, pénalité...) met aussi à jour
   l'affichage localement tout de suite, sans attendre le prochain sondage. */
function startPolling() {
  fetchAll();
  stopPolling();
  pollTimer = setInterval(fetchAll, POLL_INTERVAL_MS);
}
function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

async function fetchAll() {
  try {
    const [teamsSnap, matchesSnap, bracketSnap, metaSnap] = await Promise.all([
      getDocs(collection(db, "teams")),
      getDocs(collection(db, "matches")),
      getDocs(collection(db, "bracket")),
      getDoc(doc(db, "meta", "state")),
    ]);
    TEAMS = teamsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    MATCHES = matchesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    BRACKET = {};
    bracketSnap.docs.forEach((d) => { BRACKET[d.id] = d.data(); });
    META = metaSnap.exists() ? metaSnap.data() : { tournamentActive: false };
    renderAll();
    setLastSync();
  } catch (err) {
    console.error(err);
  }
}

function setLastSync() {
  const el = document.getElementById("last-sync");
  const now = new Date();
  el.textContent = `Synchronisé à ${now.toLocaleTimeString("fr-FR")}`;
}

function renderAll() {
  renderActiveToggle();
  if (!TEAMS.length && !MATCHES.length) return;
  renderLiveList();
  renderJourneeSwitch();
  renderPoulesList();
  renderPenalites();
  renderBracketAdmin();
}

/* ---------------- Helpers ---------------- */
const teamsById = () => Object.fromEntries(TEAMS.map((t) => [t.id, t]));

async function updateMatchStatus(matchId, status) {
  await updateDoc(doc(db, "matches", matchId), { status });
  const m = MATCHES.find((x) => x.id === matchId);
  if (m) m.status = status;
  renderAll();
}
async function updateMatchScore(matchId, scoreA, scoreB) {
  await updateDoc(doc(db, "matches", matchId), { scoreA, scoreB });
  const m = MATCHES.find((x) => x.id === matchId);
  if (m) { m.scoreA = scoreA; m.scoreB = scoreB; }
  renderAll();
}
async function updateBracketMatch(key, fields) {
  await setDoc(doc(db, "bracket", key), fields, { merge: true });
  BRACKET[key] = { ...BRACKET[key], ...fields };
  renderAll();
}
async function updateTeamPenalty(teamId, penalty) {
  await updateDoc(doc(db, "teams", teamId), { penalty });
  const t = TEAMS.find((x) => x.id === teamId);
  if (t) t.penalty = penalty;
  renderAll();
}

function statusButtons(m) {
  return ["upcoming", "live", "finished"].map((s) => {
    const label = { upcoming: "À venir", live: "Live", finished: "Terminé" }[s];
    return `<button class="btn-status ${m.status === s ? "selected " + s : ""}" data-status="${s}" data-match="${m.id}">${label}</button>`;
  }).join("");
}

/* ---------------- Statut du tournoi ---------------- */
function renderActiveToggle() {
  const toggle = document.getElementById("active-toggle");
  const label = document.getElementById("active-label");
  toggle.checked = !!META.tournamentActive;
  label.textContent = META.tournamentActive ? "Tournoi actif (visible sur le site public)" : "Tournoi inactif (site public en attente)";
}
document.getElementById("active-toggle").addEventListener("change", async (e) => {
  const val = e.target.checked;
  await setDoc(doc(db, "meta", "state"), { tournamentActive: val }, { merge: true });
  META.tournamentActive = val;
  renderActiveToggle();
});

/* ---------------- Live tab (toutes journées, statut rapide) ---------------- */
function renderLiveList() {
  const tById = teamsById();
  const list = [...MATCHES].sort((a, b) => (a.journee + a.order).localeCompare(b.journee + b.order));
  const el = document.getElementById("live-list");
  el.innerHTML = list.map((m) => {
    const a = tById[m.teamA], b = tById[m.teamB];
    if (!a || !b) return "";
    return `
      <div class="admin-match">
        <div class="admin-match-head"><span>J${m.journee.replace("j","")} · Poule ${m.poule} · ${m.time}</span></div>
        <div class="admin-match-teams">
          <span class="team-label">${a.flag} ${a.name}</span>
          <span style="color:var(--text-muted)">vs</span>
          <span class="team-label" style="text-align:right">${b.name} ${b.flag}</span>
        </div>
        <div class="status-row">${statusButtons(m)}</div>
      </div>`;
  }).join("");
  bindStatusButtons(el);
}

function bindStatusButtons(container) {
  container.querySelectorAll(".btn-status[data-match]").forEach((btn) => {
    btn.addEventListener("click", () => updateMatchStatus(btn.dataset.match, btn.dataset.status));
  });
}

/* ---------------- Poules tab (par journée, scores + statut) ---------------- */
function renderJourneeSwitch() {
  const journees = [...new Set(MATCHES.map((m) => m.journee))].sort();
  const el = document.getElementById("journee-switch");
  el.innerHTML = journees.map((j) => `
    <button class="journee-btn ${j === currentJournee ? "active" : ""}" data-j="${j}">Journée ${j.replace("j", "")}</button>
  `).join("");
  el.querySelectorAll(".journee-btn").forEach((btn) => {
    btn.addEventListener("click", () => { currentJournee = btn.dataset.j; renderJourneeSwitch(); renderPoulesList(); });
  });
}

function renderPoulesList() {
  const tById = teamsById();
  const list = MATCHES.filter((m) => m.journee === currentJournee).sort((a, b) => a.order - b.order);
  const el = document.getElementById("poules-list");
  el.innerHTML = list.map((m) => {
    const a = tById[m.teamA], b = tById[m.teamB];
    if (!a || !b) return "";
    return `
      <div class="admin-match">
        <div class="admin-match-head"><span>Poule ${m.poule} · ${m.time}</span></div>
        <div class="admin-match-teams">
          <span class="team-label">${a.flag} ${a.name}</span>
          <input type="number" min="0" class="score-input" id="scoreA-${m.id}" value="${m.scoreA ?? ""}" placeholder="-" />
          <span style="color:var(--text-muted)">-</span>
          <input type="number" min="0" class="score-input" id="scoreB-${m.id}" value="${m.scoreB ?? ""}" placeholder="-" />
          <span class="team-label" style="text-align:right">${b.name} ${b.flag}</span>
        </div>
        <div class="status-row">${statusButtons(m)}</div>
      </div>`;
  }).join("");

  bindStatusButtons(el);

  el.querySelectorAll(".score-input").forEach((input) => {
    input.addEventListener("change", () => {
      const matchId = input.id.split("-").slice(1).join("-");
      const scoreA = document.getElementById(`scoreA-${matchId}`).value;
      const scoreB = document.getElementById(`scoreB-${matchId}`).value;
      updateMatchScore(
        matchId,
        scoreA === "" ? null : parseInt(scoreA, 10),
        scoreB === "" ? null : parseInt(scoreB, 10)
      );
    });
  });
}

/* ---------------- Pénalités ---------------- */
function renderPenalites() {
  const el = document.getElementById("penalites-list");
  el.innerHTML = TEAMS
    .slice()
    .sort((a, b) => a.poule.localeCompare(b.poule) || a.name.localeCompare(b.name))
    .map((t) => `
      <div class="pen-row">
        <span class="name">${t.flag} ${t.name} <span style="color:var(--text-muted)">(Poule ${t.poule})</span></span>
        <div class="pen-controls">
          <input type="number" min="0" id="pen-${t.id}" value="${t.penalty || 0}" />
          <button class="btn-ghost" data-team="${t.id}">Enregistrer</button>
        </div>
      </div>`).join("");

  el.querySelectorAll("button[data-team]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = parseInt(document.getElementById(`pen-${btn.dataset.team}`).value || "0", 10);
      updateTeamPenalty(btn.dataset.team, val);
    });
  });
}

/* ---------------- Phase finale ---------------- */
function renderBracketAdmin() {
  const { bracket } = buildBracketView(TEAMS, MATCHES, BRACKET);
  const rounds = [
    { title: "Huitièmes de finale", keys: ["hf1", "hf2", "hf3", "hf4", "hf5", "hf6", "hf7", "hf8"] },
    { title: "Quarts de finale", keys: ["qf1", "qf2", "qf3", "qf4"] },
    { title: "Demi-finales", keys: ["sf1", "sf2"] },
    { title: "Finale", keys: ["final"] },
  ];

  const el = document.getElementById("bracket-admin");
  el.innerHTML = rounds.map((round) => `
    <div class="bracket-admin-round">
      <h4>${round.title}</h4>
      <div class="bracket-admin-grid">
        ${round.keys.map((k) => renderBracketAdminMatch(bracket[k])).join("")}
      </div>
    </div>`).join("");

  rounds.flatMap((r) => r.keys).forEach((key) => {
    const m = bracket[key];
    const bothResolved = m.teamA.resolved && m.teamB.resolved;
    if (!bothResolved) return;

    document.querySelectorAll(`.btn-status[data-bracket="${key}"]`).forEach((btn) => {
      btn.addEventListener("click", () => {
        updateBracketMatch(key, {
          teamA: m.teamA.id, teamB: m.teamB.id, status: btn.dataset.status,
          scoreA: m.scoreA, scoreB: m.scoreB,
        });
      });
    });

    ["A", "B"].forEach((side) => {
      const input = document.getElementById(`bscore${side}-${key}`);
      if (!input) return;
      input.addEventListener("change", () => {
        const scoreA = document.getElementById(`bscoreA-${key}`).value;
        const scoreB = document.getElementById(`bscoreB-${key}`).value;
        updateBracketMatch(key, {
          teamA: m.teamA.id, teamB: m.teamB.id, status: m.status,
          scoreA: scoreA === "" ? null : parseInt(scoreA, 10),
          scoreB: scoreB === "" ? null : parseInt(scoreB, 10),
        });
      });
    });
  });
}

function renderBracketAdminMatch(m) {
  const bothResolved = m.teamA.resolved && m.teamB.resolved;
  const time = BRACKET_TIMES[m.key] || "";
  const statusBtns = ["upcoming", "live", "finished"].map((s) => {
    const label = { upcoming: "À venir", live: "Live", finished: "Terminé" }[s];
    return `<button class="btn-status ${m.status === s ? "selected " + s : ""}" data-status="${s}" data-bracket="${m.key}" ${bothResolved ? "" : "disabled"}>${label}</button>`;
  }).join("");

  return `
    <div class="admin-match">
      <div class="admin-match-head"><span>${m.label} · ${time}</span></div>
      <div class="admin-match-teams">
        <span class="team-label">${m.teamA.flag ? m.teamA.flag + " " : ""}${m.teamA.name}</span>
        <input type="number" min="0" class="score-input" id="bscoreA-${m.key}" value="${m.scoreA ?? ""}" placeholder="-" ${bothResolved ? "" : "disabled"} />
        <span style="color:var(--text-muted)">-</span>
        <input type="number" min="0" class="score-input" id="bscoreB-${m.key}" value="${m.scoreB ?? ""}" placeholder="-" ${bothResolved ? "" : "disabled"} />
        <span class="team-label" style="text-align:right">${m.teamB.name}${m.teamB.flag ? " " + m.teamB.flag : ""}</span>
      </div>
      <div class="status-row">${statusBtns}</div>
    </div>`;
}

/* ---------------- Envoi du programme sur Discord ---------------- */
// Envoie, pour la journée actuellement sélectionnée dans l'onglet "Matchs de
// poule" (currentJournee), un message récapitulatif dans le thread de chaque
// poule : "**Journée X - heure**" suivi de la liste des matchs "équipe vs équipe".
async function envoyerProgrammeDiscord() {
  const btn = document.getElementById("discord-send-btn");
  const statusEl = document.getElementById("discord-send-status");
  const tById = teamsById();
  const journee = currentJournee;

  btn.disabled = true;
  statusEl.textContent = "Envoi en cours…";

  const poules = [...new Set(MATCHES.filter((m) => m.journee === journee).map((m) => m.poule))].sort();
  let okCount = 0;
  let errCount = 0;

  for (const poule of poules) {
    const cfg = POULE_DISCORD[poule];
    if (!cfg) { errCount++; continue; }

    const matches = MATCHES
      .filter((m) => m.journee === journee && m.poule === poule)
      .sort((a, b) => a.order - b.order);
    if (!matches.length) continue;

    const heure = matches[0].time;
    const lignes = matches
      .map((m) => {
        const a = tById[m.teamA], b = tById[m.teamB];
        if (!a || !b) return null;
        return `${a.name} vs ${b.name}`;
      })
      .filter(Boolean)
      .join("\n");

    const content = `<@&${cfg.roleId}>\n**Journée ${journee.replace("j", "")} - ${heure}**\n\n${lignes}`;
    const url = `${WEBHOOK_URL}?thread_id=${cfg.threadId}`;
    const payload = {
      content,
      allowed_mentions: { parse: [], roles: [cfg.roleId] }, // on autorise uniquement le rôle propre à cette poule
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 204) okCount++; else errCount++;
      await new Promise((r) => setTimeout(r, 500)); // évite le rate-limit Discord
    } catch (e) {
      console.error(`Poule ${poule} :`, e);
      errCount++;
    }
  }

  statusEl.textContent = errCount === 0
    ? `Programme envoyé dans ${okCount} poule(s) ✅`
    : `${okCount} poule(s) OK, ${errCount} erreur(s) — voir la console.`;
  btn.disabled = false;
}

document.getElementById("discord-send-btn").addEventListener("click", () => {
  const journee = currentJournee.replace("j", "");
  const confirmed = confirm(`Envoyer le programme de la Journée ${journee} dans les threads Discord de chaque poule ?`);
  if (confirmed) envoyerProgrammeDiscord();
});

/* ---------------- Initialisation ---------------- */
document.getElementById("init-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("init-status");
  statusEl.textContent = "Vérification des données existantes…";
  try {
    const existing = await getDocs(collection(db, "teams"));
    if (!existing.empty) {
      statusEl.textContent = "Des équipes existent déjà dans Firestore — initialisation ignorée pour ne rien écraser.";
      return;
    }
    const batch = writeBatch(db);
    SEED_TEAMS.forEach((t) => {
      batch.set(doc(db, "teams", t.id), { ...t, penalty: 0 });
    });
    buildMatches().forEach((m) => {
      batch.set(doc(db, "matches", m.id), m);
    });
    Object.keys(BRACKET_DEF).forEach((key) => {
      batch.set(doc(db, "bracket", key), { teamA: null, teamB: null, scoreA: null, scoreB: null, status: "upcoming" });
    });
    batch.set(doc(db, "meta", "state"), { tournamentActive: false }, { merge: true });
    await batch.commit();
    statusEl.textContent = "Données initialisées avec succès : 32 équipes et 48 matchs de poule créés.";
    fetchAll();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Erreur pendant l'initialisation — vérifie ta configuration Firebase et les règles Firestore.";
  }
});

/* ---------------- Réinitialisation (tout effacer) ---------------- */
document.getElementById("reset-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("reset-status");
  const confirmed = confirm(
    "Cette action va supprimer définitivement toutes les équipes, tous les matchs et l'arbre de phase finale. Continuer ?"
  );
  if (!confirmed) return;

  statusEl.textContent = "Suppression en cours…";
  try {
    const [teamsSnap, matchesSnap, bracketSnap] = await Promise.all([
      getDocs(collection(db, "teams")),
      getDocs(collection(db, "matches")),
      getDocs(collection(db, "bracket")),
    ]);
    const allDocs = [...teamsSnap.docs, ...matchesSnap.docs, ...bracketSnap.docs];
    await Promise.all(allDocs.map((d) => deleteDoc(d.ref)));
    await setDoc(doc(db, "meta", "state"), { tournamentActive: false }, { merge: true });
    statusEl.textContent = `Toutes les données ont été supprimées (${allDocs.length} documents). Tu peux relancer "Initialiser les données".`;
    fetchAll();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Erreur pendant la réinitialisation — vérifie les règles Firestore.";
  }
});
