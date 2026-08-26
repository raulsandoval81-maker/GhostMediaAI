const patternList = document.getElementById("patternList");

let showAllPatterns = false;
const PATTERN_VISIBLE_LIMIT = 2;

const PATTERN_MAP = {
  Parents: ["Parent", "Parents", "Dad", "Mom", "Kid", "Youth", "Family"],
  Humor: ["Funny", "Humor", "Gym", "Starter Pack"],
  Underdog: ["Underdog", "Comeback", "Nobody", "Upset"],
  Motivation: ["Motivation", "Discipline", "Train", "Earn", "Work Ethic", "Hard Work", "Persistence"],
  Drama: ["Drama", "Beef", "Rivalry", "Callout", "Fight", "Controversy"],
  Technique: ["Technique", "Sprawl", "Double Leg", "Single Leg", "Setup", "Finish", "Scramble"],
  History: ["History", "Legend", "Old School", "Forgotten"],
  News: ["News", "Announcement", "Ranking", "Prospect", "Milestone", "Update"],
  GameDev: ["Game", "Arena Mode", "Prototype", "Playable", "Development", "HUD", "Controls"]
};

function getWinners() {
  return gmGetWinners();
}

function getScore(item) {
  return (
    Number(item.views || 0) +
    Number(item.likes || 0) * 5 +
    Number(item.comments || 0) * 10 +
    Number(item.shares || 0) * 15
  );
}

function detectPatterns(item) {
  const found = [];

  const text = `
    ${item.title || ""}
    ${item.product || ""}
    ${item.page || ""}
    ${item.topic || ""}
    ${item.pattern || ""}
    ${item.emotion || ""}
    ${item.tension || ""}
    ${item.lesson || ""}
    ${item.caption || ""}
  `.toLowerCase();

  Object.keys(PATTERN_MAP).forEach((pattern) => {
    const words = PATTERN_MAP[pattern];

    const match = words.some((word) =>
      text.includes(word.toLowerCase())
    );

    if (match) found.push(pattern);
  });

  return found;
}

function buildPatternSummary(pattern, items) {
  const totalViews = items.reduce((sum, item) => sum + Number(item.views || 0), 0);
  const totalLikes = items.reduce((sum, item) => sum + Number(item.likes || 0), 0);
  const totalComments = items.reduce((sum, item) => sum + Number(item.comments || 0), 0);
  const totalShares = items.reduce((sum, item) => sum + Number(item.shares || 0), 0);

  const topItem = [...items].sort((a, b) => getScore(b) - getScore(a))[0];

  return {
    pattern,
    count: items.length,
    items,
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    topItem
  };
}

function renderPatterns() {
  if (!patternList) return;

  const winners = getWinners();
  gmRefreshPatterns();
  const groups = {};

  winners.forEach((winner) => {
    const patterns = detectPatterns(winner);

    patterns.forEach((pattern) => {
      if (!groups[pattern]) groups[pattern] = [];
      groups[pattern].push(winner);
    });
  });

  patternList.innerHTML = "";

  const summaries = Object.keys(groups)
    .map((pattern) => buildPatternSummary(pattern, groups[pattern]))
    .sort((a, b) => b.count - a.count || b.totalViews - a.totalViews);

  if (!summaries.length) {
    patternList.innerHTML = `
      <div class="page-card faded">
        <h3>No repeatable results yet.</h3>
        <p>Add performance metrics in Results first.</p>
      </div>
    `;
    return;
  }

  const visibleSummaries = showAllPatterns
    ? summaries
    : summaries.slice(0, PATTERN_VISIBLE_LIMIT);

  const hiddenCount = Math.max(summaries.length - PATTERN_VISIBLE_LIMIT, 0);

  const header = document.createElement("div");
  header.className = "section-title compact-section-title";
  header.innerHTML = `
    <div class="section-divider"></div>
    <h3>Showing ${visibleSummaries.length} of ${summaries.length}</h3>
    <p>Repeatable themes detected from top-performing content.</p>
  `;
  patternList.appendChild(header);

  visibleSummaries.forEach((summary) => {
    const row = document.createElement("div");
    row.className = "page-card";

    row.innerHTML = `
      <h3>${summary.pattern}</h3>

      <p>${summary.count} result(s)</p>

      <p>
        Views: ${summary.totalViews} ·
        Likes: ${summary.totalLikes} ·
        Comments: ${summary.totalComments} ·
        Shares: ${summary.totalShares}
      </p>

      <p>
        <strong>Best Example:</strong>
        ${summary.topItem?.title || "Untitled"}
      </p>

      <p class="faded">
        ${getRecommendation(summary)}
      </p>
    `;

    patternList.appendChild(row);
  });

  if (hiddenCount > 0) {
    const toggle = document.createElement("button");
    toggle.className = "btn ghost-toggle-btn";

    toggle.textContent = showAllPatterns
      ? "▲ Hide Patterns"
      : `▼ Show ${hiddenCount} More`;

    toggle.addEventListener("click", () => {
      showAllPatterns = !showAllPatterns;
      renderPatterns();
    });

    patternList.appendChild(toggle);
  }
}

function getRecommendation(summary) {
  if (summary.pattern === "GameDev") {
    return "Recommendation: keep turning visible build progress into milestone stories.";
  }

  if (summary.pattern === "Parents") {
    return "Recommendation: separate family/emotional angles into their own follow-up posts.";
  }

  if (summary.pattern === "Motivation") {
    return "Recommendation: use persistence and earned-progress language when the story has struggle.";
  }

  if (summary.pattern === "News") {
    return "Recommendation: lead with the update clearly before adding deeper context.";
  }

  return "Recommendation: reuse this pattern when the story has a similar emotional signal.";
}

renderPatterns();
