document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ghostCounts");
  if (!el) return;

  const safeArray = value =>
    Array.isArray(value) ? value : [];

  const ideas =
    typeof gmGetIdeas === "function"
      ? safeArray(gmGetIdeas())
      : [];

  const queue =
    typeof gmGetQueue === "function"
      ? safeArray(gmGetQueue())
      : [];

  const schedule =
    typeof gmGetSchedule === "function"
      ? safeArray(gmGetSchedule())
      : [];

  const posted =
    typeof gmGetPosted === "function"
      ? safeArray(gmGetPosted())
      : [];

  const winners =
    typeof gmGetWinners === "function"
      ? safeArray(gmGetWinners())
      : [];

  const patterns =
    typeof gmGetPatterns === "function"
      ? safeArray(gmGetPatterns())
      : [];

  const ideaCount = ideas.filter(item => {
    const status =
      String(item.status || "").toUpperCase();

    return (
      status === "NEW" ||
      status === "IDEA" ||
      !status
    );
  }).length;

  const tiles = [
    {
      icon: "💡",
      label: "Ideas",
      value: ideaCount
    },
    {
      icon: "📦",
      label: "Review",
      value: queue.length
    },
    {
      icon: "📅",
      label: "Schedule",
      value: schedule.length
    },
    {
      icon: "📣",
      label: "Published",
      value: posted.length
    },
    {
      icon: "🏆",
      label: "Results",
      value: winners.length
    },
    {
      icon: "🧠",
      label: "Patterns",
      value: patterns.length
    }
  ];

  el.innerHTML = `
    <div class="gm-snapshot-grid">
      ${tiles.map(tile => `
        <div class="gm-snapshot-tile">
          <div class="gm-snapshot-icon">
            ${tile.icon}
          </div>

          <div class="gm-snapshot-copy">
            <strong>${tile.value}</strong>
            <span>${tile.label}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
});
