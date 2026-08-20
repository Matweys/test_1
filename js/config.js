const SITE_CONFIG = {
  company: {
    name: "Clouds Taking Shape ApS",
    legalForm: "ApS",
    cvr: "41405244",
    address: "Nydamsvej 17, 8362 Hørning, Denmark",
    phone: "+45 10 25 88 89 08",
    email: "helle@cloudstakingshape.com",
    website: "cloudstakingshape.com",
    capital: "kr. 240.000",
  },
  dpo: {
    name: "Helle Grove",
    email: "helle@cloudstakingshape.com",
  },
  director: {
    name: "Helle Grove Stentoft",
  },
  host: {
    name: "OVH SAS",
    address: "2 Rue Kellermann, 59100 Roubaix, France",
  },
  dates: {
    cookiesPolicy: "20 août 2026",
    privacyPolicy: "20 août 2026",
    terms: "20 août 2026",
    legal: "20 août 2026",
  },
};

(function () {
  function applyConfig() {
    document.querySelectorAll("[data-cfg]").forEach(function (el) {
      var path = el.getAttribute("data-cfg").split(".");
      var value = SITE_CONFIG;
      for (var i = 0; i < path.length; i++) {
        if (value && typeof value === "object" && path[i] in value) {
          value = value[path[i]];
        } else {
          value = "";
          break;
        }
      }
      if (typeof value !== "string") return;
      if (el.tagName === "A" && el.getAttribute("data-cfg-type") === "href") {
        var last = path[path.length - 1];
        if (last === "email") el.href = "mailto:" + value;
        else if (last === "phone") el.href = "tel:" + value.replace(/\s+/g, "");
        else el.href = value;
      } else {
        el.textContent = value;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyConfig);
  } else {
    applyConfig();
  }
})();
