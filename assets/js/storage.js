const GM_KEYS = {
  ideas: "ghostmedia-ideas",
  queue: "ghost-queue",
  schedule: "ghost-schedule",
  posted: "ghost-posted",
  winners: "ghost-winners",
  patterns: "ghostmedia-patterns",
  opportunity: "ghost-opportunity",
  scout: "ghostScoutEntries"
};

window.GM_KEYS = GM_KEYS;

function gmLoad(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function gmSave(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function gmLoadObject(key) {
  return JSON.parse(localStorage.getItem(key) || "null");
}

function gmSaveObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* Ideas */

function gmGetIdeas() {
  return gmLoad(GM_KEYS.ideas);
}

function gmSaveIdeas(ideas) {
  gmSave(GM_KEYS.ideas, ideas);
}

function gmAddIdea(data) {
  const ideas = gmGetIdeas();

  ideas.unshift({
    id: crypto.randomUUID(),
    title: data.title || "Untitled Idea",
    page: data.page || data.topic || "General",
    topic: data.topic || data.page || "General",
    product: data.product || "",
    notes: data.notes || "",
    hook: data.hook || "",
    pattern: data.pattern || "",
    emotion: data.emotion || "",
    tension: data.tension || "",
    lesson: data.lesson || "",
    audience: data.audience || [],
    platforms: data.platforms || [],
    source: data.source || "manual",
    status: "NEW",
    createdAt: new Date().toISOString()
  });

  gmSaveIdeas(ideas);
}

function gmUpdateIdeaStatus(id, status, extra = {}) {
  const ideas = gmGetIdeas().map((idea) =>
    String(idea.id) === String(id)
      ? {
          ...idea,
          ...extra,
          status,
          updatedAt: new Date().toISOString()
        }
      : idea
  );

  gmSaveIdeas(ideas);
}

/* Queue */

function gmGetQueue() {
  return gmLoad(GM_KEYS.queue);
}

function gmSaveQueue(items) {
  gmSave(GM_KEYS.queue, items);
}

/* Schedule */

function gmGetSchedule() {
  return gmLoad(GM_KEYS.schedule);
}

function gmSaveSchedule(items) {
  gmSave(GM_KEYS.schedule, items);
}

/* Posted */

function gmGetPosted() {
  return gmLoad(GM_KEYS.posted);
}

function gmSavePosted(items) {
  gmSave(GM_KEYS.posted, items);
}

/* Winners */

function gmGetWinners() {
  return gmLoad(GM_KEYS.winners);
}

function gmSaveWinners(items) {
  gmSave(GM_KEYS.winners, items);
}

/* Patterns */

function gmGetPatterns() {
  return gmLoad(GM_KEYS.patterns);
}

function gmSavePatterns(items) {
  gmSave(GM_KEYS.patterns, items);
}

function gmInferTopic(item) {
  const text = `
    ${item.title || ""}
    ${item.product || ""}
    ${item.page || ""}
    ${item.topic || ""}
    ${item.notes || ""}
    ${item.caption || ""}
  `.toLowerCase();

  if (text.includes("arena") || text.includes("game") || text.includes("prototype")) {
    return "Sandman Combat Games";
  }

  if (text.includes("parent") || text.includes("mom") || text.includes("dad") || text.includes("kid")) {
    return "Youth Sports Parents";
  }

  if (text.includes("wrestling") || text.includes("wrestler") || text.includes("mat")) {
    return "Wrestling";
  }

  return item.topic || item.page || item.product || "General";
}

function gmRebuildPatterns() {
  const winners = gmGetWinners();

  const patterns = winners.map((winner) => ({
    id: crypto.randomUUID(),
    winnerId: winner.id,
    title: winner.title || "Untitled Winner",
    topic: winner.topic || gmInferTopic(winner),
    product: winner.product || winner.page || "",
    platform: winner.platform || "Manual",
    hook: winner.hook || winner.title || "",
    pattern: winner.pattern || "",
    format: winner.format || winner.type || "",
    emotion: winner.emotion || "",
    cta: winner.cta || "",
    views: Number(winner.views || 0),
    likes: Number(winner.likes || 0),
    comments: Number(winner.comments || 0),
    shares: Number(winner.shares || 0),
    createdAt: new Date().toISOString()
  }));

  gmSavePatterns(patterns);

  return patterns;
}

function gmBestPattern() {
  const patterns = gmGetPatterns();
  const counts = {};

  patterns.forEach((pattern) => {
    const key = [
      pattern.topic,
      pattern.format,
      pattern.hook
    ].filter(Boolean).join(" | ");

    if (!key) return;

    counts[key] = (counts[key] || 0) + 1;
  });

  const best = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0];

  return best
    ? { label: best[0], count: best[1] }
    : null;
}

/* Opportunity */

function gmGetOpportunity() {
  return gmLoadObject(GM_KEYS.opportunity);
}

function gmSaveOpportunity(opportunity) {
  gmSaveObject(GM_KEYS.opportunity, opportunity);
}

/* Scout */

function gmGetScoutEntries() {
  return gmLoad(GM_KEYS.scout);
}

function gmSaveScoutEntries(entries) {
  gmSave(GM_KEYS.scout, entries);
}

/* Expose globally */

window.gmLoad = gmLoad;
window.gmSave = gmSave;
window.gmLoadObject = gmLoadObject;
window.gmSaveObject = gmSaveObject;

window.gmGetIdeas = gmGetIdeas;
window.gmSaveIdeas = gmSaveIdeas;
window.gmAddIdea = gmAddIdea;
window.gmUpdateIdeaStatus = gmUpdateIdeaStatus;

window.gmGetQueue = gmGetQueue;
window.gmSaveQueue = gmSaveQueue;

window.gmGetSchedule = gmGetSchedule;
window.gmSaveSchedule = gmSaveSchedule;

window.gmGetPosted = gmGetPosted;
window.gmSavePosted = gmSavePosted;

window.gmGetWinners = gmGetWinners;
window.gmSaveWinners = gmSaveWinners;

window.gmGetPatterns = gmGetPatterns;
window.gmSavePatterns = gmSavePatterns;
window.gmRebuildPatterns = gmRebuildPatterns;
window.gmBestPattern = gmBestPattern;

window.gmGetOpportunity = gmGetOpportunity;
window.gmSaveOpportunity = gmSaveOpportunity;

window.gmGetScoutEntries = gmGetScoutEntries;
window.gmSaveScoutEntries = gmSaveScoutEntries;