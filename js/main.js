// Pour Vida Mobile Bar Services: site interactions
(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Header hairline once the page scrolls
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setNav = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); }
  });

  // Package buttons preselect that package in the form
  const pkgSelect = document.getElementById("package-select");
  document.querySelectorAll("[data-package]").forEach((btn) =>
    btn.addEventListener("click", () => { pkgSelect.value = btn.dataset.package; })
  );

  // No past event dates
  const dateInput = document.querySelector('input[name="event_date"]');
  dateInput.min = new Date().toISOString().split("T")[0];

  // Inquiry form: validate, then submit to Formspree without leaving the page
  const form = document.getElementById("inquire-form");
  const status = form.querySelector(".form-status");
  const say = (msg, kind) => { status.textContent = msg; status.className = "form-status " + kind; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));

    const invalid = [...form.querySelectorAll("[required]")].filter((el) => !el.checkValidity());
    if (invalid.length) {
      invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));
      invalid[0].focus();
      say("Please fill in your name, a valid email, the event date and the event type.", "err");
      return;
    }

    if (form.action.includes("YOUR_FORM_ID")) {
      say("The form isn't connected yet. Send us a DM on Instagram at @pourvida_mobilebar for now.", "err");
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
      if (!res.ok) throw new Error(res.status);
      form.reset();
      say("Inquiry sent. We'll reply within a couple of days with availability and a quote.", "ok");
    } catch {
      say("Your inquiry didn't go through. Check your connection and try again, or DM us on Instagram.", "err");
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Inquiry";
    }
  });
})();
