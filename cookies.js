(function () {
  var SITE_ID = "otevru";
  var KEY = "cookie-consent:" + SITE_ID;

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && parsed.necessary === true ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function write(analytics, marketing) {
    var value = {
      necessary: true,
      analytics: !!analytics,
      marketing: !!marketing,
      gdprNotice: true,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: value }));
    return value;
  }

  function clear() {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: null }));
  }

  function hide(el) {
    if (el) el.hidden = true;
  }

  function show(el) {
    if (el) el.hidden = false;
  }

  function mount() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    if (read()) {
      hide(banner);
      return;
    }
    show(banner);

    var simple = document.getElementById("cookie-simple");
    var detail = document.getElementById("cookie-detail");
    var analytics = document.getElementById("cookie-analytics");
    var marketing = document.getElementById("cookie-marketing");

    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cookie]");
      if (!btn) return;
      var action = btn.getAttribute("data-cookie");
      if (action === "accept") {
        write(true, true);
        hide(banner);
      } else if (action === "reject") {
        write(false, false);
        hide(banner);
      } else if (action === "settings") {
        hide(simple);
        show(detail);
      } else if (action === "save") {
        write(analytics && analytics.checked, marketing && marketing.checked);
        hide(banner);
      }
    });
  }

  document.querySelectorAll("[data-cookie-reset]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      clear();
      var banner = document.getElementById("cookie-banner");
      var simple = document.getElementById("cookie-simple");
      var detail = document.getElementById("cookie-detail");
      show(banner);
      show(simple);
      hide(detail);
    });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
