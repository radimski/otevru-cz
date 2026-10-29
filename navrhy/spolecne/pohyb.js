/* Shared, short motion for the proposals: elements with [data-reveal] fade up
   once when they scroll into view. Nothing is hidden without JS, and reduced
   motion shows everything at once (handled in zaklad.css). */
(function () {
  // Mobile menu toggle
  var btn = document.querySelector(".menu-tlacitko");
  if (btn) {
    var head = btn.closest(".hlavicka");
    btn.addEventListener("click", function () {
      var open = head.classList.toggle("menu-otevreno");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Zavřít" : "Menu";
    });
    head.querySelectorAll(".menu a").forEach(function (a) {
      a.addEventListener("click", function () { head.classList.remove("menu-otevreno"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "Menu"; });
    });
  }
  if (!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach(function (el, i) {
    el.style.transitionDelay = (i % 6) * 60 + "ms";
    io.observe(el);
  });
})();
