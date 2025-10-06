// ------------------------------
// Données du quiz
// ------------------------------
const QUESTIONS = [
  {
    text: "1) Combien y a-t-il de domaines à travailler sur PIX ?",
    options: [
      { t: "3", ok: false },
      { t: "5", ok: true },
      { t: "16", ok: false },
      { t: "121", ok: false },
    ],
    more: [
      { label: "Référentiel général des domaines PIX", url: "https://pix.unilim.fr/wp-content/uploads/sites/28/2018/06/Referentiel-Vue_generale-Referentiels-PIX-2018-04-04.pdf" }
    ]
  },
  {
    text: "2) Quels sont les indices qui permettent de repérer qu’un texte a été écrit par une IA ?",
    options: [
      { t: "Erreurs subtiles et absurdités", ok: true },
      { t: "Style robotique sans imitation d’un style humain", ok: false },
      { t: "Structure très rigide", ok: true },
      { t: "Manque d’analyse critique et d’avis tranché", ok: true },
      { t: "Difficultés à résumer de manière concise", ok: false },
      { t: "C’est impossible de le repérer", ok: false },
    ],
    more: [
      { label: "Comment repérer un texte écrit avec une IA", url: "https://www.perplexity.ai/search/comment-reperer-un-texte-ecrit-3BPU1KpxTiK1phudih21Mg" }
    ]
  },
  {
    text: "3) Quels sites peuvent vous permettre de créer avec de l’IA ?",
    options: [
      { t: "ChatGPT", ok: true },
      { t: "Canva", ok: true },
      { t: "Quiz Wizard", ok: true },
      { t: "Vittascience", ok: true },
      { t: "Dall-E", ok: true },
    ],
    more: [
      { label: "Générer des images (comparatif)", url: "https://www.perplexity.ai/search/quelle-ia-pour-generer-des-ima-55CF2caaSdexJ1kyun7S3g" },
      { label: "Générer des quiz (Wooclap – Quiz Wizard)", url: "https://www.wooclap.com/fr/quiz-wizard/" },
      { label: "IA créatives (Vittascience)", url: "https://fr.vittascience.com/ia/" }
    ]
  },
  {
    text: "4) Dans quel(s) domaine(s) l’IA ne peut-il pas être utilisé aujourd’hui ?",
    options: [
      { t: "La banque", ok: false },
      { t: "La santé", ok: false },
      { t: "La pensée critique", ok: true },
      { t: "L’éthique, le jugement moral", ok: true },
      { t: "Les compétences interpersonnelles et la construction de relations", ok: true },
    ],
    more: [
      { label: "Secteurs impactés par l’IA", url: "https://www.intelligence-artificielle-school.com/alternance-et-entreprises/les-secteurs-impactes/" },
      { label: "5 compétences humaines irremplaçables", url: "https://www.jobillico.com/blog/5-competences-que-lintelligence-artificielle-ne-pourra-jamais-remplacer/" },
      { label: "L’IA au service de la personne (vidéo)", url: "https://www.youtube.com/watch?v=y2a2ItHVz0A" }
    ]
  }
];

// Feedback final par équipe quand score >= 80%
const TEAM_FEEDBACK = {
  green: "Indice d’équipe : Operating",
  yellow: "Indice d’équipe : System to",
  red:   "Indice d’équipe : Lift up",
  blue:  "Indice d’équipe : Our\nWorld" // sur 2 lignes
};

// ------------------------------
// État
// ------------------------------
let state = {
  team: null,              // 'green' | 'yellow' | 'red' | 'blue'
  index: 0,                // index question en cours
  selections: []           // tableau d'ensembles d'indices sélectionnés par question
};

// ------------------------------
// Helpers
// ------------------------------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function show(idToShow){
  // cache tous les écrans
  ["#screen-home","#screen-quiz","#screen-results"].forEach(id => $(id).classList.add("hidden"));
  $(idToShow).classList.remove("hidden");
}

function renderQuestion() {
  const q = QUESTIONS[state.index];
  $("#qIndex").textContent = (state.index + 1).toString();
  $("#qTotal").textContent = QUESTIONS.length.toString();
  $("#question-text").textContent = q.text;

  const optionsHost = $("#options");
  optionsHost.innerHTML = "";

  const selectedSet = new Set(state.selections[state.index] || []);

  q.options.forEach((opt, i) => {
    const id = `q${state.index}_opt_${i}`;
    const wrapper = document.createElement("label");
    wrapper.className = "option";
    wrapper.htmlFor = id;

    const input = document.createElement("input");
    input.type = "checkbox";                   // multi-réponses
    input.id = id;
    input.dataset.idx = String(i);
    input.checked = selectedSet.has(i);

    input.addEventListener("change", () => {
      const cur = new Set(state.selections[state.index] || []);
      if (input.checked) cur.add(i); else cur.delete(i);
      state.selections[state.index] = Array.from(cur);
      wrapper.classList.toggle("selected", input.checked);
    });

    const span = document.createElement("span");
    span.textContent = opt.t;

    wrapper.appendChild(input);
    wrapper.appendChild(span);
    wrapper.classList.toggle("selected", input.checked);
    optionsHost.appendChild(wrapper);
  });

  // Boutons navigation
  $("#btn-prev").disabled = state.index === 0;
  $("#btn-next").classList.toggle("hidden", state.index === QUESTIONS.length - 1);
  $("#btn-finish").classList.toggle("hidden", state.index !== QUESTIONS.length - 1);
}

