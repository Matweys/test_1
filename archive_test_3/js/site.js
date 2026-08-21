"use strict";

const commentForm = document.getElementById("commentForm");
const localComments = document.getElementById("localComments");
const commentStatus = document.getElementById("commentStatus");
const commentCookie = "bondeskovgaard_reader_comments";

function getSavedComments() {
  const entry = document.cookie
    .split("; ")
    .find((item) => item.startsWith(commentCookie + "="));

  if (!entry) {
    return [];
  }

  try {
    const saved = JSON.parse(decodeURIComponent(entry.slice(commentCookie.length + 1)));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveComments(comments) {
  const items = comments.slice(-5);
  let value = encodeURIComponent(JSON.stringify(items));

  while (value.length > 3500 && items.length > 1) {
    items.shift();
    value = encodeURIComponent(JSON.stringify(items));
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = commentCookie + "=" + value + "; Max-Age=31536000; Path=/; SameSite=Lax" + secure;
}

function removeSavedCommentsCookie() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = commentCookie + "=; Max-Age=0; Path=/; SameSite=Lax" + secure;
}

function renderSavedComments() {
  if (!localComments) {
    return;
  }

  const comments = getSavedComments();
  localComments.replaceChildren();

  comments.forEach((comment, index) => {
    const card = document.createElement("article");
    card.className = "comment-card local-comment";

    const heading = document.createElement("div");
    heading.className = "comment-heading";

    const author = document.createElement("strong");
    author.textContent = comment.name;

    const date = document.createElement("time");
    date.dateTime = comment.date;
    date.textContent = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(comment.date));

    const text = document.createElement("p");
    text.textContent = comment.text;

    const localLabel = document.createElement("span");
    localLabel.className = "local-label";
    localLabel.textContent = "Enregistré sur cet appareil";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "comment-remove";
    removeButton.dataset.commentIndex = String(index);
    removeButton.textContent = "Supprimer";

    heading.append(author, date);
    card.append(heading, text, localLabel, removeButton);
    localComments.append(card);
  });
}

if (commentForm) {
  renderSavedComments();

  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!commentForm.checkValidity()) {
      commentForm.reportValidity();
      return;
    }

    const data = new FormData(commentForm);
    const comments = getSavedComments();
    comments.push({
      name: String(data.get("commentName")).trim().slice(0, 40),
      text: String(data.get("commentText")).trim().slice(0, 240),
      date: new Date().toISOString()
    });

    saveComments(comments);
    commentForm.reset();
    renderSavedComments();
    commentStatus.textContent = "Votre commentaire est enregistré sur cet appareil.";
  });

  localComments.addEventListener("click", (event) => {
    const button = event.target.closest("[data-comment-index]");

    if (!button) {
      return;
    }

    const comments = getSavedComments();
    comments.splice(Number(button.dataset.commentIndex), 1);

    if (comments.length) {
      saveComments(comments);
    } else {
      removeSavedCommentsCookie();
    }

    renderSavedComments();
    commentStatus.textContent = "Le commentaire a été supprimé de cet appareil.";
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
