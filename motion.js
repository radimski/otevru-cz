/* Homepage motion (GSAP + ScrollTrigger from vendor/).
   Decorative only: every element is visible without this file, the phone
   buttons are never animated, and prefers-reduced-motion skips it all. */
(function () {
  var root = document.documentElement;
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("otevru-motion");

  // Headline lines slide up out of their own mask.
  gsap.from(".otevru-hero-title .otevru-line > span", {
    yPercent: 110,
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.09,
  });
  gsap.from(".otevru-hero-lede", {
    y: 16,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    delay: 0.35,
  });

  // Van-livery stripe drifts with the scroll.
  gsap.to(".otevru-livery", {
    backgroundPosition: "-640px 0",
    ease: "none",
    scrollTrigger: {
      trigger: ".otevru-livery",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  // "Co dělat hned teď": the line draws across and lights the steps in turn.
  var steps = gsap.utils.toArray(".otevru-now .otevru-panic-step");
  if (steps.length) {
    gsap.to(".otevru-track i", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".otevru-now",
        start: "top 70%",
        end: "center 45%",
        scrub: 0.4,
        onUpdate: function (st) {
          steps.forEach(function (step, i) {
            step.classList.toggle("is-lit", st.progress >= i / steps.length + 0.02);
          });
        },
      },
    });
  }

  // Service rows and how-it-works steps arrive once.
  [".otevru-service", ".otevru-how-step"].forEach(function (sel) {
    var items = gsap.utils.toArray(sel);
    if (!items.length) return;
    gsap.from(items, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.07,
      scrollTrigger: { trigger: items[0].parentNode, start: "top 82%" },
    });
  });
})();
