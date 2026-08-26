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
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function gmSave(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function gmLoadObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function gmSaveObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function gmNormalizeItem(item = {}, defaults = {}) {
  const normalized = {
    ...defaults,
    ...item
  };

  normalized.id = normalized.id || crypto.randomUUID();
  normalized.title = normalized.title || "Untitled";
  normalized.page = normalized.page || normalized.product || normalized.topic || "General";
  normalized.product = normalized.product || normalized.page || "";
  normalized.topic = normalized.topic || normalized.page || normalized.product || "General";
  normalized.status = String(normalized.status || defaults.status || "NEW").toUpperCase();
  normalized.createdAt = normalized.createdAt || new Date().toISOString();

  return normalized;
}

function gmUpsert(items, item) {
  const normalized = gmNormalizeItem(item);
  const existingIndex = items.findIndex(
    (candidate) => String(candidate.id) === String(normalized.id)
  );

  if (existingIndex >= 0) {
    items[existingIndex] = { ...items[existingIndex], ...normalized };
  } else {
    items.unshift(normalized);
  }

  return items;
}

/* Ideas */

function gmGetIdeas() {
  return gmLoad(GM_KEYS.ideas).map((item) => gmNormalizeItem(item, { status: "NEW" }));
}

function gmSaveIdeas(ideas) {
  gmSave(GM_KEYS.ideas, ideas.map((item) => gmNormalizeItem(item, { status: "NEW" })));
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
  return gmLoad(GM_KEYS.queue).map((item) => gmNormalizeItem(item, { status: "QUEUED" }));
}

function gmSaveQueue(items) {
  gmSave(GM_KEYS.queue, items.map((item) => gmNormalizeItem(item, { status: "QUEUED" })));
}

/* Schedule */

function gmGetSchedule() {
  return gmLoad(GM_KEYS.schedule).map((item) => gmNormalizeItem(item, { status: "SCHEDULED" }));
}

function gmSaveSchedule(items) {
  gmSave(GM_KEYS.schedule, items.map((item) => gmNormalizeItem(item, { status: "SCHEDULED" })));
}

/* Posted */

function gmGetPosted() {
  return gmLoad(GM_KEYS.posted).map((item) => gmNormalizeItem(item, { status: "POSTED" }));
}

function gmSavePosted(items) {
  gmSave(GM_KEYS.posted, items.map((item) => gmNormalizeItem(item, { status: "POSTED" })));
}

function gmPromotePublishedToWinner(id, metrics = {}) {
  const posted = gmGetPosted();
  const item = posted.find((candidate) => String(candidate.id) === String(id));

  if (!item) return null;

  const winner = gmNormalizeItem(
    {
      ...item,
      ...metrics,
      status: "WINNER",
      promotedAt: new Date().toISOString()
    },
    { status: "WINNER" }
  );

  gmSaveWinners(gmUpsert(gmGetWinners(), winner));
  gmSavePosted(posted.filter((candidate) => String(candidate.id) !== String(id)));
  gmRebuildPatterns();

  return winner;
}

/* Winners */

function gmGetWinners() {
  return gmLoad(GM_KEYS.winners).map((item) => gmNormalizeItem(item, { status: "WINNER" }));
}

function gmSaveWinners(items) {
  gmSave(GM_KEYS.winners, items.map((item) => gmNormalizeItem(item, { status: "WINNER" })));
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
    id: `pattern-${winner.id}`,
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

function gmRefreshPatterns() {
  return gmRebuildPatterns();
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
window.gmNormalizeItem = gmNormalizeItem;
window.gmUpsert = gmUpsert;

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
window.gmPromotePublishedToWinner = gmPromotePublishedToWinner;

window.gmGetWinners = gmGetWinners;
window.gmSaveWinners = gmSaveWinners;

window.gmGetPatterns = gmGetPatterns;
window.gmSavePatterns = gmSavePatterns;
window.gmRebuildPatterns = gmRebuildPatterns;
window.gmRefreshPatterns = gmRefreshPatterns;
window.gmBestPattern = gmBestPattern;

window.gmGetOpportunity = gmGetOpportunity;
window.gmSaveOpportunity = gmSaveOpportunity;

window.gmGetScoutEntries = gmGetScoutEntries;
window.gmSaveScoutEntries = gmSaveScoutEntries;
