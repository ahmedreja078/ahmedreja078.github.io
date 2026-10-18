/* ============================================================
   Ahmed Reja Sk — Portfolio interactions
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  const nav = document.querySelector(".nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active link highlight on scroll ---------- */
  const sections = [...document.querySelectorAll("main section[id]")];
  const linkMap = new Map();
  document.querySelectorAll('.nav__links a[href^="#"]').forEach((a) => {
    linkMap.set(a.getAttribute("href").slice(1), a);
  });

  const setActiveLink = () => {
    const pos = window.scrollY + 120;
    let current = "";
    sections.forEach((s) => {
      if (s.offsetTop <= pos) current = s.id;
    });
    linkMap.forEach((a, id) => a.classList.toggle("active", id === current));
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Typewriter subtitle ---------- */
  const typedEl = document.getElementById("typed");
  const phrases = [
    "Data Scientist & ML Engineer",
    "Deep Learning Research Intern",
    "GenAI & LLM Enthusiast",
    "M.S. Data Science (Pursuing)",
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
    } else {
      let p = 0;
      let i = 0;
      let deleting = false;

      const tick = () => {
        const phrase = phrases[p];
        if (!deleting) {
          i++;
          typedEl.textContent = phrase.slice(0, i);
          if (i === phrase.length) {
            deleting = true;
            return setTimeout(tick, 1900);
          }
          return setTimeout(tick, 68);
        }
        i--;
        typedEl.textContent = phrase.slice(0, i);
        if (i === 0) {
          deleting = false;
          p = (p + 1) % phrases.length;
          return setTimeout(tick, 320);
        }
        setTimeout(tick, 32);
      };
      tick();
    }
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll(
    ".section__title, .mini-card, .skill-group, .timeline__item, .project-card, .achievement-card, .contact__card, .about__text, .contact__lead"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.transitionDelay = `${Math.min(idx * 60, 240)}ms`;
            el.classList.add("visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Neural network canvas ---------- */
  const canvas = document.getElementById("neural-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let nodes = [];
    let raf = null;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((width * height) / 26000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 0) {
          n.x += (dx / dist) * 1.1;
          n.y += (dy / dist) * 1.1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(77, 216, 255, ${0.16 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = "rgba(124, 92, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener(
      "mousemove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true }
    );
    document.addEventListener("mouseleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    resize();
    draw();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    });
  }
})();
