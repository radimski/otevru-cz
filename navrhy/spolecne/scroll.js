/* One short scroll effect per proposal, ideas from the Agntix template
   (ThemeForest): V1 service names fill left to right, V2 the hero card shrinks
   away, V3 the about text darkens word by word, V4 a band moves with the scroll.
   No pins, transform/opacity/background-position only, nothing hidden without JS,
   prefers-reduced-motion skips it all. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var body = document.body;

  if (body.classList.contains("navrh-v1")) {
    body.classList.add("efekt-vypln");
    gsap.utils.toArray(".sluzba h3").forEach(function (h) {
      gsap.fromTo(h, { backgroundPositionX: "100%" }, {
        backgroundPositionX: "0%", ease: "none",
        scrollTrigger: { trigger: h, start: "top 88%", end: "top 52%", scrub: true },
      });
    });
  }

  if (body.classList.contains("navrh-v2")) {
    gsap.to(".karta", {
      scale: 0.93, yPercent: 4, ease: "none",
      scrollTrigger: { start: 0, end: "+=700", scrub: true },
    });
    gsap.to(".karta .uvod-obraz", {
      yPercent: -10, ease: "none",
      scrollTrigger: { start: 0, end: "+=700", scrub: true },
    });
  }

  if (body.classList.contains("navrh-v3")) {
    var p = document.querySelector(".onas-text");
    if (p) {
      // Wrap words but keep the link intact.
      p.childNodes.forEach(function (n) {
        if (n.nodeType !== 3) { n.classList && n.classList.add("slovo"); return; }
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement("span"); s.className = "slovo"; s.textContent = part; frag.appendChild(s);
        });
        p.replaceChild(frag, n);
      });
      gsap.fromTo(p.querySelectorAll(".slovo"), { opacity: 0.18 }, {
        opacity: 1, stagger: 0.08, ease: "none",
        scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true },
      });
    }
  }

  if (body.classList.contains("navrh-v4")) {
    gsap.fromTo(".pas-jizda", { xPercent: 0 }, {
      xPercent: -35, ease: "none",
      scrollTrigger: { trigger: ".pas", start: "top bottom", end: "bottom top", scrub: true },
    });
  }
})();
