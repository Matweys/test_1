(function () {
  "use strict";

  var CONSENT_KEY = "cts_consent_v1";
  var banner = document.getElementById("cookie-banner");

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setConsent() {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ timestamp: Date.now(), essential: true })
    );
  }

  function initConsent() {
    if (!banner) return;
    if (!getConsent()) {
      requestAnimationFrame(function () {
        banner.classList.add("is-visible");
      });
    }

    var ok = document.getElementById("cookie-accept");
    if (ok) {
      ok.addEventListener("click", function () {
        setConsent();
        banner.classList.remove("is-visible");
      });
    }
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initYear() {
    var el = document.getElementById("current-year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("contact-thanks");
      if (note) {
        note.hidden = false;
        form.reset();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initConsent();
    initNav();
    initYear();
    initContactForm();
  });
})();
