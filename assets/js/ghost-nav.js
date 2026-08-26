document.addEventListener("DOMContentLoaded", () => {
  const navTarget = document.getElementById("ghostNav");
  if (!navTarget) return;

  const currentPath = window.location.pathname;

  const mainLinks = [
    { label: "Dashboard", href: "/dashboard/headquarters.html" },
    { label: "Create", href: "/dashboard/ideas.html" },
    { label: "Review", href: "/dashboard/queue.html" },
    { label: "Schedule", href: "/dashboard/schedule.html" },
    { label: "Published", href: "/dashboard/published.html" },
    { label: "Results", href: "/dashboard/winners.html" }
  ];

  const advancedLinks = [
    { label: "Research Notes", href: "/public/scout/" },
    { label: "Create Variations", href: "/dashboard/factory.html" },
    { label: "Create Images", href: "/dashboard/image-generator.html" },
    { label: "What’s Working", href: "/dashboard/patterns.html" },
    { label: "Recommendations", href: "/dashboard/opportunities.html" },
    { label: "Performance", href: "/dashboard/analytics.html" }
  ];

  function linkMarkup(item) {
    const active =
      currentPath === item.href ||
      currentPath.endsWith(item.href);

    return `
      <a
        class="gm-menu-link ${active ? "active" : ""}"
        href="${item.href}"
      >
        ${item.label}
      </a>
    `;
  }

  navTarget.innerHTML = `
    <div class="gm-nav-shell">
      <button
        id="gmMenuButton"
        class="gm-menu-button"
        type="button"
        aria-label="Open Ghost Media navigation"
        aria-expanded="false"
      >
        <span class="gm-menu-icon">☰</span>
      </button>

      <div
        id="gmNavBackdrop"
        class="gm-nav-backdrop"
      ></div>

      <aside
        id="gmNavDrawer"
        class="gm-nav-drawer"
        aria-hidden="true"
      >
        <div class="gm-drawer-header">
          <strong>👻 Ghost Media</strong>

          <button
            id="gmMenuClose"
            class="gm-menu-close"
            type="button"
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <nav class="gm-menu-links">
          ${mainLinks.map(linkMarkup).join("")}
        </nav>

        <details class="gm-advanced-menu">
          <summary>Advanced Tools</summary>

          <div class="gm-advanced-links">
            ${advancedLinks.map(linkMarkup).join("")}
          </div>
        </details>
      </aside>
    </div>
  `;

  const button = document.getElementById("gmMenuButton");
  const close = document.getElementById("gmMenuClose");
  const drawer = document.getElementById("gmNavDrawer");
  const backdrop = document.getElementById("gmNavBackdrop");

  const heading =
    document.querySelector(".wrap h1, .container h1, main h1, body h1");

  if (heading) {
    const headerRow = document.createElement("div");
    headerRow.className = "gm-heading-row";

    heading.parentNode.insertBefore(headerRow, heading);

    headerRow.appendChild(heading);
    headerRow.appendChild(navTarget);
  }

  function openMenu() {
    drawer.classList.add("open");
    backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    document.body.classList.add("gm-menu-open");
  }

  function closeMenu() {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    document.body.classList.remove("gm-menu-open");
  }

  button.addEventListener("click", openMenu);
  close.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
});
