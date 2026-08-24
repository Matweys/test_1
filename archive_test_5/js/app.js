"use strict";

var QUESTIONS = [
  {
    q: "On vous dit : « Ce qui s’est passé hier soir à l’antenne a choqué toute la France. » Votre premier réflexe ?",
    s: "Prenez la réaction la plus spontanée, pas la plus « correcte ».",
    a: [
      ["A", "Je cherche le passage exact et le contexte de diffusion.", "source"],
      ["B", "Je bloque déjà sur « toute la France » : qui a compté ?", "lexique"],
      ["C", "Je laisse passer la première vague avant de me positionner.", "tempo"],
      ["D", "Je me demande si ça change quelque chose de concret pour moi.", "filtre"]
    ]
  },
  {
    q: "Un message arrive sans lien : « Tout le monde a été choqué par la déclaration d’aujourd’hui. » Vous…",
    s: "Même mécanique, autre moment de la journée.",
    a: [
      ["A", "Demande qui a parlé, où, et dans quel cadre.", "source"],
      ["B", "Repère le poids des mots « tout le monde » et « choqué ».", "lexique"],
      ["C", "Attend une deuxième source avant de commenter.", "tempo"],
      ["D", "Classe ça en « bruit du jour » tant qu’aucun impact n’apparaît.", "filtre"]
    ]
  },
  {
    q: "La conversation s’emballe autour de vous. Quelle posture vous ressemble le plus ?",
    s: "",
    a: [
      ["A", "Je ramène un extrait ou un résumé clair si j’en trouve un.", "source"],
      ["B", "Je rappelle que le titre et le fond, ce n’est pas la même chose.", "lexique"],
      ["C", "J’écoute sans intervenir tout de suite.", "tempo"],
      ["D", "Je change de sujet si ça n’aide personne à agir.", "filtre"]
    ]
  },
  {
    q: "Plus tard, l’événement paraît moins spectaculaire que le titre. Votre réaction habituelle ?",
    s: "",
    a: [
      ["A", "Je mets à jour ce que j’avais compris, sans drame.", "source"],
      ["B", "Je retiens comment le packaging a fonctionné.", "lexique"],
      ["C", "Je suis content d’avoir attendu.", "tempo"],
      ["D", "Peu importe : l’impact pratique était faible.", "filtre"]
    ]
  },
  {
    q: "La prochaine fois qu’une phrase « choc » fait le tour des fils, vous…",
    s: "",
    a: [
      ["A", "Allez d’abord à la source originale.", "source"],
      ["B", "Pesez chaque formulation avant de croire.", "lexique"],
      ["C", "Observez le climat, puis formez un avis.", "tempo"],
      ["D", "Filtrez : utile pour vous, ou simple spectacle ?", "filtre"]
    ]
  }
];

var PROFILES = {
  source: {
    title: "Le Relieur de sources",
    lead: "Avant de monter en température, vous voulez le passage original, le cadre et la chronologie. Le buzz vous intéresse moins que le fil réel.",
    force: "Résistance aux résumés tronqués et aux extraits sortis de leur contexte.",
    watch: "La quête du « dossier complet » peut parfois retarder une conclusion déjà assez claire."
  },
  lexique: {
    title: "L’Oreille aux mots",
    lead: "« Toute la France », « choqué », « tout le monde » : vous entendez d’abord l’amplification. Les mots ne passent jamais inaperçus.",
    force: "Repérer les généralisations et ce qu’une formule laisse dans l’ombre.",
    watch: "Une formulation excessivement large n’implique pas automatiquement que le fait soit inventé."
  },
  tempo: {
    title: "Le Pauseur",
    lead: "Vous savez que l’intensité du moment n’est pas celle de l’événement. Vous laissez retomber la poussière avant de trancher.",
    force: "Éviter la contagion émotionnelle et garder un jugement stable.",
    watch: "Attendre protège, mais certaines situations demandent tout de même une réaction rapide."
  },
  filtre: {
    title: "Le Tri pratique",
    lead: "Vous traversez le spectacle pour atteindre l’effet réel. Si rien ne change dans votre journée, le sujet perd vite sa priorité.",
    force: "Séparer le bruit médiatique des conséquences observables.",
    watch: "Certains symboles agissent plus tard — un impact faible aujourd’hui n’est pas toujours nul demain."
  }
};

var step = 0;
var picks = [];
var lastProfileKey = "";

var elBar = document.querySelector("[data-wz-bar]");
var elLabel = document.querySelector("[data-step-label]");
var elQuiz = document.querySelector("[data-quiz]");
var elResult = document.querySelector("[data-result]");
var elBack = document.querySelector("[data-back]");
var leadForm = document.getElementById("leadForm");
var leadStatus = document.getElementById("leadStatus");
var leadSubmit = document.getElementById("leadSubmit");
var leadProfile = document.getElementById("leadProfile");

