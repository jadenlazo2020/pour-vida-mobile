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

  // Signature Sips: the menu card is a tab list; picking a drink redraws it on the stage
  const tabs = [...document.querySelectorAll('.sips-list [role="tab"]')];
  const stage = document.getElementById("sip-stage");
  const drinks = {};
  document.getElementById("drink-data").content.querySelectorAll("[data-drink]").forEach((d) => {
    drinks[d.dataset.drink] = d.dataset;
  });
  const slot = (name) => stage.querySelector(`[data-slot="${name}"]`);
  const selectDrink = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tab.focus();
    const d = drinks[tab.dataset.drink];
    stage.setAttribute("aria-labelledby", tab.id);
    // Replacing the svg restarts its draw-in animation
    slot("art").innerHTML = `<svg viewBox="0 0 200 220" class="line-art draw"><use href="#d-${d.drink}"/></svg>`;
    slot("name").textContent = d.name;
    slot("desc").textContent = d.desc;
    slot("good").textContent = d.good;
    const info = stage.querySelector(".sip-info");
    info.classList.remove("swap");
    void info.offsetWidth;
    info.classList.add("swap");
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectDrink(tab, false));
    tab.addEventListener("keydown", (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      let next = null;
      if (e.key in keys) next = tabs[(i + keys[e.key] + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      selectDrink(next, true);
    });
  });

  // Packages: level of service tabs show one level at a time
  const lvlTabs = [...document.querySelectorAll('.level-tabs [role="tab"]')];
  const pickLevel = (tab, focus) => {
    lvlTabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  lvlTabs.forEach((tab, i) => {
    tab.addEventListener("click", () => pickLevel(tab, false));
    tab.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      let next = null;
      if (step) next = lvlTabs[(i + step + lvlTabs.length) % lvlTabs.length];
      else if (e.key === "Home") next = lvlTabs[0];
      else if (e.key === "End") next = lvlTabs[lvlTabs.length - 1];
      if (!next) return;
      e.preventDefault();
      pickLevel(next, true);
    });
  });

  // Slideshow: fade to the next photo every 3 seconds. Pauses on hover or
  // keyboard focus, and only advances on its own when reduced motion is off.
  const show = document.querySelector(".slideshow");
  if (show) {
    const slides = [...show.querySelectorAll(".slide")];
    const dots = [...show.querySelectorAll(".slide-dots button")];
    let current = 0;
    let timer = null;
    const goTo = (n) => {
      current = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle("is-active", k === current);
        if (k === current) s.removeAttribute("aria-hidden");
        else s.setAttribute("aria-hidden", "true");
      });
      dots.forEach((d, k) => (k === current ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));
    };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      stop();
      if (!still.matches && !document.hidden) timer = setInterval(() => goTo(current + 1), 3000);
    };
    dots.forEach((d, k) => d.addEventListener("click", () => { goTo(k); start(); }));
    show.addEventListener("mouseenter", stop);
    show.addEventListener("mouseleave", start);
    show.addEventListener("focusin", stop);
    show.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", start);
    start();
  }

  // No past event dates
  const dateInput = document.querySelector('input[name="event_date"]');
  dateInput.min = new Date().toISOString().split("T")[0];

  // Inquiry form: validate, then send through Web3Forms without leaving the page
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

    const data = new FormData(form);
    const subject = `Event inquiry: ${data.get("event_type")} on ${data.get("event_date")}`;

    // No access key yet: open the visitor's email app with the inquiry filled in
    if (data.get("access_key") === "YOUR_ACCESS_KEY") {
      const labels = {
        name: "Name", email: "Email", phone: "Phone", event_date: "Event date", event_type: "Event type",
        guest_count: "Guest count", location: "City or venue", package: "Package", level: "Level", message: "Notes",
      };
      const lines = Object.entries(labels)
        .filter(([key]) => data.get(key))
        .map(([key, label]) => `${label}: ${data.get(key)}`);
      window.location.href = `mailto:angalina62604@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      say("Your email app should open with your inquiry filled in. Press send there to reach us.", "ok");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      data.set("subject", subject);
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || res.status);
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
