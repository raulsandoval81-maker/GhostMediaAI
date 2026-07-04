document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ghostCounts");
  if (!el) return;

  const ideas = gmGetIdeas();

  const queue = JSON.parse(localStorage.getItem("ghost-queue") || "[]");
  const schedule = JSON.parse(localStorage.getItem("ghost-schedule") || "[]");
  const posted = JSON.parse(localStorage.getItem("ghost-posted") || "[]");
  const winners = JSON.parse(localStorage.getItem("ghost-winners") || "[]");

  const ideaCount = ideas.filter(i => {
    const status = String(i.status || "").toUpperCase();
    return status === "NEW" || status === "IDEA";
  }).length;

  const queueCount =
    queue.filter(i => String(i.status || "").toUpperCase() === "QUEUED").length;

  const scheduledCount = schedule.length;
  const postedCount = posted.length;
  const winnerCount = winners.length;

  const patternCount = new Set(
    winners.map(i =>
      i.pattern ||
      i.topic ||
      i.product ||
      i.page ||
      "General"
    )
  ).size;

  el.innerHTML = `
    <div class="ghost-counts">
      <span>💡 Ideas: ${ideaCount}</span>
      <span>📦 Queue: ${queueCount}</span>
      <span>📅 Scheduled: ${scheduledCount}</span>
      <span>📣 Posted: ${postedCount}</span>
      <span>🏆 Winners: ${winnerCount}</span>
      <span>🧠 Patterns: ${patternCount}</span>
    </div>
  `;
});