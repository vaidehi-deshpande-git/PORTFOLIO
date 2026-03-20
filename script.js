// Theme handling
const THEME_KEY = "portfolio-theme";

function applyTheme(theme) {
  const doc = document.documentElement;
  const body = document.body;

  if (theme === "dark") {
    doc.setAttribute("data-theme", "dark");
    body.setAttribute("data-theme", "dark");
  } else {
    doc.setAttribute("data-theme", "light");
    body.setAttribute("data-theme", "light");
  }
}

function detectPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

document.addEventListener("DOMContentLoaded", () => {
  // Apply initial theme
  // applyTheme(detectPreferredTheme());

  // Theme toggle button
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      // applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // Dynamic year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const targetEl = targetId && document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
      const elementPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 12;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });

  // Intersection Observer for scroll animations and skill bars
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("skill-bar")) {
            const bar = entry.target.querySelector(".progress-bar");
            if (bar && !bar.dataset.animated) {
              const progress = bar.dataset.progress || 0;
              bar.style.width = progress + "%";
              bar.dataset.animated = "true";
            }
          }
        }
      });
    },
    {
      threshold: 0.16,
    },
  );

  document.querySelectorAll(".fade-in-up, .skill-bar").forEach((el) => {
    observer.observe(el);
  });

  // Simple counter animation for highlights
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count || "0", 10);
        let current = 0;
        const duration = 900;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          current = Math.floor(progress * target);
          el.textContent = current.toString();
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target.toString();
          }
        }

        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((c) => counterObserver.observe(c));

  // Contact form demo validation
  const contactForm = document.getElementById("contactForm");
  const statusEl = document.getElementById("contactStatus");
  const submitBtn = document.getElementById("contactSubmit");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      contactForm.classList.add("was-validated");

      if (!contactForm.checkValidity()) {
        if (statusEl) {
          statusEl.textContent = "Please fill all required fields correctly.";
          statusEl.style.color = "#f97316";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = "Sending (demo)...";
        statusEl.style.color = "";
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.textContent =
            "Message sent! (This is a demo front-end only form.)";
          statusEl.style.color = "#22c55e";
        }
        if (submitBtn) submitBtn.disabled = false;
        contactForm.reset();
        contactForm.classList.remove("was-validated");
      }, 900);
    });
  }
});
