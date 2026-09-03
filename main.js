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
    var btns = document.querySelectorAll("[data-nav-toggle]");
    var panel = document.getElementById("otevru-mobile-nav");
    if (!btns.length || !panel) return;

    function setOpen(open) {
      if (open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
      btns.forEach(function (btn) {
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.textContent = open ? "Zavřít" : "Menu";
      });
    }

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setOpen(panel.hasAttribute("hidden"));
      });
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function bindLockDemo(stage) {
    if (!stage) return;

    var key = stage.querySelector(".lock-key");
    var keypins = stage.querySelectorAll(".lock-keypin-col");
    var drivers = stage.querySelectorAll(".lock-driver-col");
    var springs = stage.querySelectorAll(".lock-spring");
    var stacks = stage.querySelectorAll(".lock-pin-stack");
    var endKey = stage.querySelector(".lock-end-key");
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var KEY_OUT = -220;
    var PIN_X = [150, 186, 222, 258, 294];
    /* Seated tip Y of each stavítko (matches key cuts when tx = 0). */
    var PIN_TIP_Y = [125, 133, 137, 129, 121];
    /* Top profile of the key blade (local key coords) — pins ride this. */
    var KEY_TOP = [
      [10, 104],
      [42, 104],
      [42, 112],
      [88, 112],
      [88, 113],
      [139, 113],
      [150, 125],
      [161, 113],
      [168, 113],
      [175, 113],
      [186, 133],
      [197, 113],
      [204, 113],
      [211, 113],
      [222, 137],
      [233, 113],
      [240, 113],
      [247, 113],
      [258, 129],
      [269, 113],
      [276, 113],
      [283, 113],
      [294, 121],
      [305, 113],
      [326, 113],
      [334, 120],
    ];
    var CYCLE_MS = 10000;
    var DRIVER_TUCK = 3;
    var SPRING_TOP = 32;
    var DRIVER_TOP0 = 81;
    var SPRING_NAT = DRIVER_TOP0 - SPRING_TOP;

    function smoothstep(t) {
      t = Math.max(0, Math.min(1, t));
      return t * t * (3 - 2 * t);
    }

    function keyTx(p) {
      if (p < 0.03) return KEY_OUT;
      if (p < 0.4) return KEY_OUT + (0 - KEY_OUT) * ((p - 0.03) / 0.37);
      if (p < 0.78) return 0;
      if (p < 0.96) return 0 + (KEY_OUT - 0) * ((p - 0.78) / 0.18);
      return KEY_OUT;
    }

    function maxLift(i) {
      var el = stacks[i] || keypins[i] || drivers[i];
      if (!el) return 12;
      var v = el.style.getPropertyValue("--lift");
      if (!v) v = getComputedStyle(el).getPropertyValue("--lift");
      var n = parseFloat(v);
      return isFinite(n) ? n : 12;
    }

    function keySurfaceY(localX) {
      var pts = KEY_TOP;
      var n = pts.length;
      if (n < 2) return null;
      if (localX < pts[0][0] || localX > pts[n - 1][0]) return null;
      for (var i = 0; i < n - 1; i++) {
        var x0 = pts[i][0];
        var y0 = pts[i][1];
        var x1 = pts[i + 1][0];
        var y1 = pts[i + 1][1];
        var lo = Math.min(x0, x1);
        var hi = Math.max(x0, x1);
        if (localX < lo || localX > hi) continue;
        if (hi === lo) return Math.min(y0, y1);
        var t = (localX - x0) / (x1 - x0);
        return y0 + (y1 - y0) * t;
      }
      return null;
    }

    /**
     * Pin tip follows the key bitting at this chamber’s x as the key slides.
     * --lift is the hanging rest; seated (tx = 0) is still translateY(0).
     */
    function pinDy(i, tx) {
      var rest = maxLift(i);
      var surf = keySurfaceY(PIN_X[i] - tx);
      if (surf == null) return rest;
      var dy = surf - PIN_TIP_Y[i];
      if (dy > rest) dy = rest;
      return dy;
    }

    function springScale(dLift) {
      var gap = DRIVER_TOP0 + dLift - SPRING_TOP;
      var s = gap / SPRING_NAT;
      if (s < 0.35) s = 0.35;
      if (s > 1.45) s = 1.45;
      return s;
    }

    function applyStack(i, dy, turnT, relaxing) {
      if (keypins[i]) {
        keypins[i].classList.toggle("is-relaxing", relaxing);
        keypins[i].style.transform = "translateY(" + dy + "px)";
      }
      /* Kolíky follow the stack. Once seated, they stay in the shell on the plug OD. */
      var dLift = dy;
      if (Math.abs(dy) < 0.75) dLift = -DRIVER_TUCK * turnT;
      if (drivers[i]) {
        drivers[i].classList.toggle("is-relaxing", relaxing);
        drivers[i].style.transform = "translateY(" + dLift + "px)";
      }
      if (springs[i]) {
        springs[i].classList.toggle("is-relaxing", relaxing);
        springs[i].style.transform = "scaleY(" + springScale(dLift) + ")";
      }
    }

    function applyPose(tx, turnT, relaxing) {
      if (key) key.style.transform = "translateX(" + tx + "px)";
      if (endKey) {
        var inAmt = Math.max(0, Math.min(1, (tx - KEY_OUT) / (0 - KEY_OUT)));
        endKey.style.opacity = String(inAmt);
      }
      for (var i = 0; i < keypins.length; i++) {
        applyStack(i, pinDy(i, tx), turnT, relaxing);
      }
    }

    function applyFrame(p) {
      var tx = keyTx(p);
      var turnT = 0;
      if (p >= 0.5 && p < 0.58) turnT = smoothstep((p - 0.5) / 0.08);
      else if (p >= 0.58 && p <= 0.7) turnT = 1;
      else if (p > 0.7 && p < 0.78) turnT = 1 - smoothstep((p - 0.7) / 0.08);
      applyPose(tx, turnT, p >= 0.78);
    }

    function resetIdle() {
      applyPose(KEY_OUT, 0, false);
    }

    if (reduce) {
      stage.classList.add("is-playing", "is-js-pins");
      applyPose(0, 1, false);
      return;
    }

    var started = false;
    var timer = null;

    function startCycle() {
      if (started) return;
      started = true;
      stage.classList.add("is-playing", "is-js-pins");
      var t0 = performance.now();

      function tick(now) {
        var p = ((now - t0) % CYCLE_MS) / CYCLE_MS;
        applyFrame(p);
        timer = requestAnimationFrame(tick);
      }
      timer = requestAnimationFrame(tick);
    }

    function stopCycle() {
      started = false;
      stage.classList.remove("is-playing");
      if (timer) cancelAnimationFrame(timer);
      timer = null;
      resetIdle();
    }

    resetIdle();

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) startCycle();
            else stopCycle();
          });
        },
        { threshold: 0.35 }
      );
      io.observe(stage);
    } else {
      startCycle();
    }
  }

  ready(function () {
    paint();
    bindNav();
    bindLockDemo(document.querySelector('[data-lock-demo="hero"]'));
    setInterval(paint, 60000);
  });
})();
