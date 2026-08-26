const ideas = gmGetIdeas();

const queue = gmGetQueue();
const schedule = gmGetSchedule();
const posted = gmGetPosted();
const winners = gmGetWinners();
const patterns = gmRebuildPatterns();
const bestPattern = gmBestPattern();

const ideaCount = ideas.filter(i => {
  const status = String(i.status || "").toUpperCase();
  return status === "NEW" || status === "IDEA";
}).length;

document.getElementById("ideaCount").textContent = ideaCount;
document.getElementById("queueCount").textContent = queue.length;
document.getElementById("winnerCount").textContent = winners.length;
document.getElementById("patternCount").textContent = patterns.length;

const topWinner = winners
  .slice()
  .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))[0];

document.getElementById("topWinner").textContent =
  topWinner ? topWinner.title || "Top result found" : "No results saved";

document.getElementById("topPattern").textContent =
  bestPattern
    ? `${bestPattern.label} (${bestPattern.count}x)`
    : "Not enough results yet";

function getTopOpportunity() {
  const totals = {};

  patterns.forEach(pattern => {
    const key = pattern.topic || pattern.title || "General";
    totals[key] = (totals[key] || 0) + 1;
  });

  return Object.entries(totals)
    .map(([name, count]) => ({
      name,
      winners: count,
      score: Math.min(count * 20, 100)
    }))
    .sort((a, b) => b.score - a.score)[0] || null;
}

const topOpportunity = getTopOpportunity();

document.getElementById("topOpportunity").textContent =
  topOpportunity
    ? `${topOpportunity.name} — Score ${topOpportunity.score} (${topOpportunity.winners} winner${topOpportunity.winners === 1 ? "" : "s"})`
    : "Not enough results yet";

document.getElementById("weekPlan").textContent =
  posted.length
    ? `${posted.length} post${posted.length === 1 ? "" : "s"} awaiting results`
    : schedule.length
      ? `${schedule.length} scheduled post${schedule.length === 1 ? "" : "s"}`
      : "No active posts awaiting results";
