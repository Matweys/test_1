(function () {
    "use strict";

    var LETTER = "A-Za-zÀ-ÖØ-öø-ÿ";
    var MAX = 400;

    var MARKERS = [
        {
            id: "collectif",
            name: "Quantificateur collectif",
            tag: "portée",
            weight: 22,
            extra: 6,
            why: "La phrase attribue une même réaction à un groupe entier. Une émotion partagée par des millions de personnes n'est jamais mesurable en quelques heures : c'est une figure de style, pas un fait.",
            ask: "Qui exactement a réagi, et sur quelle mesure repose ce « tout le monde » ?",
            terms: ["toute la france", "la france entière", "tous les français", "toutes les françaises",
                "tout le monde", "tout le pays", "le pays entier", "toute l'europe", "la planète entière",
                "l'ensemble des français", "personne n[e']", "aucun français", "des millions de personnes",
                "la france est", "les français sont"]
        },
        {
            id: "emotion",
            name: "Vocabulaire émotionnel",
            tag: "ton",
            weight: 20,
            extra: 5,
            why: "Ces mots décrivent une émotion supposée du public plutôt qu'un événement. Ils orientent la lecture avant même que le fait soit énoncé.",
            ask: "Si je retire les mots chargés d'émotion, que reste-t-il comme information ?",
            terms: ["choqu[éeé]e?s?", "choquant[es]?", "sous le choc", "scandale", "scandaleux",
                "stup[ée]faction", "stup[ée]fiant[es]?", "sid[ée]r[ée]e?s?", "boulevers[ée]e?s?",
                "incroyable", "inimaginable", "in[ée]dit[es]?", "historique", "explosif", "explosive",
                "s[ée]isme", "toll[ée]", "pol[ée]mique", "clash", "fureur", "col[èe]re noire",
                "indignation", "glaçant[es]?", "terrible", "dramatique", "affolant[es]?", "hallucinant[es]?"]
        },
        {
            id: "flou",
            name: "Référence floue",
            tag: "précision",
            weight: 16,
            extra: 4,
            why: "L'objet de la phrase n'est pas nommé. Le lecteur comble le vide avec sa propre imagination, ce qui rend l'accroche efficace mais vide de contenu.",
            ask: "De quoi parle-t-on précisément : quel propos, prononcé par qui, dans quel contexte ?",
            terms: ["ce qui s'est pass[ée]", "ce qu'il s'est pass[ée]", "cette d[ée]claration",
                "cette annonce", "cette phrase", "ce geste", "cette sortie", "la v[ée]rit[ée]",
                "on ne vous dit pas", "ce que personne", "certains", "des sources", "une source",
                "des proches", "un[e]? personnalit[ée]", "quelqu'un", "une star", "un[e]? c[ée]l[èe]brit[ée]",
                "des internautes", "les r[ée]seaux sociaux s'enflamment", "ça a d[ée]rap[ée]"]
        },
        {
            id: "urgence",
            name: "Urgence temporelle",
            tag: "rythme",
            weight: 12,
            extra: 3,
            why: "Le repère de temps crée un sentiment de rattrapage : il faudrait réagir maintenant. C'est précisément le moment où la vérification n'existe pas encore.",
            ask: "Qu'est-ce que je perds à lire la même information dans deux heures, une fois vérifiée ?",
            terms: ["hier soir", "hier", "ce matin", "ce soir", "cette nuit", "aujourd'hui",
                "[àa] l'instant", "en direct", "urgent", "derni[èe]re minute", "flash", "il y a quelques minutes",
                "vient de", "en ce moment m[êe]me", "maintenant"]
        },
        {
            id: "typo",
            name: "Typographie d'accroche",
            tag: "forme",
            weight: 10,
            extra: 4,
            why: "Majuscules, points d'exclamation ou points de suspension remplacent l'argument par un signal visuel d'intensité.",
            ask: "L'information a-t-elle besoin de ces signes pour être comprise ?",
            terms: []
        }
    ];

    var SOURCE_TERMS = ["selon", "d'apr[èe]s", "a d[ée]clar[ée]", "a annonc[ée]", "a confirm[ée]",
        "a pr[ée]cis[ée]", "a indiqu[ée]", "interrog[ée]e? par", "au micro de", "dans un communiqu[ée]",
        "rapporte", "cit[ée] par", "conf[ée]rence de presse", "communiqu[ée] officiel"];

    var NOT_A_SOURCE = ["france", "français", "française", "françaises", "europe", "européens",
        "paris", "internet", "facebook", "instagram", "tiktok", "twitter", "youtube", "whatsapp",
        "telegram", "web", "hexagone"];

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function buildRegex(term) {
        return new RegExp("(^|[^" + LETTER + "])(" + term + ")(?![" + LETTER + "])", "gi");
    }

    function findRanges(text, terms) {
        var ranges = [];
        for (var i = 0; i < terms.length; i++) {
            var re = buildRegex(terms[i]);
            var m;
            while ((m = re.exec(text)) !== null) {
                var start = m.index + m[1].length;
                var end = start + m[2].length;
                ranges.push({ start: start, end: end });
                if (re.lastIndex <= start) {
                    re.lastIndex = start + 1;
                }
            }
        }
        return ranges;
    }

    function mergeRanges(ranges) {
        if (!ranges.length) {
            return [];
        }
        ranges.sort(function (a, b) {
            return a.start - b.start || b.end - a.end;
        });
        var out = [ranges[0]];
        for (var i = 1; i < ranges.length; i++) {
            var last = out[out.length - 1];
            var cur = ranges[i];
            if (cur.start <= last.end) {
                last.end = Math.max(last.end, cur.end);
            } else {
                out.push(cur);
            }
        }
        return out;
    }

    function highlight(text, ranges) {
        var merged = mergeRanges(ranges.slice());
        var html = "";
        var cursor = 0;
        for (var i = 0; i < merged.length; i++) {
            html += escapeHtml(text.slice(cursor, merged[i].start));
            html += "<mark>" + escapeHtml(text.slice(merged[i].start, merged[i].end)) + "</mark>";
            cursor = merged[i].end;
        }
        html += escapeHtml(text.slice(cursor));
        return html;
    }

    function typographyHits(text) {
        var hits = [];
        var bangs = text.match(/!/g);
        if (bangs && bangs.length >= 1) {
            hits.push(bangs.length + (bangs.length > 1 ? " points d'exclamation" : " point d'exclamation"));
        }
        if (/\.{3}|…/.test(text)) {
            hits.push("points de suspension");
        }
        var caps = text.match(new RegExp("(^|[^" + LETTER + "])([A-ZÀ-Ö]{4,})(?![" + LETTER + "])", "g"));
        if (caps) {
            hits.push(caps.length + (caps.length > 1 ? " mots en majuscules" : " mot en majuscules"));
        }
        return hits;
    }

    function hasNamedSource(text) {
        for (var i = 0; i < SOURCE_TERMS.length; i++) {
            if (buildRegex(SOURCE_TERMS[i]).test(text)) {
                return true;
            }
        }
        return false;
    }

    function hasProperNoun(text) {
        var re = new RegExp("[^.!?]\\s([A-ZÀ-Ö][a-zà-öø-ÿ]{2,})", "g");
        var m;
        while ((m = re.exec(text)) !== null) {
            if (NOT_A_SOURCE.indexOf(m[1].toLowerCase()) === -1) {
                return true;
            }
        }
        return false;
    }

    function band(score) {
        if (score < 25) {
            return {
                label: "Formulation plutôt factuelle",
                text: "Le texte annonce surtout ce qui s'est passé. Les marqueurs d'accroche sont rares."
            };
        }
        if (score < 50) {
            return {
                label: "Quelques marqueurs d'accroche",
                text: "L'information reste identifiable, mais la formulation cherche à capter l'attention avant de l'informer."
            };
        }
        if (score < 75) {
            return {
                label: "Formulation nettement sensationnaliste",
                text: "L'émotion et la portée annoncée dominent le contenu factuel. Une vérification s'impose avant tout partage."
            };
        }
        return {
            label: "Accroche émotionnelle, faits quasi absents",
            text: "Le texte décrit une réaction supposée plutôt qu'un événement. Presque rien n'y est vérifiable en l'état."
        };
    }

    function analyse(text) {
        var findings = [];
        var positives = [];
        var allRanges = [];
        var score = 0;

        for (var i = 0; i < MARKERS.length; i++) {
            var marker = MARKERS[i];
            var hits = [];
            var count = 0;

            if (marker.id === "typo") {
                hits = typographyHits(text);
                count = hits.length;
            } else {
                var ranges = findRanges(text, marker.terms);
                var merged = mergeRanges(ranges.slice());
                count = merged.length;
                for (var j = 0; j < merged.length; j++) {
                    hits.push(text.slice(merged[j].start, merged[j].end));
                }
                allRanges = allRanges.concat(ranges);
            }

            if (count > 0) {
                score += marker.weight + (count - 1) * marker.extra;
                findings.push({
                    name: marker.name,
                    tag: marker.tag,
                    why: marker.why,
                    ask: marker.ask,
                    hits: hits
                });
            }
        }

        var sourced = hasNamedSource(text) || hasProperNoun(text);
        if (!sourced) {
            score += 14;
            findings.push({
                name: "Aucune source identifiable",
                tag: "attribution",
                why: "Personne n'est nommé : ni l'auteur du propos, ni le média qui le rapporte. Sans attribution, la phrase ne peut être ni vérifiée ni contestée.",
                ask: "Qui affirme cela, et où puis-je lire ou écouter le propos d'origine ?",
                hits: []
            });
        } else {
            positives.push("Une source ou une personne nommée apparaît dans le texte : le propos peut être retrouvé.");
        }

        if (!/\d/.test(text)) {
            score += 8;
            findings.push({
                name: "Aucun élément chiffré",
                tag: "vérifiabilité",
                why: "Pas de date précise, pas de durée, pas de quantité. Rien ne permet de confronter la phrase à une donnée existante.",
                ask: "Quel chiffre, quelle date ou quel document permettrait de trancher ?",
                hits: []
            });
        } else {
            positives.push("Le texte comporte au moins un élément chiffré, donc confrontable à une donnée.");
        }

        if (text.length <= 90) {
            positives.push("Le texte est court : c'est un titre ou une accroche, pas encore un article. Le contenu complet reste à lire.");
        }

        score = Math.max(0, Math.min(100, Math.round(score)));

        return {
            score: score,
            band: band(score),
            findings: findings,
            positives: positives,
            html: highlight(text, allRanges)
        };
    }

    var input = document.getElementById("an-input");
    var runBtn = document.getElementById("an-run");
    var clearBtn = document.getElementById("an-clear");
    var result = document.getElementById("an-result");
    var empty = document.getElementById("an-empty");

    if (!input || !runBtn || !result) {
        return;
    }

    function listHits(hits) {
        if (!hits.length) {
            return "";
        }
        var quoted = hits.map(function (h) {
            return "<b>" + escapeHtml(h) + "</b>";
        }).join(", ");
        return '<p class="finding-hits">Repéré : ' + quoted + "</p>";
    }

    function render(data) {
        var findingsHtml = data.findings.map(function (f) {
            return '<li class="finding">' +
                '<div class="finding-top"><span class="finding-name">' + f.name + '</span>' +
                '<span class="finding-tag">' + f.tag + "</span></div>" +
                "<p>" + f.why + "</p>" +
                listHits(f.hits) +
                "</li>";
        }).join("");

        var questionsHtml = data.findings.map(function (f) {
            return "<li>" + f.ask + "</li>";
        }).join("");

        var positivesHtml = data.positives.length
            ? '<ul class="findings"><li class="finding"><div class="finding-top">' +
            '<span class="finding-name">Ce qui joue en faveur du texte</span>' +
            '<span class="finding-tag">équilibre</span></div><p>' +
            data.positives.join(" ") + "</p></li></ul>"
            : "";

        result.innerHTML =
            '<div class="gauge">' +
            '<div class="gauge-num">' + data.score + "<span>/100</span></div>" +
            '<div class="gauge-meta">' +
            '<div class="gauge-label">' + data.band.label + "</div>" +
            '<div class="gauge-track"><div class="gauge-fill" style="width:' + data.score + '%"></div></div>' +
            '<p class="hint">' + data.band.text + "</p>" +
            "</div></div>" +
            '<div class="marked-text">' + data.html + "</div>" +
            (findingsHtml
                ? '<h3 style="margin-top:26px">Marqueurs relevés</h3><ul class="findings">' + findingsHtml + "</ul>"
                : '<p class="hint" style="margin-top:20px">Aucun marqueur d\'accroche relevé dans ce texte.</p>') +
            positivesHtml +
            (questionsHtml
                ? '<div class="questions"><h3>Les questions à poser avant de partager</h3><ol>' + questionsHtml + "</ol></div>"
                : "");

        result.hidden = false;
        if (empty) {
            empty.hidden = true;
        }
    }

    function run() {
        var text = input.value.trim().slice(0, MAX);
        if (!text) {
            result.hidden = true;
            if (empty) {
                empty.hidden = false;
                empty.textContent = "Saisissez une phrase ou choisissez un exemple ci-dessous pour lancer l'analyse.";
            }
            return;
        }
        render(analyse(text));
    }

    runBtn.addEventListener("click", run);

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            input.value = "";
            result.hidden = true;
            result.innerHTML = "";
            if (empty) {
                empty.hidden = false;
                empty.textContent = "Saisissez une phrase ou choisissez un exemple ci-dessous pour lancer l'analyse.";
            }
            input.focus();
        });
    }

    input.addEventListener("keydown", function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            run();
        }
    });

    Array.prototype.forEach.call(document.querySelectorAll(".preset"), function (btn) {
        btn.addEventListener("click", function () {
            input.value = btn.getAttribute("data-text") || btn.textContent.trim();
            run();
            result.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
})();
