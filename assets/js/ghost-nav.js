document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("ghostNav");
  if (!nav) return;

  const path = window.location.pathname;
  const backRoutes = {
    "/dashboard/ai-inbox.html": ["/dashboard/headquarters.html", "Dashboard"],
    "/public/scout/": ["/dashboard/headquarters.html", "Dashboard"],
    "/public/scout/index.html": ["/dashboard/headquarters.html", "Dashboard"],
    "/dashboard/ideas.html": ["/dashboard/headquarters.html", "Dashboard"],
    "/dashboard/content.html": ["/dashboard/ideas.html", "Content Ideas"],
    "/dashboard/briefs.html": ["/dashboard/opportunities.html", "Recommendations"],
    "/dashboard/factory.html": ["/dashboard/headquarters.html", "Dashboard"],
    "/carousel/": ["/dashboard/factory.html", "Create Variations"],
    "/carousel/index.html": ["/dashboard/factory.html", "Create Variations"],
    "/dashboard/image-generator.html": ["/dashboard/headquarters.html", "Dashboard"],
    "/dashboard/photo.html": ["/dashboard/ideas.html", "Create"],
    "/dashboard/video.html": ["/dashboard/ideas.html", "Create"],
    "/dashboard/queue.html": ["/dashboard/headquarters.html", "Dashboard"],
    "/dashboard/schedule.html": ["/dashboard/queue.html", "Review Content"],
    "/dashboard/published.html": ["/dashboard/schedule.html", "Schedule Content"],
    "/dashboard/winners.html": ["/dashboard/published.html", "Published"],
    "/dashboard/patterns.html": ["/dashboard/winners.html", "Results"],
    "/dashboard/opportunities.html": ["/dashboard/winners.html", "Results"],
    "/dashboard/analytics.html": ["/dashboard/winners.html", "Results"]
  };
  const back = backRoutes[path] || ["/dashboard/headquarters.html", "Dashboard"];

  const primaryLinks = [
    ["/dashboard/headquarters.html", "Dashboard", "dashboard"],
    ["/dashboard/ideas.html", "Create", "create"],
    ["/dashboard/queue.html", "Review", "review"],
    ["/dashboard/schedule.html", "Schedule", "schedule"],
    ["/dashboard/published.html", "Published", "published"],
    ["/dashboard/winners.html", "Results", "results"]
  ];

  const activeSection =
    path.includes("queue") ? "review" :
    path.includes("schedule") ? "schedule" :
    path.includes("published") ? "published" :
    path.includes("winners") || path.includes("patterns") ||
      path.includes("opportunities") || path.includes("analytics") ? "results" :
    path.includes("ideas") || path.includes("content") || path.includes("ai-inbox") ||
      path.includes("factory") || path.includes("carousel") || path.includes("image-generator") ||
      path.includes("photo") || path.includes("video") ? "create" :
    path.includes("headquarters") ? "dashboard" : "";

  nav.innerHTML = `
    <div class="ghost-nav-context">
      <a href="${back[0]}">← Back to ${back[1]}</a>
    </div>
    <div class="ghost-shell-nav" aria-label="Primary navigation">
      ${primaryLinks.map(([href, label, section]) => `
        <a href="${href}" ${activeSection === section ? 'aria-current="page"' : ""}>${label}</a>
      `).join("")}
      <details class="ghost-advanced-menu">
        <summary>Advanced Tools</summary>
        <div class="ghost-advanced-links">
          <a href="/public/scout/">Research Notes</a>
          <a href="/dashboard/factory.html">Create Variations</a>
          <a href="/dashboard/image-generator.html">Create Images</a>
          <a href="/dashboard/patterns.html">What’s Working</a>
          <a href="/dashboard/opportunities.html">Recommendations</a>
          <a href="/dashboard/analytics.html">Performance</a>
        </div>
      </details>
    </div>
  `;
});
