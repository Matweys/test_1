(function () {
    "use strict";

    var toggle = document.querySelector(".nav-toggle");
    var mobileNav = document.getElementById("mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            var open = mobileNav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var year = document.getElementById("year");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    var KEY = "dl_notice_vue";
    var note = document.getElementById("cookie-note");
    var okBtn = document.getElementById("cookie-note-ok");

    function readStore(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function writeStore(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            return;
        }
    }

    if (note && okBtn) {
        if (readStore(KEY) !== "1") {
            note.classList.add("visible");
        }
        okBtn.addEventListener("click", function () {
            note.classList.remove("visible");
            writeStore(KEY, "1");
        });
    }

    var printBtn = document.getElementById("print-btn");
    if (printBtn) {
        printBtn.addEventListener("click", function () {
            window.print();
        });
    }

    var form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var name = (document.getElementById("cf-name") || {}).value || "";
            var subject = (document.getElementById("cf-subject") || {}).value || "";
            var message = (document.getElementById("cf-message") || {}).value || "";
            var to = form.getAttribute("data-mailto") || "";

            var body = message + "\n\n— " + name;
            var href = "mailto:" + to +
                "?subject=" + encodeURIComponent(subject || "Message depuis le site") +
                "&body=" + encodeURIComponent(body);

            window.location.href = href;
        });
    }

    var tests = document.querySelectorAll("[data-test]");
    Array.prototype.forEach.call(tests, function (item) {
        var answer = item.querySelector(".st-answer");
        var buttons = item.querySelectorAll(".st-btn");

        Array.prototype.forEach.call(buttons, function (btn) {
            btn.addEventListener("click", function () {
                Array.prototype.forEach.call(buttons, function (b) {
                    b.classList.remove("picked");
                    b.setAttribute("aria-pressed", "false");
                });
                btn.classList.add("picked");
                btn.setAttribute("aria-pressed", "true");
                if (answer) {
                    answer.hidden = false;
                }
            });
        });
    });
})();
