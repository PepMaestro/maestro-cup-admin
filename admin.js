import { firebaseConfig } from "./firebase-config.js";
import { buildBracketView, poulesTerminees, BRACKET_DEF } from "./logic.js";
import { TEAMS as SEED_TEAMS, buildMatches } from "./seed-data.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, onSnapshot, doc, updateDoc, setDoc, getDocs, writeBatch,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let TEAMS = [];
let MATCHES = [];
let BRACKET = {};
let currentJournee = "j1";

/* ---------------- Auth ---------------- */
const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const logoutBtn = document.getElementById("logout-btn");
const userEmailEl = document.getElementById("user-email");

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
    logoutBtn.style.display = "inline-block";
    userEmailEl.textContent = user.email;
    startListeners();
  } else {
    loginScreen.style.display = "flex";
    appScreen.style.display = "none";
    logoutBtn.style.display = "none";
    userEmailEl.textContent = "";
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

/* ---------------- Tabs ---------------- */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

/* ---------------- Firestore listeners ---------------- */
let listenersStarted = false;
function startListeners() {
  if (listenersStarted) return;
  listenersStarted = true;

  onSnapshot(collection(db, "teams"), (snap) => {
    TEAMS = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderAll();
  });

  onSnapshot(collection(db, "matches"), (snap) => {
    MATCHES = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderAll();
  });

  onSnapshot(collection(db, "bracket"), (snap) => {
    BRACKET = {};
    snap.docs.forEach((d) => { BRACKET[d.id] = d.data(); });
    renderAll();
  });
}

function renderAll() {
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
}
async function updateMatchScore(matchId, scoreA, scoreB) {
  await updateDoc(doc(db, "matches", matchId), { scoreA, scoreB });
}
async function updateBracketMatch(key, fields) {
  await setDoc(doc(db, "bracket", key), fields, { merge: true });
}
async function updateTeamPenalty(teamId, penalty) {
  await updateDoc(doc(db, "teams", teamId), { penalty });
}

function statusButtons(m, onChange) {
  return ["upcoming", "live", "finished"].map((s) => {
    const label = { upcoming: "À venir", live: "Live", finished: "Terminé" }[s];
    return `<button class="btn-status ${m.status === s ? "selected " + s : ""}" data-status="${s}" data-match="${m.id}">${label}</button>`;
  }).join("");
}

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
  const statusBtns = ["upcoming", "live", "finished"].map((s) => {
    const label = { upcoming: "À venir", live: "Live", finished: "Terminé" }[s];
    return `<button class="btn-status ${m.status === s ? "selected " + s : ""}" data-status="${s}" data-bracket="${m.key}" ${bothResolved ? "" : "disabled"}>${label}</button>`;
  }).join("");

  return `
    <div class="admin-match">
      <div class="admin-match-head"><span>${m.label}</span></div>
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
    await batch.commit();
    statusEl.textContent = "Données initialisées avec succès : 16 équipes et 24 matchs de poule créés.";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Erreur pendant l'initialisation — vérifie ta configuration Firebase et les règles Firestore.";
  }
});
