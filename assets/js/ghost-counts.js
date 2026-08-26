document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ghostCounts");
  if (!el) return;

  const ideas = gmGetIdeas();

  const queue = gmGetQueue();
  const schedule = gmGetSchedule();
  const posted = gmGetPosted();
  const winners = gmGetWinners();

  const ideaCount = ideas.filter(i => {
    const status = String(i.status || "").toUpperCase();
    return status === "NEW" || status === "IDEA";
  }).length;

  const queueCount =
    queue.filter(i => String(i.status || "").toUpperCase() === "QUEUED").length;

  const scheduledCount = schedule.length;
  const postedCount = posted.length;
  const winnerCount = winners.length;

  const patternCount = gmGetPatterns().length;


el.innerHTML = `
  <nav class="ghost-counts">

    <a href="/dashboard/ideas.html" title="Ideas">
      💡${ideaCount}
    </a>

    <a href="/dashboard/queue.html" title="Review">
      📦${queueCount}
    </a>

    <a href="/dashboard/schedule.html" title="Schedule">
      📅${scheduledCount}
    </a>

    <a href="/dashboard/published.html" title="Published">
      📣${postedCount}
    </a>

    <a href="/dashboard/winners.html" title="Results">
      🏆${winnerCount}
    </a>

    <a href="/dashboard/patterns.html" title="What’s Working">
      🧠${patternCount}
    </a>

  </nav>
`;

});
