"use strict";

(function () {
  var form = document.getElementById("contactForm");
  var status = document.getElementById("contactStatus");
  var submit = document.getElementById("contactSubmit");

  if (!form || !status || !submit) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    submit.disabled = true;
    status.classList.remove("is-error");
    status.textContent = "Envoi en cours…";

    fetch("send.php", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        return response.json().then(function (json) {
          return { ok: response.ok, json: json };
        });
      })
      .then(function (out) {
        if (!out.ok || !out.json || !out.json.ok) {
          throw new Error("send_failed");
        }

        status.textContent = "Votre message a bien été envoyé.";
        form.reset();
        submit.disabled = false;
      })
      .catch(function () {
        submit.disabled = false;
        status.classList.add("is-error");
        status.textContent = "Le message n’a pas pu être envoyé. Écrivez-nous à Matthias@bondeskovgaardaps.com.";
      });
  });
})();
