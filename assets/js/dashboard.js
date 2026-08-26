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

// GHOST MEDIA QUICK INSIGHT V1

document.addEventListener("DOMContentLoaded", () => {
  const bestSignal = document.getElementById("gmBestSignal");
  const recommendation = document.getElementById("gmRecommendation");
  const nextMove = document.getElementById("gmNextMove");

  if (!bestSignal || !recommendation || !nextMove) return;

  const safeArray = value => Array.isArray(value) ? value : [];

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

  const opportunities =
    typeof gmGetOpportunities === "function"
      ? safeArray(gmGetOpportunities())
      : [];

  // Best signal
  if (winners.length) {
    const latestWinner = winners[winners.length - 1];

    bestSignal.textContent =
      latestWinner.title ||
      latestWinner.hook ||
      latestWinner.topic ||
      latestWinner.product ||
      "Winning content detected";
  } else if (patterns.length) {
    const pattern = patterns[0];

    bestSignal.textContent =
      pattern.name ||
      pattern.pattern ||
      pattern.topic ||
      "A useful pattern is emerging";
  } else {
    bestSignal.textContent =
      "No clear winner yet — keep collecting results.";
  }

  // Recommendation
  if (opportunities.length) {
    const opportunity = opportunities[0];

    recommendation.textContent =
      opportunity.recommendation ||
      opportunity.title ||
      opportunity.topic ||
      "Create another piece from your strongest signal.";
  } else if (patterns.length) {
    recommendation.textContent =
      "Reuse the strongest pattern in a fresh piece of content.";
  } else {
    recommendation.textContent =
      "Publish consistently so Ghost can learn what works.";
  }

  // Next move
  if (queue.length) {
    nextMove.textContent =
      `${queue.length} item${queue.length === 1 ? "" : "s"} waiting for review.`;
  } else if (schedule.length) {
    nextMove.textContent =
      `${schedule.length} item${schedule.length === 1 ? "" : "s"} ready in Schedule.`;
  } else if (posted.length && !winners.length) {
    nextMove.textContent =
      "Add results to your published content.";
  } else if (ideas.length) {
    nextMove.textContent =
      "Turn one of your ideas into a draft.";
  } else {
    nextMove.textContent =
      "Create your next piece of content.";
  }
});
