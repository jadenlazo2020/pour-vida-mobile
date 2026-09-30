// Pour Vida Mobile Bar Services — site interactions
(function () {
  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Sticky header shadow
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // Hide the placeholder label on any photo slot whose image actually loads
  document.querySelectorAll(".photo").forEach((el) => {
    const m = (el.getAttribute("style") || "").match(/url\(['"]?(.+?)['"]?\)/);
    if (!m) return;
    const img = new Image();
    img.onload = () => el.classList.add("has-img");
    img.src = m[1];
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // "Inquire for pricing" buttons preselect the package in the form
  const pkgSelect = document.getElementById("package-select");
  document.querySelectorAll("[data-package]").forEach((btn) =>
    btn.addEventListener("click", () => {
      pkgSelect.value = btn.dataset.package;
    })
  );

  // Don't allow past event dates
  const dateInput = document.querySelector('input[name="event_date"]');
  dateInput.min = new Date().toISOString().split("T")[0];

  // Inquiry form (Formspree, submitted via fetch so the visitor stays on the page)
  const form = document.getElementById("inquire-form");
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";

    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "The inquiry form isn't connected yet. Please DM us on Instagram in the meantime!";
      status.classList.add("err");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = "Thank you! We'll be in touch soon. Cheers! 🥂";
      status.classList.add("ok");
    } catch {
      status.textContent = "Something went wrong. Please try again or message us on Instagram.";
      status.classList.add("err");
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Inquiry";
    }
  });
})();
