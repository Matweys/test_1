"use strict";

const questions = [
  {
    title: "Un titre affirme qu’une déclaration « bouleverse tout le pays ». Que cherchez-vous d’abord ?",
    answers: [
      ["A", "L’entretien complet et le moment où la phrase a été prononcée", "context"],
      ["B", "Ce que recouvrent exactement « bouleverse » et « tout le pays »", "words"],
      ["C", "Les réactions après quelques heures, une fois l’émotion retombée", "calm"],
      ["D", "Ce que cette déclaration change concrètement dans la réalité", "action"]
    ]
  },
  {
    title: "Une courte vidéo devient virale. Votre premier mouvement ?",
    answers: [
      ["A", "Retrouver la vidéo d’origine et ce qui précède l’extrait", "context"],
      ["B", "Observer la légende et les mots choisis pour orienter la lecture", "words"],
      ["C", "Attendre que des informations plus stables apparaissent", "calm"],
      ["D", "Vérifier si la séquence aura une conséquence réelle", "action"]
    ]
  },
  {
    title: "Deux médias racontent le même événement de façon opposée. Vous…",
    answers: [
      ["A", "Comparez leurs sources et reconstruisez la chronologie", "context"],
      ["B", "Mettez les deux titres côte à côte pour repérer leurs cadrages", "words"],
      ["C", "Suspendez votre jugement tant que les versions restent confuses", "calm"],
      ["D", "Retenez seulement les faits communs aux deux récits", "action"]
    ]
  },
  {
    title: "Sur un réseau social, « tout le monde » semble indigné. Qu’en pensez-vous ?",
    answers: [
      ["A", "Je cherche qui compose réellement ce groupe très visible", "context"],
      ["B", "Je me méfie immédiatement de l’expression « tout le monde »", "words"],
      ["C", "Je sais qu’une vague de réactions peut vite disparaître", "calm"],
      ["D", "Je regarde si cette indignation produit une action concrète", "action"]
    ]
  },
  {
    title: "Une information importante reste incomplète. Quelle phrase vous ressemble ?",
    answers: [
      ["A", "« Il me manque encore la source et le contexte. »", "context"],
      ["B", "« La façon de le dire affirme plus que les faits disponibles. »", "words"],
      ["C", "« Je peux attendre avant de me faire une opinion. »", "calm"],
      ["D", "« Dites-moi d’abord ce que cela change vraiment. »", "action"]
    ]
  }
];

const profiles = {
  context: {
    symbol: "⌕",
    title: "Le Cartographe",
    lead: "Vous refusez les fragments isolés. Votre premier réflexe est de reconstruire le terrain autour d’une information avant de décider ce qu’elle signifie.",
    strength: "Relier les faits, les sources et la chronologie pour éviter les conclusions hors contexte.",
    watch: "La recherche du contexte parfait peut parfois retarder une conclusion pourtant suffisamment étayée."
  },
  words: {
    symbol: "“”",
    title: "Le Décodeur",
    lead: "Les mots ne passent jamais inaperçus. Vous détectez rapidement les généralisations, les émotions imposées et les formulations qui vont plus loin que les faits.",
    strength: "Voir comment une phrase cadre notre perception avant même que nous examinions l’information.",
    watch: "Une formulation maladroite n’implique pas automatiquement que le fait présenté soit faux."
  },
  calm: {
    symbol: "≈",
    title: "Le Tempo",
    lead: "Vous savez que l’intensité du moment n’est pas toujours celle de l’événement. Vous laissez le bruit retomber avant de choisir votre lecture.",
    strength: "Résister à la contagion émotionnelle et préserver un jugement stable dans l’urgence.",
    watch: "Attendre protège des réactions hâtives, mais certaines situations nécessitent tout de même une réponse rapide."
  },
  action: {
    symbol: "↗",
    title: "Le Pragmatique",
    lead: "Vous traversez le spectacle pour atteindre l’effet réel. Une information mérite surtout votre attention lorsqu’elle modifie une décision, une règle ou une situation.",
    strength: "Distinguer les conséquences observables de l’agitation qui accompagne une annonce.",
    watch: "Les mots et les symboles peuvent avoir des effets différés, même lorsqu’aucun changement immédiat n’est visible."
  }
};

