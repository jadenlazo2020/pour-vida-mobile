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

  // Click plus arrow/Home/End keys (wrapping) for a list of tabs; onPick(tab, focus) does the selecting
  const initTablist = (tabs, onPick) => {
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => onPick(tab, false));
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        let next = null;
        if (step) next = tabs[(i + step + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (!next) return;
        e.preventDefault();
        onPick(next, true);
      });
    });
  };

  // Event ticker: two aria-hidden copies of the list fill the scrolling loop
  const bandList = document.querySelector(".band-list");
  for (let n = 0; n < 2; n++) {
    const copy = bandList.cloneNode(true);
    copy.removeAttribute("aria-label");
    copy.setAttribute("aria-hidden", "true");
    bandList.parentNode.appendChild(copy);
  }

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
  initTablist(tabs, selectDrink);

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
  initTablist(lvlTabs, pickLevel);

  // Slideshow: fade to the next photo every 3 seconds. Pauses on hover or
  // keyboard focus, and only advances on its own when reduced motion is off.
  const show = document.querySelector(".slideshow");
  if (show) {
    const slides = [...show.querySelectorAll(".slide")];
    const dots = [...show.querySelectorAll(".slide-dots button")];
    let current = 0;
    let timer = null;
    let hovered = false;
    let focused = false;
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
      if (!still.matches && !document.hidden && !hovered && !focused) timer = setInterval(() => goTo(current + 1), 3000);
    };
    dots.forEach((d, k) => d.addEventListener("click", () => { goTo(k); start(); }));
    // Mouse only: touch taps fire a pointerenter with no matching leave. Focus pauses only for keyboard focus.
    show.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = true; stop(); } });
    show.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = false; start(); } });
    show.addEventListener("focusin", (e) => { focused = e.target.matches(":focus-visible"); if (focused) stop(); });
    show.addEventListener("focusout", () => { focused = false; start(); });
    document.addEventListener("visibilitychange", start);
    start();
  }

  // No past event dates
  const dateInput = document.querySelector('input[name="event_date"]');
  const now = new Date();
  dateInput.min = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, "0")).join("-");

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
      say(
        invalid[0].validity.rangeUnderflow
          ? "Pick today's date or a later one for your event."
          : "Please fill in your name, a valid email, the event date and the event type.",
        "err"
      );
      return;
    }

    const data = new FormData(form);
    const subject = `Event inquiry: ${data.get("event_type")} on ${data.get("event_date")}`;

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
