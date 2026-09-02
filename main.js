(function () {
  var SCHEDULE = {
    timezone: "Europe/Prague",
    week: [
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
      { open: "07:00", close: "18:00" },
    ],
  };

  function parseTime(value) {
    var parts = value.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  }

  function formatTime(value) {
    var parts = value.split(":").map(Number);
    return parts[0] + ":" + String(parts[1]).padStart(2, "0");
  }

  function pragueClock(date) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SCHEDULE.timezone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    var get = function (type) {
      var hit = parts.find(function (p) {
        return p.type === type;
      });
      return hit ? hit.value : "";
    };
    var dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: dayMap[get("weekday")] || 0,
      minutes: parseTime(get("hour") + ":" + get("minute")),
    };
  }

  function evaluate(now) {
    var clock = pragueClock(now || new Date());
    var period = SCHEDULE.week[clock.day];
    if (!period) {
      return { isOpen: false, label: "Zavřeno", detail: "", ariaLabel: "Právě zavřeno" };
    }
    var openM = parseTime(period.open);
    var closeM = parseTime(period.close);
    if (clock.minutes >= openM && clock.minutes < closeM) {
      return {
        isOpen: true,
        label: "Otevřeno",
        detail: "Do " + formatTime(period.close),
        ariaLabel: "Právě otevřeno, zavírá v " + formatTime(period.close),
      };
    }
    if (clock.minutes < openM) {
      return {
        isOpen: false,
        label: "Zavřeno",
        detail: "Otevírá v " + formatTime(period.open),
        ariaLabel: "Právě zavřeno, dnes otevírá v " + formatTime(period.open),
      };
    }
    return {
      isOpen: false,
      label: "Zavřeno",
      detail: "Otevírá zítra " + formatTime(period.open),
      ariaLabel: "Právě zavřeno, zítra otevírá v " + formatTime(period.open),
    };
  }

  function paint() {
    var status = evaluate();
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      var dot = el.querySelector(".open-status-dot");
      var label = el.querySelector(".open-status-label");
      var detail = el.querySelector(".open-status-detail");
      if (dot) {
        dot.classList.toggle("is-open", status.isOpen);
        dot.classList.toggle("is-closed", !status.isOpen);
      }
      if (label) label.textContent = status.label;
      if (detail) detail.textContent = status.detail;
      el.setAttribute("aria-label", status.ariaLabel);
    });
  }

  function bindNav() {
    var btn = document.querySelector("[data-nav-toggle]");
    var panel = document.getElementById("otevru-mobile-nav");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("hidden") === false;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    paint();
    bindNav();
    setInterval(paint, 60000);
  });
})();