const quizIntro = document.getElementById("quizIntro");
const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");
const questionHost = document.getElementById("questionHost");
const progressLabel = document.getElementById("progressLabel");
const progressBar = document.getElementById("progressBar");
const quizStart = document.getElementById("quizStart");
const quizBack = document.getElementById("quizBack");
const quizRestart = document.getElementById("quizRestart");
let currentQuestion = 0;
let answers = [];

function renderQuestion() {
  const question = questions[currentQuestion];
  const wrapper = document.createElement("div");
  const number = document.createElement("p");
  const title = document.createElement("h3");
  const answerList = document.createElement("div");

  number.className = "question-number";
  number.textContent = "Situation " + String(currentQuestion + 1).padStart(2, "0");
  title.className = "question-title";
  title.textContent = question.title;
  answerList.className = "answer-list";

  question.answers.forEach(([letter, text, profile]) => {
    const button = document.createElement("button");
    const letterSpan = document.createElement("span");
    const textSpan = document.createElement("span");

    button.type = "button";
    button.className = "answer-button";
    button.dataset.profile = profile;
    letterSpan.className = "answer-letter";
    letterSpan.textContent = letter;
    textSpan.textContent = text;
    button.append(letterSpan, textSpan);
    answerList.append(button);
  });

  wrapper.append(number, title, answerList);
  questionHost.replaceChildren(wrapper);
  progressLabel.textContent = "Question " + (currentQuestion + 1) + " sur " + questions.length;
  progressBar.style.width = ((currentQuestion + 1) / questions.length * 100) + "%";
  quizBack.disabled = currentQuestion === 0;
}

function showResult() {
  const totals = { context: 0, words: 0, calm: 0, action: 0 };
  answers.forEach((answer) => {
    totals[answer] += 1;
  });

  const resultKey = Object.keys(totals).reduce((best, key) =>
    totals[key] > totals[best] ? key : best
  );
  const result = profiles[resultKey];

  document.getElementById("resultSymbol").textContent = result.symbol;
  document.getElementById("resultTitle").textContent = result.title;
  document.getElementById("resultLead").textContent = result.lead;
  document.getElementById("resultStrength").textContent = result.strength;
  document.getElementById("resultWatch").textContent = result.watch;
  quizPanel.hidden = true;
  resultPanel.hidden = false;
  resultPanel.focus({ preventScroll: true });
}

if (quizStart) {
  quizStart.addEventListener("click", () => {
    currentQuestion = 0;
    answers = [];
    quizIntro.hidden = true;
    resultPanel.hidden = true;
    quizPanel.hidden = false;
    renderQuestion();
  });

  questionHost.addEventListener("click", (event) => {
    const button = event.target.closest(".answer-button");
    if (!button) {
      return;
    }

    answers[currentQuestion] = button.dataset.profile;
    if (currentQuestion === questions.length - 1) {
      showResult();
      return;
    }

    currentQuestion += 1;
    renderQuestion();
  });

  quizBack.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
      answers = answers.slice(0, currentQuestion);
      renderQuestion();
    }
  });

  quizRestart.addEventListener("click", () => {
    currentQuestion = 0;
    answers = [];
    resultPanel.hidden = true;
    quizPanel.hidden = false;
    renderQuestion();
  });
}

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const data = new FormData(contactForm);
    const subject = String(data.get("subject")).trim();
    const body = [
      "Nom : " + String(data.get("name")).trim(),
      "E-mail : " + String(data.get("email")).trim(),
      "",
      String(data.get("message")).trim()
    ].join("\n");

    contactStatus.textContent = "Votre application de messagerie va s’ouvrir pour envoyer le message.";
    window.location.href = "mailto:Matthias@bondeskovgaardaps.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
}
