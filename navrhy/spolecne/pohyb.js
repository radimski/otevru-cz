/* Shared, short motion for the proposals: elements with [data-reveal] fade up
   once when they scroll into view. Nothing is hidden without JS, and reduced
   motion shows everything at once (handled in zaklad.css). */
(function () {
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