function render() {
  if (!elQuiz) return;

  if (step >= QUESTIONS.length) {
    finish();
    return;
  }

  var item = QUESTIONS[step];
  elLabel.textContent = "Étape " + (step + 1) + " sur " + QUESTIONS.length;
  elBar.style.width = ((step + 1) / QUESTIONS.length) * 100 + "%";

  var host = document.createElement("div");
  var q = document.createElement("p");
  q.className = "wz-q";
  q.textContent = item.q;
  host.appendChild(q);

  if (item.s) {
    var sub = document.createElement("p");
    sub.className = "wz-sub";
    sub.textContent = item.s;
    host.appendChild(sub);
  }

  var opts = document.createElement("div");
  opts.className = "wz-opts";

  item.a.forEach(function (row) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wz-opt";
    if (picks[step] === row[2]) btn.classList.add("is-on");

    var letter = document.createElement("span");
    letter.className = "wz-letter";
    letter.textContent = row[0];

    var text = document.createElement("span");
    text.textContent = row[1];

    btn.appendChild(letter);
    btn.appendChild(text);
    btn.addEventListener("click", function () {
      picks[step] = row[2];
      step += 1;
      render();
    });
    opts.appendChild(btn);
  });

  host.appendChild(opts);
  elQuiz.replaceChildren(host);
  elBack.disabled = step === 0;
  elResult.classList.remove("is-show");
  elQuiz.hidden = false;
}

function finish() {
  var tally = { source: 0, lexique: 0, tempo: 0, filtre: 0 };
  picks.forEach(function (k) {
    if (tally[k] !== undefined) tally[k] += 1;
  });

  var winner = "source";
  var max = -1;
  ["source", "lexique", "tempo", "filtre"].forEach(function (k) {
    if (tally[k] > max) {
      max = tally[k];
      winner = k;
    }
  });

  lastProfileKey = winner;
  var p = PROFILES[winner];
  document.getElementById("resTitle").textContent = p.title;
  document.getElementById("resLead").textContent = p.lead;
  document.getElementById("resForce").textContent = p.force;
  document.getElementById("resWatch").textContent = p.watch;
  if (leadProfile) leadProfile.value = p.title;
  if (leadForm) {
    leadForm.reset();
    if (leadProfile) leadProfile.value = p.title;
  }
  if (leadStatus) leadStatus.textContent = "";
  if (leadSubmit) leadSubmit.disabled = false;

  elLabel.textContent = "Profil";
  elBar.style.width = "100%";
  elQuiz.hidden = true;
  elResult.classList.add("is-show");
  elBack.disabled = false;
  elResult.focus();
}

if (elBack) {
  elBack.addEventListener("click", function () {
    if (elResult.classList.contains("is-show")) {
      step = QUESTIONS.length - 1;
      picks = picks.slice(0, step);
      elResult.classList.remove("is-show");
      elQuiz.hidden = false;
      render();
      return;
    }
    if (step > 0) {
      step -= 1;
      picks = picks.slice(0, step);
      render();
    }
  });
}

var restart = document.querySelector("[data-restart]");
if (restart) {
  restart.addEventListener("click", function () {
    step = 0;
    picks = [];
    lastProfileKey = "";
    elResult.classList.remove("is-show");
    elQuiz.hidden = false;
    render();
  });
}

if (leadForm) {
  leadForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      return;
    }

    var data = new FormData(leadForm);
    if (leadProfile && !data.get("profile")) {
      data.set("profile", leadProfile.value || lastProfileKey);
    }

    leadSubmit.disabled = true;
    leadStatus.textContent = "Envoi en cours…";

    fetch("send.php", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        return res.json().then(function (json) {
          return { ok: res.ok, json: json };
        });
      })
      .then(function (out) {
        if (out.ok && out.json && out.json.ok) {
          leadStatus.textContent = "Merci. Votre demande a bien été envoyée. Nous vous recontactons rapidement.";
          leadForm.querySelectorAll("input, button").forEach(function (el) {
            if (el.type !== "hidden") el.disabled = true;
          });
          leadSubmit.disabled = true;
          return;
        }
        throw new Error((out.json && out.json.error) || "send_failed");
      })
      .catch(function () {
        leadSubmit.disabled = false;
        leadStatus.textContent = "L’envoi automatique n’a pas abouti. Ouverture de votre messagerie…";
        var name = String(data.get("name") || "").trim();
        var email = String(data.get("email") || "").trim();
        var phone = String(data.get("phone") || "").trim();
        var profile = String(data.get("profile") || "").trim();
        var body = [
          "Demande Relais Lucide",
          "Nom : " + name,
          "E-mail : " + email,
          "Téléphone : " + (phone || "—"),
          "Profil : " + (profile || "—")
        ].join("\n");
        window.location.href =
          "mailto:Matthias@bondeskovgaardaps.com?subject=" +
          encodeURIComponent("Relais Lucide — " + (profile || "profil")) +
          "&body=" +
          encodeURIComponent(body);
      });
  });
}

render();