function arraysEqualAsSets(a1, a2){
  if (a1.length !== a2.length) return false;
  const s1 = new Set(a1), s2 = new Set(a2);
  for (const v of s1) if (!s2.has(v)) return false;
  return true;
}

// calcule % sur base "question parfaite" (toutes bonnes cochées, aucune mauvaise)
// -> 4 questions => 0,25,50,75,100 ; seuil 80% => seuls les 100% passent
function computeScorePercent(){
  let correctQuestions = 0;
  QUESTIONS.forEach((q, qi) => {
    const selected = state.selections[qi] || [];
    const correctIdx = q.options.map((o, i) => o.ok ? i : null).filter(v => v !== null);
    // Parfaite si sets identiques
    if (arraysEqualAsSets(selected, correctIdx)) correctQuestions++;
  });
  return Math.round((correctQuestions / QUESTIONS.length) * 100);
}

function renderResults(){
  show("#screen-results");

  const percent = computeScorePercent();
  $("#score-line").textContent = `Score : ${percent}% de réussite`;

  const reviewHost = $("#review");
  reviewHost.innerHTML = "";

  QUESTIONS.forEach((q, qi) => {
    const block = document.createElement("div");
    block.className = "review-block";

    const title = document.createElement("div");
    title.className = "review-title";
    title.textContent = q.text;
    block.appendChild(title);

    const ul = document.createElement("ul");
    ul.className = "review-options";

    const selected = new Set(state.selections[qi] || []);
    const correctIdx = new Set(q.options.map((o,i)=>o.ok?i:null).filter(v=>v!==null));

    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      const userPicked = selected.has(i);

      // balise du texte d'option
      const label = document.createElement(opt.ok ? "strong" : "span");
      label.textContent = opt.t;

      if (opt.ok) {
        label.classList.add("correct"); // vert + gras via CSS
      }
      if (userPicked) {
        label.classList.add("chosen"); // souligner ce que l'utilisateur a coché
      }

      li.appendChild(label);
      ul.appendChild(li);
    });

    block.appendChild(ul);

    // Afficher "Pour aller plus loin" si la question n'est pas parfaite
    const isPerfect = arraysEqualAsSets(Array.from(selected), Array.from(correctIdx));
    if (!isPerfect && q.more && q.more.length){
      const moreTitle = document.createElement("p");
      moreTitle.innerHTML = "<em>Pour aller plus loin :</em>";
      block.appendChild(moreTitle);

      const m = document.createElement("ul");
      m.className = "more-links";
      q.more.forEach(link=>{
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link.url; a.target = "_blank"; a.rel = "noopener";
        a.textContent = link.label;
        li.appendChild(a);
        m.appendChild(li);
      });
      block.appendChild(m);
    }

    reviewHost.appendChild(block);
  });

  const fb = $("#final-feedback");
  const retry = $("#retry-zone");

  if (percent >= 80) {
    const msg = TEAM_FEEDBACK[state.team] || "Bravo !";
    fb.textContent = msg;
    fb.classList.remove("hidden");
    retry.classList.add("hidden"); // pas de recommencer
  } else {
    fb.textContent = "";
    fb.classList.add("hidden");
    retry.classList.remove("hidden"); // bouton recommencer visible
  }
}

// ------------------------------
// Actions / Navigation
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {

  // Choix de l’équipe
  $$(".team").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.team = btn.dataset.team;
      state.index = 0;
      state.selections = Array.from({length: QUESTIONS.length}, ()=>[]);
      $("#screen-home").classList.add("hidden");
      show("#screen-quiz");
      renderQuestion();
    });
  });

  // Navigation quiz
  $("#btn-prev").addEventListener("click", ()=>{
    if (state.index > 0){
      state.index--;
      renderQuestion();
    }
  });

  $("#btn-next").addEventListener("click", ()=>{
    if (state.index < QUESTIONS.length - 1){
      state.index++;
      renderQuestion();
    }
  });

  $("#btn-finish").addEventListener("click", ()=>{
    renderResults();
  });

  // Recommencer (revient à l’accueil pour resélectionner l’équipe)
  $("#btn-retry").addEventListener("click", ()=>{
    state = { team:null, index:0, selections:[] };
    show("#screen-home");
  });
});
