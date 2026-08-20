(function () {
  "use strict";

  var data = window.QUIZ_DATA;
  if (!data) return;

  var state = { current: 0, answers: [] };

  var els = {
    intro: document.getElementById("quiz-intro"),
    card: document.getElementById("quiz-card"),
    question: document.getElementById("quiz-question"),
    options: document.getElementById("quiz-options"),
    prevBtn: document.getElementById("quiz-prev"),
    nextBtn: document.getElementById("quiz-next"),
    progress: document.getElementById("quiz-progress-bar"),
    progressLabel: document.getElementById("quiz-progress-label"),
    result: document.getElementById("quiz-result"),
    resultEyebrow: document.getElementById("result-eyebrow"),
    resultTitle: document.getElementById("result-title"),
    resultDesc: document.getElementById("result-desc"),
    resultStrengths: document.getElementById("result-strengths"),
    resultTip: document.getElementById("result-tip"),
    restartBtn: document.getElementById("quiz-restart"),
    startBtn: document.getElementById("quiz-start"),
  };

  if (!els.card) return;

  function start() {
    state.current = 0;
    state.answers = [];
    els.intro.classList.add("is-hidden");
    els.result.classList.add("is-hidden");
    els.card.classList.remove("is-hidden");
    render();
  }

  function render() {
    var q = data.questions[state.current];
    if (!q) return finish();

    els.question.textContent = q.text;
    els.options.innerHTML = "";

    q.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.setAttribute("data-letter", opt.letter);
      if (state.answers[state.current] === opt.letter) {
        btn.classList.add("is-selected");
      }

      var letter = document.createElement("span");
      letter.className = "quiz-option__letter";
      letter.textContent = opt.letter;

      var text = document.createElement("span");
      text.className = "quiz-option__text";
      text.textContent = opt.text;

      btn.appendChild(letter);
      btn.appendChild(text);
      btn.addEventListener("click", function () {
        selectAnswer(opt.letter);
      });
      els.options.appendChild(btn);
    });

    var pct = (state.current / data.questions.length) * 100;
    els.progress.style.width = pct + "%";
    els.progressLabel.textContent =
      "Question " + (state.current + 1) + " sur " + data.questions.length;

    els.prevBtn.disabled = state.current === 0;
    els.nextBtn.textContent =
      state.current === data.questions.length - 1
        ? "Voir mon profil"
        : "Question suivante";
    els.nextBtn.disabled = !state.answers[state.current];
  }

  function selectAnswer(letter) {
    state.answers[state.current] = letter;
    render();
  }

  function next() {
    if (!state.answers[state.current]) return;
    if (state.current < data.questions.length - 1) {
      state.current++;
      render();
    } else {
      finish();
    }
  }

  function prev() {
    if (state.current > 0) {
      state.current--;
      render();
    }
  }

  function finish() {
    var count = { A: 0, B: 0, C: 0, D: 0 };
    state.answers.forEach(function (l) {
      count[l] = (count[l] || 0) + 1;
    });

    var winner = "A";
    var max = -1;
    ["A", "B", "C", "D"].forEach(function (k) {
      if (count[k] > max) {
        max = count[k];
        winner = k;
      }
    });

    var p = data.profiles[winner];
    els.card.classList.add("is-hidden");
    els.result.classList.remove("is-hidden");
    els.resultEyebrow.textContent = p.eyebrow;
    els.resultTitle.textContent = p.title;
    els.resultDesc.textContent = p.desc;
    els.resultStrengths.textContent = p.strengths;
    els.resultTip.textContent = p.tip;
    els.progress.style.width = "100%";
    els.progressLabel.textContent = "Terminé";

    els.result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function restart() {
    start();
    els.card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (els.startBtn) els.startBtn.addEventListener("click", start);
  if (els.nextBtn) els.nextBtn.addEventListener("click", next);
  if (els.prevBtn) els.prevBtn.addEventListener("click", prev);
  if (els.restartBtn) els.restartBtn.addEventListener("click", restart);
})();
